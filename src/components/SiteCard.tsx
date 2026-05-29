import React from 'react';
import type { SiteGroup, CustomSiteData } from '../types';
import { Edit3, Trash2 } from 'lucide-react';
import { useI18n } from '../utils/i18n';

interface Props {
  group: SiteGroup;
  customData?: CustomSiteData;
  onDeleteGroup: (domain: string) => void;
  onEditCustom: (domain: string) => void;
  onClick: (domain: string) => void;
}

export const SiteCard: React.FC<Props> = ({ 
  group, 
  customData, 
  onDeleteGroup, 
  onEditCustom,
  onClick
}) => {
  const { t } = useI18n();

  const displayName = customData?.customName || group.domainWithoutSuffix;
  const displayLogo = customData?.customLogo || `https://www.google.com/s2/favicons?domain=${group.domain}&sz=64`;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all hover:shadow-md flex flex-col h-full">
      <div 
        className="flex flex-col items-center justify-center p-4 cursor-pointer group relative text-center flex-1"
        onClick={() => onClick(group.domain)}
      >
        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden mb-2">
          <img 
            src={displayLogo} 
            alt={displayName} 
            className="w-8 h-8 object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCI+PC9jaXJjbGU+PC9zdmc+'; }}
          />
        </div>
        
        <div className="w-full">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{displayName}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {group.visits.length} {t('visits')}
          </p>
        </div>

        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => { e.stopPropagation(); onEditCustom(group.domain); }}
            className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            title={t('editCustomName')}
          >
            <Edit3 size={14} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDeleteGroup(group.domain); }}
            className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            title={t('delete')}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
