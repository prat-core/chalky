export interface AnimationRequest {
  id: string;
  text: string;
  context: import('./scene').SceneData;
  timestamp: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface AnimationResponse {
  id: string;
  videoUrl: string;
  generatedCode: string;
  success: boolean;
  error?: string;
}

export interface LLMResponse {
  code: string;
  explanation: string;
  confidence: number;
}

export interface AnimationSettings {
  quality: 'low' | 'medium' | 'high';
  frameRate: number;
  duration?: number;
} 