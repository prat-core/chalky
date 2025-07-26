from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
import logging
from dotenv import load_dotenv

from app.api import animation, health
from app.core.config import settings

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

# Create FastAPI application
app = FastAPI(
    title="Chalky Backend",
    description="AI-powered Manim animation generation API using Google Gemini",
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(animation.router, prefix="/api", tags=["animation"])

# Static files for serving generated videos
if os.path.exists(settings.MANIM_OUTPUT_DIR):
    app.mount("/videos", StaticFiles(directory=settings.MANIM_OUTPUT_DIR), name="videos")

@app.on_event("startup")
async def startup_event():
    """Initialize application on startup"""
    logger.info("Starting Chalky Backend with Google Gemini...")
    
    # Create necessary directories
    os.makedirs(settings.MANIM_OUTPUT_DIR, exist_ok=True)
    os.makedirs(settings.TEMP_DIR, exist_ok=True)
    
    logger.info(f"Using Gemini model: {settings.GEMINI_MODEL}")
    logger.info(f"Google API key configured: {bool(settings.GOOGLE_API_KEY)}")
    logger.info("Chalky Backend started successfully!")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("Shutting down Chalky Backend...")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.DEBUG
    ) 