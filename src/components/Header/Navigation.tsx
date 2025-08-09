'use client';

import { useState, useEffect } from 'react';
import { CompanyIcon, DesignerIcon, DeveloperIcon, ContentIcon, HelpIcon, PlusIcon } from '../icons';
import NavigationTab from './NavigationTab';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import AddTabModal from './AddTabModal';

export type TabType = 'company' | 'designer' | 'developer' | 'content' | 'help' | string;

export interface TabData {
  id: TabType;
  icon: React.ReactNode;
  label: string;
  deletable?: boolean;
}

const initialTabs: TabData[] = [
  { id: 'company', icon: <CompanyIcon />, label: 'Company', deletable: true },
  { id: 'designer', icon: <DesignerIcon />, label: 'Designer', deletable: true },
  { id: 'developer', icon: <DeveloperIcon />, label: 'Developer', deletable: true },
  { id: 'content', icon: <ContentIcon />, label: 'Content', deletable: true },
  { id: 'help', icon: <HelpIcon />, label: 'Help', deletable: true },
];

export default function Navigation({ onTabChange }: { onTabChange?: (tabId: TabType) => void }) {
  const [tabs, setTabs] = useState<TabData[]>(initialTabs);
  const [activeTab, setActiveTab] = useState<TabType>('designer');
  const [hoveredTab, setHoveredTab] = useState<TabType | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tabToDelete, setTabToDelete] = useState<{ id: TabType; label: string } | null>(null);
  const [showAddTabModal, setShowAddTabModal] = useState(false);

  const handleTabClick = (tabId: TabType) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
    console.log('Switched to tab:', tabId);
  };

  const handleDeleteRequest = (tabId: TabType) => {
    // Prevent deletion if only one deletable tab remains
    const deletableTabs = tabs.filter(tab => tab.deletable);
    if (deletableTabs.length <= 1) {
      console.log('Cannot delete: At least one tab must remain');
      return;
    }

    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      setTabToDelete({ id: tabId, label: tab.label });
      setShowDeleteModal(true);
    }
  };

  const handleConfirmDelete = () => {
    if (!tabToDelete) return;

    // Remove the tab
    const newTabs = tabs.filter(tab => tab.id !== tabToDelete.id);
    setTabs(newTabs);
    
    // If the deleted tab was active, switch to the first available tab
    if (activeTab === tabToDelete.id) {
      const firstAvailableTab = newTabs.find(tab => tab.deletable) || newTabs[0];
      setActiveTab(firstAvailableTab.id);
      onTabChange?.(firstAvailableTab.id);
    }
    
    console.log('Deleted tab:', tabToDelete.id);
    setTabToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setTabToDelete(null);
  };

  const handleAddNewMenu = () => {
    setShowAddTabModal(true);
  };

  const handleCreateTab = (icon: React.ReactNode, name: string) => {
    const newTabId = `tab-${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    const newTab: TabData = {
      id: newTabId,
      icon,
      label: name,
      deletable: true
    };

    setTabs(prevTabs => [...prevTabs, newTab]);
    setActiveTab(newTabId);
    onTabChange?.(newTabId);
    console.log('Created new tab:', newTab);
  };

  const canDeleteTab = (tabId: TabType) => {
    const tab = tabs.find(t => t.id === tabId);
    if (!tab?.deletable) return false;
    
    const deletableTabs = tabs.filter(tab => tab.deletable);
    return deletableTabs.length > 1;
  };

  const handleTabHover = (tabId: TabType | null) => {
    setHoveredTab(tabId);
  };

  // Notify parent of initial active tab
  useEffect(() => {
    onTabChange?.(activeTab);
  }, [onTabChange, activeTab]);

  const handleTabLabelChange = (tabId: TabType, newLabel: string) => {
    setTabs(prevTabs =>
      prevTabs.map(tab =>
        tab.id === tabId ? { ...tab, label: newLabel } : tab
      )
    );
    console.log('Updated tab label:', tabId, 'to:', newLabel);
  };

  const getTabShiftDirection = (currentTabId: TabType, index: number): 'right' | 'none' => {
    if (!hoveredTab || hoveredTab === currentTabId) return 'none';
    
    const hoveredIndex = tabs.findIndex(tab => tab.id === hoveredTab);
    const currentIndex = index;
    
    // All tabs to the right of hovered tab should shift right
    if (hoveredIndex < currentIndex) {
      return 'right';
    }
    
    return 'none';
  };

  // Determine if Add New Menu button should shift
  const getAddMenuShiftDirection = (): 'right' | 'none' => {
    if (!hoveredTab) return 'none';
    
    const hoveredIndex = tabs.findIndex(tab => tab.id === hoveredTab);
    
    // If any tab is hovered, Add New Menu should shift right
    if (hoveredIndex >= 0) {
      return 'right';
    }
    
    return 'none';
  };

  return (
    <div className="flex flex-row h-[38.5px] items-center px-7 relative w-full">
      <div className="flex flex-row items-start w-full">
        {tabs.map((tab, index) => (
          <NavigationTab
            key={tab.id}
            icon={tab.icon}
            label={tab.label}
            isActive={activeTab === tab.id}
            onClick={() => handleTabClick(tab.id)}
            onDelete={tab.deletable ? () => handleDeleteRequest(tab.id) : undefined}
            canDelete={canDeleteTab(tab.id)}
            onHover={(isHovered: boolean) => handleTabHover(isHovered ? tab.id : null)}
            shiftDirection={getTabShiftDirection(tab.id, index)}
            isLastTab={index === tabs.length - 0}
            onLabelChange={(newLabel: string) => handleTabLabelChange(tab.id, newLabel)}
          />
        ))}
        
        {/* Add New Menu Button */}
        <div 
          className="flex h-[38.5px] items-start transition-transform duration-300 ease-out mr-0"
          style={{
            transform: getAddMenuShiftDirection() === 'right' ? 'translateX(8px)' : 'translateX(0px)'
          }}
        >
          <button
            onClick={handleAddNewMenu}
            className="flex flex-row h-[38.5px] items-center relative transition-all duration-200 rounded-t-md pl-1 pr-2 cursor-pointer pb-[10.5px] pt-[9.5px]"
          >
            <div className="flex items-center justify-center h-3 w-5 pr-1">
              <div className="transition-all duration-200 opacity-75 hover:opacity-100">
                <PlusIcon />
              </div>
            </div>
            <div className="text-xs transition-colors duration-200 text-[#b0c4cc] hover:text-neutral-300">
              Add New Menu
            </div>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        tabName={tabToDelete?.label || ''}
      />

      {/* Add Tab Modal */}
      <AddTabModal
        isOpen={showAddTabModal}
        onClose={() => setShowAddTabModal(false)}
        onCreateTab={handleCreateTab}
      />
    </div>
  );
} 