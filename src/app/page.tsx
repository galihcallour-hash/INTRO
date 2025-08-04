'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import MainContent from '@/components/MainContent';
import Footer from '@/components/Footer';
import { MenuItemType, MenuItemData } from '@/components/Sidebar';

export default function Home() {
  const [selectedMenu, setSelectedMenu] = useState<MenuItemData | undefined>();

  const handleMenuChange = (menuId: MenuItemType, menuData?: MenuItemData) => {
    setSelectedMenu(menuData);
  };

  return (
    <div className="bg-white relative size-full min-h-screen">
      {/* Background */}
      <div className="absolute bg-neutral-950 left-0 right-0 top-0 min-h-screen">
        <div className="h-screen relative w-full">
          {/* Header */}
          <Header />

          {/* Main Content Container */}
          <div className="flex flex-row items-start left-0 right-0 top-[95.5px] absolute">
            {/* Sidebar */}
            <Sidebar onMenuChange={handleMenuChange} />

            {/* Main Content */}
            <MainContent selectedMenu={selectedMenu} />
          </div>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
}
