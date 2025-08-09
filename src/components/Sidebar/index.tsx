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
  DragHandleIcon
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
}

interface SidebarProps {
  activeTab?: TabType;
  onMenuChange?: (menuId: MenuItemType, menuData?: MenuItemData) => void;
}

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

export default function Sidebar({ activeTab = 'designer', onMenuChange }: SidebarProps) {
  const [sectionsData, setSectionsData] = useState<Record<TabType, SectionData[]>>({});
  const [activeMenu, setActiveMenu] = useState<MenuItemType>('style-guide');
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const initialMenuSetRef = useRef(false);

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

  const handleDropdownAction = (action: string, itemId: string, sectionId: string) => {
    switch (action) {
      case 'edit':
        // Handle edit functionality
        break;
      case 'duplicate':
        // Handle duplicate functionality
        const sectionIndex = sections.findIndex(s => s.id === sectionId);
        const itemIndex = sections[sectionIndex].items.findIndex(item => item.id === itemId);
        const originalItem = sections[sectionIndex].items[itemIndex];

        const newItem = {
          ...originalItem,
          id: `${originalItem.id}-copy-${Date.now()}`,
          title: `${originalItem.title} Copy`
        };
        
        setSectionsData(prev => ({
          ...prev,
          [activeTab]: prev[activeTab].map(section => 
        section.id === sectionId
          ? {
              ...section,
                  items: [
                    ...section.items.slice(0, itemIndex + 1),
                    newItem,
                    ...section.items.slice(itemIndex + 1)
                  ]
            }
          : section
      )
        }));
        break;
      case 'changeIcon':
        // Handle change icon functionality
        break;
      case 'delete':
        // Handle delete functionality
        setSectionsData(prev => ({
          ...prev,
          [activeTab]: prev[activeTab].map(section => 
        section.id === sectionId
              ? { ...section, items: section.items.filter(item => item.id !== itemId) }
          : section
      )
        }));
        break;
    }
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
    <div className="bg-[#191919] w-[240px] h-full flex flex-col border-r border-neutral-800 md:w-[240px] sm:w-[200px]">
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
              <div className="flex items-center w-full pb-[5.25px] pl-[2px] pr-[4px] pt-[4.25px] sm:pb-[4px] sm:pt-[3px]">
                {/* Drag Handle - appears on left when hovered */}
                <div
                  className={`flex items-center justify-center w-3 h-3 cursor-grab active:cursor-grabbing text-neutral-500 hover:text-neutral-300 transition-opacity duration-300 ease-in-out mr-1 ${
                    hoveredSection === section.id
                      ? 'opacity-100' 
                      : 'opacity-0 pointer-events-none'
                  }`}
                  draggable
                  title="Drag to reorder section"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DragHandleIcon />
                </div>

                {/* Section Title and Chevron - Now properly left-aligned */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="flex items-center justify-between w-full"
                >
                  <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wider text-left sm:text-[10px]">
                    {section.title}
                  </h3>
                  <div className={`transition-transform duration-300 ease-in-out ${
                    section.isCollapsed ? '-rotate-90' : 'rotate-0'
                  }`}>
                    <ChevronIcon />
                  </div>
                </button>
              </div>
            </div>

            {/* Section Items with smooth animation */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
              section.isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[1000px] opacity-100'
            }`}>
              <div className="space-y-1 sm:space-y-0.5">
                {section.items.map((item) => (
                  <MenuItem 
                    key={item.id}
                    icon={item.icon} 
                    title={item.title} 
                    isActive={activeMenu === item.id}
                    onClick={() => handleMenuClick(item)}
                    onRename={() => handleDropdownAction('edit', item.id, section.id)}
                    onChangeIcon={() => handleDropdownAction('changeIcon', item.id, section.id)}
                    onDuplicate={() => handleDropdownAction('duplicate', item.id, section.id)}
                    onDelete={() => handleDropdownAction('delete', item.id, section.id)}
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