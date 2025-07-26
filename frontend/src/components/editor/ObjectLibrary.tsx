"use client";

import { useDrag } from 'react-dnd';
import { Square, Circle, Type, Move } from 'lucide-react';
import type { ManimObject, DragItem } from '@/lib/types/scene';

interface DraggableObjectProps {
  type: ManimObject['type'];
  icon: React.ReactNode;
  label: string;
}

function DraggableObject({ type, icon, label }: DraggableObjectProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'MANIM_OBJECT',
    item: { type: 'MANIM_OBJECT', id: `new-${type}`, objectType: type } as DragItem,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag as any}
      className={`
        flex flex-col items-center justify-center p-3 border-2 border-dashed border-muted-foreground/30 
        rounded-lg cursor-grab active:cursor-grabbing transition-all duration-200 hover:border-primary/50 
        hover:bg-muted/50 bg-background min-w-20
        ${isDragging ? 'opacity-50 scale-95' : 'opacity-100'}
      `}
    >
      <div className="text-xl mb-1 text-muted-foreground group-hover:text-primary">
        {icon}
      </div>
      <span className="text-xs font-medium text-muted-foreground text-center">{label}</span>
    </div>
  );
}

export default function ObjectLibrary() {
  const objects: DraggableObjectProps[] = [
    {
      type: 'Square',
      icon: <Square className="w-5 h-5" />,
      label: 'Square'
    },
    {
      type: 'Circle',
      icon: <Circle className="w-5 h-5" />,
      label: 'Circle'
    },
    {
      type: 'Text',
      icon: <Type className="w-5 h-5" />,
      label: 'Text'
    },
    {
      type: 'LaTeX',
      icon: <div className="w-5 h-5 flex items-center justify-center text-sm font-bold">∑</div>,
      label: 'LaTeX'
    }
  ];

  return (
    <div className="w-full h-full bg-background">
      {/* Header */}
      <div className="pb-3">
        <h3 className="text-sm font-semibold text-foreground">Object Library</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Drag objects to the canvas
        </p>
      </div>

      {/* Object Grid - Horizontal layout */}
      <div className="flex gap-3 flex-wrap">
        {objects.map((obj) => (
          <DraggableObject
            key={obj.type}
            type={obj.type}
            icon={obj.icon}
            label={obj.label}
          />
        ))}
      </div>

      {/* Quick tip */}
      <div className="mt-3 bg-muted/30 rounded-lg p-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Move className="w-3 h-3" />
          <span>Drag any object onto the canvas to add it to your scene.</span>
        </div>
      </div>
    </div>
  );
} 