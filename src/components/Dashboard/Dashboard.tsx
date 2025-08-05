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
    <div className="bg-white relative size-full min-h-screen">
      {/* Background */}
      <div className="absolute bg-neutral-950 left-0 right-0 top-0 min-h-screen">
        <div className="h-screen relative w-full">
          {/* Header */}
          <Header onTabChange={handleTabChange} />

          {/* Main Content Container */}
          <div className="flex flex-row items-start left-0 right-0 top-[95.5px] absolute">
            {/* Sidebar */}
            <Sidebar activeTab={activeTab} onMenuChange={handleMenuChange} />

            {/* Main Content */}
            <MainContent selectedMenu={selectedMenu} />
          </div>
        </div>
      </div>
    </div>
  );
} 