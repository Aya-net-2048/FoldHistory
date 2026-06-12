import React, { useMemo } from 'react';
import { HistoryItem as HistoryItemType, CustomSiteData } from '../types';
import { HistoryItem } from './HistoryItem';
import { Virtuoso } from 'react-virtuoso';
import { useI18n } from '../utils/i18n';
import { format, startOfDay, isToday, isYesterday } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { getFaviconUrl } from '../utils/favicon';

interface Props {
  domain: string;
  initialTimestamp?: number;
  historyItems: HistoryItemType[];
  privacyRecords: Record<string, boolean>;
  customSites: Record<string, CustomSiteData>;
  onDeleteItem: (url: string) => void;
  onTogglePrivacy: (url: string) => void;
  onClose: () => void;
}

export const DomainDetailView: React.FC<Props> = ({
  domain,
  initialTimestamp,
  historyItems,
  privacyRecords,
  customSites,
  onDeleteItem,
  onTogglePrivacy,
  onClose
}) => {
  const { t } = useI18n();

  const domainItems = useMemo(() => {
    return historyItems.filter(item => item.domain === domain);
  }, [historyItems, domain]);

  const formatDayTitle = (timestamp: number) => {
    const date = new Date(timestamp);
    if (isToday(date)) return t('today');
    if (isYesterday(date)) return t('yesterday');
    return format(date, 'yyyy-MM-dd');
  };

  const groupedList: Array<{ type: 'header'; id: string; title: string } | { type: 'item'; data: HistoryItemType }> = [];
  let currentDay = -1;
  let initialIndex = 0;
  const targetDay = initialTimestamp ? startOfDay(new Date(initialTimestamp)).getTime() : -1;

  for (const item of domainItems) {
    const itemDay = startOfDay(new Date(item.lastVisitTime)).getTime();
    if (itemDay !== currentDay) {
      currentDay = itemDay;
      if (currentDay === targetDay) {
        initialIndex = groupedList.length;
      }
      groupedList.push({ type: 'header', id: `header-${currentDay}`, title: formatDayTitle(currentDay) });
    }
    groupedList.push({ type: 'item', data: item });
  }

  const renderItem = (_index: number, row: typeof groupedList[0]) => {
    if (row.type === 'header') {
      return (
        <div className="px-4 py-2 mt-4 mb-2 bg-gray-100 dark:bg-gray-800 rounded-md sticky top-0 z-10 mx-4 max-w-4xl lg:mx-auto w-[calc(100%-2rem)]">
          <span className="font-semibold text-gray-700 dark:text-gray-300">{row.title}</span>
        </div>
      );
    }

    return (
      <div className="px-4 max-w-4xl mx-auto w-full">
        <HistoryItem 
          item={row.data}
          onDelete={onDeleteItem}
          onTogglePrivacy={onTogglePrivacy}
          isBlurred={!!privacyRecords[row.data.url]}
        />
      </div>
    );
  };

  const displayName = customSites[domain]?.customName || domainItems[0]?.domainWithoutSuffix || domain;
  const displayLogo = customSites[domain]?.customLogo || getFaviconUrl(domainItems[0]?.url || domain);

  return (
    <div className="absolute inset-0 bg-white dark:bg-gray-900 z-20 flex flex-col animate-in slide-in-from-right duration-200">
      <div className="flex items-center space-x-4 p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-0 z-30">
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-600 dark:text-gray-300" />
        </button>
        <div className="flex items-center space-x-3">
          <img src={displayLogo} alt="" className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">{displayName}</h2>
        </div>
        <span className="text-sm text-gray-500 ml-auto">{domainItems.length} {t('visits')}</span>
      </div>
      
      <div className="flex-1 w-full relative">
        <div className="absolute inset-0">
          {domainItems.length === 0 ? (
            <div className="flex justify-center items-center h-64 text-gray-500">
              {t('noResults')}
            </div>
          ) : (
            <Virtuoso
              initialTopMostItemIndex={initialIndex}
              style={{ height: '100%', width: '100%' }}
              data={groupedList}
              itemContent={renderItem}
              className="custom-scrollbar"
              components={{
                Footer: () => <div style={{ height: '2rem' }} />
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
