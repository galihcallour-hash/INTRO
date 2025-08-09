import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import MainContent from '@/components/MainContent';
import { MenuItemType, MenuItemData, TabType } from '@/components/Sidebar';

export default function Dashboard() {
  const [selectedMenu, setSelectedMenu] = useState<MenuItemData | undefined>();
  const [activeTab, setActiveTab] = useState<TabType>('designer');

  // Sidebar width (resizable like Notion)
  const DEFAULT_WIDTH = 240; // px
  const MIN_WIDTH = 180;
  const MAX_WIDTH = 420;
  const [sidebarWidth, setSidebarWidth] = useState<number>(DEFAULT_WIDTH);
  const isResizingRef = useRef(false);

  // Load persisted width
  useEffect(() => {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem('sidebar:width') : null;
    if (raw) {
      const parsed = Number(raw);
      if (!Number.isNaN(parsed)) setSidebarWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, parsed)));
    }
  }, []);

  // Persist width
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('sidebar:width', String(sidebarWidth));
    }
  }, [sidebarWidth]);

  // Mouse handlers for resizing
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!isResizingRef.current) return;
      // Sidebar is left column, so width = clientX but clamp between min/max
      const next = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, e.clientX));
      setSidebarWidth(next);
      e.preventDefault();
    };

    const stopResize = () => {
      isResizingRef.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', stopResize);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', stopResize);
    };
  }, []);

  const handleResizeStart = (e: React.MouseEvent) => {
    isResizingRef.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  };

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
        {/* Sidebar - Resizable width, full height */}
        <div className="flex-shrink-0" style={{ width: sidebarWidth }}>
          <Sidebar activeTab={activeTab} onMenuChange={handleMenuChange} widthPx={sidebarWidth} />
        </div>

        {/* Resize handle */}
        <div className="relative flex-shrink-0 w-px" aria-hidden>
          {/* Single visible divider line */}
          <div className="w-px h-full bg-neutral-800" />
          {/* Wider invisible hit area for drag */}
          <button
            onMouseDown={handleResizeStart}
            className="absolute -left-2 top-0 bottom-0 w-4 cursor-col-resize bg-transparent"
            title="Drag to resize"
            aria-label="Resize sidebar"
          />
        </div>

        {/* Main Content - Takes remaining space */}
        <div className="flex-1 min-w-0">
          <MainContent selectedMenu={selectedMenu} />
        </div>
      </div>
    </div>
  );
} 