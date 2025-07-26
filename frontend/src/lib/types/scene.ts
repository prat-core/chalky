export interface SceneData {
  id: string;
  objects: ManimObject[];
  settings: SceneSettings;
  metadata: {
    created: Date;
    modified: Date;
    version: string;
  };
}

export interface ManimObject {
  id: string;
  type: 'Square' | 'Circle' | 'Text' | 'LaTeX' | 'Line' | 'Arrow';
  position: [number, number];
  rotation: number;
  scale: number;
  properties: Record<string, any>;
  states: ObjectState[];
  layer: number;
}

export interface ObjectState {
  id: string;
  timestamp: number;
  properties: Partial<ManimObject>;
  transition?: TransitionConfig;
}

export interface TransitionConfig {
  duration: number;
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
  delay?: number;
}

export interface SceneSettings {
  width: number;
  height: number;
  backgroundColor: string;
  frameRate: number;
  quality: 'low' | 'medium' | 'high';
}

// Canvas-specific types
export interface CanvasPosition {
  x: number;
  y: number;
}

export interface DragItem {
  type: string;
  id: string;
  objectType?: ManimObject['type'];
}

// Object-specific property interfaces
export interface SquareProperties {
  sideLength: number;
  color: string;
  fillOpacity: number;
  strokeWidth: number;
  strokeColor: string;
}

export interface CircleProperties {
  radius: number;
  color: string;
  fillOpacity: number;
  strokeWidth: number;
  strokeColor: string;
}

export interface TextProperties {
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  weight: 'normal' | 'bold';
}

export interface LaTeXProperties {
  tex: string;
  fontSize: number;
  color: string;
}

export type ObjectProperties = 
  | SquareProperties 
  | CircleProperties 
  | TextProperties 
  | LaTeXProperties; 