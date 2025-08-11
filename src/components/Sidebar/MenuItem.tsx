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
  MoreIcon,
  ChevronIcon,
  BuildingIcon,
  BriefcaseIcon,
  LinkIcon,
  UploadIcon,
  DownloadIcon,
  GridIcon,
  TableIcon,
  TagIcon,
  LockIcon,
  ShieldIcon,
  TrophyIcon,
  BagIcon
} from '../icons';

// Categorized icons for the icon picker
const iconCategories: { label: string; icons: { name: string; icon: React.ReactNode }[] }[] = [
  {
    label: 'General',
    icons: [
      { name: 'Home', icon: <HomeIcon /> },
      { name: 'Folder', icon: <FolderIcon /> },
      { name: 'File', icon: <FileIcon /> },
      { name: 'Page', icon: <PageIcon /> },
      { name: 'Image', icon: <ImageIcon /> },
      { name: 'Grid', icon: <GridIcon /> },
      { name: 'Table', icon: <TableIcon /> },
      { name: 'Link', icon: <LinkIcon /> },
      { name: 'Upload', icon: <UploadIcon /> },
      { name: 'Download', icon: <DownloadIcon /> },
      { name: 'Tag', icon: <TagIcon /> },
      { name: 'Lock', icon: <LockIcon /> },
      { name: 'Shield', icon: <ShieldIcon /> },
      { name: 'Trophy', icon: <TrophyIcon /> },
    ],
  },
  {
    label: 'Media',
    icons: [
      { name: 'Camera', icon: <CameraIcon /> },
      { name: 'Video', icon: <VideoIcon /> },
      { name: 'Music', icon: <MusicIcon /> },
      { name: 'Star', icon: <StarIcon /> },
      { name: 'Heart', icon: <HeartIcon /> },
      { name: 'Favorite', icon: <FavoriteIcon /> },
    ],
  },
  {
    label: 'People & Company',
    icons: [
      { name: 'Person', icon: <PersonIcon /> },
      { name: 'Email', icon: <EmailIcon /> },
      { name: 'Phone', icon: <PhoneIcon /> },
      { name: 'Location', icon: <LocationIcon /> },
      { name: 'Building', icon: <BuildingIcon /> },
      { name: 'Briefcase', icon: <BriefcaseIcon /> },
      { name: 'Bag', icon: <BagIcon /> },
    ],
  },
  {
    label: 'System',
    icons: [
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
      { name: 'Menu', icon: <MenuIcon /> },
      { name: 'More', icon: <MoreIcon /> },
    ],
  },
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
  const [dropdownPos, setDropdownPos] = useState<{left:number; top:number}>({ left: 0, top: 0 });
  const [iconPickerPos, setIconPickerPos] = useState<{left:number; top:number}>({ left: 0, top: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);
  const threeDotsRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const iconPickerRef = useRef<HTMLDivElement>(null);
  const changeIconButtonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownReady, setDropdownReady] = useState(false);
  const [iconPickerReady, setIconPickerReady] = useState(false);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDropdownReady(false);
    setShowDropdown(!showDropdown);
  };

  const handleIconSelect = (iconData: { name: string; icon: React.ReactNode }) => {
    onChangeIcon?.(iconData.icon);
    setShowIconPicker(false);
    setShowDropdown(false);
    setIconPickerReady(false);
    setDropdownReady(false);
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

  // Compute dropdown position once visible and on resize/scroll
  useEffect(() => {
    const margin = 8;
    const computeDropdown = () => {
      if (!showDropdown || !threeDotsRef.current || !dropdownRef.current) return;
      const btnRect = threeDotsRef.current.getBoundingClientRect();
      const ddRect = dropdownRef.current.getBoundingClientRect();
      const dropdownWidth = ddRect.width || 160;
      const dropdownHeight = ddRect.height || 160;
      let left = btnRect.right - dropdownWidth; // right align under button
      let top = btnRect.bottom + 6;
      // If bottom overflows, place above
      if (top + dropdownHeight > window.innerHeight - margin) {
        top = Math.max(margin, btnRect.top - dropdownHeight - 6);
      }
      // Clamp horizontally
      left = Math.min(Math.max(margin, left), window.innerWidth - dropdownWidth - margin);
      setDropdownPos({ left, top });
    };

    // defer to ensure portal content measured
    if (showDropdown) {
      const rAF = requestAnimationFrame(computeDropdown);
      const onWin = () => computeDropdown();
      window.addEventListener('resize', onWin);
      window.addEventListener('scroll', onWin, true);
      // Mark ready after first frame compute
      const rAF2 = requestAnimationFrame(() => setDropdownReady(true));
      return () => {
        cancelAnimationFrame(rAF);
        cancelAnimationFrame(rAF2);
        window.removeEventListener('resize', onWin);
        window.removeEventListener('scroll', onWin, true);
      };
    } else {
      setDropdownReady(false);
      // no-op
    }
  }, [showDropdown]);

  // Compute icon picker position next to the dropdown (auto flips if overflowing)
  useEffect(() => {
    const margin = 8;
    const computePicker = () => {
      if (!showIconPicker || !dropdownRef.current) return;
      const ddRect = dropdownRef.current.getBoundingClientRect();
      const btnRect = changeIconButtonRef.current?.getBoundingClientRect() || ddRect;
      const pickerEl = iconPickerRef.current;
      const pickerWidth = pickerEl?.offsetWidth || 360;
      const pickerHeight = pickerEl?.offsetHeight || 420;
      let left = ddRect.right + 8; // default show to right
      if (left + pickerWidth > window.innerWidth - margin) {
        left = Math.max(margin, ddRect.left - pickerWidth - 8);
      }
      let top = btnRect.top;
      if (top + pickerHeight > window.innerHeight - margin) {
        top = Math.max(margin, window.innerHeight - pickerHeight - margin);
      }
      setIconPickerPos({ left, top });
    };

    if (showIconPicker) {
      const rAF = requestAnimationFrame(computePicker);
      const onWin = () => computePicker();
      window.addEventListener('resize', onWin);
      window.addEventListener('scroll', onWin, true);
      const rAF2 = requestAnimationFrame(() => setIconPickerReady(true));
      return () => {
        cancelAnimationFrame(rAF);
        cancelAnimationFrame(rAF2);
        window.removeEventListener('resize', onWin);
        window.removeEventListener('scroll', onWin, true);
      };
    } else {
      setIconPickerReady(false);
      // no-op
    }
  }, [showIconPicker]);

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
      className={`group relative w-full cursor-pointer transition-colors duration-200 ease-in-out rounded-md ${
        isActive 
          ? 'bg-neutral-800/70' 
          : 'hover:bg-neutral-800/30'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleMenuItemClick}
    >
      <div className="flex items-center w-full px-3 py-2 sm:px-2 sm:py-1.5 pr-3">
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
          <div className="flex items-center justify-center w-[16px] h-[16px] mr-2 sm:mr-1.5 sm:w-4 sm:h-4">
            <div className="w-4 h-4 text-neutral-400 transition-colors duration-300 ease-in-out sm:w-4 sm:h-4 [&>svg]:w-full [&>svg]:h-full">
              {icon}
            </div>
          </div>
          
          {/* Text */}
          <div className="flex flex-col grow items-start justify-start">
            <div className={`font-normal text-[12px] leading-[18px] w-full text-left transition-colors duration-300 ease-in-out sm:text-[11.5px] sm:leading-[17px] ${
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
              className="fixed bg-neutral-800 border border-neutral-700 rounded-md shadow-lg min-w-[150px]"
              style={{
                zIndex: 999999,
                position: 'fixed',
                left: dropdownPos.left,
                top: dropdownPos.top,
                visibility: dropdownReady ? 'visible' : 'hidden',
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
                {/* Right arrow indicator */}
                <div className="ml-auto w-3 h-3 opacity-60 [&>svg]:w-3 [&>svg]:h-3 transform -rotate-90">
                  <ChevronIcon />
                </div>
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
              className="fixed bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg p-3 space-y-3 min-w-[360px] max-h-[420px] overflow-y-auto"
              style={{
                zIndex: 999999,
                position: 'fixed',
                left: iconPickerPos.left,
                top: iconPickerPos.top,
                visibility: iconPickerReady ? 'visible' : 'hidden',
              }}
            >
              {/* Search */}
              <div className="px-2">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search icons..."
                    className="w-full bg-neutral-900 text-neutral-200 placeholder-neutral-500 rounded-md pl-8 pr-3 py-2 text-xs border border-neutral-700 focus:outline-none focus:ring-0"
                    aria-label="Search icons"
                  />
                  <div className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500">
                    <SearchIcon />
                  </div>
                </div>
              </div>

              {iconCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="flex flex-col">
                  <div className="text-xs text-neutral-300 mb-1 px-2">{category.label}</div>
                  <div className="grid grid-cols-6 gap-2">
                    {category.icons
                      .filter((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((iconData, iconIndex) => (
                      <button
                        key={iconIndex}
                        onClick={() => handleIconSelect(iconData)}
                        className="w-12 h-12 flex items-center justify-center text-neutral-400 hover:text-[#359aba] hover:bg-neutral-700/50 rounded-md transition-colors duration-200 group"
                        title={iconData.name}
                      >
                        <div className="w-4 h-4 [&>svg]:w-4 [&>svg]:h-4 flex items-center justify-center">
                          {iconData.icon}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>,
            document.body
          )}
        </div>
      </div>
    </div>
  );
} 