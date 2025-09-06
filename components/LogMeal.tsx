import React, { useState, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { useData } from '../hooks/useData';
import { MealType, Macros } from '../types';
import Spinner from './common/Spinner';
import { getTodayDateString } from '../utils/dateUtils';

interface LogMealProps {
  onClose: () => void;
  initialData?: { name: string; description: string; macros: Macros } | null;
}

const LogMeal: React.FC<LogMealProps> = ({ onClose, initialData }) => {
  const { addMeal, addCustomMeal } = useData();
  const [description, setDescription] = useState('');
  const [mealType, setMealType] = useState<MealType>(MealType.LUNCH);
  const [date, setDate] = useState(getTodayDateString());
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{ name: string; macros: Macros } | null>(null);
  const [saveAsCustom, setSaveAsCustom] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setDescription(initialData.description);
      setAnalysisResult({ name: initialData.name, macros: initialData.macros });
    }
  }, [initialData]);

  const handleAnalyze = async () => {
    if (!description) {
      setError('Please enter a meal description.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    const result = await geminiService.analyzeMeal(description);
    if (result) {
      setAnalysisResult(result);
    } else {
      setError('Could not analyze meal. Please try again or enter macros manually.');
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!analysisResult) {
      setError('Please analyze the meal before saving.');
      return;
    }

    if (saveAsCustom) {
      await addCustomMeal({
        name: analysisResult.name,
        description,
        macros: analysisResult.macros,
      });
    }

    await addMeal({
      name: analysisResult.name,
      description,
      macros: analysisResult.macros,
      mealType,
      date,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{initialData ? 'AI Meal Suggestion' : 'Log a Meal'}</h2>
        <div className="space-y-4">
          <textarea
            placeholder="Describe your meal... (e.g., 'A bowl of pasta with tomato sauce and meatballs')"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          />
          <select value={mealType} onChange={(e) => setMealType(e.target.value as MealType)} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
            {Object.values(MealType).map(mt => <option key={mt} value={mt}>{mt}</option>)}
          </select>
          <button onClick={handleAnalyze} disabled={isLoading} className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex justify-center">
            {isLoading ? <Spinner /> : 'Analyze with AI'}
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {analysisResult && (
            <div className="mt-4 space-y-3">
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
                <h3 className="font-semibold">Analysis Result:</h3>
                <p><span className="font-medium">Name:</span> {analysisResult.name}</p>
                <p><span className="font-medium">Calories:</span> {Math.round(analysisResult.macros.calories)} kcal</p>
                <p><span className="font-medium">Protein:</span> {Math.round(analysisResult.macros.protein)} g</p>
                <p><span className="font-medium">Carbs:</span> {Math.round(analysisResult.macros.carbs)} g</p>
                <p><span className="font-medium">Fat:</span> {Math.round(analysisResult.macros.fat)} g</p>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="save-custom"
                  checked={saveAsCustom}
                  onChange={(e) => setSaveAsCustom(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="save-custom" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  Save as a favorite meal
                </label>
              </div>
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-md hover:bg-gray-400">Cancel</button>
          <button onClick={handleSave} disabled={!analysisResult} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-green-300">Save Meal</button>
        </div>
      </div>
    </div>
  );
};

export default LogMeal;