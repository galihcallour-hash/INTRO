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
          id: 'mission-intro',
          type: 'paragraph',
          content: 'Our mission and vision guide every decision we make and define our purpose as an organization.',
        },
        {
          id: 'mission-heading',
          type: 'heading1',
          content: 'Our Mission',
        },
        {
          id: 'mission-content',
          type: 'paragraph',
          content: 'To create innovative solutions that empower businesses and improve user experiences through thoughtful design and technology.',
        },
        {
          id: 'vision-heading',
          type: 'heading1',
          content: 'Our Vision',
        },
        {
          id: 'vision-content',
        type: 'paragraph',
          content: 'To be the leading partner for companies seeking to transform their digital presence and create meaningful connections with their users.',
        }
      ]
    },
    'company-values': {
      title: 'Company Values',
      icon: <FlowIcon />,
      description: 'Core values that define our culture and guide our work',
      content: [
        {
          id: 'values-intro',
          type: 'paragraph',
          content: 'Our values are the foundation of our culture and guide how we work together and serve our clients.',
        },
        {
          id: 'values-heading',
          type: 'heading1',
          content: 'Core Values',
        },
        {
          id: 'value-1',
          type: 'paragraph',
          content: '• **Innovation** - We constantly seek new and better ways to solve problems',
        },
        {
          id: 'value-2',
          type: 'paragraph',
          content: '• **Collaboration** - We work together to achieve shared goals',
        },
        {
          id: 'value-3',
          type: 'paragraph',
          content: '• **Excellence** - We strive for the highest quality in everything we do',
        },
        {
          id: 'value-4',
          type: 'paragraph',
          content: '• **Integrity** - We act with honesty and transparency in all our dealings',
        }
      ]
    },
    'organization-chart': {
      title: 'Organization Chart',
      icon: <SystemIcon />,
      description: 'Our organizational structure and team hierarchy',
      content: [
        {
          id: 'org-intro',
          type: 'paragraph',
          content: 'Our organizational structure is designed to promote collaboration and clear communication across all levels.',
        },
        {
          id: 'org-heading',
          type: 'heading1',
          content: 'Leadership Team',
        },
        {
          id: 'leadership-content',
          type: 'paragraph',
          content: 'Our leadership team brings together diverse expertise in design, technology, and business strategy.',
        }
      ]
    },
    'hr-policies': {
      title: 'HR Policies',
      icon: <FileIcon />,
      description: 'Human resources policies and procedures',
      content: [
        {
          id: 'hr-intro',
          type: 'paragraph',
          content: 'Our HR policies ensure a fair, inclusive, and productive work environment for all team members.',
        },
        {
          id: 'hr-heading',
          type: 'heading1',
          content: 'Key Policies',
        },
        {
          id: 'policy-1',
          type: 'paragraph',
          content: '• Equal Opportunity Employment',
        },
        {
          id: 'policy-2',
          type: 'paragraph',
          content: '• Work-Life Balance',
        },
        {
          id: 'policy-3',
          type: 'paragraph',
          content: '• Professional Development',
        }
      ]
    },
    'code-of-conduct': {
      title: 'Code of Conduct',
      icon: <PageIcon />,
      description: 'Guidelines for professional behavior and ethics',
      content: [
        {
          id: 'conduct-intro',
          type: 'paragraph',
          content: 'Our code of conduct establishes the standards of behavior expected from all team members.',
        },
        {
          id: 'conduct-heading',
          type: 'heading1',
          content: 'Behavioral Standards',
        },
        {
          id: 'standard-1',
          type: 'paragraph',
          content: '• Treat all colleagues with respect and professionalism',
        },
        {
          id: 'standard-2',
          type: 'paragraph',
          content: '• Maintain confidentiality of sensitive information',
        },
        {
          id: 'standard-3',
          type: 'paragraph',
          content: '• Report any violations or concerns promptly',
        }
      ]
    },
    'security-policies': {
      title: 'Security Policies',
      icon: <LayersIcon />,
      description: 'Information security and data protection policies',
      content: [
        {
          id: 'security-intro',
          type: 'paragraph',
          content: 'Our security policies protect sensitive information and ensure compliance with industry standards.',
        },
        {
          id: 'security-heading',
          type: 'heading1',
          content: 'Security Guidelines',
        },
        {
          id: 'security-1',
          type: 'paragraph',
          content: '• Use strong passwords and enable two-factor authentication',
        },
        {
          id: 'security-2',
          type: 'paragraph',
          content: '• Keep software and systems updated',
        },
        {
          id: 'security-3',
          type: 'paragraph',
          content: '• Report security incidents immediately',
        }
      ]
    },
    
    // Developer Tab Content
    'coding-standards': {
      title: 'Coding Standards',
      icon: <FileIcon />,
      description: 'Guidelines for writing clean, maintainable code',
      content: [
        {
          id: 'coding-intro',
          type: 'paragraph',
          content: 'Our coding standards ensure consistency, readability, and maintainability across all projects.',
        },
        {
          id: 'coding-heading',
          type: 'heading1',
          content: 'Code Quality Standards',
        },
        {
          id: 'standard-1',
          type: 'paragraph',
          content: '• Use meaningful variable and function names',
        },
        {
          id: 'standard-2',
          type: 'paragraph',
          content: '• Write clear comments and documentation',
        },
        {
          id: 'standard-3',
          type: 'paragraph',
          content: '• Follow consistent formatting and indentation',
        },
        {
          id: 'standard-4',
          type: 'paragraph',
          content: '• Implement proper error handling',
        }
      ]
    },
    'git-workflow': {
      title: 'Git Workflow',
      icon: <FlowIcon />,
      description: 'Version control workflow and branching strategy',
      content: [
        {
          id: 'git-intro',
          type: 'paragraph',
          content: 'Our Git workflow ensures clean version history and smooth collaboration across development teams.',
        },
        {
          id: 'git-heading',
          type: 'heading1',
          content: 'Branching Strategy',
        },
        {
          id: 'branch-1',
          type: 'paragraph',
          content: '• **main** - Production-ready code',
        },
        {
          id: 'branch-2',
          type: 'paragraph',
          content: '• **develop** - Integration branch for features',
        },
        {
          id: 'branch-3',
          type: 'paragraph',
          content: '• **feature/** - Individual feature development',
        },
        {
          id: 'branch-4',
          type: 'paragraph',
          content: '• **hotfix/** - Critical production fixes',
        }
      ]
    },
    'code-review': {
      title: 'Code Review',
      icon: <PageIcon />,
      description: 'Code review process and best practices',
      content: [
        {
          id: 'review-intro',
          type: 'paragraph',
          content: 'Code reviews are essential for maintaining code quality and sharing knowledge across the team.',
        },
        {
          id: 'review-heading',
          type: 'heading1',
          content: 'Review Process',
        },
        {
          id: 'process-1',
          type: 'paragraph',
          content: '1. Create a pull request with clear description',
        },
        {
          id: 'process-2',
          type: 'paragraph',
          content: '2. Request review from at least two team members',
        },
        {
          id: 'process-3',
          type: 'paragraph',
          content: '3. Address feedback and make necessary changes',
        },
        {
          id: 'process-4',
          type: 'paragraph',
          content: '4. Merge only after approval from reviewers',
        }
      ]
    },
    'api-docs': {
      title: 'API Documentation',
      icon: <SystemIcon />,
      description: 'API documentation and integration guidelines',
      content: [
        {
          id: 'api-intro',
          type: 'paragraph',
          content: 'Comprehensive API documentation for seamless integration and development.',
        },
        {
          id: 'api-heading',
          type: 'heading1',
          content: 'API Overview',
        },
        {
          id: 'api-1',
          type: 'paragraph',
          content: '• RESTful API design principles',
        },
        {
          id: 'api-2',
          type: 'paragraph',
          content: '• Authentication and authorization',
        },
        {
          id: 'api-3',
          type: 'paragraph',
          content: '• Rate limiting and error handling',
        }
      ]
    },
    'architecture': {
      title: 'Architecture',
      icon: <DesignIcon />,
      description: 'System architecture and design patterns',
      content: [
        {
          id: 'arch-intro',
          type: 'paragraph',
          content: 'Our system architecture follows modern design patterns and best practices for scalability and maintainability.',
        },
        {
          id: 'arch-heading',
          type: 'heading1',
          content: 'Architecture Principles',
        },
        {
          id: 'principle-1',
          type: 'paragraph',
          content: '• Microservices architecture for scalability',
        },
        {
          id: 'principle-2',
          type: 'paragraph',
          content: '• Event-driven communication between services',
        },
        {
          id: 'principle-3',
          type: 'paragraph',
          content: '• Database per service pattern',
        }
      ]
    },
    'deployment': {
      title: 'Deployment Guide',
      icon: <LayersIcon />,
      description: 'Deployment procedures and environment management',
      content: [
        {
          id: 'deploy-intro',
          type: 'paragraph',
          content: 'Our deployment process ensures reliable and consistent releases across all environments.',
        },
        {
          id: 'deploy-heading',
          type: 'heading1',
          content: 'Deployment Pipeline',
        },
        {
          id: 'pipeline-1',
          type: 'paragraph',
          content: '1. **Development** - Local development and testing',
        },
        {
          id: 'pipeline-2',
          type: 'paragraph',
          content: '2. **Staging** - Pre-production testing environment',
        },
        {
          id: 'pipeline-3',
          type: 'paragraph',
          content: '3. **Production** - Live environment with monitoring',
        }
      ]
    },
    
    // Content Tab Content
    'brand-voice': {
      title: 'Brand Voice',
      icon: <DesignIcon />,
      description: 'Brand voice and tone guidelines for consistent communication',
      content: [
        {
          id: 'voice-intro',
          type: 'paragraph',
          content: 'Our brand voice defines how we communicate with our audience and reflects our personality and values.',
        },
        {
          id: 'voice-heading',
          type: 'heading1',
          content: 'Voice Characteristics',
        },
        {
          id: 'voice-1',
          type: 'paragraph',
          content: '• **Professional** - Knowledgeable and trustworthy',
        },
        {
          id: 'voice-2',
          type: 'paragraph',
          content: '• **Approachable** - Friendly and accessible',
        },
        {
          id: 'voice-3',
          type: 'paragraph',
          content: '• **Clear** - Simple and easy to understand',
        },
        {
          id: 'voice-4',
          type: 'paragraph',
          content: '• **Inspiring** - Motivating and forward-thinking',
        }
      ]
    },
    'content-guidelines': {
      title: 'Content Guidelines',
      icon: <FileIcon />,
      description: 'Guidelines for creating consistent, high-quality content',
      content: [
        {
          id: 'content-intro',
          type: 'paragraph',
          content: 'Our content guidelines ensure all written materials maintain consistency and quality across all channels.',
        },
        {
          id: 'content-heading',
          type: 'heading1',
          content: 'Writing Guidelines',
        },
        {
          id: 'guideline-1',
          type: 'paragraph',
          content: '• Write in active voice whenever possible',
        },
        {
          id: 'guideline-2',
          type: 'paragraph',
          content: '• Use clear, concise language',
        },
        {
          id: 'guideline-3',
          type: 'paragraph',
          content: '• Maintain consistent terminology',
        }
      ]
    },
    'editorial-calendar': {
      title: 'Editorial Calendar',
      icon: <PageIcon />,
      description: 'Content planning and scheduling guidelines',
      content: [
        {
          id: 'calendar-intro',
          type: 'paragraph',
          content: 'Our editorial calendar helps plan, organize, and schedule content across all channels and platforms.',
        },
        {
          id: 'calendar-heading',
          type: 'heading1',
          content: 'Planning Process',
        },
        {
          id: 'planning-1',
          type: 'paragraph',
          content: '• Quarterly content strategy planning',
        },
        {
          id: 'planning-2',
          type: 'paragraph',
          content: '• Monthly editorial calendar review',
        },
        {
          id: 'planning-3',
          type: 'paragraph',
          content: '• Weekly content production schedule',
        }
      ]
    },
    'blog-posts': {
      title: 'Blog Posts',
      icon: <FlowIcon />,
      description: 'Guidelines for writing engaging blog content',
      content: [
        {
          id: 'blog-intro',
          type: 'paragraph',
          content: 'Blog posts are a key part of our content strategy, helping to educate, inform, and engage our audience.',
        },
        {
          id: 'blog-heading',
          type: 'heading1',
          content: 'Blog Writing Guidelines',
        },
        {
          id: 'blog-1',
          type: 'paragraph',
          content: '• Start with compelling headlines',
        },
        {
          id: 'blog-2',
          type: 'paragraph',
          content: '• Use subheadings to break up content',
        },
        {
          id: 'blog-3',
          type: 'paragraph',
          content: '• Include relevant images and examples',
        }
      ]
    },
    'social-media': {
      title: 'Social Media',
      icon: <ImageIcon />,
      description: 'Social media content guidelines and best practices',
      content: [
        {
          id: 'social-intro',
          type: 'paragraph',
          content: 'Social media content should be engaging, on-brand, and tailored to each platform\'s unique audience.',
        },
        {
          id: 'social-heading',
          type: 'heading1',
          content: 'Platform Guidelines',
        },
        {
          id: 'platform-1',
          type: 'paragraph',
          content: '• **LinkedIn** - Professional insights and company updates',
        },
        {
          id: 'platform-2',
          type: 'paragraph',
          content: '• **Twitter** - Quick updates and industry commentary',
        },
        {
          id: 'platform-3',
          type: 'paragraph',
          content: '• **Instagram** - Visual storytelling and behind-the-scenes',
        }
      ]
    },
    'marketing-copy': {
      title: 'Marketing Copy',
      icon: <SystemIcon />,
      description: 'Guidelines for persuasive marketing content',
      content: [
        {
          id: 'marketing-intro',
          type: 'paragraph',
          content: 'Marketing copy should be persuasive, benefit-focused, and aligned with our brand voice and values.',
        },
        {
          id: 'marketing-heading',
          type: 'heading1',
          content: 'Copy Principles',
        },
        {
          id: 'copy-1',
          type: 'paragraph',
          content: '• Focus on customer benefits, not just features',
        },
        {
          id: 'copy-2',
          type: 'paragraph',
          content: '• Use clear, action-oriented language',
        },
        {
          id: 'copy-3',
          type: 'paragraph',
          content: '• Include compelling calls-to-action',
        }
      ]
    },
    
    // Help Tab Content
    'overview': {
      title: 'Overview',
      icon: <DesignIcon />,
      description: 'General overview and introduction',
      content: [
        {
          id: 'overview-intro',
          type: 'paragraph',
          content: 'Welcome to our comprehensive documentation system. Here you\'ll find everything you need to get started.',
        },
        {
          id: 'overview-heading',
          type: 'heading1',
          content: 'Getting Started',
        },
        {
          id: 'overview-1',
        type: 'paragraph',
          content: 'Navigate through the sidebar to explore different sections and topics.',
        }
      ]
    },
    'getting-started': {
      title: 'Getting Started',
      icon: <FlowIcon />,
      description: 'Quick start guide and basic information',
      content: [
        {
          id: 'start-intro',
          type: 'paragraph',
          content: 'This guide will help you quickly get up to speed with our systems and processes.',
        },
        {
          id: 'start-heading',
          type: 'heading1',
          content: 'First Steps',
        },
        {
          id: 'step-1',
          type: 'paragraph',
          content: '1. Review the relevant documentation for your role',
        },
        {
          id: 'step-2',
          type: 'paragraph',
          content: '2. Set up your development environment',
        },
        {
          id: 'step-3',
        type: 'paragraph',
          content: '3. Connect with your team members',
        }
      ]
    }
  };

  const result = contentMap[menuId] || {
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
  
  return result;
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

  const handleContentChange = (_blocks: BlockData[]) => {
    // Here you could save the content to a backend or local storage
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