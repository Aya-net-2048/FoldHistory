import React from 'react';
import type { HistoryItem as HistoryItemType } from '../types';
import { HistoryItem } from './HistoryItem';
import { Virtuoso } from 'react-virtuoso';
import { useI18n } from '../utils/i18n';
import { format, startOfDay, isToday, isYesterday } from 'date-fns';

interface Props {
  historyItems: HistoryItemType[];
  privacyRecords: Record<string, boolean>;
  onDeleteItem: (url: string) => void;
  onTogglePrivacy: (url: string) => void;
}

export const TimelineView: React.FC<Props> = ({
  historyItems,
  privacyRecords,
  onDeleteItem,
  onTogglePrivacy
}) => {
  const { t } = useI18n();

  const formatDayTitle = (timestamp: number) => {
    const date = new Date(timestamp);
    if (isToday(date)) return t('today');
    if (isYesterday(date)) return t('yesterday');
    return format(date, 'yyyy-MM-dd');
  };

  // Group items by day for timeline dividers
  const groupedList: Array<{ type: 'header'; id: string; title: string } | { type: 'item'; data: HistoryItemType }> = [];
  let currentDay = -1;

  for (const item of historyItems) {
    const itemDay = startOfDay(new Date(item.lastVisitTime)).getTime();
    if (itemDay !== currentDay) {
      currentDay = itemDay;
      groupedList.push({ type: 'header', id: `header-${currentDay}`, title: formatDayTitle(currentDay) });
    }
    groupedList.push({ type: 'item', data: item });
  }

  if (historyItems.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        {t('noResults')}
      </div>
    );
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

  return (
    <div className="absolute inset-0">
      <Virtuoso
        style={{ height: '100%', width: '100%' }}
        data={groupedList}
        itemContent={renderItem}
        className="custom-scrollbar"
        components={{
          Footer: () => <div style={{ height: '2rem' }} />
        }}
      />
    </div>
  );
};
