import React, { useState, useEffect, useRef } from 'react';
import { 
  FolderIcon, 
  FileIcon, 
  PageIcon, 
  ImageIcon, 
  LayersIcon, 
  DesignIcon, 
  SystemIcon, 
  FlowIcon, 
  AIIcon,
  ChevronIcon,
  PlusIcon,
  DragHandleIcon,
  ThreeDotsIcon,
  EditIcon,
  CopyIcon,
  DeleteIcon,
  ImageIcon as ChangeImageIcon,
  HomeIcon,
  StarIcon,
  HeartIcon,
  PersonIcon,
  EmailIcon,
  PhoneIcon,
  LocationIcon,
  CameraIcon,
  MusicIcon,
  VideoIcon,
  FavoriteIcon,
  GridIcon,
  TableIcon,
  LinkIcon,
  UploadIcon,
  DownloadIcon,
  TagIcon,
  LockIcon,
  ShieldIcon,
  TrophyIcon,
  BagIcon,
  SearchIcon
} from '../icons';
import MenuItem from './MenuItem';

export type MenuItemType = string;
export type TabType = 'company' | 'designer' | 'developer' | 'content' | 'help' | string;

export interface MenuItemData {
  id: string;
  title: string;
  icon: React.ReactNode;
}

export interface SectionData {
  id: string;
  title: string;
  items: MenuItemData[];
  isCollapsed?: boolean;
  icon?: React.ReactNode;
}

interface SidebarProps {
  activeTab?: TabType;
  onMenuChange?: (menuId: MenuItemType, menuData?: MenuItemData) => void;
  widthPx?: number; // optional width controlled by parent
}

// Categorized icons for section icon picker
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
      { name: 'Bag', icon: <BagIcon /> },
    ],
  },
];

// Different menu sections for different tabs
const getTabSections = (tabId: TabType): SectionData[] => {
  switch (tabId) {
    case 'designer':
      return [
        {
          id: 'design-principles',
          title: 'DESIGN PRINCIPLES',
          items: [
            { id: 'design-process', title: 'Design Process', icon: <FlowIcon /> },
            { id: 'style-guide', title: 'Style Guide', icon: <DesignIcon /> },
          ],
          isCollapsed: false
        },
  {
    id: 'figma-governance',
    title: 'FIGMA GOVERNANCE',
    items: [
            { id: 'folder-name', title: 'Folder Name', icon: <FolderIcon /> },
      { id: 'file-structure', title: 'File Name & Structure', icon: <FileIcon /> },
      { id: 'page-structure', title: 'Page Name & Structure', icon: <PageIcon /> },
      { id: 'cover-thumbnail', title: 'Cover / Thumbnail', icon: <ImageIcon /> },
      { id: 'layer-convention', title: 'Layer Name Convention', icon: <LayersIcon /> },
          ],
          isCollapsed: false
  },
  {
    id: 'design-resource',
    title: 'DESIGN RESOURCE',
    items: [
      { id: 'design-bank', title: 'Design Bank', icon: <DesignIcon /> },
      { id: 'design-system', title: 'Design System', icon: <SystemIcon /> },
      { id: 'flow', title: 'Flow', icon: <FlowIcon /> },
      { id: 'ai', title: 'AI', icon: <AIIcon /> },
          ],
          isCollapsed: false
  }
];

    case 'company':
      return [
        {
          id: 'company-overview',
          title: 'COMPANY OVERVIEW',
          items: [
            { id: 'mission-vision', title: 'Mission & Vision', icon: <DesignIcon /> },
            { id: 'company-values', title: 'Company Values', icon: <FlowIcon /> },
            { id: 'organization-chart', title: 'Organization Chart', icon: <SystemIcon /> },
          ],
          isCollapsed: false
        },
        {
          id: 'policies',
          title: 'POLICIES',
          items: [
            { id: 'hr-policies', title: 'HR Policies', icon: <FileIcon /> },
            { id: 'code-of-conduct', title: 'Code of Conduct', icon: <PageIcon /> },
            { id: 'security-policies', title: 'Security Policies', icon: <LayersIcon /> },
          ],
          isCollapsed: false
        }
      ];
    
    case 'developer':
      return [
        {
          id: 'development-standards',
          title: 'DEVELOPMENT STANDARDS',
          items: [
            { id: 'coding-standards', title: 'Coding Standards', icon: <FileIcon /> },
            { id: 'git-workflow', title: 'Git Workflow', icon: <FlowIcon /> },
            { id: 'code-review', title: 'Code Review', icon: <PageIcon /> },
          ],
          isCollapsed: false
        },
        {
          id: 'technical-docs',
          title: 'TECHNICAL DOCUMENTATION',
          items: [
            { id: 'api-docs', title: 'API Documentation', icon: <SystemIcon /> },
            { id: 'architecture', title: 'Architecture', icon: <DesignIcon /> },
            { id: 'deployment', title: 'Deployment Guide', icon: <LayersIcon /> },
          ],
          isCollapsed: false
        }
      ];
    
    case 'content':
      return [
        {
          id: 'content-strategy',
          title: 'CONTENT STRATEGY',
          items: [
            { id: 'brand-voice', title: 'Brand Voice', icon: <DesignIcon /> },
            { id: 'content-guidelines', title: 'Content Guidelines', icon: <FileIcon /> },
            { id: 'editorial-calendar', title: 'Editorial Calendar', icon: <PageIcon /> },
          ],
          isCollapsed: false
        },
        {
          id: 'content-types',
          title: 'CONTENT TYPES',
          items: [
            { id: 'blog-posts', title: 'Blog Posts', icon: <FlowIcon /> },
            { id: 'social-media', title: 'Social Media', icon: <ImageIcon /> },
            { id: 'marketing-copy', title: 'Marketing Copy', icon: <SystemIcon /> },
          ],
          isCollapsed: false
        }
      ];
    
    default:
      return [
        {
          id: 'general',
          title: 'GENERAL',
          items: [
            { id: 'overview', title: 'Overview', icon: <DesignIcon /> },
            { id: 'getting-started', title: 'Getting Started', icon: <FlowIcon /> },
          ],
          isCollapsed: false
        }
      ];
  }
};

export default function Sidebar({ activeTab = 'designer', onMenuChange, widthPx }: SidebarProps) {
  const [sectionsData, setSectionsData] = useState<Record<TabType, SectionData[]>>({});
  const [activeMenu, setActiveMenu] = useState<MenuItemType>('style-guide');
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const initialMenuSetRef = useRef(false);

  // Section header controls
  const [openSectionDropdownId, setOpenSectionDropdownId] = useState<string | null>(null);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editSectionTitle, setEditSectionTitle] = useState('');
  const sectionDropdownRef = useRef<HTMLDivElement>(null);
  const sectionThreeDotsRef = useRef<HTMLButtonElement>(null);
  const sectionChangeIconBtnRef = useRef<HTMLButtonElement>(null);
  const [showSectionIconPicker, setShowSectionIconPicker] = useState(false);
  const sectionIconPickerRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize or get sections for the current tab
  const getCurrentSections = (): SectionData[] => {
    if (!sectionsData[activeTab]) {
      const initialSections = getTabSections(activeTab);
      setSectionsData(prev => ({
        ...prev,
        [activeTab]: initialSections
      }));
      return initialSections;
    }
    return sectionsData[activeTab];
  };

  const sections = getCurrentSections();

  const handleMenuClick = (menuData: MenuItemData) => {
    setActiveMenu(menuData.id);
    onMenuChange?.(menuData.id, menuData);
  };

  // Persist menu title changes
  const handleRename = (sectionId: string, itemId: string, newTitle: string) => {
    // Build updated sections for the current tab
    const updatedSections: SectionData[] = sections.map((section) =>
      section.id === sectionId
        ? {
            ...section,
            items: section.items.map((item) =>
              item.id === itemId ? { ...item, title: newTitle } : item
            ),
          }
        : section
    );

    // Update state for current tab
    setSectionsData((prev) => ({
      ...prev,
      [activeTab]: updatedSections,
    }));

    // If this item is currently active, reflect the change in main content/header
    if (activeMenu === itemId) {
      const updatedItem = updatedSections
        .find((s) => s.id === sectionId)?.items
        .find((i) => i.id === itemId);
      if (updatedItem) {
        onMenuChange?.(updatedItem.id, updatedItem);
      }
    }
  };

  // Set initial active menu when tab changes or component mounts
  useEffect(() => {
    const currentSections = sectionsData[activeTab] || getTabSections(activeTab);
    if (currentSections.length > 0 && currentSections[0].items.length > 0 && !initialMenuSetRef.current) {
      const firstMenuItem = currentSections[0].items[0];
      console.log('Setting initial menu to:', firstMenuItem.id);
      setActiveMenu(firstMenuItem.id);
      onMenuChange?.(firstMenuItem.id, firstMenuItem);
      initialMenuSetRef.current = true;
    }
  }, [activeTab, onMenuChange, sectionsData]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openSectionDropdownId && sectionDropdownRef.current && !sectionDropdownRef.current.contains(event.target as Node) && sectionThreeDotsRef.current && !sectionThreeDotsRef.current.contains(event.target as Node)) {
        setOpenSectionDropdownId(null);
      }
      if (showSectionIconPicker && sectionIconPickerRef.current && !sectionIconPickerRef.current.contains(event.target as Node) && sectionChangeIconBtnRef.current && !sectionChangeIconBtnRef.current.contains(event.target as Node)) {
        setShowSectionIconPicker(false);
      }
    };
    if (openSectionDropdownId || showSectionIconPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openSectionDropdownId, showSectionIconPicker]);

  const toggleSection = (sectionId: string) => {
    setSectionsData(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map(section => 
        section.id === sectionId 
          ? { ...section, isCollapsed: !section.isCollapsed }
          : section
      )
    }));
  };

  const handleSectionDropdownAction = (action: string, section: SectionData) => {
    if (action === 'rename') {
      setEditingSectionId(section.id);
      setEditSectionTitle(section.title);
      setOpenSectionDropdownId(null);
      return;
    }
    if (action === 'changeIcon') {
      setShowSectionIconPicker(true);
      return;
    }
    if (action === 'duplicate') {
      const sectionIndex = sections.findIndex(s => s.id === section.id);
      const newSection: SectionData = {
        ...section,
        id: `${section.id}-copy-${Date.now()}`,
        title: `${section.title} Copy`,
      };
      setSectionsData(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].flatMap((s, idx) => idx === sectionIndex ? [s, newSection] : [s])
      }));
      setOpenSectionDropdownId(null);
      return;
    }
    if (action === 'delete') {
      setSectionsData(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].filter(s => s.id !== section.id)
      }));
      setOpenSectionDropdownId(null);
      return;
    }
  };

  const saveSectionTitle = () => {
    if (!editingSectionId) return;
    const title = editSectionTitle.trim();
    if (!title) { setEditingSectionId(null); return; }
    setSectionsData(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map(section => section.id === editingSectionId ? { ...section, title } : section)
    }));
    setEditingSectionId(null);
  };

  const cancelSectionTitle = () => {
    setEditingSectionId(null);
  };

  const handleSectionIconSelect = (iconData: { name: string; icon: React.ReactNode }) => {
    if (!openSectionDropdownId) return;
    setSectionsData(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map(section => section.id === openSectionDropdownId ? { ...section, icon: iconData.icon } : section)
    }));
    setShowSectionIconPicker(false);
    setOpenSectionDropdownId(null);
  };

  const addNewSection = () => {
    const newSection: SectionData = {
      id: `section-${Date.now()}`,
      title: 'NEW SECTION',
      items: [],
      isCollapsed: false
    };
    setSectionsData(prev => ({
      ...prev,
      [activeTab]: [...prev[activeTab], newSection]
    }));
  };

  return (
    <div className="bg-[#191919] w-[240px] h-full flex flex-col md:w-[240px] sm:w-[200px]" style={widthPx ? { width: `${widthPx}px` } : undefined}>
      {/* Sidebar Content - Scrollable only when needed */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 pb-2 sm:p-3">
        {sections.map((section) => (
          <div key={section.id} className="mb-4 sm:mb-3">
            {/* Section Header */}
            <div 
              className="flex items-center w-full mb-3 sm:mb-2 group"
              onMouseEnter={() => setHoveredSection(section.id)}
              onMouseLeave={() => setHoveredSection(null)}
            >
              {/* Container with same padding as menu items */}
              <div className="flex items-center w-full pb-[5.25px] pl-[2px] pr-1 pt-[4.25px] sm:pb-[4px] sm:pt-[3px] cursor-pointer select-none" onClick={() => toggleSection(section.id)}>
                {/* Drag Handle - appears on left when hovered */}
                <div
                  className={`flex items-center justify-center w-3 h-3 cursor-grab active:cursor-grabbing text-neutral-500 hover:text-neutral-300 transition-opacity duration-300 ease-in-out mr-1 ${
                    hoveredSection === section.id
                      ? 'opacity-100' 
                      : 'opacity-0 pointer-events-none'
                  }`}
                  draggable
                  title="Drag to reorder section"
                  onClick={(e) => { e.stopPropagation(); }}
                >
                  <DragHandleIcon />
                </div>

                {/* Section Title and Controls */}
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {/* Optional Section Icon */}
                    {section.icon && (
                      <div className="w-3 h-3 text-neutral-400 flex-shrink-0">{section.icon}</div>
                    )}
                    {editingSectionId === section.id ? (
                      <input
                        value={editSectionTitle}
                        onChange={(e) => setEditSectionTitle(e.target.value)}
                        onBlur={saveSectionTitle}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') { e.preventDefault(); saveSectionTitle(); }
                          if (e.key === 'Escape') { e.preventDefault(); cancelSectionTitle(); }
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-transparent border-none outline-none text-neutral-400 uppercase tracking-wider text-[12px] sm:text-[11px] px-1 rounded w-full truncate"
                        autoFocus
                      />
                    ) : (
                      <h3 className="text-[12px] font-medium text-neutral-400 uppercase tracking-wider text-left sm:text-[11px] truncate">
                        {section.title}
                      </h3>
                    )}
                  </div>

                  {/* Right controls: three dots and chevron */}
                  <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      ref={sectionThreeDotsRef}
                      onClick={(e) => { e.stopPropagation(); setOpenSectionDropdownId(section.id); setShowSectionIconPicker(false); }}
                      className={`flex items-center justify-center p-1 rounded transition-colors duration-200 w-5 h-5 ${
                        (hoveredSection === section.id || openSectionDropdownId === section.id)
                          ? 'hover:bg-neutral-700/50 visible'
                          : 'invisible'
                      }`}
                      title="More actions"
                    >
                      <div className="w-3 h-3 text-neutral-400 hover:text-neutral-200">
                        <ThreeDotsIcon />
                      </div>
                    </button>

                    <button
                      onClick={(e) => { e.stopPropagation(); toggleSection(section.id); }}
                      className="flex items-center justify-center p-[3px] rounded w-5 h-5"
                      title={section.isCollapsed ? 'Expand' : 'Collapse'}
                    >
                      <div className={`w-[10.5px] h-[10.5px] transition-transform duration-300 ease-in-out ${
                        section.isCollapsed ? '-rotate-90' : 'rotate-0'
                      }`}>
                        <ChevronIcon />
                      </div>
                    </button>
                  </div>
                </div>

                {/* Section dropdown - portal */}
                {openSectionDropdownId === section.id && typeof document !== 'undefined' && (
                  <div 
                    ref={sectionDropdownRef}
                    className="fixed bg-neutral-800 border border-neutral-700 rounded-md shadow-lg min-w-[150px] z-[999999]"
                    style={{
                      position: 'fixed',
                      left: sectionThreeDotsRef.current ? sectionThreeDotsRef.current.getBoundingClientRect().right - 150 : 0,
                      top: sectionThreeDotsRef.current ? sectionThreeDotsRef.current.getBoundingClientRect().bottom + 4 : 0,
                    }}
                  >
                    <button
                      onClick={() => handleSectionDropdownAction('rename', section)}
                      className="w-full flex items-center px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-700"
                    >
                      <div className="w-3 h-3 mr-2"><EditIcon /></div>
                      Rename
                    </button>
                    <button
                      ref={sectionChangeIconBtnRef}
                      onClick={() => handleSectionDropdownAction('changeIcon', section)}
                      className="w-full flex items-center px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-700"
                    >
                      <div className="w-3 h-3 mr-2"><ChangeImageIcon /></div>
                      <span className="mr-auto">Change Icon</span>
                      <div className="w-3 h-3 -rotate-90 opacity-60"><ChevronIcon /></div>
                    </button>
                    <button
                      onClick={() => handleSectionDropdownAction('duplicate', section)}
                      className="w-full flex items-center px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-700"
                    >
                      <div className="w-3 h-3 mr-2"><CopyIcon /></div>
                      Duplicate
                    </button>
                    <button
                      onClick={() => handleSectionDropdownAction('delete', section)}
                      className="w-full flex items-center px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-700 hover:text-red-400"
                    >
                      <div className="w-3 h-3 mr-2"><DeleteIcon /></div>
                      Delete
                    </button>
                  </div>
                )}

                {/* Section icon picker - portal */}
                {showSectionIconPicker && openSectionDropdownId === section.id && typeof document !== 'undefined' && (
                  <div
                    ref={sectionIconPickerRef}
                    className="fixed bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg p-3 space-y-3 min-w-[360px] max-h-[420px] overflow-y-auto z-[999999]"
                    style={{
                      position: 'fixed',
                      left: sectionDropdownRef.current ? sectionDropdownRef.current.getBoundingClientRect().right + 8 : 0,
                      top: sectionChangeIconBtnRef.current ? sectionChangeIconBtnRef.current.getBoundingClientRect().top : 0,
                    }}
                  >
                    <div className="px-2">
                      <div className="relative">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search icons..."
                          className="w-full bg-neutral-900 text-neutral-200 placeholder-neutral-500 rounded-md pl-8 pr-3 py-2 text-xs border border-neutral-700 focus:outline-none focus:ring-0"
                        />
                        <div className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500">
                          <SearchIcon />
                        </div>
                      </div>
                    </div>
                    {iconCategories.map((category, idx) => (
                      <div key={idx} className="flex flex-col">
                        <div className="text-xs text-neutral-300 mb-1 px-2">{category.label}</div>
                        <div className="grid grid-cols-6 gap-2">
                          {category.icons
                            .filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map((iconData, iIndex) => (
                              <button
                                key={iIndex}
                                onClick={() => handleSectionIconSelect(iconData)}
                                className="w-12 h-12 flex items-center justify-center text-neutral-400 hover:text-[#359aba] hover:bg-neutral-700/50 rounded-md transition-colors duration-200"
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
                  </div>
                )}
              </div>
            </div>

            {/* Section Items with smooth animation */}
            <div className={`overflow-hidden transition-opacity duration-300 ease-in-out px-2 ${
              section.isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[1000px] opacity-100'
            }`}>
              <div className="space-y-1 sm:space-y-0.5 pr-1">
                {section.items.map((item) => (
                  <MenuItem 
                    key={item.id}
                    icon={item.icon} 
                    title={item.title} 
                    isActive={activeMenu === item.id}
                    onClick={() => handleMenuClick(item)}
                    onRename={(newTitle) => handleRename(section.id, item.id, newTitle)}
                    onChangeIcon={() => {/* MenuItem handles its own icon change */}}
                    onDuplicate={() => {/* handled inside MenuItem dropdown */}}
                    onDelete={() => {/* handled inside MenuItem dropdown */}}
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', item.id);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      const draggedId = e.dataTransfer.getData('text/plain');
                      // TODO: Implement drag and drop reordering
                      if (draggedId) {
                        // Handle reordering logic here
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Add Section Button - Positioned right after last section */}
        <div className="mt-2 pt-2 sm:mt-1 sm:pt-1">
          <div className="border-t border-neutral-800 mx-2"></div>
          <div className="mt-4 sm:mt-3">
            <button
              onClick={addNewSection}
              className="flex items-center w-full px-3 py-2 text-sm text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50 rounded-md transition-all duration-200 sm:px-2 sm:py-1.5 sm:text-xs"
            >
              <PlusIcon />
              <span className="ml-2 sm:ml-1.5">Add section</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 