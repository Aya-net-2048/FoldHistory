import { useState, useEffect } from 'react';
import { useHistory } from './hooks/useHistory';
import { useStorage } from './hooks/useStorage';
import { useI18n } from './utils/i18n';
import { GroupedView } from './components/GroupedView';
import { TimelineView } from './components/TimelineView';
import { ExportModal } from './components/ExportModal';
import { DomainDetailView } from './components/DomainDetailView';
import { Search, Download, Moon, Sun, LayoutList, Clock } from 'lucide-react';

function App() {
  const { lang, setLanguage, t } = useI18n();
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grouped' | 'timeline'>('grouped');
  const [darkMode, setDarkMode] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [activeDomainDetail, setActiveDomainDetail] = useState<string | null>(null);

  const { historyItems, groupedHistory, deleteItem, deleteHostItems } = useHistory(debouncedSearch);
  const { customSites, privacyRecords, updateCustomSite, togglePrivacy } = useStorage();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchText]);

  // Handle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleExportClick = () => {
    setIsExportModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans flex flex-col transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
              <img src="/logo.png" alt="FoldHistory" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-xl font-bold hidden sm:block">{t('title')}</h1>
          </div>

          <div className="flex-1 max-w-xl mx-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500" size={18} />
              <input 
                type="text" 
                placeholder={t('searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-transparent focus:bg-white dark:focus:bg-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 rounded-full outline-none transition-all"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="hidden md:flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('grouped')}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'grouped' 
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <LayoutList size={16} />
                <span>{t('groupedView')}</span>
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'timeline' 
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Clock size={16} />
                <span>{t('timelineView')}</span>
              </button>
            </div>
            
            <button
              onClick={() => setLanguage(lang === 'zh' ? 'en' : 'zh')}
              className="px-2 py-1 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              {lang === 'zh' ? 'EN' : '中'}
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={handleExportClick}
              className="hidden sm:flex items-center space-x-1 px-3 py-1.5 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-md transition-colors text-sm font-medium"
            >
              <Download size={16} />
              <span>{t('exportBtn')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full flex flex-col pt-6 pb-0 px-0 relative overflow-hidden">
        {/* View Area */}
        <div className="flex-1 w-full relative">
          <div className="absolute inset-0">
            {viewMode === 'grouped' ? (
              <GroupedView 
                groupedHistory={groupedHistory}
                customSites={customSites}
                onDeleteGroup={deleteHostItems}
                onUpdateCustomSite={updateCustomSite}
                onSiteClick={setActiveDomainDetail}
              />
            ) : (
              <TimelineView 
                historyItems={historyItems}
                privacyRecords={privacyRecords}
                onDeleteItem={deleteItem}
                onTogglePrivacy={togglePrivacy}
              />
            )}
          </div>

          {activeDomainDetail && (
            <DomainDetailView
              domain={activeDomainDetail}
              historyItems={historyItems}
              privacyRecords={privacyRecords}
              customSites={customSites}
              onDeleteItem={deleteItem}
              onTogglePrivacy={togglePrivacy}
              onClose={() => setActiveDomainDetail(null)}
            />
          )}
        </div>
      </main>

      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        historyItems={historyItems} 
      />
    </div>
  );
}

export default App;
