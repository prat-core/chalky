import { useState, useCallback } from 'react';
import type { SceneData, ManimObject } from '../types/scene';
import { SceneSerializer } from '../utils/scene-serializer';

export function useScene(initialScene?: SceneData) {
  const [scene, setScene] = useState<SceneData>(
    initialScene || SceneSerializer.createEmptyScene()
  );
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);

  const addObject = useCallback((
    type: ManimObject['type'], 
    position: [number, number],
    properties?: Record<string, any>
  ) => {
    const newObject = SceneSerializer.createManimObject(type, position, properties);
    console.log('Adding object:', { type, position, newObject }); // Debug log
    setScene(prevScene => {
      const newScene = {
        ...SceneSerializer.updateSceneMetadata(prevScene),
        objects: [...prevScene.objects, newObject]
      };
      console.log('New scene state:', newScene); // Debug log
      return newScene;
    });
    return newObject.id;
  }, []);

  const updateObject = useCallback((objectId: string, updates: Partial<ManimObject>) => {
    console.log('Updating object:', { objectId, updates }); // Debug log
    setScene(prevScene => ({
      ...SceneSerializer.updateSceneMetadata(prevScene),
      objects: prevScene.objects.map(obj => 
        obj.id === objectId ? { ...obj, ...updates } : obj
      )
    }));
  }, []);

  const deleteObject = useCallback((objectId: string) => {
    setScene(prevScene => ({
      ...SceneSerializer.updateSceneMetadata(prevScene),
      objects: prevScene.objects.filter(obj => obj.id !== objectId)
    }));
    if (selectedObjectId === objectId) {
      setSelectedObjectId(null);
    }
  }, [selectedObjectId]);

  const moveObject = useCallback((objectId: string, newPosition: [number, number]) => {
    updateObject(objectId, { position: newPosition });
  }, [updateObject]);

  const getObject = useCallback((objectId: string) => {
    return scene.objects.find(obj => obj.id === objectId);
  }, [scene.objects]);

  const clearScene = useCallback(() => {
    setScene(SceneSerializer.createEmptyScene());
    setSelectedObjectId(null);
  }, []);

  const selectedObject = selectedObjectId ? getObject(selectedObjectId) : null;

  return {
    scene,
    setScene,
    selectedObjectId,
    setSelectedObjectId,
    selectedObject,
    addObject,
    updateObject,
    deleteObject,
    moveObject,
    getObject,
    clearScene
  };
} 