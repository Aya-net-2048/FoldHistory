import { useState, useEffect } from 'react';

type LangCode = 'zh' | 'en';

const translations = {
  zh: {
    title: '历史记录',
    searchPlaceholder: '搜索历史记录...',
    groupedView: '聚合视图',
    timelineView: '时间线视图',
    exportBtn: '导出',
    clearAllBtn: '清空今日记录',
    editCustomName: '编辑名称',
    editCustomLogo: '修改 Logo',
    save: '保存',
    cancel: '取消',
    delete: '删除',
    visits: '次访问',
    today: '今天',
    yesterday: '昨天',
    noResults: '没有找到历史记录',
    unlockHover: '悬停解锁',
    blurToggle: '隐私',
    exportSuccess: '导出成功',
    noMoreData: '没有更多记录了'
  },
  en: {
    title: 'History',
    searchPlaceholder: 'Search history...',
    groupedView: 'Grouped',
    timelineView: 'Timeline',
    exportBtn: 'Export',
    clearAllBtn: 'Clear Day',
    editCustomName: 'Edit Name',
    editCustomLogo: 'Edit Logo',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    visits: 'visits',
    today: 'Today',
    yesterday: 'Yesterday',
    noResults: 'No history found',
    unlockHover: 'Hover to unlock',
    blurToggle: 'Privacy',
    exportSuccess: 'Export successful',
    noMoreData: 'No more data'
  }
};

let currentLang: LangCode = 'zh'; // Default to Chinese
const listeners = new Set<(lang: LangCode) => void>();

export const setLanguage = (lang: LangCode) => {
  currentLang = lang;
  if (chrome?.storage) {
    chrome.storage.local.set({ language: lang });
  }
  listeners.forEach(listener => listener(lang));
};

export const t = (key: keyof typeof translations['zh']): string => {
  return translations[currentLang][key] || key;
};

export function useI18n() {
  const [lang, setLang] = useState<LangCode>(currentLang);

  useEffect(() => {
    if (chrome?.storage) {
      chrome.storage.local.get(['language'], (result: { [key: string]: any }) => {
        if (result.language && (result.language === 'zh' || result.language === 'en')) {
          currentLang = result.language;
          setLang(result.language);
        }
      });
    }

    listeners.add(setLang);
    return () => {
      listeners.delete(setLang);
    };
  }, []);

  return { lang, setLanguage, t: (key: keyof typeof translations['zh']) => translations[lang][key] || key };
}
