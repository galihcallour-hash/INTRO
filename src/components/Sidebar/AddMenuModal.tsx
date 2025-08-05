import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CloseIcon, FolderIcon, FileIcon, PageIcon, ImageIcon, LayersIcon, DesignIcon, SystemIcon, FlowIcon, AIIcon } from '../icons';

interface AddMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateMenu: (icon: string, name: string) => void;
}

const availableIcons = [
  { id: 'folder', name: 'Folder', component: <FolderIcon /> },
  { id: 'file', name: 'File', component: <FileIcon /> },
  { id: 'page', name: 'Page', component: <PageIcon /> },
  { id: 'image', name: 'Image', component: <ImageIcon /> },
  { id: 'layers', name: 'Layers', component: <LayersIcon /> },
  { id: 'design', name: 'Design', component: <DesignIcon /> },
  { id: 'system', name: 'System', component: <SystemIcon /> },
  { id: 'flow', name: 'Flow', component: <FlowIcon /> },
  { id: 'ai', name: 'AI', component: <AIIcon /> },
];

export default function AddMenuModal({ isOpen, onClose, onCreateMenu }: AddMenuModalProps) {
  const [selectedIcon, setSelectedIcon] = useState(availableIcons[0]);
  const [menuName, setMenuName] = useState('');
  const [showIconDropdown, setShowIconDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCreate = () => {
    if (menuName.trim()) {
      onCreateMenu(selectedIcon.id, menuName.trim());
      handleClose();
    }
  };

  const handleClose = () => {
    setMenuName('');
    setSelectedIcon(availableIcons[0]);
    setShowIconDropdown(false);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreate();
    } else if (e.key === 'Escape') {
      handleClose();
    }
  };

  const selectIcon = (icon: typeof availableIcons[0]) => {
    setSelectedIcon(icon);
    setShowIconDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowIconDropdown(false);
      }
    };

    if (showIconDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showIconDropdown]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/30 flex items-center justify-center p-4"
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999999,
        backdropFilter: 'blur(1px)'
      }}
    >
      <div className="bg-neutral-800 rounded-lg shadow-xl p-6 w-96 max-w-[90vw]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-neutral-50">Add New Menu</h2>
          <button
            onClick={handleClose}
            className="text-neutral-400 hover:text-neutral-200 transition-colors duration-200"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Icon and Name Row */}
          <div className="flex items-center space-x-3">
            {/* Icon Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowIconDropdown(!showIconDropdown)}
                className="flex items-center justify-center w-12 h-10 bg-neutral-700 border border-neutral-600 rounded-md hover:bg-neutral-600 transition-colors duration-200 cursor-pointer"
              >
                <div className="text-neutral-200">
                  {selectedIcon.component}
                </div>
              </button>

              {/* Icon Dropdown Menu - Using Portal to prevent stacking context issues */}
              {showIconDropdown && typeof document !== 'undefined' && createPortal(
                <div 
                  className="fixed bg-neutral-700 border border-neutral-600 rounded-md shadow-lg max-h-60 overflow-y-auto"
                  style={{
                    zIndex: 999999,
                    position: 'fixed',
                    left: dropdownRef.current?.querySelector('button')?.getBoundingClientRect().left || 0,
                    top: (dropdownRef.current?.querySelector('button')?.getBoundingClientRect().bottom || 0) + 4,
                    minWidth: '200px'
                  }}
                >
                  {availableIcons.map((icon) => (
                    <button
                      key={icon.id}
                      onClick={() => selectIcon(icon)}
                      className="w-full flex items-center px-3 py-2 text-neutral-200 hover:bg-neutral-600 transition-colors duration-200"
                    >
                      <div className="mr-3">{icon.component}</div>
                      <span className="text-sm">{icon.name}</span>
                    </button>
                  ))}
                </div>,
                document.body
              )}
            </div>

            {/* Menu Name Input */}
            <div className="flex-1">
              <input
                ref={inputRef}
                type="text"
                value={menuName}
                onChange={(e) => setMenuName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter menu name"
                className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-neutral-50 placeholder-neutral-400 focus:outline-none focus:border-[#359aba] transition-colors duration-200"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 mt-6">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-neutral-400 hover:text-neutral-200 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!menuName.trim()}
            className="px-4 py-2 bg-[#359aba] text-white rounded-md hover:bg-[#2d7b94] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );

  // Render modal at document root to avoid stacking context issues
  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
} 