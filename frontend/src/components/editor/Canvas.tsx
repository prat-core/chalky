"use client";

import { useCallback, useRef, useState, useEffect } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { Square, Circle, Type } from 'lucide-react';
import type { ManimObject, DragItem, CanvasPosition } from '@/lib/types/scene';
import { CoordinateTransform } from '@/lib/utils/scene-serializer';

// Standard Manim video dimensions
const MANIM_WIDTH = 1920;
const MANIM_HEIGHT = 1080;
const ASPECT_RATIO = MANIM_WIDTH / MANIM_HEIGHT;

// Default canvas size (smaller for better screen fit)
const DEFAULT_CANVAS_WIDTH = 800;
const DEFAULT_CANVAS_HEIGHT = DEFAULT_CANVAS_WIDTH / ASPECT_RATIO; // ~450px

interface CanvasObjectProps {
  object: ManimObject;
  canvasWidth: number;
  canvasHeight: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onMove: (id: string, position: [number, number]) => void;
}

function CanvasObject({ 
  object, 
  canvasWidth, 
  canvasHeight, 
  isSelected, 
  onSelect, 
  onMove 
}: CanvasObjectProps) {
  const canvasPos = CoordinateTransform.manimToCanvas(
    object.position, 
    canvasWidth, 
    canvasHeight
  );

  console.log('Rendering object:', object.id, 'at canvas position:', canvasPos, 'from manim position:', object.position);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CANVAS_OBJECT',
    item: { type: 'CANVAS_OBJECT', id: object.id } as DragItem,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const renderObjectIcon = () => {
    const baseClasses = `w-8 h-8 transition-all duration-200 ${
      isSelected ? 'text-primary' : 'text-foreground'
    }`;
    
    const style = { color: object.properties.color || '#3B82F6' };
    
    switch (object.type) {
      case 'Square':
        return <Square className={baseClasses} style={style} />;
      case 'Circle':
        return <Circle className={baseClasses} style={style} />;
      case 'Text':
        return <Type className={baseClasses} style={style} />;
      case 'LaTeX':
        return (
          <div 
            className={`w-8 h-8 flex items-center justify-center text-lg font-bold ${baseClasses}`}
            style={style}
          >
            ∑
          </div>
        );
      default:
        return <Square className={baseClasses} style={style} />;
    }
  };

  return (
    <div
      ref={drag as any}
      className={`
        absolute cursor-move transition-all duration-200 z-20
        ${isDragging ? 'opacity-50 scale-110' : 'opacity-100'}
        ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
        hover:scale-110 p-1 rounded-md bg-background/80 backdrop-blur-sm border border-border shadow-lg
      `}
      style={{
        left: `${canvasPos.x}px`,
        top: `${canvasPos.y}px`,
        transform: `translate(-50%, -50%) scale(${object.scale}) rotate(${object.rotation}deg)`,
        zIndex: object.layer + 20,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(object.id);
      }}
    >
      {renderObjectIcon()}
      
      {/* Object label */}
      {object.type === 'Text' && (
        <div 
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs px-2 py-1 bg-background/90 rounded border text-center whitespace-nowrap shadow-sm"
          style={{ color: object.properties.color || '#FFFFFF' }}
        >
          {object.properties.text || 'Text'}
        </div>
      )}
      
      {/* LaTeX preview */}
      {object.type === 'LaTeX' && (
        <div 
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs px-2 py-1 bg-background/90 rounded border text-center whitespace-nowrap shadow-sm"
          style={{ color: object.properties.color || '#FFFFFF' }}
        >
          {object.properties.tex || 'x^2'}
        </div>
      )}
    </div>
  );
}

interface CanvasProps {
  objects: ManimObject[];
  selectedObjectId: string | null;
  onObjectSelect: (id: string | null) => void;
  onObjectMove: (id: string, position: [number, number]) => void;
  onObjectAdd: (type: ManimObject['type'], position: [number, number]) => void;
}

export default function Canvas({
  objects,
  selectedObjectId,
  onObjectSelect,
  onObjectMove,
  onObjectAdd
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasDimensions, setCanvasDimensions] = useState({ 
    width: DEFAULT_CANVAS_WIDTH, 
    height: DEFAULT_CANVAS_HEIGHT 
  });

  // Calculate proper canvas dimensions that maintain Manim aspect ratio
  useEffect(() => {
    const updateDimensions = () => {
      if (!canvasRef.current) return;
      
      const container = canvasRef.current.parentElement;
      if (!container) return;

      const containerWidth = container.clientWidth - 32; // Account for padding
      const containerHeight = container.clientHeight - 32;
      
      // Calculate dimensions to fit container while maintaining aspect ratio
      // Use a maximum size that's comfortable for most screens
      const maxWidth = Math.min(containerWidth, 900); // Max width of 900px
      const maxHeight = Math.min(containerHeight, 600); // Max height of 600px
      
      let canvasWidth = maxWidth;
      let canvasHeight = maxWidth / ASPECT_RATIO;
      
      if (canvasHeight > maxHeight) {
        canvasHeight = maxHeight;
        canvasWidth = maxHeight * ASPECT_RATIO;
      }
      
      setCanvasDimensions({ width: canvasWidth, height: canvasHeight });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['MANIM_OBJECT', 'CANVAS_OBJECT'],
    drop: (item: DragItem, monitor) => {
      console.log('=== DROP EVENT ===');
      console.log('Item:', item);
      console.log('Canvas ref:', canvasRef.current);
      console.log('Current objects count:', objects.length);
      
      if (!canvasRef.current) {
        console.error('Canvas ref not available');
        return;
      }

      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) {
        console.error('No client offset available');
        return;
      }

      const canvasRect = canvasRef.current.getBoundingClientRect();
      const canvasPos: CanvasPosition = {
        x: clientOffset.x - canvasRect.left,
        y: clientOffset.y - canvasRect.top,
      };

      console.log('Canvas position:', canvasPos);
      console.log('Canvas rect:', canvasRect);
      console.log('Canvas dimensions:', canvasDimensions);

      const manimPos = CoordinateTransform.canvasToManim(
        canvasPos,
        canvasDimensions.width,
        canvasDimensions.height
      );

      console.log('Manim position:', manimPos);

      if (item.type === 'MANIM_OBJECT' && item.objectType) {
        console.log('Adding new object:', item.objectType, 'at position:', manimPos);
        try {
          onObjectAdd(item.objectType, manimPos);
          console.log('Object add function called successfully');
        } catch (error) {
          console.error('Error adding object:', error);
        }
      } else if (item.type === 'CANVAS_OBJECT') {
        console.log('Moving object:', item.id, 'to position:', manimPos);
        try {
          onObjectMove(item.id, manimPos);
          console.log('Object move function called successfully');
        } catch (error) {
          console.error('Error moving object:', error);
        }
      }
      
      console.log('=== END DROP EVENT ===');
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onObjectSelect(null);
    }
  }, [onObjectSelect]);

  console.log('Canvas render - objects:', objects.length, 'dimensions:', canvasDimensions);

  return (
    <div className="flex-1 relative bg-background flex items-center justify-center p-4">
      {/* Canvas Container with proper Manim aspect ratio */}
      <div
        ref={(node) => {
          canvasRef.current = node;
          drop(node);
        }}
        className={`
          relative bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-border rounded-lg shadow-xl
          transition-all duration-200 overflow-hidden
          ${isOver ? 'border-primary shadow-primary/20' : ''}
        `}
        onClick={handleCanvasClick}
        style={{
          width: `${canvasDimensions.width}px`,
          height: `${canvasDimensions.height}px`,
          backgroundImage: `
            radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)
          `,
          backgroundSize: '20px 20px',
        }}
      >
        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Center crosshair */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-8 h-0.5 bg-primary/40"></div>
          <div className="absolute w-0.5 h-8 bg-primary/40"></div>
        </div>

        {/* Canvas dimensions indicator */}
        <div className="absolute top-2 left-2 bg-background/80 backdrop-blur rounded px-2 py-1 text-xs text-muted-foreground">
          Manim {MANIM_WIDTH}×{MANIM_HEIGHT} (Canvas: {canvasDimensions.width.toFixed(0)}×{canvasDimensions.height.toFixed(0)})
        </div>

        {/* Canvas objects */}
        {objects.map((object) => {
          console.log('Rendering object in map:', object.id, object.type, object.position);
          return (
            <CanvasObject
              key={object.id}
              object={object}
              canvasWidth={canvasDimensions.width}
              canvasHeight={canvasDimensions.height}
              isSelected={object.id === selectedObjectId}
              onSelect={onObjectSelect}
              onMove={onObjectMove}
            />
          );
        })}

        {/* Drop zone indicator */}
        {isOver && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="bg-primary/20 border-2 border-dashed border-primary/60 rounded-lg p-8 backdrop-blur-sm">
              <p className="text-primary font-medium">Drop to add object</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {objects.length === 0 && !isOver && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-4xl mb-4 text-muted-foreground/50">🎬</div>
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Manim Canvas
              </h3>
              <p className="text-sm text-muted-foreground/80 max-w-md">
                Drag objects from the library to start building your mathematical animation scene.
              </p>
              <p className="text-xs text-muted-foreground/60 mt-2">
                Maintains {MANIM_WIDTH}×{MANIM_HEIGHT} aspect ratio
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 