from fastapi import APIRouter
from app.core.config import settings
import subprocess
import sys

router = APIRouter()

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    
    # Check if Manim is available
    manim_available = False
    manim_version = None
    
    try:
        result = subprocess.run(
            ["manim", "--version"], 
            capture_output=True, 
            text=True, 
            timeout=5
        )
        if result.returncode == 0:
            manim_available = True
            manim_version = result.stdout.strip()
    except Exception:
        pass
    
    # Check if Google API key is configured
    gemini_configured = bool(settings.GOOGLE_API_KEY)
    
    return {
        "status": "healthy",
        "version": "1.0.0",
        "python_version": sys.version,
        "llm_provider": "google-gemini",
        "gemini_model": settings.GEMINI_MODEL,
        "gemini_configured": gemini_configured,
        "manim_available": manim_available,
        "manim_version": manim_version,
        "debug_mode": settings.DEBUG
    } 