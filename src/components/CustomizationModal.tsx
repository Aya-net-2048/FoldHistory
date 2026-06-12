import React, { useState, useEffect } from 'react';
import type { CustomSiteData } from '../types';
import { useI18n } from '../utils/i18n';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  hostname: string;
  initialData: CustomSiteData | undefined;
  onSave: (hostname: string, data: Partial<CustomSiteData>) => void;
}

export const CustomizationModal: React.FC<Props> = ({ isOpen, onClose, hostname, initialData, onSave }) => {
  const { t } = useI18n();
  const [name, setName] = useState('');
  const [logo, setLogo] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.customName || '');
      setLogo(initialData?.customLogo || '');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert(t('invalidImage'));
        return;
      }
      // Validate file size (e.g. max 1MB for chrome.storage)
      if (file.size > 1024 * 1024) {
        alert(t('imageTooLarge'));
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(hostname, { customName: name, customLogo: logo });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6 m-4 animate-in fade-in zoom-in duration-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          {t('editCustomName')} - {hostname}
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('editCustomName')}
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={hostname}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('editCustomLogo')}
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-200 dark:border-gray-600">
                {logo ? (
                  <img src={logo} alt="Preview" className="w-8 h-8 object-cover" />
                ) : (
                  <span className="text-gray-400 text-xs">Logo</span>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 dark:text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100
                    dark:file:bg-gray-700 dark:file:text-gray-300 dark:hover:file:bg-gray-600
                    cursor-pointer"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {t('imageHint') || 'Recommended size: 64x64. Max size: 1MB'}
                </p>
                {logo && (
                  <button
                    onClick={() => setLogo('')}
                    className="mt-2 text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400"
                  >
                    {t('clearLogo') || 'Clear Logo'}
                  </button>
                )}
              </div>
            </div>
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
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
          >
            {t('save')}
          </button>
        </div>
      </div>
    </div>
  );
};
