"use client";

import { useState } from 'react';
import { Trash2, RotateCw, Move, Palette } from 'lucide-react';
import type { ManimObject } from '@/lib/types/scene';

interface PropertyPanelProps {
  selectedObject: ManimObject | null;
  onUpdateObject: (objectId: string, updates: Partial<ManimObject>) => void;
  onDeleteObject: (objectId: string) => void;
}

export default function PropertyPanel({ 
  selectedObject, 
  onUpdateObject, 
  onDeleteObject 
}: PropertyPanelProps) {
  const [colorValue, setColorValue] = useState(selectedObject?.properties.color || '#3B82F6');

  if (!selectedObject) {
    return (
      <div className="w-80 bg-background border-l border-border">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Properties</h3>
        </div>
        <div className="p-4 text-center">
          <div className="text-muted-foreground/50 mb-2">
            <Palette className="w-8 h-8 mx-auto" />
          </div>
          <p className="text-sm text-muted-foreground">
            Select an object to edit its properties
          </p>
        </div>
      </div>
    );
  }

  const updateProperty = (key: string, value: any) => {
    onUpdateObject(selectedObject.id, {
      properties: {
        ...selectedObject.properties,
        [key]: value
      }
    });
  };

  const updateTransform = (key: keyof Pick<ManimObject, 'position' | 'rotation' | 'scale' | 'layer'>, value: any) => {
    onUpdateObject(selectedObject.id, {
      [key]: value
    });
  };

  return (
    <div className="w-80 bg-background border-l border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Properties</h3>
            <p className="text-xs text-muted-foreground">
              {selectedObject.type} • {selectedObject.id.slice(0, 8)}
            </p>
          </div>
          <button
            onClick={() => onDeleteObject(selectedObject.id)}
            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6 overflow-y-auto">
        {/* Transform Properties */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Move className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Transform</span>
          </div>
          
          {/* Position */}
          <div className="space-y-2 mb-4">
            <label className="text-xs text-muted-foreground">Position</label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-muted-foreground">X</label>
                <input
                  type="number"
                  step="0.1"
                  value={selectedObject.position[0]}
                  onChange={(e) => updateTransform('position', [
                    parseFloat(e.target.value) || 0,
                    selectedObject.position[1]
                  ])}
                  className="w-full px-2 py-1 text-xs border border-input rounded bg-background"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Y</label>
                <input
                  type="number"
                  step="0.1"
                  value={selectedObject.position[1]}
                  onChange={(e) => updateTransform('position', [
                    selectedObject.position[0],
                    parseFloat(e.target.value) || 0
                  ])}
                  className="w-full px-2 py-1 text-xs border border-input rounded bg-background"
                />
              </div>
            </div>
          </div>

          {/* Scale & Rotation */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground">Scale</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="5"
                value={selectedObject.scale}
                onChange={(e) => updateTransform('scale', parseFloat(e.target.value) || 1)}
                className="w-full px-2 py-1 text-xs border border-input rounded bg-background"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground flex items-center gap-1">
                <RotateCw className="w-3 h-3" />
                Rotation
              </label>
              <input
                type="number"
                step="15"
                value={selectedObject.rotation}
                onChange={(e) => updateTransform('rotation', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1 text-xs border border-input rounded bg-background"
              />
            </div>
          </div>
        </div>

        {/* Object-specific Properties */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Palette className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Appearance</span>
          </div>

          {/* Color */}
          <div className="mb-4">
            <label className="text-xs text-muted-foreground">Color</label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={colorValue}
                onChange={(e) => {
                  setColorValue(e.target.value);
                  updateProperty('color', e.target.value);
                }}
                className="w-8 h-8 rounded border border-input cursor-pointer"
              />
              <input
                type="text"
                value={colorValue}
                onChange={(e) => {
                  setColorValue(e.target.value);
                  updateProperty('color', e.target.value);
                }}
                className="flex-1 px-2 py-1 text-xs border border-input rounded bg-background"
              />
            </div>
          </div>

          {/* Square/Circle specific properties */}
          {(selectedObject.type === 'Square' || selectedObject.type === 'Circle') && (
            <>
              {selectedObject.type === 'Square' && (
                <div className="mb-4">
                  <label className="text-xs text-muted-foreground">Side Length</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={selectedObject.properties.sideLength}
                    onChange={(e) => updateProperty('sideLength', parseFloat(e.target.value) || 1)}
                    className="w-full px-2 py-1 text-xs border border-input rounded bg-background"
                  />
                </div>
              )}

              {selectedObject.type === 'Circle' && (
                <div className="mb-4">
                  <label className="text-xs text-muted-foreground">Radius</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={selectedObject.properties.radius}
                    onChange={(e) => updateProperty('radius', parseFloat(e.target.value) || 1)}
                    className="w-full px-2 py-1 text-xs border border-input rounded bg-background"
                  />
                </div>
              )}

              <div className="mb-4">
                <label className="text-xs text-muted-foreground">Fill Opacity</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={selectedObject.properties.fillOpacity}
                  onChange={(e) => updateProperty('fillOpacity', parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground text-right">
                  {selectedObject.properties.fillOpacity}
                </div>
              </div>

              <div className="mb-4">
                <label className="text-xs text-muted-foreground">Stroke Width</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={selectedObject.properties.strokeWidth}
                  onChange={(e) => updateProperty('strokeWidth', parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1 text-xs border border-input rounded bg-background"
                />
              </div>
            </>
          )}

          {/* Text specific properties */}
          {selectedObject.type === 'Text' && (
            <>
              <div className="mb-4">
                <label className="text-xs text-muted-foreground">Text Content</label>
                <input
                  type="text"
                  value={selectedObject.properties.text}
                  onChange={(e) => updateProperty('text', e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-input rounded bg-background"
                />
              </div>

              <div className="mb-4">
                <label className="text-xs text-muted-foreground">Font Size</label>
                <input
                  type="number"
                  min="8"
                  max="72"
                  value={selectedObject.properties.fontSize}
                  onChange={(e) => updateProperty('fontSize', parseInt(e.target.value) || 24)}
                  className="w-full px-2 py-1 text-xs border border-input rounded bg-background"
                />
              </div>

              <div className="mb-4">
                <label className="text-xs text-muted-foreground">Font Weight</label>
                <select
                  value={selectedObject.properties.weight}
                  onChange={(e) => updateProperty('weight', e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-input rounded bg-background"
                >
                  <option value="normal">Normal</option>
                  <option value="bold">Bold</option>
                </select>
              </div>
            </>
          )}

          {/* LaTeX specific properties */}
          {selectedObject.type === 'LaTeX' && (
            <>
              <div className="mb-4">
                <label className="text-xs text-muted-foreground">LaTeX Expression</label>
                <textarea
                  value={selectedObject.properties.tex}
                  onChange={(e) => updateProperty('tex', e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-input rounded bg-background"
                  rows={2}
                  placeholder="x^2 + y^2 = r^2"
                />
              </div>

              <div className="mb-4">
                <label className="text-xs text-muted-foreground">Font Size</label>
                <input
                  type="number"
                  min="8"
                  max="72"
                  value={selectedObject.properties.fontSize}
                  onChange={(e) => updateProperty('fontSize', parseInt(e.target.value) || 24)}
                  className="w-full px-2 py-1 text-xs border border-input rounded bg-background"
                />
              </div>
            </>
          )}
        </div>

        {/* Layer */}
        <div>
          <label className="text-xs text-muted-foreground">Layer</label>
          <input
            type="number"
            min="0"
            max="10"
            value={selectedObject.layer}
            onChange={(e) => updateTransform('layer', parseInt(e.target.value) || 0)}
            className="w-full px-2 py-1 text-xs border border-input rounded bg-background"
          />
          <p className="text-xs text-muted-foreground/70 mt-1">
            Higher layers appear on top
          </p>
        </div>
      </div>
    </div>
  );
} 