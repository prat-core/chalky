# Chalky Backend

AI-powered Manim animation generation API built with FastAPI and Google Gemini.

## Features

- **Natural Language Animation**: Convert natural language descriptions into Manim code using Google Gemini
- **Google Gemini Integration**: Powered by Google's latest Gemini 2.0 Flash model
- **Manim Execution**: Automated video generation from AI-generated code
- **RESTful API**: Clean API endpoints for frontend integration

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Install Manim

Follow the [official Manim installation guide](https://docs.manim.community/en/stable/installation.html) for your platform.

### 3. Environment Configuration

Create a `.env` file based on `.env.template`:

```bash
cp .env.template .env
```

Configure your environment variables:

```env
# Required: Google API Key for Gemini
GOOGLE_API_KEY=your_google_api_key_here

# Optional: Customize Gemini model (default: gemini-2.0-flash-001)
GEMINI_MODEL=gemini-2.0-flash-001

# Optional: Customize other settings
MANIM_QUALITY=medium_quality
API_PORT=8000
DEBUG=True
```

### 4. Get Google API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env` file

### 5. Run the Server

```bash
python main.py
```

Or with uvicorn directly:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

### Health Check
```
GET /api/health
```

### Generate Animation
```
POST /api/animate
Content-Type: application/json

{
  "scene": {
    "id": "scene-123",
    "objects": [
      {
        "id": "square-1",
        "type": "Square",
        "position": [0, 0],
        "properties": {"color": "#3B82F6", "sideLength": 2}
      }
    ],
    "settings": {
      "width": 1920,
      "height": 1080,
      "backgroundColor": "#000000"
    },
    "metadata": {
      "created": "2024-01-01T00:00:00",
      "modified": "2024-01-01T00:00:00"
    }
  },
  "request": "Make the square rotate 90 degrees clockwise"
}
```

### Job Status
```
GET /api/status/{job_id}
```

### Test Gemini Connection
```
POST /api/test-gemini
```

### Simple Connection Test
```
POST /api/test-gemini-simple
```

## Usage Example

1. **Send animation request** with scene data and natural language description
2. **Receive job ID** and poll status endpoint for completion
3. **Get video URL** when job completes successfully
4. **Stream or download** the generated video

## Architecture

```
backend/
├── app/
│   ├── api/           # API endpoints
│   ├── core/          # Configuration and settings
│   ├── models/        # Pydantic data models
│   └── services/      # Business logic services
├── output/            # Generated video files
├── temp/              # Temporary files
└── main.py           # FastAPI application
```

## Development

### Testing Gemini Integration

```bash
# Simple connection test
curl -X POST "http://localhost:8000/api/test-gemini-simple"

# Full animation test
curl -X POST "http://localhost:8000/api/test-gemini"
```

### Health Check

```bash
curl "http://localhost:8000/api/health"
```

### API Documentation

Visit `http://localhost:8000/docs` for interactive API documentation when running in debug mode.

## Troubleshooting

### Common Issues

1. **Manim not found**: Ensure Manim is properly installed and available in PATH
2. **Google API key errors**: 
   - Verify your Google API key is correctly set in `.env`
   - Ensure the key has access to Gemini API
   - Check [Google AI Studio](https://makersuite.google.com/) for API limits
3. **Permission errors**: Check write permissions for output and temp directories
4. **Memory issues**: Large animations may require more RAM; consider reducing quality

### Gemini-Specific Issues

- **Rate Limits**: Gemini has API rate limits; check your quota in Google AI Studio
- **Model Availability**: Ensure `gemini-2.0-flash-001` is available in your region
- **Content Filtering**: Some animation requests may be filtered by Google's safety policies

### Logs

The application logs detailed information about:
- Gemini API requests and responses
- Manim execution output
- Error details and stack traces

Check the console output for debugging information.

## Model Information

- **Default Model**: `gemini-2.0-flash-001`
- **Capabilities**: Latest Google Gemini model with enhanced reasoning and code generation
- **Performance**: Optimized for fast response times and accurate code generation
- **Alternatives**: You can switch to other Gemini models by updating `GEMINI_MODEL` in your `.env` file 