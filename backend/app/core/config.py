from pydantic_settings import BaseSettings
from typing import Literal
import os

class Settings(BaseSettings):
    # Google Gemini Configuration
    GOOGLE_API_KEY: str = "AIzaSyCDRd9kJxnKaqwLwVbvbPocZMTNFFNIQO8"
    GEMINI_MODEL: str = "gemini-2.5-pro"
    
    # Manim Configuration
    MANIM_QUALITY: Literal["low_quality", "medium_quality", "high_quality"] = "medium_quality"
    MANIM_OUTPUT_DIR: str = "./output"
    TEMP_DIR: str = "./temp"
    
    # API Configuration
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    DEBUG: bool = True
    
    # CORS Settings
    FRONTEND_URL: str = "http://localhost:3000"
    
    # Execution Limits
    MAX_EXECUTION_TIME: int = 30  # seconds
    MAX_CONCURRENT_JOBS: int = 3
    
    class Config:
        env_file = ".env"
        case_sensitive = True

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        
        # Validate Google API key
        if not self.GOOGLE_API_KEY:
            raise ValueError("GOOGLE_API_KEY is required for Gemini integration")

# Global settings instance
settings = Settings() 