import React, { useState } from 'react';
import { CustomMeal, MealType } from '../../types';
import { useData } from '../../hooks/useData';
import Spinner from '../common/Spinner';

interface CustomMealListProps {
  customMeals: CustomMeal[];
}

const CustomMealList: React.FC<CustomMealListProps> = ({ customMeals }) => {
  const { addMeal, isLoading } = useData();
  const [expandedMealId, setExpandedMealId] = useState<string | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<MealType>(MealType.SNACK);

  if (customMeals.length === 0) {
    return (
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
        <p className="text-gray-500 dark:text-gray-400">Your favorite meals will appear here once you save them.</p>
      </div>
    );
  }

  const handleLogClick = (mealId: string) => {
    setExpandedMealId(mealId === expandedMealId ? null : mealId);
  };

  const handleConfirmLog = async (meal: CustomMeal) => {
    await addMeal({
      name: meal.name,
      description: meal.description,
      macros: meal.macros,
      mealType: selectedMealType,
    });
    setExpandedMealId(null); // Close the selector after logging
  };

  return (
    <div className="space-y-3">
      {customMeals.map(meal => (
        <div key={meal.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow transition-all duration-300">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">{meal.name}</p>
              <p className="text-sm text-gray-500">{Math.round(meal.macros.calories)} kcal</p>
            </div>
            <button 
              onClick={() => handleLogClick(meal.id)}
              className="px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600"
            >
              Log
            </button>
          </div>
          {expandedMealId === meal.id && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <select 
                  value={selectedMealType} 
                  onChange={(e) => setSelectedMealType(e.target.value as MealType)} 
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                >
                  {Object.values(MealType).map(mt => <option key={mt} value={mt}>{mt}</option>)}
                </select>
                <button 
                  onClick={() => handleConfirmLog(meal)} 
                  disabled={isLoading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center justify-center min-w-[100px]"
                >
                  {isLoading ? <Spinner /> : 'Confirm'}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CustomMealList;