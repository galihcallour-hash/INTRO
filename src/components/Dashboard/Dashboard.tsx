import React, { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import MainContent from '@/components/MainContent';
import { MenuItemType, MenuItemData, TabType } from '@/components/Sidebar';

export default function Dashboard() {
  const [selectedMenu, setSelectedMenu] = useState<MenuItemData | undefined>();
  const [activeTab, setActiveTab] = useState<TabType>('designer');

  const handleMenuChange = (menuId: MenuItemType, menuData?: MenuItemData) => {
    setSelectedMenu(menuData);
  };

  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
    // Don't reset selectedMenu - let the Sidebar's useEffect handle setting the initial menu
    // This prevents glitches and ensures proper menu activation
  };

  return (
    <div className="bg-neutral-950 h-screen flex flex-col overflow-hidden">
      {/* Header - Fixed at top */}
      <Header onTabChange={handleTabChange} />

      {/* Main Content Container - Takes remaining height */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar - Fixed width, full height */}
        <div className="flex-shrink-0">
          <Sidebar activeTab={activeTab} onMenuChange={handleMenuChange} />
        </div>

        {/* Main Content - Takes remaining space */}
        <div className="flex-1 min-w-0">
          <MainContent selectedMenu={selectedMenu} />
        </div>
      </div>
    </div>
  );
} 