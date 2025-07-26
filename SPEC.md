# Chalky - AI-Powered Manim WYSIWYG Tool

## Project Overview

Chalky is an innovative WYSIWYG (What You See Is What You Get) tool for creating mathematical animations using Manim. The platform combines visual object placement with AI-powered natural language animation requests to democratize mathematical visualization creation.

### Core Concept
1. **Visual Scene Setup**: Users drag and drop mathematical objects (shapes, text, LaTeX) onto a canvas
2. **Natural Language Animation**: Users describe desired animations in plain English
3. **AI Code Generation**: LLM generates Manim Python code based on scene + request
4. **Execution & Preview**: Backend executes generated code and returns rendered video
5. **Iteration**: Users can refine animations through follow-up requests

## Technology Stack

### Frontend
- **Framework**: Next.js 15.4.4 with React 19
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **Animations**: Framer Motion 12.23.9
- **Drag & Drop**: React DnD (to be added)
- **Canvas Rendering**: SVG-based with potential WebGL upgrade
- **Math Rendering**: KaTeX or MathJax for LaTeX preview
- **Icons**: Lucide React
- **State Management**: React state + Context API

### Backend
- **Framework**: FastAPI (Python)
- **LLM Integration**: OpenAI GPT-4 or Anthropic Claude
- **Manim Execution**: Manim Community Edition
- **File Processing**: Temporary file management for video generation
- **Video Processing**: FFmpeg integration via Manim

### Infrastructure
- **Development**: Local development
- **File Storage**: Local file system for MVP
- **Video Hosting**: Temporary local serving
## API Endpoints

### Core Animation API
```
POST /api/animate
- Body: { scene: SceneData, request: string, settings?: AnimationSettings }
- Returns: { videoUrl: string, generatedCode: string, success: boolean }
```

### Scene Management
```
GET /api/scene/{id}
- Returns: SceneData object

POST /api/scene
- Body: SceneData
- Returns: { id: string, success: boolean }

PUT /api/scene/{id}
- Body: Partial<SceneData>
- Returns: { success: boolean }
```

### LLM Integration
```
POST /api/llm/generate-code
- Body: { scene: SceneData, request: string, context?: string[] }
- Returns: { code: string, explanation: string, confidence: number }

POST /api/llm/refine-animation
- Body: { previousCode: string, feedback: string, scene: SceneData }
- Returns: { code: string, changes: string[] }
```

### File Management
```
GET /api/files/video/{id}
- Returns: Video file stream

POST /api/export/python
- Body: { scene: SceneData, animations: Animation[] }
- Returns: { pythonCode: string, filename: string }

GET /api/export/download/{id}
- Returns: Python file download
```

### Health & Status
```
GET /api/health
- Returns: System status and capabilities

GET /api/status/{jobId}
- Returns: Animation generation progress
```

## Implementation Details

### Frontend Architecture

#### Component Structure
```
src/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── workspace/
│   │   └── page.tsx            # Main editor interface
│   └── layout.tsx              # Root layout
├── components/
│   ├── editor/
│   │   ├── Canvas.tsx          # Main drag-and-drop canvas
│   │   ├── ObjectLibrary.tsx   # Palette of Manim objects
│   │   ├── PropertyPanel.tsx   # Object property editor
│   │   ├── SceneGraph.tsx      # Hierarchical object view
│   │   └── Timeline.tsx        # Animation timeline
│   ├── chat/
│   │   ├── ChatInterface.tsx   # Natural language input
│   │   ├── ChatHistory.tsx     # Conversation history
│   │   └── PromptSuggestions.tsx # Quick prompt buttons
│   ├── preview/
│   │   ├── VideoPlayer.tsx     # Animation preview player
│   │   ├── CodeViewer.tsx      # Generated Python code display
│   │   └── ExportPanel.tsx     # Export options
│   └── ui/                     # shadcn/ui components
└── lib/
    ├── types/
    │   ├── scene.ts            # Scene data structures
    │   ├── manim-objects.ts    # Manim object type definitions
    │   └── animations.ts       # Animation type definitions
    ├── utils/
    │   ├── scene-serializer.ts # Convert visual scene to data
    │   ├── coordinate-transform.ts # Canvas ↔ Manim coordinates
    │   └── code-formatter.ts   # Python code prettification
    └── api/
        └── client.ts           # API client functions
```

#### Core Data Structures
```typescript
interface SceneData {
  id: string;
  objects: ManimObject[];
  settings: SceneSettings;
  metadata: {
    created: Date;
    modified: Date;
    version: string;
  };
}

interface ManimObject {
  id: string;
  type: 'Square' | 'Circle' | 'Text' | 'LaTeX' | 'Line' | 'Arrow';
  position: [number, number];
  rotation: number;
  scale: number;
  properties: Record<string, any>;
  states: ObjectState[];
  layer: number;
}

interface ObjectState {
  id: string;
  timestamp: number;
  properties: Partial<ManimObject>;
  transition?: TransitionConfig;
}

interface AnimationRequest {
  id: string;
  text: string;
  context: SceneData;
  timestamp: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}
```

### Backend Architecture

#### Service Layer
```python
# main.py - FastAPI application entry point
# services/
#   ├── llm_service.py          # OpenAI/Anthropic integration
#   ├── manim_service.py        # Manim code execution
#   ├── scene_service.py        # Scene data management
#   └── export_service.py       # Code generation & export
# models/
#   ├── scene_models.py         # Pydantic models for scene data
#   ├── animation_models.py     # Animation request models
#   └── response_models.py      # API response models
# utils/
#   ├── code_generator.py       # Python AST manipulation
#   ├── sandbox.py              # Secure code execution
#   └── file_manager.py         # Temporary file handling
```

#### LLM Prompt Engineering
```python
SYSTEM_PROMPT = """
You are a Manim animation expert. Generate clean, efficient Manim code based on scene objects and user requests.

Available scene objects: {objects}
User request: {request}

Guidelines:
- Use Manim Community Edition syntax
- Focus on educational clarity
- Include proper timing and easing
- Return only the animation method code
- Use descriptive variable names

Common patterns:
- self.play(Create(object)) for object introduction
- self.play(Transform(obj1, obj2)) for shape changes
- self.play(obj.animate.shift(direction)) for movement
- self.play(Indicate(object)) for highlighting
"""

EXAMPLES = [
    {
        "scene": "Square at center",
        "request": "Break into two triangles",
        "code": """
# Split square into two triangles
triangle1 = Polygon([-1,-1], [1,-1], [1,1])
triangle2 = Polygon([-1,-1], [-1,1], [1,1])
self.play(Transform(square, VGroup(triangle1, triangle2)))
"""
    }
]
```

#### Manim Code Execution
```python
class ManimExecutor:
    def __init__(self):
        self.temp_dir = "/tmp/manim_renders"
        self.timeout = 30  # seconds
    
    async def execute_animation(self, code: str, scene_data: SceneData) -> str:
        # 1. Generate complete Manim scene file
        full_code = self.generate_scene_file(code, scene_data)
        
        # 2. Execute in sandboxed environment
        result = await self.run_manim_safely(full_code)
        
        # 3. Return video file path
        return result.video_path
    
    def generate_scene_file(self, animation_code: str, scene_data: SceneData) -> str:
        return f"""
from manim import *

class GeneratedScene(Scene):
    def construct(self):
        # Initialize objects from scene data
        {self.generate_object_creation(scene_data)}
        
        # User-requested animation
        {animation_code}
"""
```

## Integrations

### OpenAI/Anthropic Integration
```python
class LLMService:
    def __init__(self, provider: str = "openai"):
        self.provider = provider
        self.client = self._initialize_client()
    
    async def generate_animation_code(
        self, 
        scene: SceneData, 
        request: str,
        examples: List[CodeExample] = None
    ) -> LLMResponse:
        prompt = self._build_prompt(scene, request, examples)
        
        response = await self.client.chat.completions.create(
            model="gpt-4" if self.provider == "openai" else "claude-3-sonnet",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=2000
        )
        
        return self._parse_response(response)
```

### Manim Library Integration
- **Version**: Manim Community Edition (latest stable)
- **Rendering**: 1080p by default, configurable
- **Output**: MP4 format for web compatibility
- **Fonts**: Support for LaTeX rendering
- **Extensions**: Custom plugins for educational content

### File Storage Integration
```python
class FileManager:
    def __init__(self, storage_type: str = "local"):
        self.storage = self._initialize_storage(storage_type)
    
    async def store_video(self, video_data: bytes) -> str:
        # Generate unique filename
        filename = f"animation_{uuid.uuid4()}.mp4"
        
        # Store file (local/S3/GCS)
        url = await self.storage.upload(filename, video_data)
        
        # Schedule cleanup after 24 hours
        self._schedule_cleanup(filename)
        
        return url
```

## Development Roadmap

### Phase 1: Core Editor (Week 1-2)
- [ ] Basic canvas with drag-and-drop
- [ ] Object library (Square, Circle, Text)
- [ ] Property panel for object editing
- [ ] Scene serialization

### Phase 2: AI Integration (Week 3-4)
- [ ] Chat interface for animation requests
- [ ] LLM service setup and prompt engineering
- [ ] Basic animation code generation
- [ ] Simple animation preview

### Phase 3: Manim Backend (Week 5-6)
- [ ] FastAPI backend setup
- [ ] Manim code execution pipeline
- [ ] Video generation and serving
- [ ] Error handling and validation

### Phase 4: Polish & Features (Week 7-8)
- [ ] LaTeX object support
- [ ] Animation timeline improvements
- [ ] Export functionality
- [ ] Code optimization and UI polish


## Testing Strategy

### Frontend Testing
- Unit tests for utility functions
- Component testing with React Testing Library
- E2E tests with Playwright for core workflows

### Backend Testing
- Unit tests for all services
- Integration tests for LLM and Manim pipelines
- Load testing for concurrent animation generation

### Quality Assurance
- Code generation quality evaluation
- Animation accuracy verification
- Performance benchmarking