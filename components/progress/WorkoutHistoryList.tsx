import React from 'react';
import { WorkoutLog } from '../../types';
import { formatDate } from '../../utils/dateUtils';

interface WorkoutHistoryListProps {
  workouts: WorkoutLog[];
}

const WorkoutHistoryList: React.FC<WorkoutHistoryListProps> = ({ workouts }) => {
  if (workouts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No workouts logged in this period.</p>
      </div>
    );
  }

  const groupedWorkouts = workouts.reduce((acc, workout) => {
    (acc[workout.date] = acc[workout.date] || []).push(workout);
    return acc;
  }, {} as Record<string, WorkoutLog[]>);

  const sortedDates = Object.keys(groupedWorkouts).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
      {sortedDates.map(date => (
        <div key={date}>
          <h3 className="font-semibold text-lg mb-2 sticky top-0 bg-white dark:bg-gray-800 py-1">{formatDate(date)}</h3>
          <div className="space-y-3">
            {groupedWorkouts[date].map(workout => (
              <div key={workout.id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">{workout.exerciseType}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{workout.duration} mins - {workout.intensity}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                        <p className="font-semibold text-sm text-cyan-600 dark:text-cyan-400">-{Math.round(workout.caloriesBurned)} kcal</p>
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

export default WorkoutHistoryList;
