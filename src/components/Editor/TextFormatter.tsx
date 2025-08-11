import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { BlockType } from './Block';

interface TextFormatterProps {
  show: boolean;
  onClose: () => void;
  position?: { x: number; y: number };
  onTurnInto?: (type: BlockType) => void;
  currentType?: BlockType;
}

export default function TextFormatter({ show, onClose, position, onTurnInto, currentType = 'paragraph' }: TextFormatterProps) {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [typeAnchor, setTypeAnchor] = useState<{ left: number; top: number } | null>(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrike, setIsStrike] = useState(false);
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const colorDropdownRef = useRef<HTMLDivElement>(null);
  const [colorAnchor, setColorAnchor] = useState<{ left: number; top: number } | null>(null);
  const [recentTextColors, setRecentTextColors] = useState<string[]>([]);
  const [recentBgColors, setRecentBgColors] = useState<string[]>([]);
  const [currentTextHex, setCurrentTextHex] = useState<string>('');
  const [currentBgHex, setCurrentBgHex] = useState<string>('');
  const [defaultBgHex, setDefaultBgHex] = useState<string>('#000000');

  useEffect(() => {
    if (show && toolbarRef.current && position) {
      const toolbar = toolbarRef.current;
      toolbar.style.left = `${position.x}px`;
      toolbar.style.top = `${position.y - 56}px`;
    }
  }, [show, position]);

  const recomputeActive = () => {
    try {
      setIsBold(document.queryCommandState('bold'));
      setIsItalic(document.queryCommandState('italic'));
      setIsUnderline(document.queryCommandState('underline'));
      setIsStrike(document.queryCommandState('strikeThrough'));
    } catch {}
  };

  useEffect(() => {
    if (!show) return;
    recomputeActive();
    const onSel = () => recomputeActive();
    document.addEventListener('selectionchange', onSel);
    return () => document.removeEventListener('selectionchange', onSel);
  }, [show]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (showTypeDropdown && dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowTypeDropdown(false);
      }
    };
    if (showTypeDropdown) {
      document.addEventListener('mousedown', onDoc);
      return () => document.removeEventListener('mousedown', onDoc);
    }
  }, [showTypeDropdown]);

  // Close color dropdown on outside click
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (showColorDropdown && colorDropdownRef.current && !colorDropdownRef.current.contains(e.target as Node)) {
        setShowColorDropdown(false);
      }
    };
    if (showColorDropdown) {
      document.addEventListener('mousedown', onDoc);
      return () => document.removeEventListener('mousedown', onDoc);
    }
  }, [showColorDropdown]);

  const wrapSelection = (wrapperFactory: () => HTMLElement) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    if (range.collapsed) return;
    const selectedContent = range.extractContents();
    const wrapper = wrapperFactory();
    wrapper.appendChild(selectedContent);
    range.insertNode(wrapper);
    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(wrapper);
    selection.addRange(newRange);
    recomputeActive();
  };

  const rgbToHex = (rgb: string): string => {
    // rgb(a) to hex converter
    const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d\.]+))?\)/i);
    if (!m) return rgb;
    const r = parseInt(m[1], 10), g = parseInt(m[2], 10), b = parseInt(m[3], 10);
    const toHex = (n: number) => n.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  useEffect(() => {
    // capture default background from body/html
    const bg = getComputedStyle(document.body).backgroundColor || getComputedStyle(document.documentElement).backgroundColor;
    setDefaultBgHex(rgbToHex(bg));
  }, []);

  useEffect(() => {
    if (!show) return;
    const updateCurrentColors = () => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const node = (sel.anchorNode?.nodeType === 3 ? sel.anchorNode?.parentElement : sel.anchorNode as HTMLElement) as HTMLElement | null;
      if (!node) return;
      const cs = getComputedStyle(node);
      setCurrentTextHex(rgbToHex(cs.color));
      const bg = cs.backgroundColor;
      setCurrentBgHex(bg === 'rgba(0, 0, 0, 0)' ? defaultBgHex : rgbToHex(bg));
    };
    updateCurrentColors();
    document.addEventListener('selectionchange', updateCurrentColors);
    return () => document.removeEventListener('selectionchange', updateCurrentColors);
  }, [show, defaultBgHex]);

  const findAncestorTag = (tagName: string): HTMLElement | null => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    const node = sel.anchorNode as Node | null;
    let el: Node | null = node;
    while (el && (el as HTMLElement).nodeType === 3) el = el.parentNode;
    while (el && (el as HTMLElement).nodeType === 1) {
      const htmlEl = el as HTMLElement;
      if (htmlEl.tagName === tagName) return htmlEl;
      el = htmlEl.parentElement;
    }
    return null;
  };

  const toggleWithCommand = (cmd: string, value?: string) => {
    try {
      document.execCommand(cmd, false, value);
      recomputeActive();
    } catch {}
  };

  const rememberTextColor = (hex: string) => {
    setRecentTextColors((prev) => {
      const next = [hex, ...prev.filter((c) => c !== hex)];
      return next.slice(0, 6);
    });
  };
  const rememberBgColor = (hex: string) => {
    setRecentBgColors((prev) => {
      const next = [hex, ...prev.filter((c) => c !== hex)];
      return next.slice(0, 6);
    });
  };

  const applyTextColor = (hex: string) => {
    toggleWithCommand('foreColor', hex);
    rememberTextColor(hex);
    setCurrentTextHex(hex);
    setShowColorDropdown(true);
  };

  const applyBgColor = (hex: string) => {
    // Try hiliteColor, fallback to backColor
    try {
      document.execCommand('hiliteColor', false, hex);
    } catch {
      try { document.execCommand('backColor', false, hex); } catch {}
    }
    rememberBgColor(hex);
    setCurrentBgHex(hex === 'transparent' ? defaultBgHex : hex);
    setShowColorDropdown(true);
  };
  const clearBgColor = () => applyBgColor('transparent');
  const clearTextColor = () => {
    // Apply body color as default fallback
    const bodyColor = rgbToHex(getComputedStyle(document.body).color);
    applyTextColor(bodyColor);
  };

  const applyFormat = (format: string) => {
    switch (format) {
      case 'bold':
        return toggleWithCommand('bold');
      case 'italic':
        return toggleWithCommand('italic');
      case 'underline':
        return toggleWithCommand('underline');
      case 'strike':
        return toggleWithCommand('strikeThrough');
      case 'code': {
        const existing = findAncestorTag('CODE');
        if (existing) {
          const text = document.createTextNode(existing.textContent || '');
          const parent = existing.parentNode;
          if (parent) {
            parent.replaceChild(text, existing);
            const sel = window.getSelection();
            if (sel) {
              sel.removeAllRanges();
              const r = document.createRange();
              r.selectNodeContents(text);
              sel.addRange(r);
            }
          }
          recomputeActive();
          return;
        }
        return wrapSelection(() => {
          const el = document.createElement('code');
          el.style.backgroundColor = '#374151';
          el.style.color = '#f9fafb';
          el.style.padding = '0.125rem 0.25rem';
          el.style.borderRadius = '0.25rem';
          el.style.fontSize = '0.875em';
          el.style.fontFamily = 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace';
          return el;
        });
      }
      case 'link': {
        const a = findAncestorTag('A');
        if (a) {
          toggleWithCommand('unlink');
          return;
        }
        const url = prompt('Enter URL:');
        if (!url) return;
        return toggleWithCommand('createLink', url);
      }
      default:
        return;
    }
  };

  if (!show) return null;

  const Button = ({
    label,
    onClick,
    active,
    children
  }: { label: string; onClick: () => void; active?: boolean; children?: React.ReactNode }) => (
    <button
      onClick={onClick}
      className={`px-2 py-1 text-sm rounded transition-colors ${
        active ? 'bg-neutral-700 text-blue-400' : 'text-neutral-200'
      } hover:bg-neutral-800`}
      title={label}
    >
      {children || label}
    </button>
  );

  const typeOptions: { key: string; label: string; type: BlockType; icon: React.ReactNode }[] = [
    { key: 'text', label: 'Text', type: 'paragraph', icon: <span className="w-4 inline-block">T</span> },
    { key: 'h1', label: 'Heading 1', type: 'heading1', icon: <span className="w-4 inline-block">H1</span> },
    { key: 'h2', label: 'Heading 2', type: 'heading2', icon: <span className="w-4 inline-block">H2</span> },
    { key: 'h3', label: 'Heading 3', type: 'heading3', icon: <span className="w-4 inline-block">H3</span> },
    { key: 'page', label: 'Page', type: 'page', icon: <span className="w-4 inline-block">📄</span> },
    { key: 'bulleted', label: 'Bulleted list', type: 'bulletList', icon: <span className="w-4 inline-block">•</span> },
    { key: 'numbered', label: 'Numbered list', type: 'numberedList', icon: <span className="w-4 inline-block">1.</span> },
    { key: 'todo', label: 'To-do list', type: 'todoList', icon: <span className="w-4 inline-block">☐</span> },
    { key: 'toggle', label: 'Toggle list', type: 'toggleList', icon: <span className="w-4 inline-block">▸</span> },
    { key: 'code', label: 'Code', type: 'codeBlock', icon: <span className="w-4 inline-block">{'</>'}</span> },
    { key: 'quote', label: 'Quote', type: 'quote', icon: <span className="w-4 inline-block">“”</span> },
    { key: 'callout', label: 'Callout', type: 'callout', icon: <span className="w-4 inline-block">▣</span> },
  ];

  const openTypeDropdown = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTypeAnchor({ left: rect.left, top: rect.bottom + 8 });
    setShowTypeDropdown((v) => !v);
  };

  const toolbarContent = (
    <div
      ref={toolbarRef}
      className="fixed bg-neutral-900/95 border border-neutral-700 rounded-lg shadow-lg flex items-center gap-3 px-3 py-2 select-none"
      style={{
        zIndex: 999999,
        position: 'fixed',
        left: position ? `${position.x}px` : '0px',
        top: position ? `${position.y - 56}px` : '0px',
        transform: 'translateX(-50%)',
        pointerEvents: 'auto'
      }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {/* Left: Text with chevron */}
      <div className="flex items-center gap-1 pr-2 mr-1 border-r border-neutral-700/60 relative">
        <button
          className="text-sm text-neutral-200 px-2 py-1 rounded hover:bg-neutral-800 flex items-center gap-1"
          onClick={openTypeDropdown}
        >
          <span>{
            currentType === 'paragraph' ? 'Text' :
            currentType === 'heading1' ? 'Heading 1' :
            currentType === 'heading2' ? 'Heading 2' :
            currentType === 'heading3' ? 'Heading 3' :
            currentType === 'bulletList' ? 'Bulleted list' :
            currentType === 'numberedList' ? 'Numbered list' :
            currentType === 'todoList' ? 'To-do list' :
            currentType === 'toggleList' ? 'Toggle list' :
            currentType === 'page' ? 'Page' :
            currentType === 'codeBlock' ? 'Code' :
            currentType === 'quote' ? 'Quote' :
            currentType === 'callout' ? 'Callout' : 'Text'
          }</span>
          <span className={`transition-transform ${showTypeDropdown ? 'rotate-180' : ''}`}>▾</span>
        </button>
        {showTypeDropdown && typeof document !== 'undefined' && typeAnchor && createPortal(
          <div
            ref={dropdownRef}
            className="fixed bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg min-w-[260px] py-1"
            style={{
              zIndex: 1000000,
              left: typeAnchor.left,
              top: typeAnchor.top,
            }}
          >
            <div className="px-3 py-2 text-neutral-400 text-xs">Turn into</div>
            {typeOptions.map((opt) => {
              const active = currentType === opt.type;
              return (
                <button
                  key={opt.key}
                  onClick={() => {
                    // Preserve current selection bounds, then call turn-into
                    const sel = window.getSelection();
                    let startOffset = 0, endOffset = 0, anchorNode: Node | null = null;
                    if (sel && sel.rangeCount > 0) {
                      const r = sel.getRangeAt(0);
                      startOffset = r.startOffset; endOffset = r.endOffset; anchorNode = r.startContainer;
                    }
                    onTurnInto?.(opt.type);
                    setShowTypeDropdown(false);
                    // Re-apply selection on next frame to keep toolbar visible
                    requestAnimationFrame(() => {
                      const selection = window.getSelection();
                      if (!selection || !anchorNode) return;
                      selection.removeAllRanges();
                      const newRange = document.createRange();
                      const container = anchorNode.nodeType === 3 ? anchorNode : (anchorNode.firstChild || anchorNode);
                      if (!container) return;
                      const textNode = container.nodeType === 3 ? container : container.firstChild;
                      if (!textNode) return;
                      const len = (textNode.textContent || '').length;
                      newRange.setStart(textNode, Math.min(startOffset, len));
                      newRange.setEnd(textNode, Math.min(endOffset, len));
                      selection.addRange(newRange);
                    });
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-neutral-700 ${active ? 'bg-neutral-700/60' : ''}`}
                >
                  <span className="flex items-center gap-3 text-neutral-200">
                    <span className="text-neutral-300 w-6 flex justify-center">{opt.icon}</span>
                    {opt.label}
                  </span>
                  {active && <span className="text-blue-400">✓</span>}
                </button>
              );
            })}
          </div>,
          document.body
        )}
      </div>

      {/* Inline actions */}
      <div className="flex items-center gap-1">
        <Button label="Bold" onClick={() => applyFormat('bold')} active={isBold}>B</Button>
        <Button label="Italic" onClick={() => applyFormat('italic')} active={isItalic}><span className="italic">I</span></Button>
        <Button label="Underline" onClick={() => applyFormat('underline')} active={isUnderline}><span className="underline">U</span></Button>
        <Button label="Strikethrough" onClick={() => applyFormat('strike')} active={isStrike}>S</Button>
        <Button label="Code" onClick={() => applyFormat('code')}>{'</>'}</Button>
        <Button label="Link" onClick={() => applyFormat('link')}>Link</Button>
      </div>

      {/* Right section */}
      <div className="pl-2 ml-1 border-l border-neutral-700/60 flex items-center gap-1">
        <button
          className="px-2 py-1 text-sm rounded text-neutral-200 hover:bg-neutral-800 flex items-center gap-1"
          onClick={(e) => {
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            setColorAnchor({ left: rect.left, top: rect.bottom + 8 });
            setShowColorDropdown((v) => !v);
          }}
          title="Color"
        >
          <span
            className="px-1 py-0.5 rounded"
            style={{ color: currentTextHex || undefined, backgroundColor: currentBgHex || undefined }}
          >
            A
          </span>
          <span className={`transition-transform ${showColorDropdown ? 'rotate-180' : ''}`}>▾</span>
        </button>
        {showColorDropdown && typeof document !== 'undefined' && colorAnchor && createPortal(
          <div
            ref={colorDropdownRef}
            className="fixed bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg p-3 w-[300px]"
            style={{ zIndex: 1000000, left: colorAnchor.left, top: colorAnchor.top }}
            onMouseDown={(e) => e.preventDefault()}
          >
            {/* Recently used removed per request */}
            {/* Text color */}
            <div className="text-neutral-400 text-sm mb-2">Text color</div>
            <div className="grid grid-cols-6 gap-2 mb-4">
              {/* Default */}
              <button onClick={clearTextColor} className={`w-8 h-8 rounded-md border border-neutral-600 flex items-center justify-center ${currentTextHex===rgbToHex(getComputedStyle(document.body).color)?'ring-2 ring-blue-400':''}`}>
                <span className="font-semibold">A</span>
              </button>
              {['#e5e7eb','#9ca3af','#f59e0b','#f97316','#fbbf24','#facc15','#10b981','#60a5fa','#a78bfa','#f472b6','#fb7185','#ef4444'].map((c, idx) => (
                <button key={idx} onMouseDown={(e)=>e.preventDefault()} onClick={() => applyTextColor(c)} className={`w-8 h-8 rounded-md border border-neutral-600 flex items-center justify-center ${currentTextHex===c?'ring-2 ring-blue-400':''}`}>
                  <span className="font-semibold" style={{ color: c }}>A</span>
                </button>
              ))}
            </div>
            {/* Background color */}
            <div className="text-neutral-400 text-sm mb-2">Background color</div>
            <div className="grid grid-cols-6 gap-2">
              {/* Default bg (transparent / editor bg) */}
              <button onMouseDown={(e)=>e.preventDefault()} onClick={clearBgColor} className={`w-8 h-8 rounded-md border border-neutral-600 ${currentBgHex===defaultBgHex?'ring-2 ring-blue-400':''}`} style={{ backgroundColor: defaultBgHex }} />
              {['#374151','#4b5563','#92400e','#b45309','#a16207','#78350f','#065f46','#1e40af','#5b21b6','#7e22ce','#991b1b','#7f1d1d'].map((c, idx) => (
                <button key={idx} onMouseDown={(e)=>e.preventDefault()} onClick={() => applyBgColor(c)} className={`w-8 h-8 rounded-md border border-neutral-600 ${currentBgHex===c?'ring-2 ring-blue-400':''}`} style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>,
          document.body
        )}
        <Button label="More" onClick={() => {}}>···</Button>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(toolbarContent, document.body) : null;
} 