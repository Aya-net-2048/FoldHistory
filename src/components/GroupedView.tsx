import React, { useState } from 'react';
import type { DayGroup, CustomSiteData } from '../types';
import { SiteCard } from './SiteCard';
import { CustomizationModal } from './CustomizationModal';
import { Virtuoso } from 'react-virtuoso';
import { useI18n } from '../utils/i18n';
import { isToday, isYesterday } from 'date-fns';

interface Props {
  groupedHistory: DayGroup[];
  customSites: Record<string, CustomSiteData>;
  onDeleteGroup: (domain: string, timestampStart: number, timestampEnd: number) => void;
  onUpdateCustomSite: (domain: string, data: Partial<CustomSiteData>) => void;
  onSiteClick: (domain: string) => void;
}

export const GroupedView: React.FC<Props> = ({
  groupedHistory,
  customSites,
  onDeleteGroup,
  onUpdateCustomSite,
  onSiteClick
}) => {
  const { t } = useI18n();
  const [editingHost, setEditingHost] = useState<string | null>(null);

  const formatDayTitle = (timestamp: number, dateStr: string) => {
    const date = new Date(timestamp);
    if (isToday(date)) return t('today');
    if (isYesterday(date)) return t('yesterday');
    return dateStr;
  };

  const renderDay = (_index: number, dayGroup: DayGroup) => {
    const endOfDay = dayGroup.timestamp + 24 * 60 * 60 * 1000 - 1;
    return (
      <div className="mb-8 px-4 max-w-4xl mx-auto w-full">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200 sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 py-2 z-10">
          {formatDayTitle(dayGroup.timestamp, dayGroup.dateStr)}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {dayGroup.sites.map(site => (
            <SiteCard 
              key={`${dayGroup.dateStr}-${site.domain}`}
              group={site}
              customData={customSites[site.domain]}
              onDeleteGroup={(domain) => onDeleteGroup(domain, dayGroup.timestamp, endOfDay)}
              onEditCustom={setEditingHost}
              onClick={onSiteClick}
            />
          ))}
        </div>
      </div>
    );
  };

  if (groupedHistory.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        {t('noResults')}
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      <Virtuoso
        style={{ height: '100%', width: '100%' }}
        data={groupedHistory}
        itemContent={renderDay}
        className="custom-scrollbar"
        components={{
          Footer: () => <div style={{ height: '2rem' }} />
        }}
      />
      <CustomizationModal
        isOpen={!!editingHost}
        onClose={() => setEditingHost(null)}
        hostname={editingHost || ''}
        initialData={editingHost ? customSites[editingHost] : undefined}
        onSave={onUpdateCustomSite}
      />
    </div>
  );
};
