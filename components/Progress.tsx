import React, { useState, useMemo } from 'react';
import { useData } from '../hooks/useData';
import WeightChart from './charts/WeightChart';
import Spinner from './common/Spinner';
import { Meal, WeightLog, WorkoutLog } from '../types';
import ProgressSummary from './progress/ProgressSummary';
import MealHistoryList from './progress/MealHistoryList';
import { CalendarIcon } from './common/Icons';
import DateRangePickerModal from './DateRangePickerModal';
import WorkoutSummary from './progress/WorkoutSummary';
import WorkoutHistoryList from './progress/WorkoutHistoryList';
import NutritionChart from './charts/NutritionChart';
import CaloriesBurnedChart from './charts/CaloriesBurnedChart';
import WeightHistoryList from './progress/WeightHistoryList';

type Period = 'week' | 'month' | 'custom';
type ProgressTab = 'nutrition' | 'workouts' | 'weight';
type ViewMode = 'summary' | 'chart';

const Progress: React.FC = () => {
  const { allMeals, allWorkouts, weightLogs, isLoading } = useData();
  
  const [activePeriod, setActivePeriod] = useState<Period>('week');
  const [dateRange, setDateRange] = useState<{ startDate: Date, endDate: Date }>(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 6);
    return { startDate, endDate };
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ProgressTab>('nutrition');
  const [viewMode, setViewMode] = useState<ViewMode>('summary');

  const setPeriod = (period: Period) => {
    const endDate = new Date();
    const startDate = new Date();
    if (period === 'week') {
      startDate.setDate(endDate.getDate() - 6);
    } else if (period === 'month') {
      startDate.setDate(endDate.getDate() - 29);
    }
    setActivePeriod(period);
    setDateRange({ startDate, endDate });
    if (period === 'custom') {
      setIsDatePickerOpen(true);
    }
  };
  
  const handleApplyCustomDate = (start: string, end: string) => {
      // Add timezone offset to prevent date from being off by one day
      const startDate = new Date(new Date(start).valueOf() + new Date().getTimezoneOffset() * 60 * 1000);
      const endDate = new Date(new Date(end).valueOf() + new Date().getTimezoneOffset() * 60 * 1000);
      setDateRange({ startDate, endDate });
      setIsDatePickerOpen(false);
  }

  const { filteredMeals, filteredWorkouts, filteredWeightLogs } = useMemo(() => {
    const start = dateRange.startDate.setHours(0, 0, 0, 0);
    const end = dateRange.endDate.setHours(23, 59, 59, 999);

    const filterByDate = <T extends { date: string }>(item: T) => {
      const itemDate = new Date(item.date).getTime();
      return itemDate >= start && itemDate <= end;
    };

    return {
      filteredMeals: allMeals.filter(filterByDate),
      filteredWorkouts: allWorkouts.filter(filterByDate),
      filteredWeightLogs: weightLogs.filter(filterByDate),
    };
  }, [allMeals, allWorkouts, weightLogs, dateRange]);

  if (isLoading) {
      return <div className="flex justify-center items-center h-64"><Spinner /></div>
  }
  
  const renderContent = () => {
    if (viewMode === 'chart') {
       switch (activeTab) {
        case 'nutrition':
          return <NutritionChart data={filteredMeals} />;
        case 'workouts':
          return <CaloriesBurnedChart data={filteredWorkouts} />;
        case 'weight':
          return <WeightChart data={filteredWeightLogs} />;
      }
    } else {
       switch (activeTab) {
        case 'nutrition':
          return (
            <>
              {/* FIX: The 'period' prop was hardcoded to "custom", causing a type error. It is now correctly passed from the activePeriod state. */}
              <ProgressSummary meals={filteredMeals} period={activePeriod} />
              <div className="mt-6"><MealHistoryList meals={filteredMeals} /></div>
            </>
          );
        case 'workouts':
           return (
            <>
              <WorkoutSummary workouts={filteredWorkouts} />
              <div className="mt-6"><WorkoutHistoryList workouts={filteredWorkouts} /></div>
            </>
          );
        case 'weight':
          return (
            <>
              <p className="text-center mb-4"><span className="font-bold">{filteredWeightLogs.length}</span> entries found for this period.</p>
              <WeightHistoryList weightLogs={filteredWeightLogs} />
            </>
          );
      }
    }
  }

  const periodButtons: { id: Period, label: string }[] = [
      { id: 'week', label: 'This Week'},
      { id: 'month', label: 'This Month'},
  ]

  const tabButtons: { id: ProgressTab, label: string }[] = [
      { id: 'nutrition', label: 'Nutrition' },
      { id: 'workouts', label: 'Workouts' },
      { id: 'weight', label: 'Weight' },
  ]
  

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Your Progress</h1>
      
      {isDatePickerOpen && 
        <DateRangePickerModal 
          onClose={() => setIsDatePickerOpen(false)} 
          onApply={handleApplyCustomDate}
          initialStartDate={dateRange.startDate}
          initialEndDate={dateRange.endDate}
        />
      }

      {/* Period Filter */}
      <div className="grid grid-cols-3 gap-2">
          {periodButtons.map(p => (
              <button key={p.id} onClick={() => setPeriod(p.id)} className={`py-2 text-sm font-medium rounded-md transition-colors ${activePeriod === p.id ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                {p.label}
              </button>
          ))}
          <button onClick={() => setPeriod('custom')} className={`py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center ${activePeriod === 'custom' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
             <CalendarIcon className="w-4 h-4 mr-2"/> Custom
          </button>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {tabButtons.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 text-sm font-medium transition-colors -mb-px border-b-2 ${activeTab === tab.id ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                {tab.label}
            </button>
        ))}
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow min-h-[400px]">
          {/* View Mode Toggle */}
          <div className="flex justify-end mb-4">
              <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1 w-48">
                {(['summary', 'chart'] as ViewMode[]).map(mode => (
                  <button key={mode} onClick={() => setViewMode(mode)} className={`w-full py-1 text-sm font-medium rounded-md transition-colors ${viewMode === mode ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow' : 'text-gray-600 dark:text-gray-300'}`}>
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
          </div>
          {renderContent()}
      </div>
    </div>
  );
};

export default Progress;