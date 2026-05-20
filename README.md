# File Converter Web App

A clean, user-friendly file conversion web app that converts files between compatible formats (audio, image, and video).

## Features

- **Smart file type detection** - Automatically detects uploaded file type
- **Strict validation** - Only shows valid conversion options (no invalid cross-type conversions)
- **Drag & drop upload** - Simple and intuitive interface
- **Dynamic format search** - Searchable dropdown that updates based on uploaded file
- **Backend validation** - Server-side verification of file types and conversions
- **Ad-ready** - Includes placeholder slots for Google AdSense integration

## Supported Formats

### Image
- PNG, JPG, JPEG, WEBP, BMP, GIF

### Audio
- MP3, WAV, OGG, FLAC, AAC, M4A

### Video
- MP4, WEBM, AVI, MOV, MKV (requires ffmpeg)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/USERNAME/REPO.git
cd REPO
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. For audio conversion, install ffmpeg:
- **Windows**: Download from [ffmpeg.org](https://ffmpeg.org/download.html)
- **macOS**: `brew install ffmpeg`
- **Linux**: `sudo apt install ffmpeg`

## Running the App

```bash
python app.py
```

Visit `http://localhost:8000` in your browser.

## Deployment to GitHub

```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

## Tech Stack

- **Backend**: FastAPI (Python)
- **File Processing**: Pillow (images), pydub (audio)
- **Frontend**: HTML, CSS, JavaScript
- **Deployment**: Ready for GitHub

## Project Structure

```
.
├── app.py              # FastAPI backend
├── static/
│   ├── index.html      # Frontend UI
│   ├── style.css       # Styling
│   └── script.js       # Client-side logic
├── uploads/            # Temporary upload storage
├── outputs/            # Converted files storage
├── requirements.txt    # Python dependencies
└── README.md
```

## API Endpoints

- `GET /` - Serve frontend
- `POST /api/detect` - Detect file type and return valid formats
- `POST /api/convert` - Convert file to target format
- `GET /api/download/{file_id}/{format}` - Download converted file

## License

MIT
