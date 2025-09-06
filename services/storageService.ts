import type { UserProfile, Meal, WeightLog, WaterLog, WorkoutLog, CustomMeal } from '../types';

const PROFILE_KEY = 'fitness_tracker_profile';
const MEALS_KEY = 'fitness_tracker_meals';
const WEIGHT_LOG_KEY = 'fitness_tracker_weight_log';
const WATER_LOG_KEY = 'fitness_tracker_water_log';
const WORKOUTS_KEY = 'fitness_tracker_workouts';
const CUSTOM_MEALS_KEY = 'fitness_tracker_custom_meals';

class StorageService {
  // Profile
  async getProfile(userId: string): Promise<UserProfile | null> {
    const data = localStorage.getItem(`${PROFILE_KEY}_${userId}`);
    return data ? JSON.parse(data) : null;
  }

  async saveProfile(userId: string, profile: UserProfile): Promise<void> {
    localStorage.setItem(`${PROFILE_KEY}_${userId}`, JSON.stringify(profile));
  }
  
  // Meals
  async getAllMeals(userId: string): Promise<Meal[]> {
    const data = localStorage.getItem(`${MEALS_KEY}_${userId}`);
    return data ? JSON.parse(data) : [];
  }

  async getMealsForDate(userId: string, date: string): Promise<Meal[]> {
    const allMeals = await this.getAllMeals(userId);
    return allMeals.filter(meal => meal.date === date);
  }

  async addMeal(userId: string, meal: Meal): Promise<void> {
    const allMeals = await this.getAllMeals(userId);
    allMeals.push(meal);
    localStorage.setItem(`${MEALS_KEY}_${userId}`, JSON.stringify(allMeals));
  }
  
  // Custom Meals
  async getCustomMeals(userId: string): Promise<CustomMeal[]> {
    const data = localStorage.getItem(`${CUSTOM_MEALS_KEY}_${userId}`);
    return data ? JSON.parse(data) : [];
  }

  async addCustomMeal(userId: string, customMeal: CustomMeal): Promise<void> {
    const customMeals = await this.getCustomMeals(userId);
    // Prevent duplicates by name (case-insensitive)
    if (!customMeals.some(m => m.name.toLowerCase() === customMeal.name.toLowerCase())) {
        customMeals.push(customMeal);
        localStorage.setItem(`${CUSTOM_MEALS_KEY}_${userId}`, JSON.stringify(customMeals));
    }
  }

  // Weight Logs
  async getWeightHistory(userId: string): Promise<WeightLog[]> {
    const data = localStorage.getItem(`${WEIGHT_LOG_KEY}_${userId}`);
    return data ? JSON.parse(data) : [];
  }

  async addWeightLog(userId: string, log: WeightLog): Promise<void> {
    const history = await this.getWeightHistory(userId);
    const existingLogIndex = history.findIndex(item => item.date === log.date);
    if(existingLogIndex > -1){
        history[existingLogIndex] = log;
    } else {
        history.push(log);
    }
    history.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    localStorage.setItem(`${WEIGHT_LOG_KEY}_${userId}`, JSON.stringify(history));
  }

  // Water Logs
  async getAllWaterLogs(userId: string): Promise<WaterLog[]> {
     const data = localStorage.getItem(`${WATER_LOG_KEY}_${userId}`);
     return data ? JSON.parse(data) : [];
  }

  async getWaterLog(userId: string, date: string): Promise<WaterLog> {
    const allLogs = await this.getAllWaterLogs(userId);
    return allLogs.find(log => log.date === date) || { date, glasses: 0 };
  }

  async saveWaterLog(userId: string, log: WaterLog): Promise<void> {
    const allLogs = await this.getAllWaterLogs(userId);
    const existingLogIndex = allLogs.findIndex(item => item.date === log.date);
    if(existingLogIndex > -1){
        allLogs[existingLogIndex] = log;
    } else {
        allLogs.push(log);
    }
    localStorage.setItem(`${WATER_LOG_KEY}_${userId}`, JSON.stringify(allLogs));
  }

  // Workouts
  async getAllWorkouts(userId: string): Promise<WorkoutLog[]> {
    const data = localStorage.getItem(`${WORKOUTS_KEY}_${userId}`);
    return data ? JSON.parse(data) : [];
  }

  async getWorkoutsForDate(userId: string, date: string): Promise<WorkoutLog[]> {
    const allWorkouts = await this.getAllWorkouts(userId);
    return allWorkouts.filter(workout => workout.date === date);
  }

  async addWorkout(userId: string, workout: WorkoutLog): Promise<void> {
    const allWorkouts = await this.getAllWorkouts(userId);
    allWorkouts.push(workout);
    localStorage.setItem(`${WORKOUTS_KEY}_${userId}`, JSON.stringify(allWorkouts));
  }
}

export const storageService = new StorageService();