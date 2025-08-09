import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  HomeIcon,
  StarIcon,
  HeartIcon,
  PersonIcon,
  EmailIcon,
  PhoneIcon,
  LocationIcon,
  CalendarIcon,
  ClockIcon,
  CameraIcon,
  MusicIcon,
  VideoIcon,
  GameIcon,
  BookIcon,
  ShoppingIcon,
  FavoriteIcon,
  SearchIcon,
  NotificationIcon,
  MenuIcon,
  MoreIcon
} from '../icons';
import { MenuItemData } from '../Sidebar';
import Editor from '../Editor/Editor';
import { BlockData } from '../Editor/Block';

interface MainContentProps {
  selectedMenu?: MenuItemData;
}



// Available icons for the icon picker - Expanded with Material Icons
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

// Content mapping for different menu items
const getContentForMenu = (menuId: string): { title: string; icon: React.ReactNode; description: string; content: BlockData[] } => {
  const contentMap: Record<string, { title: string; icon: React.ReactNode; description: string; content: BlockData[] }> = {
    // Designer Tab Content
    'design-process': {
      title: 'Design Process',
      icon: <FlowIcon />,
      description: 'Our comprehensive design process from ideation to implementation',
      content: [
        { id: 'empty-content', type: 'paragraph', content: '' }
      ]
    },
    'style-guide': {
      title: 'Style Guide',
      icon: <DesignIcon />,
      description: 'Visual design standards and guidelines for consistent branding',
      content: [
        { id: 'empty-content', type: 'paragraph', content: '' }
      ]
    },
    'folder-name': {
      title: 'Folder Name',
      icon: <FolderIcon />,
      description: 'Naming conventions for project folders and organization',
      content: [
        { id: 'empty-content', type: 'paragraph', content: '' }
      ]
    },
    'file-structure': {
      title: 'File Name & Structure',
      icon: <FileIcon />,
      description: 'File naming standards and organizational structure',
      content: [
        { id: 'empty-content', type: 'paragraph', content: '' }
      ]
    },
    'page-structure': {
      title: 'Page Name & Structure',
      icon: <PageIcon />,
      description: 'Page naming conventions and hierarchical structure',
      content: [
        { id: 'empty-content', type: 'paragraph', content: '' }
      ]
    },
    'cover-thumbnail': {
      title: 'Cover / Thumbnail',
      icon: <ImageIcon />,
      description: 'Guidelines for creating covers and thumbnails',
      content: [
        { id: 'empty-content', type: 'paragraph', content: '' }
      ]
    },
    'layer-convention': {
      title: 'Layer Name Convention',
      icon: <LayersIcon />,
      description: 'Standardized naming for design layers and components',
      content: [
        { id: 'empty-content', type: 'paragraph', content: '' }
      ]
    },
    'design-bank': {
      title: 'Design Bank',
      icon: <DesignIcon />,
      description: 'Repository of design assets and resources',
      content: [
        { id: 'empty-content', type: 'paragraph', content: '' }
      ]
    },
    'design-system': {
      title: 'Design System',
      icon: <SystemIcon />,
      description: 'Comprehensive design system and component library',
      content: [
        { id: 'empty-content', type: 'paragraph', content: '' }
      ]
    },
    'flow': {
      title: 'Flow',
      icon: <FlowIcon />,
      description: 'User flow diagrams and interaction patterns',
      content: [
        { id: 'empty-content', type: 'paragraph', content: '' }
      ]
    },
    'ai': {
      title: 'AI',
      icon: <AIIcon />,
      description: 'AI-powered design tools and automation',
      content: [
        { id: 'empty-content', type: 'paragraph', content: '' }
      ]
    },

    // Company Tab Content (match Sidebar IDs)
    'mission-vision': {
      title: 'Mission & Vision',
      icon: <DesignIcon />,
      description: 'Our mission and vision statements',
      content: [
        { id: 'empty-content', type: 'paragraph', content: '' }
      ]
    },
    'company-values': {
      title: 'Company Values',
      icon: <FlowIcon />,
      description: 'Core values that guide our behavior',
      content: [
        { id: 'empty-content', type: 'paragraph', content: '' }
      ]
    },
    'organization-chart': {
      title: 'Organization Chart',
      icon: <SystemIcon />,
      description: 'Company organizational structure',
      content: [
        { id: 'empty-content', type: 'paragraph', content: '' }
      ]
    },
    'hr-policies': {
      title: 'HR Policies',
      icon: <FileIcon />,
      description: 'Human Resources policies and procedures',
      content: [
        { id: 'empty-content', type: 'paragraph', content: '' }
      ]
    },
    'code-of-conduct': {
      title: 'Code of Conduct',
      icon: <PageIcon />,
      description: 'Standards for ethical and professional conduct',
      content: [
        { id: 'empty-content', type: 'paragraph', content: '' }
      ]
    },
    'security-policies': {
      title: 'Security Policies',
      icon: <LayersIcon />,
      description: 'Security rules and best practices',
      content: [
        { id: 'empty-content', type: 'paragraph', content: '' }
      ]
    },

    // Developer Tab Content
    'coding-standards': {
      title: 'Coding Standards',
      icon: <FileIcon />,
      description: 'Standards for writing clean, consistent code',
      content: [
        { id: 'empty-content', type: 'paragraph', content: '' }
      ]
    },
    'git-workflow': {
      title: 'Git Workflow',
      icon: <FlowIcon />,
      description: 'Branching strategy and PR process',
      content: [
        { id: 'empty-content', type: 'paragraph', content: '' }
      ]
    },
    'code-review': {
      title: 'Code Review',
      icon: <PageIcon />,
      description: 'Guidelines for reviewing code effectively',
      content: [
        { id: 'empty-content', type: 'paragraph', content: '' }
      ]
    },
    'api-docs': {
      title: 'API Documentation',
      icon: <SystemIcon />,
      description: 'APIs and integration references',
      content: [
        { id: 'empty-content', type: 'paragraph', content: '' }
      ]
    },
    'architecture': {
      title: 'Architecture',
      icon: <DesignIcon />,
      description: 'System architecture and diagrams',
      content: [
        { id: 'empty-content', type: 'paragraph', content: '' }
      ]
    },
    'deployment': {
      title: 'Deployment Guide',
      icon: <LayersIcon />,
      description: 'How to deploy the application',
      content: [
        { id: 'empty-content', type: 'paragraph', content: '' }
      ]
    },

    // Content Tab Content
    'brand-voice': {
      title: 'Brand Voice',
      icon: <DesignIcon />,
      description: 'Tone and voice guidelines',
      content: [
        { id: 'empty-content', type: 'paragraph', content: '' }
      ]
    },
    'content-guidelines': {
      title: 'Content Guidelines',
      icon: <FileIcon />,
      description: 'Editorial standards for content',
      content: [
        { id: 'empty-content', type: 'paragraph', content: '' }
      ]
    },
    'editorial-calendar': {
      title: 'Editorial Calendar',
      icon: <PageIcon />,
      description: 'Planning and scheduling content',
      content: [
        { id: 'empty-content', type: 'paragraph', content: '' }
      ]
    },
    'blog-posts': {
      title: 'Blog Posts',
      icon: <FlowIcon />,
      description: 'Guidelines and ideas for blog posts',
      content: [
        { id: 'empty-content', type: 'paragraph', content: '' }
      ]
    },
    'social-media': {
      title: 'Social Media',
      icon: <ImageIcon />,
      description: 'Social media strategy and assets',
      content: [
        { id: 'empty-content', type: 'paragraph', content: '' }
      ]
    },
    'marketing-copy': {
      title: 'Marketing Copy',
      icon: <SystemIcon />,
      description: 'Copywriting for marketing materials',
      content: [
        { id: 'empty-content', type: 'paragraph', content: '' }
      ]
    },
  };

  return contentMap[menuId] || {
    title: 'Untitled',
    icon: <FileIcon />,
    description: 'Default content',
    content: [
      { id: 'empty-content', type: 'paragraph', content: '' }
    ]
  };
};

export default function MainContent({ selectedMenu }: MainContentProps) {
  const menuContent = selectedMenu ? getContentForMenu(selectedMenu.id) : getContentForMenu('default');
  
  const [currentMenu, setCurrentMenu] = useState(menuContent);
  const [selectedIcon, setSelectedIcon] = useState(currentMenu.icon);
  const [showIconDropdown, setShowIconDropdown] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(currentMenu.title);
  const [blocks, setBlocks] = useState<BlockData[]>(currentMenu.content);

  // Update content when selectedMenu changes
  useEffect(() => {
    const newContent = selectedMenu ? getContentForMenu(selectedMenu.id) : getContentForMenu('default');
    setCurrentMenu(newContent);
    setSelectedIcon(newContent.icon);
    setTitleValue(newContent.title);
    setBlocks(newContent.content);
  }, [selectedMenu]);

  const titleInputRef = useRef<HTMLInputElement>(null);
  const iconDropdownRef = useRef<HTMLDivElement>(null);
  const iconButtonRef = useRef<HTMLButtonElement>(null);

  const handleContentChange = (blocks: BlockData[]) => {
    // Here you could save the content to a backend or local storage
    console.log('Content changed:', blocks);
  };

  const handleTitleClick = () => {
    setIsEditingTitle(true);
    setTitleValue(currentMenu.title);
  };

  const handleTitleSave = () => {
    if (titleValue.trim()) {
      // Here you would update the title in your data structure
    }
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setTitleValue(currentMenu.title);
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTitleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleTitleCancel();
    }
  };

  const handleIconClick = () => {
    setShowIconDropdown(!showIconDropdown);
  };

  const handleIconSelect = (iconData: { name: string; icon: React.ReactNode }) => {
    setSelectedIcon(iconData.icon);
    setShowIconDropdown(false);
    // Here you would update the icon in your data structure
  };

  // Focus title input when editing starts
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  // Close icon dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showIconDropdown && 
          iconDropdownRef.current && 
          iconButtonRef.current &&
          !iconDropdownRef.current.contains(event.target as Node) &&
          !iconButtonRef.current.contains(event.target as Node)) {
        setShowIconDropdown(false);
      }
    };

    if (showIconDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showIconDropdown]);

  return (
    <div className="bg-[#121212] flex-1 flex flex-col min-h-0">
      {/* Main Content Area - Scrollable only when needed */}
      <div className="flex-1 overflow-y-auto">
        {/* Header Section (Icon & Title) with padding */}
        <div className="max-w-4xl mx-auto py-8 pb-0">
          {/* Icon Section - 76px clickable icon */}
          <div className="relative mb-4">
            <button
              ref={iconButtonRef}
              onClick={handleIconClick}
              className="w-[76px] h-[76px] flex items-center justify-center text-[#359aba] hover:bg-neutral-800/30 rounded-lg transition-colors duration-200 border-2 border-transparent hover:border-neutral-700/50"
              title="Click to change icon"
            >
              <div className="w-12 h-12 [&>svg]:w-12 [&>svg]:h-12">
                {selectedIcon}
              </div>
            </button>

            {/* Icon Dropdown - Using Portal to prevent stacking context issues */}
            {showIconDropdown && typeof document !== 'undefined' && createPortal(
              <div 
                ref={iconDropdownRef}
                className="fixed bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg p-3 grid grid-cols-6 gap-2 min-w-[300px] max-h-[400px] overflow-y-auto"
                style={{
                  zIndex: 999999,
                  position: 'fixed',
                  left: iconButtonRef.current ? iconButtonRef.current.getBoundingClientRect().left : 0,
                  top: iconButtonRef.current ? iconButtonRef.current.getBoundingClientRect().bottom + 8 : 0,
                }}
              >
                {availableIcons.map((iconData, index) => (
                  <button
                    key={index}
                    onClick={() => handleIconSelect(iconData)}
                    className="w-12 h-12 flex items-center justify-center text-neutral-400 hover:text-[#359aba] hover:bg-neutral-700/50 rounded-md transition-colors duration-200 group"
                    title={iconData.name}
                  >
                    <div className="w-6 h-6 [&>svg]:w-6 [&>svg]:h-6 flex items-center justify-center">
                      {iconData.icon}
                    </div>
                  </button>
                ))}
              </div>,
              document.body
            )}
            </div>

          {/* Title Section - Editable H1 */}
          <div className="mb-8">
            {isEditingTitle ? (
              <input
                ref={titleInputRef}
                type="text"
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                onKeyDown={handleTitleKeyDown}
                onBlur={handleTitleSave}
                className="text-5xl font-bold text-neutral-50 bg-transparent border-none outline-none w-full placeholder-neutral-500"
                placeholder="Untitled"
                autoFocus
              />
            ) : (
              <h1 
                onClick={handleTitleClick}
                className="text-5xl font-bold text-neutral-50 cursor-text hover:bg-neutral-800/20 rounded-md px-2 py-1 -mx-2 -my-1 transition-colors duration-200"
                title="Click to edit title"
              >
                {currentMenu.title}
              </h1>
            )}
        </div>
      </div>
      
        {/* Editor Section - Full width with no horizontal padding */}
        <div className="w-full">
        <Editor 
            key={currentMenu.title}
            initialContent={blocks}
          onContentChange={handleContentChange}
        />
        </div>
      </div>
    </div>
  );
} 