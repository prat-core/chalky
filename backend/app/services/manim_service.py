import asyncio
import logging
import os
import subprocess
import tempfile
import uuid
from pathlib import Path
from typing import Dict, Any, Optional
import aiofiles

from app.core.config import settings
from app.models.scene import SceneData, ManimObject

logger = logging.getLogger(__name__)

class ManimExecutionError(Exception):
    """Custom exception for Manim execution errors"""
    pass

class ManimService:
    def __init__(self):
        self.output_dir = Path(settings.MANIM_OUTPUT_DIR)
        self.temp_dir = Path(settings.TEMP_DIR)
        self.quality = settings.MANIM_QUALITY
        
        # Ensure directories exist
        self.output_dir.mkdir(exist_ok=True)
        self.temp_dir.mkdir(exist_ok=True)
    
    async def execute_animation(
        self, 
        scene: SceneData, 
        animation_code: str,
        job_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Execute Manim animation code and return video file info"""
        
        if not job_id:
            job_id = str(uuid.uuid4())
        
        logger.info(f"Executing animation job {job_id}")
        
        try:
            # Generate complete Manim scene file
            scene_file_content = self._generate_scene_file(scene, animation_code, job_id)
            
            # Write scene file to temporary location
            scene_file_path = self.temp_dir / f"scene_{job_id}.py"
            async with aiofiles.open(scene_file_path, 'w') as f:
                await f.write(scene_file_content)
            
            # Execute Manim command
            video_path = await self._run_manim(scene_file_path, job_id)
            
            # Cleanup temporary files
            await self._cleanup_temp_files(scene_file_path)
            
            # Get video file info
            video_info = await self._get_video_info(video_path)
            
            logger.info(f"Successfully generated video for job {job_id}")
            
            return {
                "job_id": job_id,
                "video_path": str(video_path),
                "video_url": f"/videos/{video_path.name}",
                "success": True,
                **video_info
            }
            
        except Exception as e:
            logger.error(f"Failed to execute animation {job_id}: {str(e)}")
            # Cleanup on error
            await self._cleanup_temp_files(scene_file_path if 'scene_file_path' in locals() else None)
            raise ManimExecutionError(f"Animation execution failed: {str(e)}")
    
    def _generate_scene_file(self, scene: SceneData, animation_code: str, job_id: str) -> str:
        """Generate complete Manim scene file"""
        
        # Generate object initialization code
        object_init_code = self._generate_object_initialization(scene.objects)
        
        # Create the complete scene file
        scene_file = f"""#!/usr/bin/env python3
from manim import *
import numpy as np

class GeneratedScene_{job_id.replace('-', '_')}(Scene):
    def construct(self):
        # Scene settings
        self.camera.background_color = "{scene.settings.backgroundColor}"
        
        # Initialize objects from scene data
{object_init_code}
        
        # User-requested animation
{self._indent_code(animation_code, 2)}
        
        # Final pause
        self.wait(2)

# This allows the script to be run directly
if __name__ == "__main__":
    from manim import config
    config.media_width = {scene.settings.width}
    config.media_height = {scene.settings.height}
    config.frame_rate = {scene.settings.frameRate}
"""
        
        return scene_file
    
    def _generate_object_initialization(self, objects: list[ManimObject]) -> str:
        """Generate code to initialize all objects in the scene"""
        if not objects:
            return "        # No objects in scene"
        
        init_lines = []
        for obj in objects:
            init_line = self._generate_object_init_line(obj)
            init_lines.append(f"        {init_line}")
        
        return "\n".join(init_lines)
    
    def _generate_object_init_line(self, obj: ManimObject) -> str:
        """Generate initialization line for a single object"""
        obj_id = obj.id.replace('-', '_')  # Make valid Python variable name
        pos = obj.position
        props = obj.properties
        
        if obj.type == "Square":
            side_length = props.get('sideLength', 2)
            color = props.get('color', '#3B82F6')
            return f"{obj_id} = Square(side_length={side_length}, color='{color}').move_to([{pos[0]}, {pos[1]}, 0])"
        
        elif obj.type == "Circle":
            radius = props.get('radius', 1)
            color = props.get('color', '#EF4444')
            return f"{obj_id} = Circle(radius={radius}, color='{color}').move_to([{pos[0]}, {pos[1]}, 0])"
        
        elif obj.type == "Text":
            text = props.get('text', 'Text')
            font_size = props.get('fontSize', 24)
            color = props.get('color', '#FFFFFF')
            return f"{obj_id} = Text('{text}', font_size={font_size}, color='{color}').move_to([{pos[0]}, {pos[1]}, 0])"
        
        elif obj.type == "LaTeX":
            tex = props.get('tex', 'x^2')
            font_size = props.get('fontSize', 24)
            color = props.get('color', '#FFFFFF')
            return f"{obj_id} = MathTex('{tex}', font_size={font_size}, color='{color}').move_to([{pos[0]}, {pos[1]}, 0])"
        
        else:
            # Default fallback
            return f"{obj_id} = Square().move_to([{pos[0]}, {pos[1]}, 0])  # Unsupported type: {obj.type}"
    
    def _indent_code(self, code: str, indent_level: int) -> str:
        """Indent code by specified number of levels (4 spaces each)"""
        indent = "    " * indent_level
        lines = code.split('\n')
        indented_lines = [indent + line if line.strip() else line for line in lines]
        return '\n'.join(indented_lines)
    
    async def _run_manim(self, scene_file_path: Path, job_id: str) -> Path:
        """Run Manim command to generate video"""
        
        class_name = f"GeneratedScene_{job_id.replace('-', '_')}"
        output_file = f"animation_{job_id}"
        
        # Construct Manim command
        cmd = [
            "manim",
            "-q", self.quality,
            "--output_file", output_file,
            str(scene_file_path),
            class_name
        ]
        
        logger.info(f"Running command: {' '.join(cmd)}")
        
        try:
            # Run Manim command with timeout
            process = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                cwd=str(self.output_dir)
            )
            
            stdout, stderr = await asyncio.wait_for(
                process.communicate(), 
                timeout=settings.MAX_EXECUTION_TIME
            )
            
            if process.returncode != 0:
                error_msg = stderr.decode('utf-8') if stderr else "Unknown error"
                raise ManimExecutionError(f"Manim execution failed: {error_msg}")
            
            # Find the generated video file
            video_path = await self._find_generated_video(output_file)
            
            return video_path
            
        except asyncio.TimeoutError:
            raise ManimExecutionError(f"Animation execution timed out after {settings.MAX_EXECUTION_TIME} seconds")
        except Exception as e:
            raise ManimExecutionError(f"Failed to execute Manim: {str(e)}")
    
    async def _find_generated_video(self, output_file: str) -> Path:
        """Find the generated video file in the output directory"""
        
        # Common video extensions Manim might generate
        extensions = ['.mp4', '.mov', '.avi']
        
        for ext in extensions:
            video_path = self.output_dir / f"{output_file}{ext}"
            if video_path.exists():
                return video_path
        
        # If exact name not found, look for files with similar names
        for file_path in self.output_dir.glob(f"{output_file}*"):
            if file_path.suffix.lower() in extensions:
                return file_path
        
        raise ManimExecutionError(f"Generated video file not found: {output_file}")
    
    async def _get_video_info(self, video_path: Path) -> Dict[str, Any]:
        """Get information about the generated video"""
        
        if not video_path.exists():
            raise ManimExecutionError(f"Video file not found: {video_path}")
        
        stat = video_path.stat()
        
        return {
            "file_size": stat.st_size,
            "file_name": video_path.name,
            "created_at": stat.st_ctime
        }
    
    async def _cleanup_temp_files(self, scene_file_path: Optional[Path]):
        """Clean up temporary files"""
        if scene_file_path and scene_file_path.exists():
            try:
                scene_file_path.unlink()
                logger.info(f"Cleaned up temporary file: {scene_file_path}")
            except Exception as e:
                logger.warning(f"Failed to cleanup temp file {scene_file_path}: {e}")

# Global Manim service instance
manim_service = ManimService() 