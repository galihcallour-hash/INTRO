import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Block, { BlockData, BlockType } from './Block';

interface EditorProps {
  initialContent?: BlockData[];
  onContentChange?: (blocks: BlockData[]) => void;
}

function generateId() {
  return `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

const SLASH_MENU_OPTIONS = [
  { type: 'paragraph' as BlockType, label: 'Text', description: 'Just start writing with plain text.' },
  { type: 'heading1' as BlockType, label: 'Heading 1', description: 'Big section heading.' },
  { type: 'heading2' as BlockType, label: 'Heading 2', description: 'Medium section heading.' },
  { type: 'heading3' as BlockType, label: 'Heading 3', description: 'Small section heading.' },
  { type: 'bulletList' as BlockType, label: 'Bulleted list', description: 'Create a simple bulleted list.' },
  { type: 'numberedList' as BlockType, label: 'Numbered list', description: 'Create a list with numbering.' },
  { type: 'todoList' as BlockType, label: 'To-do list', description: 'Track tasks with a to-do list.' },
  { type: 'toggleList' as BlockType, label: 'Toggle list', description: 'Togglable list of items.' },
  { type: 'page' as BlockType, label: 'Page', description: 'Create a sub-page.' },
  { type: 'callout' as BlockType, label: 'Callout', description: 'Make writing stand out.' },
  { type: 'quote' as BlockType, label: 'Quote', description: 'Capture a quote.' },
  { type: 'table' as BlockType, label: 'Table', description: 'Add a simple table.' },
  { type: 'divider' as BlockType, label: 'Divider', description: 'Visually divide blocks.' },
  { type: 'linkToPage' as BlockType, label: 'Link to page', description: 'Link to an existing page.' },
];

export default function Editor({ initialContent, onContentChange }: EditorProps) {
  const [blocks, setBlocks] = useState<BlockData[]>(
    initialContent || [
      {
        id: generateId(),
        type: 'paragraph',
        content: '',
      },
    ]
  );
  
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  // dnd-kit handles drag state internally; no local dragged id needed
  const [slashMenuState, setSlashMenuState] = useState<{
    blockId: string | null;
    query: string;
    isVisible: boolean;
    fromPlus?: boolean;
  }>({
    blockId: null,
    query: '',
    isVisible: false,
    fromPlus: false,
  });

  const editorRef = useRef<HTMLDivElement>(null);

  const updateBlocks = useCallback((newBlocks: BlockData[]) => {
    setBlocks(newBlocks);
    onContentChange?.(newBlocks);
  }, [onContentChange]);

  const handleContentChange = useCallback((blockId: string, content: string) => {
    const newBlocks = blocks.map(block =>
      block.id === blockId ? { ...block, content } : block
    );
    
    // Handle slash command detection (from typing)
    if (content.endsWith('/')) {
      setSlashMenuState({ blockId, query: '', isVisible: true, fromPlus: false });
    } else if (content.includes('/') && slashMenuState.isVisible && slashMenuState.blockId === blockId) {
      const slashIndex = content.lastIndexOf('/');
      const query = content.substring(slashIndex + 1);
      setSlashMenuState(prev => ({ ...prev, query }));
    } else if (slashMenuState.isVisible && slashMenuState.blockId === blockId && !content.includes('/')) {
      setSlashMenuState({ blockId: null, query: '', isVisible: false, fromPlus: false });
    }
    
    updateBlocks(newBlocks);
  }, [blocks, slashMenuState, updateBlocks]);

  const handleTypeChange = useCallback((blockId: string, type: BlockType) => {
    const newBlocks = blocks.map(block =>
      block.id === blockId ? { ...block, type } : block
    );
    updateBlocks(newBlocks);
    
    setSlashMenuState({ blockId: null, query: '', isVisible: false, fromPlus: false });
  }, [blocks, updateBlocks]);

  const handleAddBlock = useCallback((afterId: string, type: BlockType = 'paragraph') => {
    const afterIndex = blocks.findIndex(block => block.id === afterId);
    const newBlock: BlockData = { id: generateId(), type, content: '' };
    const newBlocks = [
      ...blocks.slice(0, afterIndex + 1),
      newBlock,
      ...blocks.slice(afterIndex + 1),
    ];
    updateBlocks(newBlocks);
    setTimeout(() => setSelectedBlockId(newBlock.id), 0);
    return newBlock.id;
  }, [blocks, updateBlocks]);

  const handleDeleteBlock = useCallback((blockId: string) => {
    if (blocks.length <= 1) return; // Don't delete the last block
    const newBlocks = blocks.filter(block => block.id !== blockId);
    updateBlocks(newBlocks);
    const deletedIndex = blocks.findIndex(block => block.id === blockId);
    if (deletedIndex > 0) {
      setSelectedBlockId(blocks[deletedIndex - 1].id);
    } else if (newBlocks.length > 0) {
      setSelectedBlockId(newBlocks[0].id);
    }
  }, [blocks, updateBlocks]);

  const handleBlockFocus = useCallback((blockId: string) => {
    setSelectedBlockId(blockId);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, blockId: string, index: number) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (block.content === '' && block.type !== 'paragraph') {
        handleTypeChange(blockId, 'paragraph');
        return;
      }
      handleAddBlock(blockId);
      return;
    }

    if (e.key === 'Backspace') {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (range.startOffset === 0 && range.endOffset === 0) {
          e.preventDefault();
          if (block.content === '' && index > 0) {
            handleDeleteBlock(blockId);
          } else if (index > 0 && block.content === '') {
            if (block.type !== 'paragraph') {
              handleTypeChange(blockId, 'paragraph');
            } else {
              handleDeleteBlock(blockId);
            }
          }
          return;
        }
      }
    }

    if (e.key === 'ArrowUp' && index > 0) {
      e.preventDefault();
      setSelectedBlockId(blocks[index - 1].id);
      return;
    }
    if (e.key === 'ArrowDown' && index < blocks.length - 1) {
      e.preventDefault();
      setSelectedBlockId(blocks[index + 1].id);
      return;
    }

    if (e.key === 'Escape' && slashMenuState.isVisible) {
      setSlashMenuState({ blockId: null, query: '', isVisible: false, fromPlus: false });
      return;
    }
  }, [blocks, slashMenuState, handleTypeChange, handleAddBlock, handleDeleteBlock]);

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  const handleDragEndDnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = blocks.findIndex(b => b.id === String(active.id));
    const newIndex = blocks.findIndex(b => b.id === String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;
    const newBlocks = arrayMove(blocks, oldIndex, newIndex);
    updateBlocks(newBlocks);
    setSelectedBlockId(String(active.id));
  }, [blocks, updateBlocks]);

  const getFilteredSlashOptions = () => {
    if (!slashMenuState.query) return SLASH_MENU_OPTIONS;
    const query = slashMenuState.query.toLowerCase();
    return SLASH_MENU_OPTIONS.filter(option =>
      option.label.toLowerCase().includes(query) || option.description.toLowerCase().includes(query)
    );
  };

  // Open slash menu from + action
  const openSlashMenuFromPlus = useCallback((blockId: string) => {
    setSlashMenuState({ blockId, query: '', isVisible: true, fromPlus: true });
  }, []);

  // Handle selecting from slash menu
  const handleSlashMenuSelect = useCallback((type: BlockType) => {
    if (!slashMenuState.blockId) return;
    const block = blocks.find(b => b.id === slashMenuState.blockId);
    if (!block) return;
    
    if (slashMenuState.fromPlus) {
      // Insert new block of selected type below current
      const newId = handleAddBlock(block.id, type);
      setSlashMenuState({ blockId: null, query: '', isVisible: false, fromPlus: false });
      setSelectedBlockId(newId);
      return;
    }

    // From typing '/': convert current block type and remove the slash query, if any
    const content = block.content;
    const slashIndex = content.lastIndexOf('/');
    const newContent = slashIndex >= 0 ? content.substring(0, slashIndex) : content;
    const newBlocks = blocks.map(b =>
      b.id === slashMenuState.blockId ? { ...b, type, content: newContent } : b
    );
    updateBlocks(newBlocks);
    setSlashMenuState({ blockId: null, query: '', isVisible: false, fromPlus: false });
  }, [blocks, slashMenuState, handleAddBlock, updateBlocks]);

  // Focus management
  useEffect(() => {
    if (selectedBlockId) {
      const blockElement = document.querySelector(`[data-block-id="${selectedBlockId}"]`);
      if (blockElement) {
        const editableElement = blockElement.querySelector('[contenteditable="true"]') as HTMLElement;
        if (editableElement) {
          editableElement.focus();

          // Move caret to the end using Range/Selection API (more reliable across browsers)
          setTimeout(() => {
            const selection = window.getSelection();
            if (!selection) return;
            const range = document.createRange();
            range.selectNodeContents(editableElement);
            range.collapse(false); // place caret at end
            selection.removeAllRanges();
            selection.addRange(range);
          }, 0);
        }
      }
    }
  }, [selectedBlockId]);

  return (
    <div
      ref={editorRef}
      className="max-w-4xl mx-auto py-2 min-h-screen text-left"
      onClick={(e) => {
        // Close slash menu when clicking outside
        if (slashMenuState.isVisible) {
          const target = e.target as HTMLElement;
          if (!target.closest('[data-slash-menu]')) {
            setSlashMenuState({ blockId: null, query: '', isVisible: false, fromPlus: false });
          }
        }
      }}
    >
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndDnd}>
        <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
      {blocks.map((block, index) => (
            <SortableItem key={block.id} id={block.id}>
              {(dragHandleProps) => (
                <div data-block-id={block.id}>
          <Block
            block={block}
            index={index}
            isSelected={selectedBlockId === block.id}
            onContentChange={handleContentChange}
            onTypeChange={handleTypeChange}
            onAddBlock={handleAddBlock}
            onDeleteBlock={handleDeleteBlock}
            onFocus={handleBlockFocus}
            onKeyDown={handleKeyDown}
                    dragHandleListeners={dragHandleProps.listeners}
                    dragHandleAttributes={dragHandleProps.attributes}
                    onOpenSlashMenu={openSlashMenuFromPlus}
            showSlashMenu={slashMenuState.isVisible && slashMenuState.blockId === block.id}
            slashMenuOptions={getFilteredSlashOptions()}
            onSlashMenuSelect={handleSlashMenuSelect}
          />
        </div>
              )}
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}

// Sortable wrapper to provide drag handle props and item transform
function SortableItem({ id, children }: { id: string; children: (props: { listeners?: React.HTMLAttributes<HTMLElement>; attributes?: React.AriaAttributes & React.HTMLAttributes<HTMLElement> }) => React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition } as React.CSSProperties;
  return (
    <div ref={setNodeRef} style={style}>
      {children({ listeners, attributes })}
    </div>
  );
} 