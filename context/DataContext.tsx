import React, { createContext, useState, useEffect, useCallback, ReactNode, useContext } from 'react';
import type { UserProfile, Meal, WeightLog, WaterLog, WorkoutLog, DailyGoals, Intensity, CustomMeal } from '../types';
import { storageService } from '../services/storageService';
import { notificationService } from '../services/notificationService';
import { getTodayDateString } from '../utils/dateUtils';
import { useAuth } from './AuthContext';
import { DEV_MODE, mockProfile } from '../config';
import { geminiService } from '../services/geminiService';

interface DataContextState {
  profile: UserProfile | null;
  meals: Meal[]; // Today's meals
  allMeals: Meal[]; // All historical meals
  workouts: WorkoutLog[]; // Today's workouts
  allWorkouts: WorkoutLog[]; // All historical workouts
  customMeals: CustomMeal[];
  weightLogs: WeightLog[];
  waterLog: WaterLog;
  adjustedDailyGoals: DailyGoals | null;
  isLoading: boolean;
  isInitialized: boolean;
  saveProfile: (profile: UserProfile) => Promise<void>;
  addMeal: (mealData: Omit<Meal, 'id' | 'date'> & { date?: string }) => Promise<void>;
  addCustomMeal: (customMealData: Omit<CustomMeal, 'id'>) => Promise<void>;
  addWorkout: (workout: Omit<WorkoutLog, 'id' | 'date' | 'caloriesBurned'> & { date?: string }) => Promise<void>;
  addWeightLog: (weight: number, date?: string) => Promise<void>;
  addWater: () => Promise<void>;
}

export const DataContext = createContext<DataContextState | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]); // Today's meals
  const [allMeals, setAllMeals] = useState<Meal[]>([]); // All meals
  const [workouts, setWorkouts] = useState<WorkoutLog[]>([]); // Today's workouts
  const [allWorkouts, setAllWorkouts] = useState<WorkoutLog[]>([]); // All workouts
  const [customMeals, setCustomMeals] = useState<CustomMeal[]>([]);
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [waterLog, setWaterLog] = useState<WaterLog>({ date: getTodayDateString(), glasses: 0 });
  const [adjustedDailyGoals, setAdjustedDailyGoals] = useState<DailyGoals | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const userId = user?.uid;

  const refreshData = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    const today = getTodayDateString();
    
    let fetchedProfile = await storageService.getProfile(userId);

    if (DEV_MODE && !fetchedProfile) {
      await storageService.saveProfile(userId, mockProfile);
      fetchedProfile = mockProfile;
    }
    
    if (fetchedProfile) {
      const [fetchedAllMeals, fetchedWeightLogs, fetchedWaterLog, fetchedAllWorkouts, fetchedCustomMeals] = await Promise.all([
        storageService.getAllMeals(userId),
        storageService.getWeightHistory(userId),
        storageService.getWaterLog(userId, today),
        storageService.getAllWorkouts(userId),
        storageService.getCustomMeals(userId),
      ]);

      const todayMeals = fetchedAllMeals.filter(meal => meal.date === today);
      const todayWorkouts = fetchedAllWorkouts.filter(workout => workout.date === today);
      
      setProfile(fetchedProfile);
      setAllMeals(fetchedAllMeals);
      setAllWorkouts(fetchedAllWorkouts);
      setMeals(todayMeals);
      setWorkouts(todayWorkouts);
      setWeightLogs(fetchedWeightLogs);
      setWaterLog(fetchedWaterLog);
      setCustomMeals(fetchedCustomMeals);

      // Adjust daily goals based on today's workouts
      const caloriesBurned = todayWorkouts.reduce((acc, w) => acc + w.caloriesBurned, 0);
      setAdjustedDailyGoals({
        ...fetchedProfile.dailyGoals,
        calories: fetchedProfile.dailyGoals.calories + caloriesBurned
      });

    }

    setIsLoading(false);
    setIsInitialized(true);
  }, [userId]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Handle Notifications
  useEffect(() => {
    if (!profile || !profile.reminderSettings.goalReached || !adjustedDailyGoals) return;

    const consumedCalories = meals.reduce((acc, meal) => acc + meal.macros.calories, 0);
    const goalCalories = adjustedDailyGoals.calories;

    if (consumedCalories >= goalCalories) {
      const today = getTodayDateString();
      const notificationKey = `goalReached_${today}_${userId}`;
      if (!sessionStorage.getItem(notificationKey)) {
        notificationService.sendNotification(
          "Goal Achieved! 🎉",
          { body: `You've reached your daily calorie goal of ${Math.round(goalCalories)} kcal!` }
        );
        sessionStorage.setItem(notificationKey, 'true');
      }
    }
  }, [meals, profile, adjustedDailyGoals, userId]);

  const saveProfile = async (newProfile: UserProfile) => {
    if (!userId) return;
    setIsLoading(true);
    await storageService.saveProfile(userId, newProfile);
    setProfile(newProfile);
    setIsLoading(false);
  };

  const addMeal = async (mealData: Omit<Meal, 'id' | 'date'> & { date?: string }) => {
    if (!userId) return;
    setIsLoading(true);
    const newMeal: Meal = {
      name: mealData.name,
      description: mealData.description,
      macros: mealData.macros,
      mealType: mealData.mealType,
      id: new Date().toISOString(),
      date: mealData.date || getTodayDateString(),
    };
    await storageService.addMeal(userId, newMeal);
    await refreshData();
    setIsLoading(false);
  };

  const addCustomMeal = async (customMealData: Omit<CustomMeal, 'id'>) => {
    if (!userId) return;
    const newCustomMeal: CustomMeal = {
      ...customMealData,
      id: new Date().toISOString(),
    };
    await storageService.addCustomMeal(userId, newCustomMeal);
    // Refresh the custom meals list in the state without a full reload
    const fetchedCustomMeals = await storageService.getCustomMeals(userId);
    setCustomMeals(fetchedCustomMeals);
  };

  const addWorkout = async (workout: Omit<WorkoutLog, 'id' | 'date' | 'caloriesBurned'> & { date?: string }) => {
    if (!userId || !profile) return;
    setIsLoading(true);
    const caloriesBurned = await geminiService.estimateCaloriesBurned({
      ...workout,
      userWeight: profile.weight
    });

    if (caloriesBurned !== null) {
      const newWorkout: WorkoutLog = {
        ...workout,
        id: new Date().toISOString(),
        date: workout.date || getTodayDateString(),
        caloriesBurned: caloriesBurned,
      };
      await storageService.addWorkout(userId, newWorkout);
      await refreshData();
    } else {
       alert("Could not estimate calories burned. Please try again.");
    }
    setIsLoading(false);
  };

  const addWeightLog = async (weight: number, date?: string) => {
    if (!userId) return;
    setIsLoading(true);
    const logDate = date || getTodayDateString();
    await storageService.addWeightLog(userId, { date: logDate, weight });

    // Only update the main profile weight if the log is for today
    if (logDate === getTodayDateString() && profile) {
      const updatedProfile = { ...profile, weight };
      await storageService.saveProfile(userId, updatedProfile);
      setProfile(updatedProfile);
    }
    
    await refreshData();
    setIsLoading(false);
  };

  const addWater = async () => {
    if (!userId) return;
    const today = getTodayDateString();
    const newWaterLog = { date: today, glasses: waterLog.glasses + 1 };
    await storageService.saveWaterLog(userId, newWaterLog);
    setWaterLog(newWaterLog);
  };

  const contextValue: DataContextState = {
    profile,
    meals,
    allMeals,
    workouts,
    allWorkouts,
    customMeals,
    weightLogs,
    waterLog,
    adjustedDailyGoals,
    isLoading,
    isInitialized,
    saveProfile,
    addMeal,
    addCustomMeal,
    addWorkout,
    addWeightLog,
    addWater,
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};