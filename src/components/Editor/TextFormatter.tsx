import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface TextFormatterProps {
  show: boolean;
  onClose: () => void;
  position?: { x: number; y: number };
}

export default function TextFormatter({ show, onClose, position }: TextFormatterProps) {
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (show && toolbarRef.current && position) {
      const toolbar = toolbarRef.current;
      toolbar.style.left = `${position.x}px`;
      toolbar.style.top = `${position.y - 50}px`;
    }
  }, [show, position]);

  const applyFormat = (format: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedContent = range.extractContents();
    
    let wrapper: HTMLElement;
    
    switch (format) {
      case 'bold':
        wrapper = document.createElement('strong');
        wrapper.style.fontWeight = 'bold';
        break;
      case 'italic':
        wrapper = document.createElement('em');
        wrapper.style.fontStyle = 'italic';
        break;
      case 'code':
        wrapper = document.createElement('code');
        wrapper.style.backgroundColor = '#374151';
        wrapper.style.color = '#f9fafb';
        wrapper.style.padding = '0.125rem 0.25rem';
        wrapper.style.borderRadius = '0.25rem';
        wrapper.style.fontSize = '0.875em';
        wrapper.style.fontFamily = 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace';
        break;
      case 'link':
        const url = prompt('Enter URL:');
        if (!url) return;
        wrapper = document.createElement('a');
        (wrapper as HTMLAnchorElement).href = url;
        wrapper.style.color = '#3b82f6';
        wrapper.style.textDecoration = 'underline';
        break;
      default:
        return;
    }
    
    wrapper.appendChild(selectedContent);
    range.insertNode(wrapper);
    
    // Clear selection
    selection.removeAllRanges();
    onClose();
  };

  if (!show) return null;

  const toolbarContent = (
    <div
      ref={toolbarRef}
      className="fixed bg-neutral-800 border border-neutral-700 rounded-md shadow-lg flex items-center px-2 py-1 space-x-1"
      style={{
        zIndex: 999999,
        position: 'fixed',
        left: position ? `${position.x}px` : '0px',
        top: position ? `${position.y - 50}px` : '0px',
      }}
    >
      <button
        onClick={() => applyFormat('bold')}
        className="px-2 py-1 text-xs rounded hover:bg-neutral-700 text-neutral-200 font-bold"
        title="Bold"
      >
        B
      </button>
      <button
        onClick={() => applyFormat('italic')}
        className="px-2 py-1 text-xs rounded hover:bg-neutral-700 text-neutral-200 italic"
        title="Italic"
      >
        I
      </button>
      <button
        onClick={() => applyFormat('code')}
        className="px-2 py-1 text-xs rounded hover:bg-neutral-700 text-neutral-200 font-mono"
        title="Code"
      >
        Code
      </button>
      <button
        onClick={() => applyFormat('link')}
        className="px-2 py-1 text-xs rounded hover:bg-neutral-700 text-neutral-200"
        title="Link"
      >
        Link
      </button>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(toolbarContent, document.body) : null;
} 