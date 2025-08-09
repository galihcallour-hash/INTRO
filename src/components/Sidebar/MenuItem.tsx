import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  ThreeDotsIcon, 
  EditIcon, 
  ImageIcon, 
  CopyIcon, 
  DeleteIcon, 
  DragHandleIcon,
  HomeIcon,
  FolderIcon,
  FileIcon,
  PageIcon,
  CameraIcon,
  VideoIcon,
  MusicIcon,
  StarIcon,
  HeartIcon,
  PersonIcon,
  EmailIcon,
  PhoneIcon,
  LocationIcon,
  CalendarIcon,
  ClockIcon,
  SearchIcon,
  NotificationIcon,
  LayersIcon,
  DesignIcon,
  SystemIcon,
  FlowIcon,
  AIIcon,
  GameIcon,
  BookIcon,
  ShoppingIcon,
  FavoriteIcon,
  MenuIcon,
  MoreIcon
} from '../icons';

// Available icons for the icon picker
const availableIcons = [
  { name: 'Home', icon: <HomeIcon /> },
  { name: 'Folder', icon: <FolderIcon /> },
  { name: 'File', icon: <FileIcon /> },
  { name: 'Page', icon: <PageIcon /> },
  { name: 'Image', icon: <ImageIcon /> },
  { name: 'Camera', icon: <CameraIcon /> },
  { name: 'Video', icon: <VideoIcon /> },
  { name: 'Music', icon: <MusicIcon /> },
  { name: 'Star', icon: <StarIcon /> },
  { name: 'Heart', icon: <HeartIcon /> },
  { name: 'Person', icon: <PersonIcon /> },
  { name: 'Email', icon: <EmailIcon /> },
  { name: 'Phone', icon: <PhoneIcon /> },
  { name: 'Location', icon: <LocationIcon /> },
  { name: 'Calendar', icon: <CalendarIcon /> },
  { name: 'Clock', icon: <ClockIcon /> },
  { name: 'Search', icon: <SearchIcon /> },
  { name: 'Notification', icon: <NotificationIcon /> },
  { name: 'Layers', icon: <LayersIcon /> },
  { name: 'Design', icon: <DesignIcon /> },
  { name: 'System', icon: <SystemIcon /> },
  { name: 'Flow', icon: <FlowIcon /> },
  { name: 'AI', icon: <AIIcon /> },
  { name: 'Game', icon: <GameIcon /> },
  { name: 'Book', icon: <BookIcon /> },
  { name: 'Shopping', icon: <ShoppingIcon /> },
  { name: 'Favorite', icon: <FavoriteIcon /> },
  { name: 'Menu', icon: <MenuIcon /> },
  { name: 'More', icon: <MoreIcon /> },
];

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
  onDrop
}: MenuItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);
  const threeDotsRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const iconPickerRef = useRef<HTMLDivElement>(null);
  const changeIconButtonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handleIconSelect = (iconData: { name: string; icon: React.ReactNode }) => {
    onChangeIcon?.(iconData.icon);
    setShowIconPicker(false);
    setShowDropdown(false);
  };

  const startEditing = () => {
    setIsEditing(true);
    setEditValue(title);
    setShowDropdown(false);
  };

  const saveEdit = () => {
    const trimmedValue = editValue.trim();
    if (trimmedValue) {
      // Always call onRename if there's a value, even if unchanged
      onRename?.(trimmedValue);
    }
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setEditValue(title);
    setIsEditing(false);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    }
  };

  const handleMenuItemClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Clear any existing timeout
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    
    onClick?.();
  };

  const handleDropdownAction = (action: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (action === 'rename') {
      startEditing();
    } else if (action === 'changeIcon') {
      setShowIconPicker(true);
      // Don't close dropdown yet, wait for icon selection
    } else if (action === 'duplicate') {
      onDuplicate?.();
      setShowDropdown(false);
    } else if (action === 'delete') {
      onDelete?.();
      setShowDropdown(false);
    }
  };



  const handleMouseLeave = () => {
    if (!showDropdown) {
      setIsHovered(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showDropdown && 
          dropdownRef.current && 
          threeDotsRef.current &&
          !dropdownRef.current.contains(event.target as Node) &&
          !threeDotsRef.current.contains(event.target as Node) &&
          (!iconPickerRef.current || !iconPickerRef.current.contains(event.target as Node))) {
        setShowDropdown(false);
        setShowIconPicker(false);
      }
      
      if (showIconPicker &&
          iconPickerRef.current &&
          !iconPickerRef.current.contains(event.target as Node) &&
          (!changeIconButtonRef.current || !changeIconButtonRef.current.contains(event.target as Node))) {
        setShowIconPicker(false);
      }
    };

    if (showDropdown || showIconPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showDropdown, showIconPicker]);

  // Auto-focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      // Use setTimeout to ensure DOM is updated
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
          // Force cursor to be visible
          inputRef.current.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length);
        }
      }, 0);
    }
  }, [isEditing]);

  return (
    <div 
      className={`group relative w-full cursor-pointer transition-all duration-300 ease-in-out rounded-md ${
        isActive 
          ? 'bg-neutral-800/70' 
          : 'hover:bg-neutral-800/30'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleMenuItemClick}
    >
      <div className="flex items-center w-full px-3 py-2 sm:px-2 sm:py-1.5">
        {/* Drag Handle - appears on left when hovered */}
        <div
          className={`flex items-center justify-center w-3 h-3 cursor-grab active:cursor-grabbing text-neutral-500 hover:text-neutral-300 transition-opacity duration-300 ease-in-out mr-2 sm:mr-1.5 ${
            (isHovered || showDropdown)
              ? 'opacity-100' 
              : 'opacity-0 pointer-events-none'
          }`}
          draggable
          title="Drag to reorder"
          onClick={(e) => e.stopPropagation()}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <DragHandleIcon />
        </div>

        {/* Main Content Container - Icon and Text */}
        <div className="flex items-center grow">
          {/* Icon Container */}
          <div className="flex items-center justify-center w-[14px] h-[14px] mr-2 sm:mr-1.5 sm:w-3 sm:h-3">
            <div className="w-3.5 h-3.5 text-neutral-400 transition-colors duration-300 ease-in-out sm:w-3 sm:h-3 [&>svg]:w-full [&>svg]:h-full">
              {icon}
            </div>
          </div>
          
          {/* Text */}
          <div className="flex flex-col grow items-start justify-start">
            <div className={`font-normal text-[11.531px] leading-[17.5px] w-full text-left transition-colors duration-300 ease-in-out sm:text-[10px] sm:leading-[15px] ${
              isActive ? 'text-neutral-50' : 'text-[#a1a1a1] hover:text-neutral-300'
            }`}>
              {isEditing ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={saveEdit}
                  onKeyDown={handleEditKeyDown}
                  className="bg-transparent border-none outline-none text-neutral-50 w-full caret-neutral-50"
                  style={{ 
                    fontSize: 'inherit', 
                    fontFamily: 'inherit', 
                    fontWeight: 'inherit',
                    caretColor: '#f5f5f5'
                  }}
                />
              ) : (
                title
              )}
            </div>
          </div>
        </div>

        {/* Three dots menu - appears on right when hovered only */}
        <div className={`flex items-center justify-center w-6 sm:w-5 transition-opacity duration-300 ease-in-out ${
          (isHovered || showDropdown)
            ? 'opacity-100'
            : 'opacity-0 pointer-events-none'
        }`}>
          <button
            ref={threeDotsRef}
            onClick={toggleDropdown}
            className="flex items-center justify-center p-1 hover:bg-neutral-700/50 rounded transition-all duration-200 ease-in-out sm:p-0.5"
          >
            <div className="w-3 h-3 text-neutral-400 hover:text-neutral-200 transition-colors duration-200 ease-in-out sm:w-2.5 sm:h-2.5">
              <ThreeDotsIcon />
            </div>
          </button>
          
          {/* Dropdown Menu - Using Portal to prevent stacking context issues */}
          {showDropdown && typeof document !== 'undefined' && createPortal(
            <div 
              ref={dropdownRef} 
              className="fixed bg-neutral-800 border border-neutral-700 rounded-md shadow-lg min-w-[130px] animate-in fade-in-0 zoom-in-95 duration-200 sm:min-w-[120px]"
              style={{
                zIndex: 999999,
                position: 'fixed',
                left: threeDotsRef.current ? threeDotsRef.current.getBoundingClientRect().right - 130 : 0,
                top: threeDotsRef.current ? threeDotsRef.current.getBoundingClientRect().bottom + 4 : 0,
              }}
            >
              <button
                onClick={(e) => handleDropdownAction('rename', e)}
                className="w-full flex items-center px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-700 transition-colors duration-200 ease-in-out sm:px-2 sm:py-1.5 sm:text-[10px]"
              >
                <div className="w-3 h-3 [&>svg]:w-3 [&>svg]:h-3">
                  <EditIcon />
                </div>
                <span className="ml-2 sm:ml-1.5">Rename</span>
              </button>
              <button
                ref={changeIconButtonRef}
                onClick={(e) => handleDropdownAction('changeIcon', e)}
                className="w-full flex items-center px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-700 transition-colors duration-200 ease-in-out sm:px-2 sm:py-1.5 sm:text-[10px]"
              >
                <div className="w-3 h-3 [&>svg]:w-3 [&>svg]:h-3">
                  <ImageIcon />
                </div>
                <span className="ml-2 sm:ml-1.5">Change Icon</span>
              </button>
              <button
                onClick={(e) => handleDropdownAction('duplicate', e)}
                className="w-full flex items-center px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-700 transition-colors duration-200 ease-in-out sm:px-2 sm:py-1.5 sm:text-[10px]"
              >
                <div className="w-3 h-3 [&>svg]:w-3 [&>svg]:h-3">
                  <CopyIcon />
                </div>
                <span className="ml-2 sm:ml-1.5">Duplicate</span>
              </button>
              <button
                onClick={(e) => handleDropdownAction('delete', e)}
                className="w-full flex items-center px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-700 hover:text-red-400 transition-colors duration-200 ease-in-out sm:px-2 sm:py-1.5 sm:text-[10px]"
              >
                <div className="w-3 h-3 [&>svg]:w-3 [&>svg]:h-3">
                  <DeleteIcon />
                </div>
                <span className="ml-2 sm:ml-1.5">Delete</span>
              </button>
            </div>,
            document.body
          )}
          
          {/* Icon Picker Dropdown - Using Portal */}
          {showIconPicker && typeof document !== 'undefined' && createPortal(
            <div 
              ref={iconPickerRef}
              className="fixed bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg p-3 grid grid-cols-6 gap-2 min-w-[300px] max-h-[400px] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-200"
              style={{
                zIndex: 999999,
                position: 'fixed',
                left: changeIconButtonRef.current ? changeIconButtonRef.current.getBoundingClientRect().left : 0,
                top: changeIconButtonRef.current ? changeIconButtonRef.current.getBoundingClientRect().bottom + 4 : 0,
              }}
            >
              {availableIcons.map((iconData, index) => (
                <button
                  key={index}
                  onClick={() => handleIconSelect(iconData)}
                  className="w-12 h-12 flex items-center justify-center text-neutral-400 hover:text-[#359aba] hover:bg-neutral-700/50 rounded-md transition-colors duration-200 group"
                  title={iconData.name}
                >
                  <div className="w-4 h-4 [&>svg]:w-4 [&>svg]:h-4 flex items-center justify-center">
                    {iconData.icon}
                  </div>
                </button>
              ))}
            </div>,
            document.body
          )}
        </div>
      </div>
    </div>
  );
} 