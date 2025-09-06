import React, { useMemo, useState } from 'react';
import { useData } from '../hooks/useData';
import LogMeal from './LogMeal';
import MealList from './dashboard/MealList';
import AddWeightModal from './AddWeightModal';
import { WaterIcon, WeightIcon, LightBulbIcon, DumbbellIcon } from './common/Icons';
import MacroRingChart from './charts/MacroRingChart';
import Spinner from './common/Spinner';
import { geminiService } from '../services/geminiService';
import { Macros } from '../types';
import SuggestMealPrompt from './SuggestMealPrompt';
import AddWorkoutModal from './AddWorkoutModal';
import WorkoutList from './dashboard/WorkoutList';
import CustomMealList from './dashboard/CustomMealList';

const Dashboard: React.FC = () => {
  const { profile, meals, workouts, waterLog, addWater, isLoading, adjustedDailyGoals, customMeals } = useData();
  const [isLogMealOpen, setIsLogMealOpen] = useState(false);
  const [isAddWeightOpen, setIsAddWeightOpen] = useState(false);
  const [isAddWorkoutOpen, setIsAddWorkoutOpen] = useState(false);
  const [isSuggestPromptOpen, setIsSuggestPromptOpen] = useState(false);
  const [isGeneratingSuggestion, setIsGeneratingSuggestion] = useState(false);
  const [suggestedMeal, setSuggestedMeal] = useState<{ name: string; description: string; macros: Macros} | null>(null);

  const consumedMacros = useMemo(() => {
    return meals.reduce(
      (acc, meal) => {
        acc.calories += meal.macros.calories;
        acc.protein += meal.macros.protein;
        acc.carbs += meal.macros.carbs;
        acc.fat += meal.macros.fat;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [meals]);

  if (!profile || !adjustedDailyGoals) return <div className="flex justify-center items-center h-64"><Spinner/></div>;

  const handleGenerateSuggestion = async (preferences: string) => {
    setIsSuggestPromptOpen(false);
    setIsGeneratingSuggestion(true);
    const remainingMacros = {
        calories: Math.max(0, adjustedDailyGoals.calories - consumedMacros.calories),
        protein: Math.max(0, adjustedDailyGoals.protein - consumedMacros.protein),
        carbs: Math.max(0, adjustedDailyGoals.carbs - consumedMacros.carbs),
        fat: Math.max(0, adjustedDailyGoals.fat - consumedMacros.fat),
    };

    const suggestion = await geminiService.getMealRecommendation(remainingMacros, profile.goal, preferences);
    if(suggestion) {
        setSuggestedMeal(suggestion);
        setIsLogMealOpen(true);
    } else {
        alert("Sorry, we couldn't generate a meal suggestion right now. Please try again later.");
    }
    setIsGeneratingSuggestion(false);
  }

  const handleCloseLogMeal = () => {
    setIsLogMealOpen(false);
    if (suggestedMeal) {
        setSuggestedMeal(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-center">Today's Summary</h2>
        <MacroRingChart consumed={consumedMacros} goal={adjustedDailyGoals} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Water Intake</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <WaterIcon className="w-8 h-8 text-blue-500" />
              <span className="text-2xl font-bold">{waterLog.glasses}</span>
              <span className="text-gray-500 dark:text-gray-400">glasses</span>
            </div>
            <button onClick={addWater} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">+</button>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Weight</h3>
           <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
               <WeightIcon className="w-8 h-8 text-green-500" />
              <span className="text-2xl font-bold">{profile.weight}</span>
              <span className="text-gray-500 dark:text-gray-400">kg</span>
            </div>
            <button onClick={() => setIsAddWeightOpen(true)} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">Log</button>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Today's Meals</h2>
          <div className="flex space-x-2">
             <button onClick={() => setIsSuggestPromptOpen(true)} disabled={isGeneratingSuggestion} className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:bg-yellow-300 flex items-center justify-center min-w-[130px]">
                {isGeneratingSuggestion ? <Spinner /> : <><LightBulbIcon className="w-5 h-5 mr-2" /> Suggest</>}
            </button>
            <button onClick={() => setIsLogMealOpen(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                Log Meal
            </button>
          </div>
        </div>
        {isLoading && meals.length === 0 ? <div className="flex justify-center p-4"><Spinner /></div> : <MealList meals={meals} />}
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">My Saved Meals</h2>
        <CustomMealList customMeals={customMeals} />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Today's Workouts</h2>
          <button onClick={() => setIsAddWorkoutOpen(true)} className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 flex items-center">
              <DumbbellIcon className="w-5 h-5 mr-2"/>
              Add Workout
          </button>
        </div>
        {isLoading && workouts.length === 0 ? <div className="flex justify-center p-4"><Spinner /></div> : <WorkoutList workouts={workouts} />}
      </div>

      {isSuggestPromptOpen && <SuggestMealPrompt onClose={() => setIsSuggestPromptOpen(false)} onSuggest={handleGenerateSuggestion} />}
      {isLogMealOpen && <LogMeal onClose={handleCloseLogMeal} initialData={suggestedMeal} />}
      {isAddWeightOpen && <AddWeightModal onClose={() => setIsAddWeightOpen(false)} />}
      {isAddWorkoutOpen && <AddWorkoutModal onClose={() => setIsAddWorkoutOpen(false)} />}
    </div>
  );
};

export default Dashboard;