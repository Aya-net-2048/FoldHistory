import { useState, useEffect, useCallback } from 'react';
import type { HistoryItem, DayGroup, SiteGroup } from '../types';
import { parse } from 'tldts';
import { format, startOfDay } from 'date-fns';

export function useHistory(searchText: string = '') {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [groupedHistory, setGroupedHistory] = useState<DayGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchHistory = useCallback(() => {
    setLoading(true);
    if (!chrome || !chrome.history) {
      // Mock data for development
      console.warn('Chrome history API not available. Using mock data.');
      const mockItems: HistoryItem[] = [
        { id: '1', url: 'https://github.com/microsoft/vscode', title: 'microsoft/vscode', lastVisitTime: Date.now() - 1000 * 60, visitCount: 10, typedCount: 2, hostname: 'github.com', domain: 'github.com', domainWithoutSuffix: 'github' },
        { id: '2', url: 'https://github.com/facebook/react', title: 'facebook/react', lastVisitTime: Date.now() - 1000 * 3600, visitCount: 5, typedCount: 1, hostname: 'github.com', domain: 'github.com', domainWithoutSuffix: 'github' },
        { id: '3', url: 'https://www.google.com/search?q=react', title: 'react - Google Search', lastVisitTime: Date.now() - 1000 * 7200, visitCount: 20, typedCount: 5, hostname: 'www.google.com', domain: 'google.com', domainWithoutSuffix: 'google' },
      ];
      setHistoryItems(mockItems);
      setGroupedHistory(groupHistory(mockItems));
      setLoading(false);
      return;
    }

    const query = {
      text: searchText,
      maxResults: 10000,
      startTime: new Date().getTime() - 1000 * 60 * 60 * 24 * 30 // Last 30 days
    };

    chrome.history.search(query, (results: chrome.history.HistoryItem[]) => {
      const items: HistoryItem[] = results.map(item => {
        let hostname = '';
        let domain = '';
        let domainWithoutSuffix = '';
        try {
          if (item.url) {
            const urlObj = new URL(item.url);
            hostname = urlObj.hostname;
            const parsed = parse(hostname);
            domain = parsed.domain || hostname;
            domainWithoutSuffix = parsed.domainWithoutSuffix || hostname.split('.')[0] || hostname;
          }
        } catch (e) {
          // ignore invalid urls
        }
        return {
          id: item.id || Math.random().toString(),
          url: item.url || '',
          title: item.title || item.url || '',
          lastVisitTime: item.lastVisitTime || Date.now(),
          visitCount: item.visitCount || 0,
          typedCount: item.typedCount || 0,
          hostname,
          domain,
          domainWithoutSuffix
        };
      }).filter(item => item.url && item.hostname); // basic filter
      
      // Sort by time descending
      items.sort((a, b) => b.lastVisitTime - a.lastVisitTime);
      
      setHistoryItems(items);
      setGroupedHistory(groupHistory(items));
      setLoading(false);
    });
  }, [searchText]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const deleteItem = (url: string) => {
    if (chrome?.history) {
      chrome.history.deleteUrl({ url }, () => {
        fetchHistory(); // Refresh after deletion
      });
    } else {
      setHistoryItems(items => items.filter(i => i.url !== url));
      setGroupedHistory(() => groupHistory(historyItems.filter(i => i.url !== url)));
    }
  };

  const deleteHostItems = (domain: string, timestampStart: number, timestampEnd: number) => {
     // In a real app, you might want to delete specific URLs within that timeframe, 
     // but chrome.history.deleteUrl only deletes by URL. So we find all matching URLs.
     const itemsToDelete = historyItems.filter(item => 
        item.domain === domain && 
        item.lastVisitTime >= timestampStart && 
        item.lastVisitTime <= timestampEnd
     );

     if (chrome?.history) {
        itemsToDelete.forEach(item => {
            chrome.history.deleteUrl({ url: item.url });
        });
        // Simplistic refresh (might have race condition with multiple deletes, but acceptable for simple case)
        setTimeout(fetchHistory, 500); 
     } else {
        fetchHistory();
     }
  };

  return {
    historyItems,
    groupedHistory,
    loading,
    deleteItem,
    deleteHostItems,
    refresh: fetchHistory
  };
}

function groupHistory(items: HistoryItem[]): DayGroup[] {
  const dayMap = new Map<string, { timestamp: number; siteMap: Map<string, SiteGroup> }>();

  for (const item of items) {
    const date = new Date(item.lastVisitTime);
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayTimestamp = startOfDay(date).getTime();

    if (!dayMap.has(dateStr)) {
      dayMap.set(dateStr, { timestamp: dayTimestamp, siteMap: new Map() });
    }
    
    const dayData = dayMap.get(dateStr)!;
    if (!dayData.siteMap.has(item.domain)) {
      dayData.siteMap.set(item.domain, {
        domain: item.domain,
        domainWithoutSuffix: item.domainWithoutSuffix,
        visits: []
      });
    }
    
    dayData.siteMap.get(item.domain)!.visits.push(item);
  }

  const result: DayGroup[] = Array.from(dayMap.entries()).map(([dateStr, { timestamp, siteMap }]) => ({
    dateStr,
    timestamp,
    sites: Array.from(siteMap.values())
  }));

  // Sort days descending
  result.sort((a, b) => b.timestamp - a.timestamp);

  return result;
}
