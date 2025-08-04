import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  { type: 'quote' as BlockType, label: 'Quote', description: 'Capture a quote.' },
  { type: 'divider' as BlockType, label: 'Divider', description: 'Visually divide blocks.' },
  { type: 'image' as BlockType, label: 'Image', description: 'Upload or embed with a link.' },
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
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [slashMenuState, setSlashMenuState] = useState<{
    blockId: string | null;
    query: string;
    isVisible: boolean;
  }>({
    blockId: null,
    query: '',
    isVisible: false,
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
    
    // Handle slash command detection
    if (content.endsWith('/')) {
      setSlashMenuState({
        blockId,
        query: '',
        isVisible: true,
      });
    } else if (content.includes('/') && slashMenuState.isVisible && slashMenuState.blockId === blockId) {
      const slashIndex = content.lastIndexOf('/');
      const query = content.substring(slashIndex + 1);
      setSlashMenuState(prev => ({
        ...prev,
        query,
      }));
    } else if (slashMenuState.isVisible && slashMenuState.blockId === blockId && !content.includes('/')) {
      setSlashMenuState({
        blockId: null,
        query: '',
        isVisible: false,
      });
    }
    
    updateBlocks(newBlocks);
  }, [blocks, slashMenuState, updateBlocks]);

  const handleTypeChange = useCallback((blockId: string, type: BlockType) => {
    const newBlocks = blocks.map(block =>
      block.id === blockId ? { ...block, type } : block
    );
    updateBlocks(newBlocks);
    
    // Close slash menu when type changes
    setSlashMenuState({
      blockId: null,
      query: '',
      isVisible: false,
    });
  }, [blocks, updateBlocks]);

  const handleAddBlock = useCallback((afterId: string, type: BlockType = 'paragraph') => {
    const afterIndex = blocks.findIndex(block => block.id === afterId);
    const newBlock: BlockData = {
      id: generateId(),
      type,
      content: '',
    };
    
    const newBlocks = [
      ...blocks.slice(0, afterIndex + 1),
      newBlock,
      ...blocks.slice(afterIndex + 1),
    ];
    
    updateBlocks(newBlocks);
    
    // Focus the new block
    setTimeout(() => {
      setSelectedBlockId(newBlock.id);
    }, 0);
  }, [blocks, updateBlocks]);

  const handleDeleteBlock = useCallback((blockId: string) => {
    if (blocks.length <= 1) return; // Don't delete the last block
    
    const newBlocks = blocks.filter(block => block.id !== blockId);
    updateBlocks(newBlocks);
    
    // Focus previous block if available
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

    // Handle Enter key
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      
      // If current block is empty and not a paragraph, convert to paragraph
      if (block.content === '' && block.type !== 'paragraph') {
        handleTypeChange(blockId, 'paragraph');
        return;
      }
      
      // Add new block
      handleAddBlock(blockId);
      return;
    }

    // Handle Backspace at the beginning of a block
    if (e.key === 'Backspace') {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (range.startOffset === 0 && range.endOffset === 0) {
          e.preventDefault();
          
          if (block.content === '' && index > 0) {
            // Delete empty block
            handleDeleteBlock(blockId);
          } else if (index > 0 && block.content === '') {
            // Convert block type to paragraph if it's empty
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

    // Handle Arrow Up/Down navigation
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

    // Handle Escape to close slash menu
    if (e.key === 'Escape' && slashMenuState.isVisible) {
      setSlashMenuState({
        blockId: null,
        query: '',
        isVisible: false,
      });
      return;
    }
  }, [blocks, slashMenuState, handleTypeChange, handleAddBlock, handleDeleteBlock]);

  const handleDragStart = useCallback((e: React.DragEvent, blockId: string) => {
    setDraggedBlockId(blockId);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    
    if (!draggedBlockId || draggedBlockId === targetId) {
      setDraggedBlockId(null);
      return;
    }

    const draggedIndex = blocks.findIndex(block => block.id === draggedBlockId);
    const targetIndex = blocks.findIndex(block => block.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedBlockId(null);
      return;
    }

    const newBlocks = [...blocks];
    const [draggedBlock] = newBlocks.splice(draggedIndex, 1);
    newBlocks.splice(targetIndex, 0, draggedBlock);
    
    updateBlocks(newBlocks);
    setDraggedBlockId(null);
  }, [blocks, draggedBlockId, updateBlocks]);

  const handleSlashMenuSelect = useCallback((type: BlockType) => {
    if (!slashMenuState.blockId) return;
    
    const block = blocks.find(b => b.id === slashMenuState.blockId);
    if (!block) return;
    
    // Remove the slash command from content
    const content = block.content;
    const slashIndex = content.lastIndexOf('/');
    const newContent = content.substring(0, slashIndex);
    
    // Update block type and content
    const newBlocks = blocks.map(b =>
      b.id === slashMenuState.blockId
        ? { ...b, type, content: newContent }
        : b
    );
    
    updateBlocks(newBlocks);
    
    // Close slash menu
    setSlashMenuState({
      blockId: null,
      query: '',
      isVisible: false,
    });
  }, [blocks, slashMenuState, updateBlocks]);

  const getFilteredSlashOptions = () => {
    if (!slashMenuState.query) return SLASH_MENU_OPTIONS;
    
    const query = slashMenuState.query.toLowerCase();
    return SLASH_MENU_OPTIONS.filter(option =>
      option.label.toLowerCase().includes(query) ||
      option.description.toLowerCase().includes(query)
    );
  };

  // Focus management
  useEffect(() => {
    if (selectedBlockId) {
      const blockElement = document.querySelector(`[data-block-id="${selectedBlockId}"]`);
      if (blockElement) {
        const editableElement = blockElement.querySelector('[contenteditable="true"]') as HTMLElement;
        if (editableElement) {
          editableElement.focus();
        }
      }
    }
  }, [selectedBlockId]);

  return (
    <div
      ref={editorRef}
      className="max-w-4xl mx-auto px-8 py-8 min-h-screen text-left"
      onClick={(e) => {
        // Close slash menu when clicking outside
        if (slashMenuState.isVisible) {
          const target = e.target as HTMLElement;
          if (!target.closest('[data-slash-menu]')) {
            setSlashMenuState({
              blockId: null,
              query: '',
              isVisible: false,
            });
          }
        }
      }}
    >
      {blocks.map((block, index) => (
        <div key={block.id} data-block-id={block.id}>
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
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            isDragging={draggedBlockId === block.id}
            showSlashMenu={slashMenuState.isVisible && slashMenuState.blockId === block.id}
            slashMenuOptions={getFilteredSlashOptions()}
            onSlashMenuSelect={handleSlashMenuSelect}
          />
        </div>
      ))}
    </div>
  );
} 