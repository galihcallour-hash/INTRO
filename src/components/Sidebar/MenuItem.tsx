import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ThreeDotsIcon, EditIcon, ImageIcon, CopyIcon, DeleteIcon, DragHandleIcon } from '../icons';

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
    setIsHovered(false); // Reset hover state when dropdown closes
    
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
          setIsHovered(false); // Reset hover state when clicking outside
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
      className={`flex flex-row items-center w-full relative transition-all duration-300 ease-in-out ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        if (!showDropdown) {
          setIsHovered(false);
        }
      }}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {/* Main button container that includes all elements */}
      <div 
        className={`flex flex-row items-center w-full pb-[5.25px] pl-[8px] pr-[4px] pt-[4.25px] rounded-[6px] transition-all duration-300 ease-in-out hover:bg-[rgba(250,250,250,0.05)] cursor-pointer ${
          isActive ? 'bg-[rgba(250,250,250,0.1)]' : ''
        }`}
        onClick={onClick}
      >
        {/* Drag Handle - appears on left when hovered only */}
        <div
          className={`flex items-center justify-center w-3 h-3 cursor-grab active:cursor-grabbing text-neutral-500 hover:text-neutral-300 transition-opacity duration-300 ease-in-out mr-1 ${
            (isHovered || showDropdown) 
              ? 'opacity-100' 
              : 'opacity-0 pointer-events-none'
          }`}
          draggable
          onDragStart={onDragStart}
          title="Drag to reorder"
          onClick={(e) => e.stopPropagation()}
        >
          <DragHandleIcon />
        </div>

        {/* Main button content */}
        <div className="flex flex-row grow items-center justify-start transition-all duration-300 ease-in-out">
          {/* Icon */}
          <div className="flex flex-col h-3.5 items-start justify-start w-[21px] pr-1">
            <div className={`flex flex-col items-start justify-center overflow-clip size-3.5 transition-colors duration-300 ease-in-out ${
              isActive ? 'text-neutral-50' : 'text-[#a1a1a1] hover:text-neutral-300'
            }`}>
              {icon}
            </div>
          </div>
          
          {/* Text */}
          <div className="flex flex-col grow items-start justify-start">
            <div className={`font-normal text-[11.531px] leading-[17.5px] w-full text-left transition-colors duration-300 ease-in-out ${
              isActive ? 'text-neutral-50' : 'text-[#a1a1a1] hover:text-neutral-300'
            }`}>
              {title}
            </div>
          </div>
        </div>

        {/* Three dots menu - appears on right when hovered only */}
        <div className={`flex items-center justify-center w-6 transition-opacity duration-300 ease-in-out ${
          (isHovered || showDropdown)
            ? 'opacity-100'
            : 'opacity-0 pointer-events-none'
        }`}>
          <button
            ref={threeDotsRef}
            onClick={toggleDropdown}
            className="flex items-center justify-center p-1 hover:bg-neutral-700/50 rounded transition-all duration-200 ease-in-out"
          >
            <div className="w-3 h-3 text-neutral-400 hover:text-neutral-200 transition-colors duration-200 ease-in-out">
              <ThreeDotsIcon />
            </div>
          </button>
          
          {/* Dropdown Menu - Using Portal to prevent stacking context issues */}
          {showDropdown && typeof document !== 'undefined' && createPortal(
            <div 
              ref={dropdownRef} 
              className="fixed bg-neutral-800 border border-neutral-700 rounded-md shadow-lg min-w-[130px] animate-in fade-in-0 zoom-in-95 duration-200"
              style={{
                zIndex: 999999,
                position: 'fixed',
                left: threeDotsRef.current ? threeDotsRef.current.getBoundingClientRect().right - 130 : 0,
                top: threeDotsRef.current ? threeDotsRef.current.getBoundingClientRect().bottom + 4 : 0,
              }}
            >
              <button
                onClick={(e) => handleDropdownAction('rename', e)}
                className="w-full flex items-center px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-700 transition-colors duration-200 ease-in-out"
              >
                <EditIcon />
                <span className="ml-2">Rename</span>
              </button>
              <button
                onClick={(e) => handleDropdownAction('changeIcon', e)}
                className="w-full flex items-center px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-700 transition-colors duration-200 ease-in-out"
              >
                <ImageIcon />
                <span className="ml-2">Change Icon</span>
              </button>
              <button
                onClick={(e) => handleDropdownAction('duplicate', e)}
                className="w-full flex items-center px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-700 transition-colors duration-200 ease-in-out"
              >
                <CopyIcon />
                <span className="ml-2">Duplicate</span>
              </button>
              <button
                onClick={(e) => handleDropdownAction('delete', e)}
                className="w-full flex items-center px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-700 hover:text-red-400 transition-colors duration-200 ease-in-out"
              >
                <DeleteIcon />
                <span className="ml-2">Delete</span>
              </button>
            </div>,
            document.body
          )}
        </div>
      </div>
    </div>
  );
} 