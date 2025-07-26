import { v4 as uuidv4 } from 'uuid';
import type { SceneData, ManimObject, SceneSettings, CanvasPosition } from '../types/scene';

export class SceneSerializer {
  static createEmptyScene(): SceneData {
    return {
      id: uuidv4(),
      objects: [],
      settings: {
        width: 1920,  // Standard Manim width
        height: 1080, // Standard Manim height
        backgroundColor: '#000000',
        frameRate: 60,
        quality: 'medium'
      },
      metadata: {
        created: new Date(),
        modified: new Date(),
        version: '1.0.0'
      }
    };
  }

  static createManimObject(
    type: ManimObject['type'], 
    position: [number, number],
    properties: Record<string, any> = {}
  ): ManimObject {
    const defaultProperties = this.getDefaultProperties(type);
    
    const newObject = {
      id: uuidv4(),
      type,
      position,
      rotation: 0,
      scale: 1,
      properties: { ...defaultProperties, ...properties },
      states: [],
      layer: 0
    };
    
    console.log('Creating new Manim object:', newObject);
    return newObject;
  }

  static getDefaultProperties(type: ManimObject['type']): Record<string, any> {
    switch (type) {
      case 'Square':
        return {
          sideLength: 2,
          color: '#3B82F6',
          fillOpacity: 0.3,
          strokeWidth: 2,
          strokeColor: '#1E40AF'
        };
      case 'Circle':
        return {
          radius: 1,
          color: '#EF4444',
          fillOpacity: 0.3,
          strokeWidth: 2,
          strokeColor: '#DC2626'
        };
      case 'Text':
        return {
          text: 'Text',
          fontSize: 24,
          fontFamily: 'Arial',
          color: '#FFFFFF',
          weight: 'normal'
        };
      case 'LaTeX':
        return {
          tex: 'x^2',
          fontSize: 24,
          color: '#FFFFFF'
        };
      default:
        return {};
    }
  }

  static serializeScene(scene: SceneData): string {
    return JSON.stringify(scene, null, 2);
  }

  static deserializeScene(serializedScene: string): SceneData {
    const parsed = JSON.parse(serializedScene);
    
    // Convert date strings back to Date objects
    parsed.metadata.created = new Date(parsed.metadata.created);
    parsed.metadata.modified = new Date(parsed.metadata.modified);
    
    return parsed;
  }

  static updateSceneMetadata(scene: SceneData): SceneData {
    return {
      ...scene,
      metadata: {
        ...scene.metadata,
        modified: new Date()
      }
    };
  }
}

// Coordinate transformation utilities
export class CoordinateTransform {
  static canvasToManim(
    canvasPos: CanvasPosition, 
    canvasWidth: number, 
    canvasHeight: number
  ): [number, number] {
    // Convert canvas coordinates (0,0 top-left) to Manim coordinates (0,0 center)
    // Manim default coordinate system: 14 units wide, 8 units tall
    const x = (canvasPos.x - canvasWidth / 2) / (canvasWidth / 14);
    const y = -(canvasPos.y - canvasHeight / 2) / (canvasHeight / 8); // Y flipped
    
    console.log('Canvas to Manim conversion:', {
      canvasPos,
      canvasWidth,
      canvasHeight,
      manimPos: [x, y]
    });
    
    return [x, y];
  }

  static manimToCanvas(
    manimPos: [number, number], 
    canvasWidth: number, 
    canvasHeight: number
  ): CanvasPosition {
    // Convert Manim coordinates to canvas coordinates
    const x = manimPos[0] * (canvasWidth / 14) + canvasWidth / 2;
    const y = -manimPos[1] * (canvasHeight / 8) + canvasHeight / 2;
    
    const result = { x, y };
    console.log('Manim to Canvas conversion:', {
      manimPos,
      canvasWidth,
      canvasHeight,
      canvasPos: result
    });
    
    return result;
  }
} 