let uploadedFile = null;
let validFormats = [];
let selectedFormat = null;

const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const fileType = document.getElementById('fileType');
const conversionSection = document.getElementById('conversionSection');
const formatSearch = document.getElementById('formatSearch');
const formatDropdown = document.getElementById('formatDropdown');
const convertBtn = document.getElementById('convertBtn');
const resultSection = document.getElementById('resultSection');
const downloadBtn = document.getElementById('downloadBtn');
const errorMessage = document.getElementById('errorMessage');

dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);
    }
});

async function handleFile(file) {
    uploadedFile = file;
    hideError();

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/api/detect', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            showError(error.detail);
            return;
        }

        const data = await response.json();
        validFormats = data.valid_formats;

        fileName.textContent = file.name;
        fileType.textContent = data.file_type;

        dropZone.style.display = 'none';
        fileInfo.style.display = 'flex';
        conversionSection.style.display = 'block';

        renderFormatOptions();
    } catch (error) {
        showError('Failed to process file. Please try again.');
    }
}

function renderFormatOptions() {
    formatDropdown.innerHTML = '';
    validFormats.forEach(format => {
        const option = document.createElement('div');
        option.className = 'format-option';
        option.textContent = format.toUpperCase();
        option.onclick = () => selectFormat(format);
        formatDropdown.appendChild(option);
    });
}

function filterFormats(query) {
    const filtered = validFormats.filter(f =>
        f.toLowerCase().includes(query.toLowerCase())
    );

    formatDropdown.innerHTML = '';
    filtered.forEach(format => {
        const option = document.createElement('div');
        option.className = 'format-option';
        option.textContent = format.toUpperCase();
        option.onclick = () => selectFormat(format);
        formatDropdown.appendChild(option);
    });
}

formatSearch.addEventListener('input', (e) => {
    const query = e.target.value;
    if (query) {
        filterFormats(query);
        formatDropdown.classList.add('show');
    } else {
        renderFormatOptions();
        formatDropdown.classList.remove('show');
    }
});

formatSearch.addEventListener('focus', () => {
    formatDropdown.classList.add('show');
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrapper')) {
        formatDropdown.classList.remove('show');
    }
});

function selectFormat(format) {
    selectedFormat = format;
    formatSearch.value = format.toUpperCase();
    formatDropdown.classList.remove('show');
    convertBtn.disabled = false;
}

convertBtn.addEventListener('click', async () => {
    if (!selectedFormat || !uploadedFile) return;

    convertBtn.disabled = true;
    convertBtn.textContent = 'Converting...';
    hideError();

    const formData = new FormData();
    formData.append('file', uploadedFile);
    formData.append('target_format', selectedFormat);

    try {
        const response = await fetch('/api/convert', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            showError(error.detail);
            convertBtn.disabled = false;
            convertBtn.textContent = 'Convert';
            return;
        }

        const data = await response.json();

        conversionSection.style.display = 'none';
        resultSection.style.display = 'block';

        downloadBtn.onclick = () => {
            window.location.href = `/api/download/${data.download_id}/${data.format}`;
        };
    } catch (error) {
        showError('Conversion failed. Please try again.');
        convertBtn.disabled = false;
        convertBtn.textContent = 'Convert';
    }
});

function resetUpload() {
    uploadedFile = null;
    validFormats = [];
    selectedFormat = null;

    dropZone.style.display = 'block';
    fileInfo.style.display = 'none';
    conversionSection.style.display = 'none';
    resultSection.style.display = 'none';

    fileInput.value = '';
    formatSearch.value = '';
    convertBtn.disabled = true;
    convertBtn.textContent = 'Convert';
    hideError();
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}
