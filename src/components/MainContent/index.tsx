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
  PlusIcon,
  DragHandleIcon
} from '../icons';
import { MenuItemData } from '../Sidebar';
import Editor from '../Editor/Editor';
import { BlockData } from '../Editor/Block';

interface MainContentProps {
  selectedMenu?: MenuItemData;
}



// Available icons for the icon picker
const availableIcons = [
  { name: 'Folder', icon: <FolderIcon /> },
  { name: 'File', icon: <FileIcon /> },
  { name: 'Page', icon: <PageIcon /> },
  { name: 'Image', icon: <ImageIcon /> },
  { name: 'Layers', icon: <LayersIcon /> },
  { name: 'Design', icon: <DesignIcon /> },
  { name: 'System', icon: <SystemIcon /> },
  { name: 'Flow', icon: <FlowIcon /> },
  { name: 'AI', icon: <AIIcon /> },
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
        {
          id: 'process-intro',
          type: 'paragraph',
          content: 'Our design process follows a user-centered approach that ensures every design decision is backed by research and validated through testing.',
        },
        {
          id: 'process-steps',
          type: 'heading1',
          content: 'Design Process Steps',
        },
        {
          id: 'step-1',
          type: 'paragraph',
          content: '1. **Discovery & Research** - Understanding user needs and business requirements',
        },
        {
          id: 'step-2',
          type: 'paragraph',
          content: '2. **Ideation & Conceptualization** - Brainstorming and exploring design solutions',
        },
        {
          id: 'step-3',
          type: 'paragraph',
          content: '3. **Prototyping & Testing** - Creating interactive prototypes and gathering feedback',
        },
        {
          id: 'step-4',
          type: 'paragraph',
          content: '4. **Implementation & Iteration** - Refining designs based on user feedback',
        }
      ]
    },
    'style-guide': {
      title: 'Style Guide',
      icon: <DesignIcon />,
      description: 'Visual design standards and guidelines for consistent branding',
      content: [
        {
          id: 'style-intro',
          type: 'paragraph',
          content: 'Our style guide ensures visual consistency across all touchpoints and maintains brand integrity.',
        },
        {
          id: 'colors-heading',
          type: 'heading1',
          content: 'Color Palette',
        },
        {
          id: 'colors-desc',
          type: 'paragraph',
          content: 'Primary colors: #359aba (Brand Blue), #191919 (Dark), #f5f5f5 (Light)',
        },
        {
          id: 'typography-heading',
          type: 'heading1',
          content: 'Typography',
        },
        {
          id: 'typography-desc',
          type: 'paragraph',
          content: 'Primary font: Inter, Secondary font: System fonts for optimal performance',
        }
      ]
    },
    'folder-name': {
      title: 'Folder Name',
      icon: <FolderIcon />,
      description: 'Naming conventions for Figma folders and project organization',
      content: [
        {
          id: 'folder-intro',
          type: 'paragraph',
          content: 'Consistent folder naming helps maintain organization and makes it easier for team members to find and collaborate on design files.',
        },
        {
          id: 'naming-rules',
          type: 'heading1',
          content: 'Folder Naming Rules',
        },
        {
          id: 'rule-1',
          type: 'paragraph',
          content: '• Use descriptive, clear names that indicate the folder\'s purpose',
        },
        {
          id: 'rule-2',
          type: 'paragraph',
          content: '• Follow the format: [Project] - [Feature/Section] - [Version]',
        },
        {
          id: 'rule-3',
          type: 'paragraph',
          content: '• Use hyphens to separate words, avoid spaces and special characters',
        }
      ]
    },
    'file-structure': {
      title: 'File Name & Structure',
      icon: <FileIcon />,
      description: 'Guidelines for organizing and naming design files',
      content: [
        {
          id: 'file-intro',
          type: 'paragraph',
          content: 'Proper file structure and naming conventions ensure efficient workflow and easy collaboration.',
        },
        {
          id: 'structure-heading',
          type: 'heading1',
          content: 'File Structure Guidelines',
        },
        {
          id: 'structure-1',
          type: 'paragraph',
          content: '• Group related screens and components logically',
        },
        {
          id: 'structure-2',
          type: 'paragraph',
          content: '• Use consistent naming patterns across all files',
        },
        {
          id: 'structure-3',
          type: 'paragraph',
          content: '• Maintain version control through proper file naming',
        }
      ]
    },
    'page-structure': {
      title: 'Page Name & Structure',
      icon: <PageIcon />,
      description: 'Guidelines for naming and structuring pages in Figma',
      content: [
        {
          id: 'page-intro',
          type: 'paragraph',
          content: 'Consistent page naming and structure helps maintain organization and improves collaboration efficiency.',
        },
        {
          id: 'page-naming',
          type: 'heading1',
          content: 'Page Naming Convention',
        },
        {
          id: 'naming-1',
          type: 'paragraph',
          content: '• Use descriptive names that clearly indicate the page purpose',
        },
        {
          id: 'naming-2',
          type: 'paragraph',
          content: '• Follow the format: [Screen Type] - [Feature] - [State]',
        },
        {
          id: 'naming-3',
          type: 'paragraph',
          content: '• Group related pages using consistent prefixes',
        }
      ]
    },
    'cover-thumbnail': {
      title: 'Cover / Thumbnail',
      icon: <ImageIcon />,
      description: 'Guidelines for creating effective cover images and thumbnails',
      content: [
        {
          id: 'cover-intro',
          type: 'paragraph',
          content: 'Well-designed covers and thumbnails help identify files quickly and maintain visual consistency.',
        },
        {
          id: 'cover-specs',
          type: 'heading1',
          content: 'Cover Specifications',
        },
        {
          id: 'spec-1',
          type: 'paragraph',
          content: '• Use consistent dimensions and aspect ratios',
        },
        {
          id: 'spec-2',
          type: 'paragraph',
          content: '• Include project name and key visual elements',
        },
        {
          id: 'spec-3',
          type: 'paragraph',
          content: '• Maintain brand colors and typography',
        }
      ]
    },
    'layer-convention': {
      title: 'Layer Name Convention',
      icon: <LayersIcon />,
      description: 'Naming conventions for layers and components in Figma',
      content: [
        {
          id: 'layer-intro',
          type: 'paragraph',
          content: 'Consistent layer naming improves file organization and makes handoff to developers more efficient.',
        },
        {
          id: 'layer-rules',
          type: 'heading1',
          content: 'Layer Naming Rules',
        },
        {
          id: 'rule-1',
          type: 'paragraph',
          content: '• Use descriptive names that indicate the element\'s function',
        },
        {
          id: 'rule-2',
          type: 'paragraph',
          content: '• Follow the format: [Element Type]/[Purpose]/[State]',
        },
        {
          id: 'rule-3',
          type: 'paragraph',
          content: '• Use consistent naming patterns across all files',
        }
      ]
    },
    'design-bank': {
      title: 'Design Bank',
      icon: <DesignIcon />,
      description: 'Repository of design assets and resources',
      content: [
        {
          id: 'bank-intro',
          type: 'paragraph',
          content: 'Our design bank contains reusable assets, templates, and resources to maintain consistency and efficiency.',
        },
        {
          id: 'bank-categories',
          type: 'heading1',
          content: 'Asset Categories',
        },
        {
          id: 'category-1',
          type: 'paragraph',
          content: '• **Icons & Illustrations** - Scalable vector graphics and custom illustrations',
        },
        {
          id: 'category-2',
          type: 'paragraph',
          content: '• **Templates** - Pre-designed layouts and page structures',
        },
        {
          id: 'category-3',
          type: 'paragraph',
          content: '• **Brand Assets** - Logos, colors, and typography resources',
        }
      ]
    },
    'design-system': {
      title: 'Design System',
      icon: <SystemIcon />,
      description: 'Comprehensive design system components and guidelines',
      content: [
        {
          id: 'system-intro',
          type: 'paragraph',
          content: 'Our design system ensures consistency across all products and provides reusable components.',
        },
        {
          id: 'system-components',
          type: 'heading1',
          content: 'System Components',
        },
        {
          id: 'component-1',
          type: 'paragraph',
          content: '• **Foundations** - Colors, typography, spacing, and grid systems',
        },
        {
          id: 'component-2',
          type: 'paragraph',
          content: '• **Components** - Buttons, forms, navigation, and interactive elements',
        },
        {
          id: 'component-3',
          type: 'paragraph',
          content: '• **Patterns** - Layout patterns and interaction guidelines',
        }
      ]
    },
    'flow': {
      title: 'Flow',
      icon: <FlowIcon />,
      description: 'User flow diagrams and journey mapping',
      content: [
        {
          id: 'flow-intro',
          type: 'paragraph',
          content: 'User flows help visualize the user journey and identify potential friction points in the experience.',
        },
        {
          id: 'flow-types',
          type: 'heading1',
          content: 'Flow Types',
        },
        {
          id: 'type-1',
          type: 'paragraph',
          content: '• **Task Flows** - Step-by-step user actions to complete specific tasks',
        },
        {
          id: 'type-2',
          type: 'paragraph',
          content: '• **User Journeys** - End-to-end experience mapping across touchpoints',
        },
        {
          id: 'type-3',
          type: 'paragraph',
          content: '• **System Flows** - Technical process flows and data relationships',
        }
      ]
    },
    'ai': {
      title: 'AI',
      icon: <AIIcon />,
      description: 'AI-powered design tools and automation guidelines',
      content: [
        {
          id: 'ai-intro',
          type: 'paragraph',
          content: 'AI tools can enhance our design process by automating repetitive tasks and generating creative alternatives.',
        },
        {
          id: 'ai-tools',
          type: 'heading1',
          content: 'AI Tools & Applications',
        },
        {
          id: 'tool-1',
          type: 'paragraph',
          content: '• **Content Generation** - Automated copy and placeholder text creation',
        },
        {
          id: 'tool-2',
          type: 'paragraph',
          content: '• **Image Processing** - Background removal and image enhancement',
        },
        {
          id: 'tool-3',
          type: 'paragraph',
          content: '• **Design Assistance** - Layout suggestions and color palette generation',
        }
      ]
    },
    // Company Tab Content
    'mission-vision': {
      title: 'Mission & Vision',
      icon: <DesignIcon />,
      description: 'Our company mission, vision, and core values',
      content: [
        {
          id: 'mission-heading',
          type: 'heading1',
          content: 'Our Mission',
        },
        {
          id: 'mission-content',
          type: 'paragraph',
          content: 'To create exceptional digital experiences that empower businesses and delight users through innovative design and technology.',
        },
        {
          id: 'vision-heading',
          type: 'heading1',
          content: 'Our Vision',
        },
        {
          id: 'vision-content',
          type: 'paragraph',
          content: 'To be the leading design and development partner that transforms ideas into impactful digital solutions.',
        }
      ]
    },
    'company-values': {
      title: 'Company Values',
      icon: <FlowIcon />,
      description: 'The core values that guide our work and culture',
      content: [
        {
          id: 'values-intro',
          type: 'paragraph',
          content: 'Our values shape how we work, collaborate, and deliver exceptional results for our clients.',
        },
        {
          id: 'value-1',
          type: 'paragraph',
          content: '**Excellence** - We strive for the highest quality in everything we do',
        },
        {
          id: 'value-2',
          type: 'paragraph',
          content: '**Innovation** - We embrace new ideas and cutting-edge technologies',
        },
        {
          id: 'value-3',
          type: 'paragraph',
          content: '**Collaboration** - We believe in the power of teamwork and open communication',
        }
      ]
    },
    // Developer Tab Content
    'coding-standards': {
      title: 'Coding Standards',
      icon: <FileIcon />,
      description: 'Code quality guidelines and best practices',
      content: [
        {
          id: 'standards-intro',
          type: 'paragraph',
          content: 'Consistent coding standards ensure maintainable, readable, and scalable code across all projects.',
        },
        {
          id: 'standards-heading',
          type: 'heading1',
          content: 'Key Standards',
        },
        {
          id: 'standard-1',
          type: 'paragraph',
          content: '• Use TypeScript for type safety and better developer experience',
        },
        {
          id: 'standard-2',
          type: 'paragraph',
          content: '• Follow consistent naming conventions (camelCase for variables, PascalCase for components)',
        },
        {
          id: 'standard-3',
          type: 'paragraph',
          content: '• Write comprehensive tests for all critical functionality',
        }
      ]
    },
    // Content Tab Content
    'brand-voice': {
      title: 'Brand Voice',
      icon: <DesignIcon />,
      description: 'Guidelines for consistent brand communication',
      content: [
        {
          id: 'voice-intro',
          type: 'paragraph',
          content: 'Our brand voice reflects our personality and values in every piece of content we create.',
        },
        {
          id: 'voice-heading',
          type: 'heading1',
          content: 'Voice Characteristics',
        },
        {
          id: 'voice-1',
          type: 'paragraph',
          content: '• **Professional yet approachable** - We maintain expertise while being friendly',
        },
        {
          id: 'voice-2',
          type: 'paragraph',
          content: '• **Clear and concise** - We communicate complex ideas simply',
        },
        {
          id: 'voice-3',
          type: 'paragraph',
          content: '• **Inspiring and confident** - We motivate action through positive messaging',
        }
      ]
    }
  };

  return contentMap[menuId] || {
    title: 'Welcome',
    icon: <DesignIcon />,
    description: 'Select a menu item to view its content',
    content: [
      {
        id: 'welcome',
        type: 'paragraph',
        content: 'Welcome to our documentation system. Please select a menu item from the sidebar to view its content.',
      }
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
    console.log('Content updated for', currentMenu.title, blocks);
  };

  const handleTitleClick = () => {
    setIsEditingTitle(true);
    setTitleValue(currentMenu.title);
  };

  const handleTitleSave = () => {
    if (titleValue.trim()) {
      // Here you would update the title in your data structure
      console.log('Title updated to:', titleValue.trim());
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
    console.log('Icon updated to:', iconData.name);
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
    <div className="bg-[#121212] flex flex-col grow items-start justify-start overflow-auto self-stretch">
      {/* Main Content Area */}
      <div className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen">
          {/* Icon Section - 76px clickable icon */}
          <div className="relative mb-4">
            <button
              ref={iconButtonRef}
              onClick={handleIconClick}
              className="w-[76px] h-[76px] flex items-center justify-center text-[#359aba] hover:bg-neutral-800/30 rounded-lg transition-colors duration-200 border-2 border-transparent hover:border-neutral-700/50"
              title="Click to change icon"
            >
              <div className="w-8 h-8 [&>svg]:w-8 [&>svg]:h-8">
                {selectedIcon}
              </div>
            </button>

            {/* Icon Dropdown - Using Portal to prevent stacking context issues */}
            {showIconDropdown && typeof document !== 'undefined' && createPortal(
              <div 
                ref={iconDropdownRef}
                className="fixed bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg p-2 grid grid-cols-3 gap-1 min-w-[180px]"
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
                    className="w-12 h-12 flex items-center justify-center text-neutral-400 hover:text-[#359aba] hover:bg-neutral-700/50 rounded-md transition-colors duration-200"
                    title={iconData.name}
                  >
                    <div className="w-6 h-6">
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
                className="w-full bg-transparent text-neutral-50 text-[32px] font-bold leading-tight outline-none border-none focus:ring-0 p-0 m-0"
                style={{ fontFamily: 'inherit' }}
              />
            ) : (
              <h1 
                onClick={handleTitleClick}
                className="text-neutral-50 text-[32px] font-bold leading-tight cursor-pointer hover:bg-neutral-800/20 rounded px-1 py-0.5 -mx-1 transition-colors duration-200"
                title="Click to edit title"
              >
                {titleValue || 'Untitled'}
              </h1>
            )}
            </div>

          {/* Interactive Input Area */}
          <div className="relative group">
            {/* Hover Controls - positioned to the left */}
            <div className="absolute left-[-50px] top-0 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {/* Add Block Button */}
              <button
                className="p-1 rounded hover:bg-neutral-700 text-neutral-400 hover:text-neutral-200 transition-colors duration-200"
                title="Add block"
              >
                <PlusIcon />
              </button>
              
              {/* Drag Handle */}
              <div
                className="p-1 rounded hover:bg-neutral-700 text-neutral-400 hover:text-neutral-200 transition-colors duration-200 cursor-grab"
                title="Drag to move"
              >
                <DragHandleIcon />
              </div>
            </div>

            {/* Editor with custom placeholder styling */}
            <div className="relative">
                            <Editor 
                key={currentMenu.title}
                initialContent={blocks}
                onContentChange={handleContentChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 