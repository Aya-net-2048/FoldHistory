import React, { useState } from 'react';
import { useI18n } from '../utils/i18n';
import { format, subDays } from 'date-fns';
import { HistoryItem } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  historyItems: HistoryItem[];
}

export const ExportModal: React.FC<Props> = ({ isOpen, onClose, historyItems }) => {
  const { t } = useI18n();
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 7), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  if (!isOpen) return null;

  const handleExport = () => {
    const start = new Date(startDate).getTime();
    // End of the selected end date
    const end = new Date(endDate).getTime() + 24 * 60 * 60 * 1000 - 1;

    const filtered = historyItems.filter(item => 
      item.lastVisitTime >= start && item.lastVisitTime <= end
    );

    const dataStr = JSON.stringify(filtered, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `foldhistory_${startDate}_to_${endDate}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-sm p-6 m-4 animate-in fade-in zoom-in duration-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          {t('exportBtn')}
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              起始日期
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              结束日期
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            {t('cancel')}
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
          >
            {t('exportBtn')}
          </button>
        </div>
      </div>
    </div>
  );
};
