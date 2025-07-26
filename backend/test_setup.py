#!/usr/bin/env python3
"""
Test script to verify backend setup and dependencies for Google Gemini integration
"""

import sys
import subprocess
import importlib.util
import os

def check_dependency(package_name, import_name=None):
    """Check if a dependency is installed"""
    if import_name is None:
        import_name = package_name
    
    try:
        importlib.import_module(import_name)
        print(f"✅ {package_name} is installed")
        return True
    except ImportError:
        print(f"❌ {package_name} is NOT installed")
        return False

def check_manim():
    """Check if Manim is available"""
    try:
        result = subprocess.run(
            ["manim", "--version"], 
            capture_output=True, 
            text=True, 
            timeout=5
        )
        if result.returncode == 0:
            version = result.stdout.strip()
            print(f"✅ Manim is available: {version}")
            return True
        else:
            print(f"❌ Manim command failed: {result.stderr}")
            return False
    except FileNotFoundError:
        print("❌ Manim is NOT installed or not in PATH")
        return False
    except Exception as e:
        print(f"❌ Error checking Manim: {e}")
        return False

def check_gemini_config():
    """Check if Google API key is configured"""
    api_key = os.getenv('GOOGLE_API_KEY')
    if api_key and api_key != 'your_google_api_key_here':
        print("✅ Google API key is configured")
        return True
    else:
        print("⚠️  Google API key is NOT configured")
        return False

def test_gemini_import():
    """Test if google-genai can be imported"""
    try:
        from google import genai
        print("✅ Google GenAI library can be imported")
        return True
    except ImportError as e:
        print(f"❌ Failed to import google-genai: {e}")
        return False

def main():
    """Run all setup checks"""
    print("🔍 Checking Chalky Backend Setup (Google Gemini)...\n")
    
    print("Python Dependencies:")
    dependencies = [
        ("fastapi", "fastapi"),
        ("uvicorn", "uvicorn"),
        ("pydantic", "pydantic"),
        ("google-genai", None),  # Will test import separately
        ("aiofiles", "aiofiles"),
        ("python-dotenv", "dotenv"),
        ("tenacity", "tenacity"),
        ("pydantic-settings", "pydantic_settings"),
    ]
    
    all_deps_ok = True
    for package, import_name in dependencies:
        if package == "google-genai":
            continue  # Test separately
        if not check_dependency(package, import_name):
            all_deps_ok = False
    
    # Special test for google-genai
    gemini_import_ok = test_gemini_import()
    if not gemini_import_ok:
        all_deps_ok = False
    
    print("\nSystem Dependencies:")
    manim_ok = check_manim()
    
    print("\nConfiguration:")
    gemini_config_ok = check_gemini_config()
    
    print(f"\nPython Version: {sys.version}")
    
    print("\n" + "="*50)
    if all_deps_ok and manim_ok:
        print("🎉 Backend setup is complete!")
        print("\nNext steps:")
        if not gemini_config_ok:
            print("1. Get Google API key from: https://makersuite.google.com/app/apikey")
            print("2. Create .env file: cp .env.template .env")
            print("3. Add your API key to .env file")
            print("4. Run: python main.py")
        else:
            print("1. Run: python main.py")
        print("5. Visit: http://localhost:8000/docs")
        print("6. Test Gemini: curl -X POST http://localhost:8000/api/test-gemini-simple")
    else:
        print("⚠️  Setup incomplete. Please install missing dependencies.")
        if not all_deps_ok:
            print("   Run: pip install -r requirements.txt")
        if not manim_ok:
            print("   Install Manim: https://docs.manim.community/en/stable/installation.html")
        if not gemini_config_ok:
            print("   Configure Google API key in .env file")

if __name__ == "__main__":
    main() 