import React, { useState, useRef, useEffect } from 'react';
import { ThreeDotsIcon, EditIcon, ImageIcon, FileIcon, DeleteIcon, DragHandleIcon } from '../icons';

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  isActive?: boolean;
  onClick?: () => void;
  onRename?: (newTitle: string) => void;
  onChangeIcon?: (newIcon: React.ReactNode) => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  isDragging?: boolean;
}

export default function MenuItem({ 
  icon, 
  title, 
  isActive = false, 
  onClick, 
  onRename, 
  onChangeIcon, 
  onDuplicate, 
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging = false
}: MenuItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const threeDotsRef = useRef<HTMLButtonElement>(null);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handleDropdownAction = (action: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(false);
    
    switch(action) {
      case 'rename':
        onRename?.(title);
        break;
      case 'changeIcon':
        onChangeIcon?.(icon);
        break;
      case 'duplicate':
        onDuplicate?.();
        break;
      case 'delete':
        onDelete?.();
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showDropdown && dropdownRef.current && threeDotsRef.current) {
        const isOutsideDropdown = !dropdownRef.current.contains(event.target as Node);
        const isNotThreeDotsButton = !threeDotsRef.current.contains(event.target as Node);
        
        if (isOutsideDropdown && isNotThreeDotsButton) {
          setShowDropdown(false);
        }
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showDropdown]);

  return (
    <div 
      className={`flex flex-row items-center justify-center w-full relative transition-opacity duration-200 ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {/* Drag Handle - appears on hover */}
      {isHovered && (
        <div className="absolute left-1 z-10">
          <div
            className="flex items-center justify-center pr-5 mr-4 cursor-grab active:cursor-grabbing text-neutral-500 hover:text-neutral-300 transition-colors duration-200"
            draggable
            onDragStart={onDragStart}
          >
            <DragHandleIcon />
          </div>
        </div>
      )}

      <button 
        onClick={onClick}
        className={`flex flex-row grow items-center justify-start pb-[5.25px] pl-[12px] pr-[16px] pt-[4.25px] rounded-[6px] transition-all duration-200 hover:bg-[rgba(250,250,250,0.05)] cursor-pointer ${
          isActive ? 'bg-[rgba(250,250,250,0.1)]' : ''
        }`}
      >
        <div className="flex flex-row grow items-center justify-start">
          <div className="flex flex-col h-3.5 items-start justify-start w-[21px] pr-1">
            <div className={`flex flex-col items-start justify-center overflow-clip size-3.5 transition-colors duration-200 ${
              isActive ? 'text-neutral-50' : 'text-[#a1a1a1] hover:text-neutral-300'
            }`}>
              {icon}
            </div>
          </div>
          <div className="flex flex-col grow items-start justify-start">
            <div className={`font-normal text-[11.531px] leading-[17.5px] w-full text-left transition-colors duration-200 ${
              isActive ? 'text-neutral-50' : 'text-[#a1a1a1] hover:text-neutral-300'
            }`}>
              {title}
            </div>
          </div>
        </div>
      </button>

      {/* Three dots menu - appears on hover */}
      {isHovered && (
        <div className="absolute right-3 z-10">
          <button
            ref={threeDotsRef}
            onClick={toggleDropdown}
            className="flex items-center justify-center p-1 hover:bg-neutral-700/50 rounded transition-colors duration-200"
          >
            <div className="w-3 h-3 text-neutral-400 hover:text-neutral-200">
              <ThreeDotsIcon />
            </div>
          </button>
          
          {/* Dropdown Menu */}
          {showDropdown && (
            <div ref={dropdownRef} className="absolute right-0 top-full mt-1 bg-neutral-800 border border-neutral-700 rounded-md shadow-lg z-50 min-w-[130px]">
              <button
                onClick={(e) => handleDropdownAction('rename', e)}
                className="w-full flex items-center px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-700 transition-colors duration-200"
              >
                <EditIcon />
                <span className="ml-2">Rename</span>
              </button>
              <button
                onClick={(e) => handleDropdownAction('changeIcon', e)}
                className="w-full flex items-center px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-700 transition-colors duration-200"
              >
                <ImageIcon />
                <span className="ml-2">Change Icon</span>
              </button>
              <button
                onClick={(e) => handleDropdownAction('duplicate', e)}
                className="w-full flex items-center px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-700 transition-colors duration-200"
              >
                <FileIcon />
                <span className="ml-2">Duplicate</span>
              </button>
              <button
                onClick={(e) => handleDropdownAction('delete', e)}
                className="w-full flex items-center px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-700 transition-colors duration-200"
              >
                <DeleteIcon />
                <span className="ml-2">Delete</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 