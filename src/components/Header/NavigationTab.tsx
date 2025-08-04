import React, { useState, useEffect, useRef } from 'react';
import { CloseIcon } from '../icons';

interface NavigationTabProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  onDelete?: () => void;
  canDelete?: boolean;
  onHover?: (isHovered: boolean) => void;
  shiftDirection?: 'right' | 'none';
  isLastTab?: boolean;
  onLabelChange?: (newLabel: string) => void;
}

export default function NavigationTab({ 
  icon, 
  label, 
  isActive, 
  onClick, 
  onDelete, 
  canDelete = true,
  onHover,
  shiftDirection = 'none',
  isLastTab = false,
  onLabelChange
}: NavigationTabProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showActiveLine, setShowActiveLine] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(label);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent tab click when clicking delete
    if (onDelete && canDelete) {
      onDelete();
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover?.(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHover?.(false);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
    setEditValue(label);
  };

  const handleSaveEdit = () => {
    if (editValue.trim() && editValue !== label && onLabelChange) {
      onLabelChange(editValue.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditValue(label);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelEdit();
    }
  };

  const handleInputBlur = () => {
    handleSaveEdit();
  };

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Update edit value when label prop changes
  useEffect(() => {
    setEditValue(label);
  }, [label]);

  // Animate active line when tab becomes active
  useEffect(() => {
    if (isActive) {
      // Reset first to ensure it starts from 0
      setShowActiveLine(false);
      // Small delay to ensure smooth animation from 0
      const timer = setTimeout(() => {
        setShowActiveLine(true);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setShowActiveLine(false);
    }
  }, [isActive]);

  const hasDeleteButton = canDelete && onDelete;

  // Calculate transform based on shift direction
  const getTransform = () => {
    if (shiftDirection === 'right') return 'translateX(8px)';
    return 'translateX(0px)';
  };

  return (
    <div className={`flex h-[38.5px] items-start transition-transform duration-300 ease-out mr-1`} 
    style={{ transform: getTransform() }}>
      <div
        className="relative group flex flex-row items-center"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
          onClick={onClick}
          onDoubleClick={handleDoubleClick}
          className={`flex flex-row h-[38.5px] items-center relative transition-all duration-200 rounded-t-md pl-1 pr-1 cursor-pointer ${
            canDelete ? 'pr-2' : 'pr-2'
          } ${
            isActive ? 'pb-[11.5px] pt-[8.5px]' : 'pb-[10.5px] pt-[9.5px]'
          }`}
        >
          {/* Hover background that matches blue line width */}
          {isHovered && (
            <div 
              className={`absolute bg-neutral-800/20 top-0 bottom-0 pointer-events-none transition-all duration-200 rounded-t-md ${
                hasDeleteButton && isHovered
                  ? 'left-0 right-[-20px]' // Extended width when delete button visible
                  : 'left-0 right-0'       // Normal width
              }`} 
            />
          )}
          
          {/* Active line with smooth animation from 0 width */}
          {isActive && (
            <div 
              className={`absolute border-b-2 border-[#359aba] bottom-0 pointer-events-none transition-all duration-300 ease-out transform origin-left scale-x-0 ${
                showActiveLine ? 'scale-x-100' : 'scale-x-0'
              } ${
                hasDeleteButton && isHovered
                  ? 'left-0 right-[-20px]' // Adjusted for smaller delete button container
                  : 'left-0 right-0'       // Normal width
              }`} 
            />
          )}
          <div className="flex items-center justify-center h-3 w-5 pr-1">
            <div className={`transition-all duration-200 ${
              isActive ? 'text-[#359aba]' : 'opacity-75'
            }`}>
              {icon}
            </div>
          </div>
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleInputBlur}
              className="text-xs bg-neutral-800 text-white px-1 py-0.5 rounded border border-[#359aba] outline-none min-w-0 max-w-24"
              style={{ width: `${Math.max(4, editValue.length)}ch` }}
            />
          ) : (
            <div className={`text-xs transition-colors duration-200 ${
              isActive ? 'text-[#359aba]' : 'text-[#b0c4cc] hover:text-neutral-300'
            }`}>
              {label}
            </div>
          )}
        </button>
        
        {/* Delete Button - appears on hover only */}
        {hasDeleteButton && (
          <div className={`flex items-center transition-all duration-200 ${
            isActive ? 'pb-[11.5px] pt-[8.5px]' : 'pb-[10.5px] pt-[9.5px]'
          } ${
            isHovered ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}>
            <button
              onClick={handleDeleteClick}
              className="flex items-center justify-center h-4 w-4 text-neutral-400 hover:text-red-400 transition-all duration-200 hover:bg-red-600/10 hover:scale-110 rounded-full"
              title={`Delete ${label} tab`}
            >
              <CloseIcon />
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 
 