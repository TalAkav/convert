# File Converter Web App

A clean, user-friendly file conversion web app that converts image files between compatible formats - entirely in your browser!

## Features

- **100% Client-Side** - No server required, all processing happens in your browser
- **Smart file type detection** - Automatically detects uploaded file type
- **Strict validation** - Only shows valid conversion options (no invalid cross-type conversions)
- **Drag & drop upload** - Simple and intuitive interface
- **Dynamic format search** - Searchable dropdown that updates based on uploaded file
- **Privacy-focused** - Your files never leave your device
- **Ad-ready** - Includes placeholder slots for Google AdSense integration

## Supported Formats

### Image (Browser-based conversion)
- PNG ↔ JPG/JPEG
- PNG ↔ WEBP
- PNG ↔ BMP
- JPG ↔ PNG
- JPG ↔ WEBP
- And all combinations between supported formats

### Audio & Video
Audio and video conversion require server-side processing and are not supported in this browser-only version.

## Installation

No installation required! Just open `index.html` in your browser.

### Option 1: Direct File Open
1. Download or clone this repository
2. Open `index.html` in any modern browser
3. Start converting!

### Option 2: Local Server (Optional)
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

## Usage

1. **Upload**: Drag & drop an image file or click to browse
2. **Select Format**: Choose your target format from the dropdown
3. **Convert**: Click the convert button
4. **Download**: Download your converted file

## Deployment to GitHub Pages

This app works perfectly with GitHub Pages:

```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

Then enable GitHub Pages:
1. Go to repository Settings
2. Navigate to Pages
3. Select "main" branch as source
4. Your app will be live at `https://USERNAME.github.io/REPO/`

## Tech Stack

- **Frontend**: Pure HTML, CSS, JavaScript
- **Image Processing**: Canvas API (browser-native)
- **No Dependencies**: Zero npm packages or build tools required

## Project Structure

```
.
├── index.html          # Main HTML file
├── style.css           # Styling
├── script.js           # Client-side conversion logic
└── README.md
```

## Browser Compatibility

Works in all modern browsers that support:
- Canvas API
- File API
- Blob API

Tested on:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Privacy

All file processing happens locally in your browser. No files are uploaded to any server, ensuring complete privacy and security.

## Ad Integration

The app includes placeholder slots for Google AdSense:
- Top banner (728x90)
- Sidebar (300x250)

Simply replace the placeholder divs with your AdSense code.

## Limitations

- Image conversion only (audio/video require server-side processing)
- BMP support varies by browser
- Large images may take longer to process
- Output quality depends on browser's Canvas implementation

## License

MIT

## Contributing

Pull requests are welcome! For major changes, please open an issue first.
