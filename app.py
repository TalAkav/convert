from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import os
import uuid
from pathlib import Path
from PIL import Image
from pydub import AudioSegment
import mimetypes

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

UPLOAD_DIR = Path("uploads")
OUTPUT_DIR = Path("outputs")
UPLOAD_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)

CONVERSION_MAP = {
    "image": {
        "formats": ["png", "jpg", "jpeg", "webp", "bmp", "gif"],
        "mime_types": ["image/png", "image/jpeg", "image/webp", "image/bmp", "image/gif"]
    },
    "audio": {
        "formats": ["mp3", "wav", "ogg", "flac", "aac", "m4a"],
        "mime_types": ["audio/mpeg", "audio/wav", "audio/ogg", "audio/flac", "audio/aac", "audio/mp4"]
    },
    "video": {
        "formats": ["mp4", "webm", "avi", "mov", "mkv"],
        "mime_types": ["video/mp4", "video/webm", "video/x-msvideo", "video/quicktime", "video/x-matroska"]
    }
}

def detect_file_type(filename: str, content_type: str) -> str:
    for file_type, data in CONVERSION_MAP.items():
        if content_type in data["mime_types"]:
            return file_type
        ext = filename.split(".")[-1].lower()
        if ext in data["formats"]:
            return file_type
    return None

def get_valid_formats(file_type: str) -> list:
    return CONVERSION_MAP.get(file_type, {}).get("formats", [])

def convert_image(input_path: Path, output_path: Path, target_format: str):
    img = Image.open(input_path)
    if img.mode == "RGBA" and target_format.lower() in ["jpg", "jpeg"]:
        img = img.convert("RGB")
    
    # Pillow uses 'JPEG' not 'JPG'
    save_format = "JPEG" if target_format.lower() in ["jpg", "jpeg"] else target_format.upper()
    img.save(output_path, format=save_format)

def convert_audio(input_path: Path, output_path: Path, target_format: str):
    audio = AudioSegment.from_file(input_path)
    audio.export(output_path, format=target_format)

@app.get("/", response_class=HTMLResponse)
async def read_root():
    with open("static/index.html", "r") as f:
        return f.read()

@app.post("/api/detect")
async def detect_file(file: UploadFile = File(...)):
    file_type = detect_file_type(file.filename, file.content_type)
    if not file_type:
        raise HTTPException(status_code=400, detail="Unsupported file type")
    
    valid_formats = get_valid_formats(file_type)
    return {
        "file_type": file_type,
        "valid_formats": valid_formats,
        "filename": file.filename
    }

@app.post("/api/convert")
async def convert_file(
    file: UploadFile = File(...),
    target_format: str = Form(...)
):
    file_type = detect_file_type(file.filename, file.content_type)
    if not file_type:
        raise HTTPException(status_code=400, detail="Unsupported file type")
    
    valid_formats = get_valid_formats(file_type)
    if target_format.lower() not in valid_formats:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid conversion: {file_type} cannot be converted to {target_format}"
        )
    
    file_id = str(uuid.uuid4())
    input_ext = file.filename.split(".")[-1]
    input_path = UPLOAD_DIR / f"{file_id}.{input_ext}"
    output_path = OUTPUT_DIR / f"{file_id}.{target_format}"
    
    with open(input_path, "wb") as f:
        f.write(await file.read())
    
    try:
        if file_type == "image":
            convert_image(input_path, output_path, target_format)
        elif file_type == "audio":
            convert_audio(input_path, output_path, target_format)
        elif file_type == "video":
            raise HTTPException(status_code=501, detail="Video conversion requires ffmpeg")
        
        return {
            "success": True,
            "download_id": file_id,
            "format": target_format
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Conversion failed: {str(e)}")
    finally:
        if input_path.exists():
            input_path.unlink()

@app.get("/api/download/{file_id}/{format}")
async def download_file(file_id: str, format: str):
    output_path = OUTPUT_DIR / f"{file_id}.{format}"
    if not output_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(
        output_path,
        media_type="application/octet-stream",
        filename=f"converted.{format}"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
