import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { PlusIcon, DragHandleIcon } from '../icons';
import TextFormatter from './TextFormatter';

export type BlockType =
  | 'paragraph'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'bulletList'
  | 'numberedList'
  | 'todoList'
  | 'toggleList'
  | 'page'
  | 'linkToPage'
  | 'callout'
  | 'quote'
  | 'codeBlock'
  | 'table'
  | 'image'
  | 'divider';

export interface BlockData {
  id: string;
  type: BlockType;
  content: string;
  completed?: boolean; // for todo items
  checked?: boolean; // for todo items
  level?: number; // for list nesting
}

interface BlockProps {
  block: BlockData;
  index: number;
  isSelected: boolean;
  onContentChange: (id: string, content: string) => void;
  onTypeChange: (id: string, type: BlockType) => void;
  onAddBlock: (afterId: string, type?: BlockType) => void;
  onDeleteBlock: (id: string) => void;
  onFocus: (id: string) => void;
  onKeyDown: (e: React.KeyboardEvent, id: string, index: number) => void;
  dragHandleListeners?: React.HTMLAttributes<HTMLElement>;
  dragHandleAttributes?: React.AriaAttributes & React.HTMLAttributes<HTMLElement>;
  onOpenSlashMenu?: (blockId: string) => void;
  isDragging?: boolean;
  showSlashMenu?: boolean;
  slashMenuOptions?: Array<{type: BlockType, label: string, description: string}>;
  onSlashMenuSelect?: (type: BlockType) => void;
}

export default function Block({
  block,
  index,
  isSelected,
  onContentChange,
  onTypeChange,
  onAddBlock,
  onFocus,
  onKeyDown,
  dragHandleListeners,
  dragHandleAttributes,
  onOpenSlashMenu,
  isDragging = false,
  showSlashMenu = false,
  slashMenuOptions = [],
  onSlashMenuSelect
}: BlockProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showFormatToolbar, setShowFormatToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [dropPosition, setDropPosition] = useState<null | 'before' | 'after'>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const slashMenuRef = useRef<HTMLDivElement>(null);

  // Ensure toolbar appears reliably on mouse or keyboard selection
  useEffect(() => {
    const isInside = (node: Node | null, container: HTMLElement | null) => {
      if (!node || !container) return false;
      let n: Node | null = node;
      while (n) {
        if (n === container) return true;
        n = (n as HTMLElement).parentNode;
      }
      return false;
    };

    const updateFromSelection = () => {
      if (!isSelected) { setShowFormatToolbar(false); return; }
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) { setShowFormatToolbar(false); return; }
      const range = sel.getRangeAt(0);
      if (sel.toString().length === 0 || range.collapsed) { setShowFormatToolbar(false); return; }
      // Only show when selection is within this block's content
      const anchorIn = isInside(sel.anchorNode, contentRef.current);
      const focusIn = isInside(sel.focusNode, contentRef.current);
      if (!anchorIn || !focusIn) { setShowFormatToolbar(false); return; }
      const rect = range.getBoundingClientRect();
      setToolbarPosition({ x: rect.left + rect.width / 2, y: rect.top + window.scrollY });
      setShowFormatToolbar(true);
    };

    document.addEventListener('selectionchange', updateFromSelection);
    return () => document.removeEventListener('selectionchange', updateFromSelection);
  }, [isSelected]);

  // Keep DOM text in sync without letting React control text nodes
  useEffect(() => {
    if (!contentRef.current) return;
    const el = contentRef.current;
    // Only update when different to avoid resetting caret
    if ((el.textContent || '') !== (block.content || '')) {
      el.textContent = block.content || '';
    }
  }, [block.content, block.id, block.type]);

  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.textContent || '';
    onContentChange(block.id, content);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle markdown shortcuts
    if (e.key === ' ') {
      const content = contentRef.current?.textContent || '';
      
      // Heading shortcuts
      if (content === '#') {
        e.preventDefault();
        onTypeChange(block.id, 'heading1');
        onContentChange(block.id, '');
        return;
      }
      if (content === '##') {
        e.preventDefault();
        onTypeChange(block.id, 'heading2');
        onContentChange(block.id, '');
        return;
      }
      if (content === '###') {
        e.preventDefault();
        onTypeChange(block.id, 'heading3');
        onContentChange(block.id, '');
        return;
      }
      
      // List shortcuts
      if (content === '-' || content === '*') {
        e.preventDefault();
        onTypeChange(block.id, 'bulletList');
        onContentChange(block.id, '');
        return;
      }
      if (content === '1.') {
        e.preventDefault();
        onTypeChange(block.id, 'numberedList');
        onContentChange(block.id, '');
        return;
      }
      if (content === '[]') {
        e.preventDefault();
        onTypeChange(block.id, 'todoList');
        onContentChange(block.id, '');
        return;
      }
      if (content === '>') {
        e.preventDefault();
        onTypeChange(block.id, 'quote');
        onContentChange(block.id, '');
        return;
      }
      if (content === '---') {
        e.preventDefault();
        onTypeChange(block.id, 'divider');
        onContentChange(block.id, '');
        return;
      }
    }

    onKeyDown(e, block.id, index);
  };

  const handleKeyUp = () => {
    // Trigger selection handler when using Shift+Arrow selections
    const sel = window.getSelection();
    if (!sel) return;
    requestAnimationFrame(() => {
      if (!isSelected) return;
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      const range = selection.getRangeAt(0);
      if (selection.toString().length === 0 || range.collapsed) return;
      const rect = range.getBoundingClientRect();
      setToolbarPosition({ x: rect.left + rect.width / 2, y: rect.top + window.scrollY });
      setShowFormatToolbar(true);
    });
  };

  const handleFocus = () => {
    onFocus(block.id);
  };

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection) { setShowFormatToolbar(false); return; }
    requestAnimationFrame(() => {
      if (!isSelected) { setShowFormatToolbar(false); return; }
      const sel = window.getSelection();
      if (!sel) { setShowFormatToolbar(false); return; }
      if (sel.rangeCount === 0) { setShowFormatToolbar(false); return; }
      const range = sel.getRangeAt(0);
      if (sel.toString().length === 0 || range.collapsed) {
        setShowFormatToolbar(false);
        return;
      }
      const rect = range.getBoundingClientRect();
      setToolbarPosition({ x: rect.left + rect.width / 2, y: rect.top + window.scrollY });
      setShowFormatToolbar(true);
    });
  };

  const handleMouseDown = () => {
    // While user is adjusting selection, hide toolbar
    setShowFormatToolbar(false);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Update block's checked state
    // This would need to be implemented in the parent component
    console.log('Checkbox toggled:', e.target.checked);
  };

  const renderContent = () => {
    const PLACEHOLDER_BY_TYPE: Record<BlockType, string | null> = {
      paragraph: 'Write what you want to write today...',
      heading1: 'Heading 1',
      heading2: 'Heading 2',
      heading3: 'Heading 3',
      bulletList: 'Bulleted list',
      numberedList: 'Numbered list',
      todoList: 'To-do list',
      toggleList: 'Toggle list',
      page: 'Page',
      linkToPage: 'Link to page',
      callout: 'Callout',
      quote: 'Quote',
      codeBlock: 'Code',
      table: 'Table',
      image: null,
      divider: null,
    };

    const getPlaceholder = () => {
      if (block.content !== '') return undefined;
      const ph = PLACEHOLDER_BY_TYPE[block.type];
      return ph ?? undefined;
    };

    const commonProps = {
      ref: contentRef,
      contentEditable: true,
      suppressContentEditableWarning: true,
      onInput: handleContentChange,
      onKeyDown: handleKeyDown,
      onKeyUp: handleKeyUp,
      onFocus: handleFocus,
      onMouseUp: handleMouseUp,
      onMouseDown: handleMouseDown,
      className: `outline-none min-h-[1.5rem] focus:outline-none`,
      'data-placeholder': getPlaceholder(),
      'data-empty': block.content === '' ? 'true' : 'false'
    } as const;

    switch (block.type) {
      case 'heading1':
        return (
          <h1 {...commonProps} className={`${commonProps.className} text-[28px] leading-[1.2] font-bold text-neutral-50 text-left`} />
        );
      case 'heading2':
        return (
          <h2 {...commonProps} className={`${commonProps.className} text-[24px] leading-[1.25] font-semibold text-neutral-50 text-left`} />
        );
      case 'heading3':
        return (
          <h3 {...commonProps} className={`${commonProps.className} text-[20px] leading-[1.3] font-medium text-neutral-50 text-left`} />
        );
      case 'bulletList':
        return (
          <div className="flex items-start text-left">
            <span className="text-neutral-400 mr-1 mt-0.5 text-base leading-6 flex-shrink-0">•</span>
            <div {...commonProps} className={`${commonProps.className} flex-1 text-neutral-200 text-left`} />
          </div>
        );
      case 'numberedList':
        return (
          <div className="flex items-start text-left">
            <span className="text-neutral-400 mr-1 mt-0.5 text-base leading-6 flex-shrink-0">1.</span>
            <div {...commonProps} className={`${commonProps.className} flex-1 text-neutral-200 text-left`} />
          </div>
        );
      case 'todoList':
        return (
          <div className="flex items-start text-left">
            <input
              type="checkbox"
              checked={block.checked || false}
              onChange={handleCheckboxChange}
              className="mt-1.5 mr-1 rounded flex-shrink-0"
            />
            <div {...commonProps} className={`${commonProps.className} flex-1 text-neutral-200 text-left ${block.checked ? 'line-through text-neutral-500' : ''}`} />
          </div>
        );
      case 'quote':
        return (
          <blockquote className="border-l-4 border-neutral-600 pl-4 text-left">
            <div {...commonProps} className={`${commonProps.className} text-neutral-300 italic text-left`} />
          </blockquote>
        );
      case 'callout':
        return (
          <div className="rounded-md bg-neutral-800/60 border border-neutral-700 p-3 text-left">
            <div {...commonProps} className={`${commonProps.className} text-neutral-200 text-left`} />
          </div>
        );
      case 'toggleList':
        return (
          <div className="flex items-start text-left">
            <span className="text-neutral-400 mr-1 mt-0.5 text-base leading-6 flex-shrink-0">▸</span>
            <div {...commonProps} className={`${commonProps.className} flex-1 text-neutral-200 text-left`} />
          </div>
        );
      case 'page':
      case 'linkToPage':
        return (
          <div {...commonProps} className={`${commonProps.className} text-neutral-200 text-left`} />
        );
      case 'codeBlock':
        return (
          <div className="rounded-md bg-neutral-800/60 border border-neutral-700 p-3 text-left font-mono text-sm">
            <div {...commonProps} className={`${commonProps.className} text-neutral-200 text-left`} />
          </div>
        );
      case 'table':
        return (
          <div className="rounded-md border border-neutral-700 p-2 text-left">
            <div {...commonProps} className={`${commonProps.className} text-neutral-200 text-left`} />
          </div>
        );
      case 'divider':
        return <hr className="border-neutral-700 my-4" />;
      default:
        return (
          <div {...commonProps} className={`${commonProps.className} text-neutral-200 text-left`} />
        );
    }
  };

  const handleAddBlock = () => {
    onAddBlock(block.id);
  };

  const handleSlashMenuClick = (type: BlockType) => {
    onSlashMenuSelect?.(type);
  };

  return (
    <div
      className={`group relative py-1 transition-opacity duration-200 opacity-100`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDragOver={(e) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const isAfter = e.clientY > rect.top + rect.height / 2;
        setDropPosition(isAfter ? 'after' : 'before');
      }}
      onDragEnter={(e) => e.preventDefault()}
      onDragLeave={() => setDropPosition(null)}
    >
      {/* Extended Hover Area - Invisible extension to the left */}
      <div
        className="absolute left-[-80px] top-0 bottom-0 w-[80px] pointer-events-auto cursor-grab active:cursor-grabbing"
        {...dragHandleAttributes}
        {...dragHandleListeners}
        title="Drag to move"
      />

      {/* Action Controls - Show when block is selected or hovered */}
      {(isSelected || isHovered) && !isDragging && (
        <div
          className={`absolute left-[-44px] top-1 flex items-center space-x-1 transition-opacity duration-200 ${
            isSelected ? 'opacity-100' : 'opacity-70'
          }`}
        >
          {/* Add Block Button */}
          <button
            onClick={() => (onOpenSlashMenu ? onOpenSlashMenu(block.id) : handleAddBlock())}
            className="p-1 rounded hover:bg-neutral-700 text-neutral-400 hover:text-neutral-200 transition-colors duration-200"
            title="Add block"
          >
            <PlusIcon />
          </button>

          {/* Drag Handle */}
          <div
            className="p-1 rounded hover:bg-neutral-700 text-neutral-400 hover:text-neutral-200 transition-colors duration-200 cursor-grab active:cursor-grabbing"
            {...dragHandleAttributes}
            {...dragHandleListeners}
            title="Drag to move"
          >
            <DragHandleIcon />
          </div>
        </div>
      )}

      {/* Block Content */}
      <div className="min-h-[1.5rem] relative" draggable={false}>
        {renderContent()}
        {/* Drop indicator line (before/after) */}
        {dropPosition && (
          <div
            className={`absolute left-0 right-0 h-[2px] bg-[#359aba] rounded ${
              dropPosition === 'before' ? 'top-0' : 'bottom-0'
            }`}
          />
        )}

        {/* Placeholder styling */}
        <style jsx>{`
          /* Fallback: when DOM truly empty */
          [contenteditable][data-placeholder] { position: relative; }
          [data-placeholder]:empty::before {
            content: attr(data-placeholder);
            color: #6b7280;
            pointer-events: none;
            position: absolute;
            left: 0;
            top: 0;
            white-space: pre-wrap;
          }
          /* Robust: when browser inserts <br/> in contenteditable (not empty) */
          [data-placeholder][data-empty="true"]::before {
            content: attr(data-placeholder);
            color: #6b7280;
            pointer-events: none;
            position: absolute;
            left: 0;
            top: 0;
            white-space: pre-wrap;
          }
        `}</style>
      </div>

      {/* Slash Menu - Using Portal to prevent stacking context issues */}
      {showSlashMenu && typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={slashMenuRef}
            data-slash-menu
            className="fixed bg-neutral-800 border border-neutral-700 rounded-md shadow-lg min-w-[300px] max-h-[300px] overflow-y-auto"
            style={{
              zIndex: 999999,
              position: 'fixed',
              left: contentRef.current ? contentRef.current.getBoundingClientRect().left : 0,
              top: contentRef.current ? contentRef.current.getBoundingClientRect().bottom + 4 : 0,
            }}
          >
            {slashMenuOptions.map((option) => (
              <button
                key={option.type}
                onClick={() => handleSlashMenuClick(option.type)}
                className="w-full flex items-start px-3 py-2 text-left hover:bg-neutral-700 transition-colors duration-200"
              >
                <div>
                  <div className="text-sm text-neutral-200 font-medium">{option.label}</div>
                  <div className="text-xs text-neutral-400">{option.description}</div>
                </div>
              </button>
            ))}
          </div>,
          document.body
        )}

      {/* Text Formatting Toolbar */}
      <TextFormatter
        show={showFormatToolbar}
        position={toolbarPosition}
        onClose={() => setShowFormatToolbar(false)}
        onTurnInto={(type) => onTypeChange(block.id, type)}
        currentType={block.type}
      />
    </div>
  );
}