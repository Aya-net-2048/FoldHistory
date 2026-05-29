import { useState, useEffect } from 'react';
import type { CustomSiteData } from '../types';

export function useStorage() {
  const [customSites, setCustomSites] = useState<Record<string, CustomSiteData>>({});
  const [privacyRecords, setPrivacyRecords] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Mock for development if outside chrome extension environment
    if (!chrome || !chrome.storage) {
      console.warn('Chrome storage API not available, using empty state.');
      return;
    }

    chrome.storage.local.get(['customSites', 'privacyRecords'], (result: { [key: string]: any }) => {
      if (result.customSites) setCustomSites(result.customSites);
      if (result.privacyRecords) setPrivacyRecords(result.privacyRecords);
    });
  }, []);

  const updateCustomSite = (hostname: string, data: Partial<CustomSiteData>) => {
    const newSites = {
      ...customSites,
      [hostname]: { ...customSites[hostname], hostname, ...data }
    };
    setCustomSites(newSites);
    if (chrome?.storage) {
      chrome.storage.local.set({ customSites: newSites });
    }
  };

  const togglePrivacy = (url: string) => {
    const isBlurred = !privacyRecords[url];
    const newRecords = { ...privacyRecords, [url]: isBlurred };
    if (!isBlurred) {
      delete newRecords[url]; // Clean up
    }
    setPrivacyRecords(newRecords);
    if (chrome?.storage) {
      chrome.storage.local.set({ privacyRecords: newRecords });
    }
  };

  return {
    customSites,
    privacyRecords,
    updateCustomSite,
    togglePrivacy
  };
}
