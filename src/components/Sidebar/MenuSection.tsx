import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronIcon, ThreeDotsIcon, EditIcon, PlusIcon, DeleteIcon, ReorderIcon } from '../icons';

interface MenuSectionProps {
  title: string;
  children: React.ReactNode;
  onAddNewMenu?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  isDragging?: boolean;
}

export default function MenuSection({ 
  title, 
  children, 
  onAddNewMenu
}: MenuSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const threeDotsRef = useRef<HTMLButtonElement>(null);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handleDropdownAction = (action: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(false);
    setIsHovered(false); // Reset hover state when dropdown closes
    
    switch(action) {
      case 'edit':
        console.log(`Edit section: ${title}`);
        break;
      case 'addNewMenu':
        onAddNewMenu?.();
        break;
      case 'delete':
        console.log(`Delete section: ${title}`);
        break;
      case 'reorder':
        console.log(`Reorder section: ${title}`);
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
    <div className="flex flex-col items-start justify-start w-full">
      <div 
        className="flex flex-row items-center justify-start pb-[7px] pl-3.5 pr-0 pt-0 w-full cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onClick={toggleExpanded}
      >
        <div className="flex flex-row grow items-center justify-between">
          <div className="flex flex-row grow items-center justify-center p-[3.5px] rounded-[4.75px]">
            <div className="flex flex-col grow items-start justify-start">
              <div className="font-normal text-neutral-50 text-[10.5px] tracking-[0.525px] leading-[14px] w-full">
                {title}
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center justify-start pl-[21px] relative">
            {/* Three dots menu - appears on hover or when dropdown is open */}
            {(isHovered || showDropdown) && (
              <div className="relative">
                <button
                  ref={threeDotsRef}
                  onClick={toggleDropdown}
                  className="flex items-center justify-center p-1 hover:bg-neutral-700/50 rounded transition-colors duration-200"
                >
                  <div className="w-3 h-3 text-neutral-400 hover:text-neutral-200">
                    <ThreeDotsIcon />
                  </div>
                </button>
                
                {/* Dropdown Menu - Using Portal to prevent stacking context issues */}
                {showDropdown && typeof document !== 'undefined' && createPortal(
                  <div 
                    ref={dropdownRef} 
                    className="fixed bg-neutral-800 border border-neutral-700 rounded-md shadow-lg min-w-[140px]"
                    style={{
                      zIndex: 999999,
                      position: 'fixed',
                      left: threeDotsRef.current ? threeDotsRef.current.getBoundingClientRect().right - 140 : 0,
                      top: threeDotsRef.current ? threeDotsRef.current.getBoundingClientRect().bottom + 4 : 0,
                    }}
                  >
                    <button
                      onClick={(e) => handleDropdownAction('edit', e)}
                      className="w-full flex items-center px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-700 transition-colors duration-200"
                    >
                      <EditIcon />
                      <span className="ml-2">Edit</span>
                    </button>
                    <button
                      onClick={(e) => handleDropdownAction('addNewMenu', e)}
                      className="w-full flex items-center px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-700 transition-colors duration-200"
                    >
                      <PlusIcon />
                      <span className="ml-2">Add New Menu</span>
                    </button>
                    <button
                      onClick={(e) => handleDropdownAction('delete', e)}
                      className="w-full flex items-center px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-700 transition-colors duration-200"
                    >
                      <DeleteIcon />
                      <span className="ml-2">Delete</span>
                    </button>
                    <button
                      onClick={(e) => handleDropdownAction('reorder', e)}
                      className="w-full flex items-center px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-700 transition-colors duration-200"
                    >
                      <ReorderIcon />
                      <span className="ml-2">Reorder</span>
                    </button>
                  </div>,
                  document.body
                )}
              </div>
            )}
            
            {/* Chevron icon */}
            <div className="flex flex-col items-start justify-start p-[3.5px] rounded-[4.75px]">
              <div className={`w-[10.5px] h-[10.5px] transition-transform duration-200 ${
                isExpanded ? 'rotate-0' : '-rotate-90'
              }`}>
                <ChevronIcon />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items - simplified without conflicting animations */}
      <div className="flex flex-col gap-[1.8px] items-start justify-start w-full">
        {children}
      </div>
    </div>
  );
} 