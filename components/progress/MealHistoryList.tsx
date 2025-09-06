import React from 'react';
import { Meal } from '../../types';
import { formatDate } from '../../utils/dateUtils';

interface MealHistoryListProps {
  meals: Meal[];
}

const MealHistoryList: React.FC<MealHistoryListProps> = ({ meals }) => {
  if (meals.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No meals logged in this period.</p>
      </div>
    );
  }

  const groupedMeals = meals.reduce((acc, meal) => {
    (acc[meal.date] = acc[meal.date] || []).push(meal);
    return acc;
  }, {} as Record<string, Meal[]>);

  const sortedDates = Object.keys(groupedMeals).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
      {sortedDates.map(date => (
        <div key={date}>
          <h3 className="font-semibold text-lg mb-2 sticky top-0 bg-white dark:bg-gray-800 py-1">{formatDate(date)}</h3>
          <div className="space-y-3">
            {groupedMeals[date].map(meal => (
              <div key={meal.id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">{meal.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{meal.mealType}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                        <p className="font-semibold text-sm">{Math.round(meal.macros.calories)} kcal</p>
                        <p className="text-xs text-gray-500">P:{Math.round(meal.macros.protein)} C:{Math.round(meal.macros.carbs)} F:{Math.round(meal.macros.fat)}</p>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MealHistoryList;
