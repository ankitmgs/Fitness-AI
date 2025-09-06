import React, { createContext, useState, useEffect, useCallback, ReactNode, useContext } from 'react';
import type { UserProfile, Meal, WeightLog, WaterLog, WorkoutLog, DailyGoals, Intensity, CustomMeal } from '../types';
import { storageService } from '../services/storageService';
import { notificationService } from '../services/notificationService';
import { getTodayDateString } from '../utils/dateUtils';
import { useAuth } from './AuthContext';
import { geminiService } from '../services/geminiService';

interface DataContextState {
  profile: UserProfile | null;
  meals: Meal[]; // Today's meals
  allMeals: Meal[]; // All historical meals
  workouts: WorkoutLog[]; // Today's workouts
  allWorkouts: WorkoutLog[]; // All historical workouts
  customMeals: CustomMeal[];
  weightLogs: WeightLog[];
  waterLog: WaterLog; // Today's water log
  allWaterLogs: WaterLog[]; // All historical water logs
  adjustedDailyGoals: DailyGoals | null;
  isLoading: boolean;
  isInitialized: boolean;
  saveProfile: (profile: UserProfile) => Promise<void>;
  addMeal: (mealData: Omit<Meal, 'id' | 'date'> & { date?: string }) => Promise<void>;
  addCustomMeal: (customMealData: Omit<CustomMeal, 'id'>) => Promise<void>;
  addWorkout: (workout: Omit<WorkoutLog, 'id' | 'date' | 'caloriesBurned'> & { date?: string }) => Promise<void>;
  addWeightLog: (weight: number, date?: string) => Promise<void>;
  addWater: (amount: number) => Promise<void>;
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
  const [waterLog, setWaterLog] = useState<WaterLog>({ date: getTodayDateString(), amount: 0 });
  const [allWaterLogs, setAllWaterLogs] = useState<WaterLog[]>([]);
  const [adjustedDailyGoals, setAdjustedDailyGoals] = useState<DailyGoals | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const userId = user?.uid;

  const refreshData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    const today = getTodayDateString();
    
    try {
      const token = await user.getIdToken();
      const fetchedProfile = await storageService.getProfile(token);
      
      if (fetchedProfile) {
        const [fetchedAllMeals, fetchedWeightLogs, fetchedAllWaterLogs, fetchedAllWorkouts, fetchedCustomMeals] = await Promise.all([
          storageService.getAllMeals(token),
          storageService.getWeightHistory(token),
          storageService.getAllWaterLogs(token),
          storageService.getAllWorkouts(token),
          storageService.getCustomMeals(token),
        ]);

        const todayMeals = fetchedAllMeals.filter(meal => meal.date === today);
        const todayWorkouts = fetchedAllWorkouts.filter(workout => workout.date === today);
        const todayWaterLog = fetchedAllWaterLogs.find(log => log.date === today) || { date: today, amount: 0 };
        
        setProfile(fetchedProfile);
        setAllMeals(fetchedAllMeals);
        setAllWorkouts(fetchedAllWorkouts);
        setMeals(todayMeals);
        setWorkouts(todayWorkouts);
        setWeightLogs(fetchedWeightLogs);
        setAllWaterLogs(fetchedAllWaterLogs);
        setWaterLog(todayWaterLog);
        setCustomMeals(fetchedCustomMeals);

        // Adjust daily goals based on today's workouts
        const caloriesBurned = todayWorkouts.reduce((acc, w) => acc + w.caloriesBurned, 0);
        setAdjustedDailyGoals({
          ...fetchedProfile.dailyGoals,
          calories: fetchedProfile.dailyGoals.calories + caloriesBurned
        });
      } else {
        // If no profile, reset all data states
        setProfile(null);
        setAllMeals([]);
        setAllWorkouts([]);
        setMeals([]);
        setWorkouts([]);
        setWeightLogs([]);
        setAllWaterLogs([]);
        setWaterLog({ date: today, amount: 0 });
        setCustomMeals([]);
      }
    } catch (error) {
        console.error("Failed to refresh data:", error);
        // Handle error state if necessary
    } finally {
        setIsLoading(false);
        setIsInitialized(true);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      refreshData();
    } else {
      // If user logs out, clear all data and reset state
      setIsInitialized(false);
      setProfile(null);
    }
  }, [user, refreshData]);

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
    if (!user) return;
    setIsLoading(true);
    const token = await user.getIdToken();
    const savedProfile = await storageService.saveProfile(token, newProfile);
    setProfile(savedProfile);
    await refreshData(); // Refresh all data after profile update
    setIsLoading(false);
  };

  const addMeal = async (mealData: Omit<Meal, 'id' | 'date'> & { date?: string }) => {
    if (!user) return;
    setIsLoading(true);
    const token = await user.getIdToken();
    const newMealData: Omit<Meal, 'id'> = {
      ...mealData,
      date: mealData.date || getTodayDateString(),
    };
    await storageService.addMeal(token, newMealData);
    await refreshData();
    setIsLoading(false);
  };

  const addCustomMeal = async (customMealData: Omit<CustomMeal, 'id'>) => {
    if (!user) return;
    const token = await user.getIdToken();
    await storageService.addCustomMeal(token, customMealData);
    const fetchedCustomMeals = await storageService.getCustomMeals(token);
    setCustomMeals(fetchedCustomMeals);
  };

  const addWorkout = async (workout: Omit<WorkoutLog, 'id' | 'date' | 'caloriesBurned'> & { date?: string }) => {
    if (!user || !profile) return;
    setIsLoading(true);
    const token = await user.getIdToken();
    const caloriesBurned = await geminiService.estimateCaloriesBurned({
      ...workout,
      userWeight: profile.weight
    });

    if (caloriesBurned !== null) {
      const newWorkoutData: Omit<WorkoutLog, 'id'> = {
        ...workout,
        date: workout.date || getTodayDateString(),
        caloriesBurned: caloriesBurned,
      };
      await storageService.addWorkout(token, newWorkoutData);
      await refreshData();
    } else {
       alert("Could not estimate calories burned. Please try again.");
    }
    setIsLoading(false);
  };

  const addWeightLog = async (weight: number, date?: string) => {
    if (!user) return;
    setIsLoading(true);
    const token = await user.getIdToken();
    const logDate = date || getTodayDateString();
    await storageService.addWeightLog(token, { date: logDate, weight });

    if (logDate === getTodayDateString() && profile) {
      const updatedProfile = { ...profile, weight };
      await storageService.saveProfile(token, updatedProfile);
      setProfile(updatedProfile);
    }
    
    await refreshData();
    setIsLoading(false);
  };

  const addWater = async (amount: number) => {
    if (!user) return;
    const token = await user.getIdToken();
    const today = getTodayDateString();
    const newAmount = (waterLog?.amount || 0) + amount;
    const newWaterLog = { date: today, amount: newAmount };
    
    await storageService.saveWaterLog(token, newWaterLog);
    
    setWaterLog(newWaterLog);
    const existingLogIndex = allWaterLogs.findIndex(item => item.date === today);
    const newAllWaterLogs = [...allWaterLogs];
     if(existingLogIndex > -1){
        newAllWaterLogs[existingLogIndex] = newWaterLog;
    } else {
        newAllWaterLogs.push(newWaterLog);
    }
    setAllWaterLogs(newAllWaterLogs);
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
    allWaterLogs,
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