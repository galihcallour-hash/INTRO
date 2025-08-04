'use client';

import { useState } from 'react';
import MenuSection from './MenuSection';
import MenuItem from './MenuItem';
import AddMenuModal from './AddMenuModal';
import { 
  FolderIcon, FileIcon, PageIcon, ImageIcon, LayersIcon,
  DesignIcon, SystemIcon, FlowIcon, AIIcon, PlusIcon 
} from '../icons';

export type MenuItemType = 
  | 'folder-structure' 
  | 'file-structure' 
  | 'page-structure' 
  | 'cover-thumbnail' 
  | 'layer-convention'
  | 'design-bank'
  | 'design-system' 
  | 'flow' 
  | 'ai'
  | string; // Allow dynamic menu IDs

export interface MenuItemData {
  id: string;
  title: string;
  icon: React.ReactNode;
}

export interface SectionData {
  id: string;
  title: string;
  items: MenuItemData[];
}

interface SidebarProps {
  onMenuChange?: (menuId: MenuItemType, menuData?: MenuItemData) => void;
}

const initialSections: SectionData[] = [
  {
    id: 'figma-governance',
    title: 'FIGMA GOVERNANCE',
    items: [
      { id: 'folder-structure', title: 'Folder Name & Structure', icon: <FolderIcon /> },
      { id: 'file-structure', title: 'File Name & Structure', icon: <FileIcon /> },
      { id: 'page-structure', title: 'Page Name & Structure', icon: <PageIcon /> },
      { id: 'cover-thumbnail', title: 'Cover / Thumbnail', icon: <ImageIcon /> },
      { id: 'layer-convention', title: 'Layer Name Convention', icon: <LayersIcon /> },
    ]
  },
  {
    id: 'design-resource',
    title: 'DESIGN RESOURCE',
    items: [
      { id: 'design-bank', title: 'Design Bank', icon: <DesignIcon /> },
      { id: 'design-system', title: 'Design System', icon: <SystemIcon /> },
      { id: 'flow', title: 'Flow', icon: <FlowIcon /> },
      { id: 'ai', title: 'AI', icon: <AIIcon /> },
    ]
  }
];

export default function Sidebar({ onMenuChange }: SidebarProps) {
  const [sections, setSections] = useState<SectionData[]>(initialSections);
  const [activeMenu, setActiveMenu] = useState<MenuItemType>('folder-structure');
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [currentSectionForNewMenu, setCurrentSectionForNewMenu] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<{type: 'section' | 'item', sectionId: string, itemId?: string} | null>(null);
  const [draggedOverItem, setDraggedOverItem] = useState<{type: 'section' | 'item', sectionId: string, itemId?: string} | null>(null);

  const handleMenuClick = (menuData: MenuItemData) => {
    setActiveMenu(menuData.id);
    onMenuChange?.(menuData.id, menuData);
    console.log('Selected menu:', menuData);
  };

  const handleAddNewMenu = (sectionId: string) => {
    setCurrentSectionForNewMenu(sectionId);
    setShowAddMenuModal(true);
  };

  const handleCreateMenu = (iconType: string, name: string) => {
    if (!currentSectionForNewMenu) return;
    
    const iconComponents = {
      folder: <FolderIcon />,
      file: <FileIcon />,
      page: <PageIcon />,
      image: <ImageIcon />,
      layers: <LayersIcon />,
      design: <DesignIcon />,
      system: <SystemIcon />,
      flow: <FlowIcon />,
      ai: <AIIcon />
    };

    const newMenuItem: MenuItemData = {
      id: `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      title: name,
      icon: iconComponents[iconType as keyof typeof iconComponents] || <FolderIcon />
    };

    setSections(prevSections =>
      prevSections.map(section =>
        section.id === currentSectionForNewMenu
          ? { ...section, items: [...section.items, newMenuItem] }
          : section
      )
    );
    
    setShowAddMenuModal(false);
    setCurrentSectionForNewMenu(null);
  };

  const handleAddSection = () => {
    const newSection: SectionData = {
      id: `section-${Date.now()}`,
      title: `NEW SECTION ${sections.length + 1}`,
      items: []
    };
    
    setSections(prevSections => [...prevSections, newSection]);
  };

  const handleMenuItemRename = (sectionId: string, itemId: string, newTitle: string) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map(item =>
                item.id === itemId ? { ...item, title: newTitle } : item
              )
            }
          : section
      )
    );
  };

  const handleMenuItemChangeIcon = (sectionId: string, itemId: string, newIcon: React.ReactNode) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map(item =>
                item.id === itemId ? { ...item, icon: newIcon } : item
              )
            }
          : section
      )
    );
  };

  const handleMenuItemDuplicate = (sectionId: string, itemId: string) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              items: [...section.items, ...section.items.filter(item => item.id === itemId).map(item => ({
                ...item,
                id: `${item.id}-copy-${Date.now()}`,
                title: `${item.title} (Copy)`
              }))]
            }
          : section
      )
    );
  };

  const handleMenuItemDelete = (sectionId: string, itemId: string) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.filter(item => item.id !== itemId)
            }
          : section
      )
    );
  };

  // Drag and Drop handlers
  const handleSectionDragStart = (sectionId: string) => (e: React.DragEvent) => {
    setDraggedItem({ type: 'section', sectionId });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleItemDragStart = (sectionId: string, itemId: string) => (e: React.DragEvent) => {
    setDraggedItem({ type: 'item', sectionId, itemId });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleSectionDrop = (targetSectionId: string) => (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedItem) return;

    if (draggedItem.type === 'section' && draggedItem.sectionId !== targetSectionId) {
      // Reorder sections
      setSections(prevSections => {
        const draggedSection = prevSections.find(s => s.id === draggedItem.sectionId);
        const targetIndex = prevSections.findIndex(s => s.id === targetSectionId);
        
        if (!draggedSection) return prevSections;
        
        const filteredSections = prevSections.filter(s => s.id !== draggedItem.sectionId);
        const newSections = [...filteredSections];
        newSections.splice(targetIndex, 0, draggedSection);
        
        return newSections;
      });
    }
    
    setDraggedItem(null);
  };

  const handleItemDrop = (targetSectionId: string, targetItemId: string) => (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.type !== 'item') return;

    // Handle item reordering within same section or moving between sections
    setSections(prevSections => {
      const sourceSectionIndex = prevSections.findIndex(s => s.id === draggedItem.sectionId);
      const targetSectionIndex = prevSections.findIndex(s => s.id === targetSectionId);
      
      if (sourceSectionIndex === -1 || targetSectionIndex === -1) return prevSections;
      
      const sourceSection = prevSections[sourceSectionIndex];
      const targetSection = prevSections[targetSectionIndex];
      
      const draggedItemData = sourceSection.items.find(item => item.id === draggedItem.itemId);
      if (!draggedItemData) return prevSections;
      
      const newSections = [...prevSections];
      
      if (draggedItem.sectionId === targetSectionId) {
        // Reordering within same section
        const targetItemIndex = targetSection.items.findIndex(item => item.id === targetItemId);
        const filteredItems = sourceSection.items.filter(item => item.id !== draggedItem.itemId);
        
        filteredItems.splice(targetItemIndex, 0, draggedItemData);
        newSections[sourceSectionIndex] = { ...sourceSection, items: filteredItems };
      } else {
        // Moving between sections
        const targetItemIndex = targetSection.items.findIndex(item => item.id === targetItemId);
        
        // Remove from source section
        newSections[sourceSectionIndex] = {
          ...sourceSection,
          items: sourceSection.items.filter(item => item.id !== draggedItem.itemId)
        };
        
        // Add to target section
        const newTargetItems = [...targetSection.items];
        newTargetItems.splice(targetItemIndex, 0, draggedItemData);
        newSections[targetSectionIndex] = { ...targetSection, items: newTargetItems };
      }
      
      return newSections;
    });
    
    setDraggedItem(null);
  };

  return (
    <div className="bg-neutral-900 flex flex-col h-[1200px] items-start justify-center sticky top-0 w-60 border-r border-neutral-800">
      <div className="flex flex-col grow items-start justify-start overflow-clip p-[10.5px] relative w-full">
        <div className="flex flex-col gap-[10.5px] grow items-start justify-start w-full">
          
          {/* Dynamic Sections */}
          {sections.map((section, sectionIndex) => (
            <div key={section.id} className={sectionIndex > 0 ? "pb-[3.5px] w-full" : "w-full"}>
              <MenuSection 
                title={section.title} 
                onAddNewMenu={() => handleAddNewMenu(section.id)}
                onDragStart={handleSectionDragStart(section.id)}
                onDragOver={handleDragOver}
                onDrop={handleSectionDrop(section.id)}
                isDragging={draggedItem?.type === 'section' && draggedItem.sectionId === section.id}
              >
                {section.items.map((item) => (
                  <MenuItem 
                    key={item.id}
                    icon={item.icon} 
                    title={item.title} 
                    isActive={activeMenu === item.id}
                    onClick={() => handleMenuClick(item)}
                    onRename={(newTitle) => handleMenuItemRename(section.id, item.id, newTitle)}
                    onChangeIcon={(newIcon) => handleMenuItemChangeIcon(section.id, item.id, newIcon)}
                    onDuplicate={() => handleMenuItemDuplicate(section.id, item.id)}
                    onDelete={() => handleMenuItemDelete(section.id, item.id)}
                    onDragStart={handleItemDragStart(section.id, item.id)}
                    onDragOver={handleDragOver}
                    onDrop={handleItemDrop(section.id, item.id)}
                    isDragging={draggedItem?.type === 'item' && draggedItem.itemId === item.id}
                  />
                ))}
              </MenuSection>
            </div>
          ))}

          {/* Add Section */}
          <div 
            className="flex flex-row h-7 items-center justify-center opacity-60 pb-0 pt-2 w-full cursor-pointer hover:opacity-80 transition-opacity duration-200"
            onClick={handleAddSection}
          >
            <div className="absolute border-t border-neutral-800 inset-0 pointer-events-none" />
            <div className="flex flex-row items-center justify-start">
              <div className="flex flex-col h-[10.5px] items-start justify-start w-3.5 pr-[3.5px]">
                <div className="flex flex-col items-start justify-center overflow-clip size-[10.5px] text-[#a1a1a1]">
                  <PlusIcon />
                </div>
              </div>
              <div className="font-normal text-[#a1a1a1] text-[9.68px] leading-[14px] whitespace-pre">
                Add section
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Menu Modal */}
      <AddMenuModal
        isOpen={showAddMenuModal}
        onClose={() => setShowAddMenuModal(false)}
        onCreateMenu={handleCreateMenu}
      />
    </div>
  );
} 