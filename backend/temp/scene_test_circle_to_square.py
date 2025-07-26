#!/usr/bin/env python3
from manim import *
import numpy as np

class GeneratedScene_test_circle_to_square(Scene):
    def construct(self):
        # Scene settings
        self.camera.background_color = "#000000"
        
        # Initialize objects from scene data
        main_circle = Circle(radius=1.5, color='#EF4444').move_to([0.0, 0.0, 0])
        
        # User-requested animation
        # Create the main circle object
                main_circle = Circle(color="#EF4444", radius=1.0).move_to([0.0, 0.0, 0.0])

                # 1. Animate the creation of the circle
                self.play(Create(main_circle))
                self.wait(1)

                # 2. Create the target square for the transformation
                # A default Square has a side length of 2, matching the circle's diameter
                # This makes it "roughly the same size" as requested.
                square = Square(color="#EF4444").move_to(main_circle.get_center())

                # 3. Animate the smooth transformation from circle to square
                self.play(Transform(main_circle, square, run_time=1.5))
                self.wait(1)

                # 4. Highlight the resulting square with a brief pulse
                # The 'there_and_back' rate function creates a smooth out-and-in effect.
                # Note that the 'main_circle' variable now points to the square mobject.
                self.play(main_circle.animate.scale(1.2), run_time=0.5, rate_func=there_and_back)
        
                # 5. Hold the final state of the animation
                self.wait(2)
        
        # Final pause
        self.wait(2)

# This allows the script to be run directly
if __name__ == "__main__":
    from manim import config
    config.media_width = 1920
    config.media_height = 1080
    config.frame_rate = 60
