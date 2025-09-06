import React from 'react';
import { WaterLog } from '../../types';
import { formatDate } from '../../utils/dateUtils';
import { WaterIcon } from '../common/Icons';

interface WaterHistoryListProps {
  waterLogs: WaterLog[];
}

const WaterHistoryList: React.FC<WaterHistoryListProps> = ({ waterLogs }) => {
  if (waterLogs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No water logged in this period.</p>
      </div>
    );
  }

  const sortedLogs = [...waterLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
      {sortedLogs.map((log, index) => (
        <div key={`${log.date}-${index}`} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <WaterIcon className="w-6 h-6 text-blue-500" />
              <p className="font-semibold text-gray-800 dark:text-gray-200">{formatDate(log.date)}</p>
            </div>
            <p className="font-semibold text-lg">{log.amount} ml</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WaterHistoryList;