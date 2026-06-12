import React from 'react';
import type { HistoryItem as HistoryItemType } from '../types';
import { Trash2, EyeOff, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { useI18n } from '../utils/i18n';
import { getFaviconUrl } from '../utils/favicon';

interface Props {
  item: HistoryItemType;
  onDelete: (url: string) => void;
  onTogglePrivacy: (url: string) => void;
  isBlurred: boolean;
}

export const HistoryItem: React.FC<Props> = ({ item, onDelete, onTogglePrivacy, isBlurred }) => {
  const { t } = useI18n();
  const timeStr = format(new Date(item.lastVisitTime), 'HH:mm');

  return (
    <div className="group flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors relative">
      <div className="flex items-center space-x-3 overflow-hidden flex-1">
        <span className="text-xs text-gray-500 w-12 flex-shrink-0">{timeStr}</span>
        <img 
          src={getFaviconUrl(item.url, 32)} 
          alt="" 
          className="w-4 h-4 flex-shrink-0"
          onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCI+PC9jaXJjbGU+PC9zdmc+'; }}
        />
        
        <div className={`flex flex-col overflow-hidden ${isBlurred ? 'group/blur' : ''}`}>
          <a 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`text-sm truncate text-gray-800 dark:text-gray-200 hover:underline ${isBlurred ? 'blur-sm hover:blur-none transition-[filter] duration-700 delay-1000' : ''}`}
            title={item.title}
          >
            {item.title || item.url}
          </a>
          <span className={`text-xs truncate text-gray-400 ${isBlurred ? 'blur-sm group-hover/blur:blur-none transition-[filter] duration-700 delay-1000' : ''}`}>
            {item.url}
          </span>
        </div>
      </div>
      
      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onTogglePrivacy(item.url)}
          className={`p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 ${isBlurred ? 'text-blue-500' : 'text-gray-500'}`}
          title={t('blurToggle')}
        >
          {isBlurred ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
        <button 
          onClick={() => onDelete(item.url)}
          className="p-1.5 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          title={t('delete')}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};
