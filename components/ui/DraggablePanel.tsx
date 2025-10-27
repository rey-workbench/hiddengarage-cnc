'use client';

import { useRef, useState, useEffect, ReactNode } from 'react';

interface DraggablePanelProps {
  id: string;
  title: string;
  icon: string;
  children: ReactNode;
  initialPosition: { x: number; y: number };
  initialSize?: { width: number; height: number };
  minSize?: { width: number; height: number };
  maxSize?: { width: number; height: number };
  resizable?: boolean;
  onPositionChange?: (position: { x: number; y: number }) => void;
  onSizeChange?: (size: { width: number; height: number }) => void;
  isMinimized: boolean;
  onToggleMinimize: () => void;
  className?: string;
}

export default function DraggablePanel({
  id,
  title,
  icon,
  children,
  initialPosition,
  initialSize = { width: 360, height: 400 },
  minSize = { width: 280, height: 200 },
  maxSize = { width: 800, height: 900 },
  resizable = true,
  onPositionChange,
  onSizeChange,
  isMinimized,
  onToggleMinimize,
  className = '',
}: DraggablePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, startX: 0, startY: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        
        let newX = dragStart.startX + deltaX;
        let newY = dragStart.startY + deltaY;
        
        const margin = -50;
        const maxX = window.innerWidth - size.width + margin;
        const maxY = window.innerHeight - (isMinimized ? 50 : size.height) + margin;
        
        newX = Math.max(margin, Math.min(newX, maxX));
        newY = Math.max(margin, Math.min(newY, maxY));
        
        setPosition({ x: newX, y: newY });
      }
      
      if (isResizing && resizable) {
        e.preventDefault();
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        
        const newWidth = Math.max(minSize.width, Math.min(resizeStart.width + deltaX, maxSize.width));
        const newHeight = Math.max(minSize.height, Math.min(resizeStart.height + deltaY, maxSize.height));
        
        setSize({ width: newWidth, height: newHeight });
        onSizeChange?.({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        const minVisible = 80;
        let { x, y } = position;
        let needsSnap = false;
        
        if (x < -size.width + minVisible) {
          x = -size.width + minVisible;
          needsSnap = true;
        }
        if (x > window.innerWidth - minVisible) {
          x = window.innerWidth - minVisible;
          needsSnap = true;
        }
        if (y < 0) {
          y = 0;
          needsSnap = true;
        }
        if (y > window.innerHeight - minVisible) {
          y = window.innerHeight - minVisible;
          needsSnap = true;
        }
        
        if (needsSnap) {
          setPosition({ x, y });
        }
        
        onPositionChange?.({ x, y });
      }
      
      setIsDragging(false);
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    if (isDragging || isResizing) {
      document.body.style.cursor = isDragging ? 'grabbing' : 'nwse-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, isResizing, dragStart, resizeStart, position, size, minSize, maxSize, resizable, onPositionChange, onSizeChange, isMinimized]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.no-drag')) return;
    
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      startX: position.x,
      startY: position.y,
    });
    setIsDragging(true);
    e.preventDefault();
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    });
    setIsResizing(true);
  };

  return (
    <div
      ref={panelRef}
      className={`fixed z-50 ${className}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: isMinimized ? 'auto' : `${size.height}px`,
        transition: isDragging || isResizing ? 'none' : 'all 0.3s ease',
        willChange: 'transform, left, top',
      }}
    >
      <div className={`panel-desktop ${isDragging ? 'dragging' : ''} ${isResizing ? 'resizing' : ''}`}>
        <div
          className="panel-header select-none group"
          onMouseDown={handleMouseDown}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <div className="flex items-center gap-2">
            <i className="fas fa-grip-vertical text-dark-500 text-[10px] group-hover:text-dark-400 transition-colors duration-200" />
            <div className="relative">
              <div className="absolute inset-0 bg-primary-500/20 rounded blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <i className={`${icon} text-primary-400 text-xs relative`} />
            </div>
            <h3 className="text-xs font-bold text-gray-100 tracking-tight">{title}</h3>
          </div>
          <div className="flex items-center gap-1 no-drag">
            <button
              onClick={onToggleMinimize}
              className="panel-header-btn transition-all duration-200 hover:scale-105"
              title={isMinimized ? 'Maximize' : 'Minimize'}
            >
              <i className={`fas ${isMinimized ? 'fa-plus' : 'fa-minus'} text-[10px]`} />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <div className="panel-content" style={{ height: `${size.height - 50}px` }}>
            {children}
          </div>
        )}

        {!isMinimized && resizable && (
          <>
            <div
              className="resize-handle resize-handle-e"
              onMouseDown={handleResizeMouseDown}
            />
            <div
              className="resize-handle resize-handle-s"
              onMouseDown={handleResizeMouseDown}
            />
            <div
              className="resize-handle resize-handle-se"
              onMouseDown={handleResizeMouseDown}
            />
          </>
        )}
      </div>
    </div>
  );
}
