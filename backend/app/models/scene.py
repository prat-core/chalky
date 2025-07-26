from pydantic import BaseModel, Field
from typing import List, Dict, Any, Literal, Optional
from datetime import datetime

class ObjectState(BaseModel):
    id: str
    timestamp: float
    properties: Dict[str, Any]
    transition: Optional[Dict[str, Any]] = None

class ManimObject(BaseModel):
    id: str
    type: Literal["Square", "Circle", "Text", "LaTeX", "Line", "Arrow"]
    position: List[float] = Field(..., min_length=2, max_length=2)
    rotation: float = 0.0
    scale: float = 1.0
    properties: Dict[str, Any]
    states: List[ObjectState] = []
    layer: int = 0

class SceneSettings(BaseModel):
    width: int = 1920
    height: int = 1080
    backgroundColor: str = "#000000"
    frameRate: int = 60
    quality: Literal["low", "medium", "high"] = "medium"

class SceneMetadata(BaseModel):
    created: datetime
    modified: datetime
    version: str = "1.0.0"

class SceneData(BaseModel):
    id: str
    objects: List[ManimObject] = []
    settings: SceneSettings
    metadata: SceneMetadata

class AnimationRequest(BaseModel):
    scene: SceneData
    request: str = Field(..., min_length=1, max_length=1000)
    settings: Optional[Dict[str, Any]] = None

class AnimationResponse(BaseModel):
    id: str
    success: bool
    video_url: Optional[str] = None
    generated_code: Optional[str] = None
    error: Optional[str] = None
    execution_time: Optional[float] = None 