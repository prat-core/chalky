from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import Dict, Any
import logging
import time
import uuid

from app.models.scene import AnimationRequest, AnimationResponse
from app.services.llm_service import llm_service
from app.services.manim_service import manim_service, ManimExecutionError

logger = logging.getLogger(__name__)

router = APIRouter()

# In-memory job storage (in production, use Redis or database)
job_storage: Dict[str, Dict[str, Any]] = {}

@router.post("/animate", response_model=AnimationResponse)
async def create_animation(request: AnimationRequest, background_tasks: BackgroundTasks):
    """Generate and execute Manim animation based on scene and natural language request"""
    
    job_id = str(uuid.uuid4())
    start_time = time.time()
    
    logger.info(f"Starting animation job {job_id} with request: {request.request[:100]}...")
    
    try:
        # Validate scene
        if not request.scene.objects:
            raise HTTPException(
                status_code=400, 
                detail="Scene must contain at least one object"
            )
        
        # Store job status
        job_storage[job_id] = {
            "status": "processing",
            "started_at": start_time,
            "request": request.request
        }
        
        # Step 1: Generate Manim code using Gemini
        logger.info(f"Generating code with Gemini for job {job_id}")
        code_result = await llm_service.generate_animation_code(
            scene=request.scene,
            request=request.request
        )
        
        logger.info(f"Generated code for job {job_id}:\n{code_result['code']}")
        
        # Step 2: Execute Manim code
        logger.info(f"Executing Manim code for job {job_id}")
        execution_result = await manim_service.execute_animation(
            scene=request.scene,
            animation_code=code_result["code"],
            job_id=job_id
        )
        
        execution_time = time.time() - start_time
        
        # Update job status
        job_storage[job_id] = {
            "status": "completed",
            "started_at": start_time,
            "completed_at": time.time(),
            "execution_time": execution_time,
            "video_url": execution_result["video_url"],
            "generated_code": code_result["code"],
            "confidence": code_result["confidence"]
        }
        
        logger.info(f"Successfully completed animation job {job_id} in {execution_time:.2f}s")
        
        return AnimationResponse(
            id=job_id,
            success=True,
            video_url=execution_result["video_url"],
            generated_code=code_result["code"],
            execution_time=execution_time
        )
        
    except ManimExecutionError as e:
        error_msg = f"Manim execution failed: {str(e)}"
        logger.error(f"Job {job_id} failed: {error_msg}")
        
        job_storage[job_id] = {
            "status": "failed",
            "started_at": start_time,
            "failed_at": time.time(),
            "error": error_msg
        }
        
        return AnimationResponse(
            id=job_id,
            success=False,
            error=error_msg,
            execution_time=time.time() - start_time
        )
        
    except Exception as e:
        error_msg = f"Animation generation failed: {str(e)}"
        logger.error(f"Job {job_id} failed: {error_msg}")
        
        job_storage[job_id] = {
            "status": "failed",
            "started_at": start_time,
            "failed_at": time.time(),
            "error": error_msg
        }
        
        return AnimationResponse(
            id=job_id,
            success=False,
            error=error_msg,
            execution_time=time.time() - start_time
        )

@router.get("/status/{job_id}")
async def get_job_status(job_id: str):
    """Get the status of an animation job"""
    
    if job_id not in job_storage:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return job_storage[job_id]

@router.get("/jobs")
async def list_jobs():
    """List all animation jobs (for debugging)"""
    return {
        "jobs": list(job_storage.keys()),
        "total": len(job_storage)
    }

@router.post("/test-gemini")
async def test_gemini_connection():
    """Test Gemini connection with a simple request"""
    
    try:
        # Create a minimal test scene
        from app.models.scene import SceneData, SceneSettings, SceneMetadata, ManimObject
        from datetime import datetime
        
        test_scene = SceneData(
            id="test",
            objects=[
                ManimObject(
                    id="test_square",
                    type="Square",
                    position=[0.0, 0.0],
                    properties={"color": "#3B82F6", "sideLength": 2}
                )
            ],
            settings=SceneSettings(),
            metadata=SceneMetadata(created=datetime.now(), modified=datetime.now())
        )
        
        result = await llm_service.generate_animation_code(
            scene=test_scene,
            request="Make the square appear with a creation animation"
        )
        
        return {
            "success": True,
            "provider": "google-gemini",
            "model": llm_service.model,
            "generated_code": result["code"],
            "confidence": result["confidence"],
            "explanation": result["explanation"]
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "provider": "google-gemini",
            "model": llm_service.model
        }

@router.post("/test-gemini-simple")
async def test_gemini_simple():
    """Simple test of Gemini connection"""
    
    try:
        result = llm_service.test_connection()
        return result
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "provider": "google-gemini"
        } 