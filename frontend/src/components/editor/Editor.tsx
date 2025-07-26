"use client";

import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { 
  Library, 
  Settings, 
  MessageCircle, 
  ChevronLeft, 
  ChevronRight, 
  PanelLeftOpen,
  PanelRightOpen
} from 'lucide-react';
import Canvas from './Canvas';
import ObjectLibrary from './ObjectLibrary';
import PropertyPanel from './PropertyPanel';
import { useScene } from '@/lib/hooks/useScene';
import type { ManimObject } from '@/lib/types/scene';

interface EditorProps {
  className?: string;
  showChat?: boolean;
  onChatToggle?: (show: boolean) => void;
}

export default function Editor({ 
  className = "", 
  showChat = false, 
  onChatToggle 
}: EditorProps) {
  const [showObjectLibrary, setShowObjectLibrary] = useState(true);
  const [showProperties, setShowProperties] = useState(true);

  const {
    scene,
    selectedObjectId,
    setSelectedObjectId,
    selectedObject,
    addObject,
    updateObject,
    deleteObject,
    moveObject
  } = useScene();

  const handleObjectAdd = (type: ManimObject['type'], position: [number, number]) => {
    const objectId = addObject(type, position);
    setSelectedObjectId(objectId);
  };

  const handleObjectSelect = (id: string | null) => {
    setSelectedObjectId(id);
  };

  const handleObjectMove = (objectId: string, newPosition: [number, number]) => {
    moveObject(objectId, newPosition);
  };

  const handleObjectUpdate = (objectId: string, updates: Partial<ManimObject>) => {
    updateObject(objectId, updates);
  };

  const handleObjectDelete = (objectId: string) => {
    deleteObject(objectId);
  };

  const handleChatToggle = () => {
    if (onChatToggle) {
      onChatToggle(!showChat);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`flex flex-col h-full bg-background relative ${className}`}>
        {/* Top Panel Controls */}
        <div className="flex justify-between items-start p-4 z-50">
          {/* Left Toggle Controls */}
          <div className="flex gap-2">
            {/* Object Library Toggle */}
            <button
              onClick={() => setShowObjectLibrary(!showObjectLibrary)}
              className={`p-2 rounded-md transition-all duration-200 ${
                showObjectLibrary 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'bg-background border border-border text-muted-foreground hover:text-foreground'
              }`}
              title="Toggle Object Library"
            >
              <Library className="w-4 h-4" />
            </button>

            {/* Chat Toggle */}
            <button
              onClick={handleChatToggle}
              className={`p-2 rounded-md transition-all duration-200 ${
                showChat 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'bg-background border border-border text-muted-foreground hover:text-foreground'
              }`}
              title="Toggle Chat Panel"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
          </div>

          {/* Right Toggle Controls */}
          <div>
            {/* Properties Toggle */}
            <button
              onClick={() => setShowProperties(!showProperties)}
              className={`p-2 rounded-md transition-all duration-200 ${
                showProperties 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'bg-background border border-border text-muted-foreground hover:text-foreground'
              }`}
              title="Toggle Properties Panel"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Object Library Panel - positioned below controls */}
        <div className={`transition-all duration-300 ease-in-out border-b border-border ${
          showObjectLibrary ? 'h-48 opacity-100' : 'h-0 opacity-0 overflow-hidden'
        }`}>
          {showObjectLibrary && (
            <div className="h-full px-4 pb-4">
              <ObjectLibrary />
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex min-h-0">
          {/* Canvas - takes full width when panels are hidden */}
          <div className="flex-1 h-full relative">
            <Canvas
              objects={scene.objects}
              selectedObjectId={selectedObjectId}
              onObjectSelect={handleObjectSelect}
              onObjectMove={handleObjectMove}
              onObjectAdd={handleObjectAdd}
            />
          </div>

          {/* Right Properties Panel */}
          <div className={`h-full transition-all duration-300 ease-in-out border-l border-border ${
            showProperties ? 'w-80 opacity-100' : 'w-0 opacity-0 overflow-hidden'
          }`}>
            {showProperties && (
              <PropertyPanel
                selectedObject={selectedObject || null}
                onUpdateObject={handleObjectUpdate}
                onDeleteObject={handleObjectDelete}
              />
            )}
          </div>
        </div>

        {/* Status Bar */}
        <div className="border-t border-border bg-muted/30 px-4 py-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                <span>{showChat ? 'Chat Open' : 'Chat Hidden'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Library className="w-3 h-3" />
                <span>{showObjectLibrary ? 'Library Open' : 'Library Hidden'}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>{scene.objects.length} object{scene.objects.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Settings className="w-3 h-3" />
              <span>{showProperties ? 'Properties Open' : 'Properties Hidden'}</span>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
} 