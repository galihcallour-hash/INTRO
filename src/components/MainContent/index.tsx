import { FolderIcon } from '../icons';
import { MenuItemData } from '../Sidebar';
import Editor from '../Editor/Editor';
import { BlockData } from '../Editor/Block';

interface MainContentProps {
  selectedMenu?: MenuItemData;
}

const defaultContent = {
  id: 'folder-structure',
  title: 'Folder Name & Structure',
  icon: <FolderIcon />,
  description: 'Guidelines for organizing and naming folders in Figma projects.'
};

const getInitialContentForMenu = (menuData: MenuItemData): BlockData[] => {
  const contentMap: Record<string, BlockData[]> = {
    'folder-structure': [
      {
        id: 'intro-block',
        type: 'paragraph',
        content: 'Use clear, descriptive folder names that reflect the project structure and content hierarchy.',
      },
      {
        id: 'heading-block',
        type: 'heading2',
        content: 'Best Practices',
      },
      {
        id: 'list-block-1',
        type: 'bulletList',
        content: 'Use consistent naming conventions across all projects',
      },
      {
        id: 'list-block-2',
        type: 'bulletList',
        content: 'Organize folders by project phase or component type',
      },
      {
        id: 'list-block-3',
        type: 'bulletList',
        content: 'Keep folder names concise but descriptive',
      }
    ],
    'file-structure': [
      {
        id: 'intro-block',
        type: 'paragraph',
        content: 'Structure your files logically with consistent naming conventions and proper organization.',
      }
    ],
    'page-structure': [
      {
        id: 'intro-block',
        type: 'paragraph',
        content: 'Create a logical page hierarchy that makes navigation intuitive for all team members.',
      }
    ],
    'cover-thumbnail': [
      {
        id: 'intro-block',
        type: 'paragraph',
        content: 'Design covers that clearly represent the content and maintain visual consistency across projects.',
      }
    ],
    'layer-convention': [
      {
        id: 'intro-block',
        type: 'paragraph',
        content: 'Use descriptive layer names and maintain consistent grouping to improve file readability.',
      }
    ],
    'design-bank': [
      {
        id: 'intro-block',
        type: 'paragraph',
        content: 'Centralized collection of approved design elements and patterns for team use.',
      }
    ],
    'design-system': [
      {
        id: 'intro-block',
        type: 'paragraph',
        content: 'Complete set of design standards, components, and guidelines for consistent product design.',
      }
    ],
    'flow': [
      {
        id: 'intro-block',
        type: 'paragraph',
        content: 'Document user journeys and interaction flows to guide design decisions.',
      }
    ],
    'ai': [
      {
        id: 'intro-block',
        type: 'paragraph',
        content: 'Leverage artificial intelligence to enhance design workflows and productivity.',
      }
    ]
  };

  return contentMap[menuData.id] || [
    {
      id: 'default-block',
      type: 'paragraph',
      content: '',
    }
  ];
};

export default function MainContent({ selectedMenu }: MainContentProps) {
  const currentMenu = selectedMenu || defaultContent;

  const handleContentChange = (blocks: BlockData[]) => {
    // Here you could save the content to a backend or local storage
    console.log('Content updated for', currentMenu.title, blocks);
  };

  return (
    <div className="bg-[#121212] flex flex-col grow items-start justify-start overflow-auto self-stretch">
      {/* Header Section */}
      <div className="w-full border-b border-neutral-800/30">
        <div className="flex flex-col gap-[13px] items-start justify-start px-12 py-12">
          <div className="flex flex-row gap-[10.5px] items-center justify-start w-full">
            <div className="flex flex-row items-center justify-center size-4">
              <div className="size-[42px] text-[#359aba]">
                {currentMenu.icon}
              </div>
            </div>
            <div className="flex flex-col items-start justify-start">
              <div className="font-bold text-neutral-50 text-[32px] leading-[3px] whitespace-pre">
                {currentMenu.title}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Editor Content */}
      <div className="flex-1 w-full">
        <Editor 
          key={currentMenu.id} // Re-render editor when menu changes
          initialContent={getInitialContentForMenu(currentMenu)}
          onContentChange={handleContentChange}
        />
      </div>
    </div>
  );
} 