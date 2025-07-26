import asyncio
import logging
from typing import Optional, Dict, Any, List
from google import genai
from tenacity import retry, stop_after_attempt, wait_exponential

from app.core.config import settings
from app.models.scene import SceneData, ManimObject

logger = logging.getLogger(__name__)


class LLMService:
    def __init__(self):
        try:
            # Initialize Google Gemini client
            self.client = genai.Client(api_key=settings.GOOGLE_API_KEY)
            self.model = settings.GEMINI_MODEL
            logger.info(f"Initialized Google Gemini client with model: {self.model}")
        except Exception as e:
            logger.error(f"Failed to initialize Gemini client: {str(e)}")
            raise ValueError(f"Failed to initialize Gemini client: {str(e)}")

    @retry(
        stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10)
    )
    async def generate_animation_code(
        self, scene: SceneData, request: str, context: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """Generate Manim animation code based on scene and user request"""

        try:
            # Build the prompt
            prompt = self._build_prompt(scene, request, context)

            logger.info(f"Generating code for request: {request[:100]}...")

            # Call Gemini API
            response_text = await self._call_gemini(prompt)

            # Extract and validate code
            code = self._extract_code(response_text)

            logger.info("Successfully generated Manim code")

            return {
                "code": code,
                "explanation": self._extract_explanation(response_text),
                "confidence": self._estimate_confidence(response_text),
                "raw_response": response_text,
            }

        except Exception as e:
            logger.error(f"Failed to generate code: {str(e)}")
            raise

    def _build_prompt(
        self, scene: SceneData, request: str, context: Optional[List[str]] = None
    ) -> str:
        """Build a structured prompt for Gemini"""

        # Scene description
        scene_description = self._describe_scene(scene)

        # Context from previous interactions
        context_str = ""
        if context:
            context_str = "\n\nPrevious context:\n" + "\n".join(context)

        # Example patterns
        examples = self._get_example_patterns()

        prompt = f"""You are a Manim animation expert. Generate clean, efficient Manim code for mathematical animations.

SCENE DESCRIPTION:
{scene_description}

USER REQUEST:
{request}

GUIDELINES:
- Use Manim Community Edition syntax (import from manim)
- Return ONLY the animation method content (not the full class)
- Use the exact object variable names provided in the scene
- Focus on educational clarity and smooth animations
- Include proper timing with self.play() calls
- Use appropriate animation types: Create, Transform, FadeIn, FadeOut, Write, etc.
- Add self.wait() between major animation steps

EXAMPLE PATTERNS:
{examples}

CODE REQUIREMENTS:
1. Start with object creation/positioning if needed
2. Use self.play() for each animation step
3. Add descriptive comments
4. Include timing with self.wait() calls
5. End with a final self.wait(2)

IMPORTANT: Return only the Python code for the animation method content, no explanations or markdown.{context_str}

Generated animation code:       """

        return prompt

    def _describe_scene(self, scene: SceneData) -> str:
        """Create a textual description of the scene"""
        if not scene.objects:
            return "Empty scene - no objects present."

        descriptions = []
        for obj in scene.objects:
            obj_desc = f"- {obj.type} '{obj.id}' at position {obj.position}"
            if obj.type == "Text":
                obj_desc += f" with text '{obj.properties.get('text', 'Text')}'"
            elif obj.type == "LaTeX":
                obj_desc += f" with formula '{obj.properties.get('tex', 'x^2')}'"
            elif obj.type in ["Square", "Circle"]:
                obj_desc += f" with color {obj.properties.get('color', '#3B82F6')}"
            descriptions.append(obj_desc)

        return "Scene objects:\n" + "\n".join(descriptions)

    def _get_example_patterns(self) -> str:
        """Get example Manim code patterns"""
        return """
# Object creation and introduction
square = Square(color=BLUE).move_to([0, 0, 0])
self.play(Create(square))

# Object transformation
circle = Circle(color=RED)
self.play(Transform(square, circle))

# Text and LaTeX
text = Text("Hello").move_to([0, 1, 0])
formula = MathTex("x^2 + y^2 = r^2").move_to([0, -1, 0])
self.play(Write(text), Write(formula))

# Movement and rotation
self.play(square.animate.shift(RIGHT * 2))
self.play(square.animate.rotate(PI/4))

# Grouping and complex animations
group = VGroup(square, text)
self.play(group.animate.scale(1.5))
"""

    async def _call_gemini(self, prompt: str) -> str:
        """Call Google Gemini API"""
        try:
            # Create async chat session
            chat = self.client.aio.chats.create(model=self.model)

            # Send message and get response
            response = await chat.send_message(prompt)

            if not response or not response.text:
                raise ValueError("Empty response from Gemini")

            return response.text

        except Exception as e:
            logger.error(f"Gemini API call failed: {str(e)}")
            raise

    def _extract_code(self, response: str) -> str:
        """Extract Python code from Gemini response"""
        # Remove markdown code blocks if present
        if "```python" in response:
            start = response.find("```python") + 9
            end = response.find("```", start)
            code = response[start:end].strip()
        elif "```" in response:
            start = response.find("```") + 3
            end = response.find("```", start)
            code = response[start:end].strip()
        else:
            code = response.strip()

        # Clean up the code
        lines = code.split("\n")
        cleaned_lines = []
        for line in lines:
            # Skip empty lines at the beginning
            if not cleaned_lines and not line.strip():
                continue
            cleaned_lines.append(line)

        return "\n".join(cleaned_lines)

    def _extract_explanation(self, response: str) -> str:
        """Extract explanation from response if present"""
        # For now, return a simple explanation
        return "AI-generated Manim animation using Google Gemini."

    def _estimate_confidence(self, response: str) -> float:
        """Estimate confidence in the generated code"""
        # Simple heuristic based on response characteristics
        if "self.play" in response and "import" not in response:
            return 0.85
        elif len(response.split("\n")) > 3:
            return 0.75
        else:
            return 0.65

    def test_connection(self) -> Dict[str, Any]:
        """Test connection to Gemini API"""
        try:
            # Simple sync test
            chat = self.client.chats.create(model=self.model)
            response = chat.send_message("Hello! Can you respond with just 'OK'?")

            return {
                "success": True,
                "model": self.model,
                "response": response.text,
                "message": "Gemini connection successful",
            }
        except Exception as e:
            return {
                "success": False,
                "model": self.model,
                "error": str(e),
                "message": "Gemini connection failed",
            }


# Global LLM service instance
llm_service = LLMService()

