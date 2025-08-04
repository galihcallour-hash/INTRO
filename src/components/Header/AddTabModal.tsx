import React, { useState } from 'react';
import { CompanyIcon, DesignerIcon, DeveloperIcon, ContentIcon, HelpIcon, FileIcon, FolderIcon, ImageIcon, LayersIcon } from '../icons';

interface AddTabModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTab: (icon: React.ReactNode, name: string) => void;
}

const availableIcons = [
  { key: 'company', icon: <CompanyIcon />, label: 'Company' },
  { key: 'designer', icon: <DesignerIcon />, label: 'Designer' },
  { key: 'developer', icon: <DeveloperIcon />, label: 'Developer' },
  { key: 'content', icon: <ContentIcon />, label: 'Content' },
  { key: 'help', icon: <HelpIcon />, label: 'Help' },
  { key: 'file', icon: <FileIcon />, label: 'File' },
  { key: 'folder', icon: <FolderIcon />, label: 'Folder' },
  { key: 'image', icon: <ImageIcon />, label: 'Image' },
  { key: 'layers', icon: <LayersIcon />, label: 'Layers' },
];

export default function AddTabModal({ isOpen, onClose, onCreateTab }: AddTabModalProps) {
  const [selectedIcon, setSelectedIcon] = useState(availableIcons[0]);
  const [tabName, setTabName] = useState('');

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tabName.trim()) {
      onCreateTab(selectedIcon.icon, tabName.trim());
      setTabName('');
      setSelectedIcon(availableIcons[0]);
      onClose();
    }
  };

  const handleCancel = () => {
    setTabName('');
    setSelectedIcon(availableIcons[0]);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-2">Add New Tab</h3>
          <p className="text-neutral-300 text-sm">
            Choose an icon and enter a name for your new tab.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium text-neutral-200 mb-3">
              Select Icon
            </label>
            <div className="grid grid-cols-5 gap-2">
              {availableIcons.map((iconOption) => (
                <button
                  key={iconOption.key}
                  type="button"
                  onClick={() => setSelectedIcon(iconOption)}
                  className={`p-3 rounded-md border-2 transition-all duration-200 flex items-center justify-center ${
                    selectedIcon.key === iconOption.key
                      ? 'border-[#359aba] bg-[#359aba]/10'
                      : 'border-neutral-600 hover:border-neutral-500'
                  }`}
                  title={iconOption.label}
                >
                  <div className={`w-4 h-4 ${
                    selectedIcon.key === iconOption.key ? 'text-[#359aba]' : 'text-neutral-400'
                  }`}>
                    {iconOption.icon}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Name Input */}
          <div>
            <label className="block text-sm font-medium text-neutral-200 mb-2">
              Tab Name
            </label>
            <input
              type="text"
              value={tabName}
              onChange={(e) => setTabName(e.target.value)}
              placeholder="Enter tab name..."
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#359aba] focus:border-transparent"
              autoFocus
              maxLength={50}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-neutral-300 bg-neutral-700 hover:bg-neutral-600 rounded-md transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!tabName.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-[#359aba] hover:bg-[#359aba]/90 disabled:bg-neutral-600 disabled:cursor-not-allowed rounded-md transition-colors duration-200"
            >
              Create Tab
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 