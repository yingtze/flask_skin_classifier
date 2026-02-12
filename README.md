# AI Skin Classifier - Aplikasi Deteksi Penyakit Kulit Berbasis AI

**Versi**: 1.0  
**Status**: Production Ready  
**Bahasa**: Bahasa Indonesia (Dokumentasi Bahasa English tersedia)

Aplikasi web modern untuk mendeteksi penyakit kulit menggunakan model deep learning YOLOv8. Dibangun dengan Flask backend dan Alpine.js frontend untuk pengalaman pengguna yang responsif dan intuitif.

---

## 📋 Daftar Isi

- [Gambaran Umum](#gambaran-umum)
- [Fitur](#fitur)
- [Tech Stack](#tech-stack)
- [Instalasi](#instalasi)
- [Cara Menjalankan](#cara-menjalankan)
- [Struktur Folder](#struktur-folder)
- [API Endpoints](#api-endpoints)
- [Informasi Model](#informasi-model)
- [Dokumentasi Teknis](#dokumentasi-teknis)
- [Troubleshooting](#troubleshooting)
- [Disclaimer](#disclaimer)

---

## 🎯 Gambaran Umum

AI Skin Classifier adalah sistem otomatis untuk analisis awal kondisi kulit berdasarkan foto. Aplikasi ini menggunakan artificial intelligence untuk mengidentifikasi 5 jenis penyakit kulit umum dengan akurasi tinggi.

### Penyakit yang Terdeteksi

1. **Jerawat (Acne)** - Peradangan pada folikel rambut dan kelenjar sebum
2. **Eksim (Eczema)** - Peradangan kulit kronis yang menyebabkan gatal dan iritasi
3. **Herpes** - Infeksi virus yang menyebabkan lesi dan lepuhan
4. **Panu (Tinea Versicolor)** - Infeksi jamur yang menyebabkan perubahan warna kulit
5. **Rosacea** - Kondisi kronis dengan wajah merah dan pembuluh darah terlihat

---

## ✨ Fitur

### Analisis Gambar
- ✅ Upload foto skin disease dengan preview real-time
- ✅ Drag-and-drop support untuk kemudahan
- ✅ Analisis instant dengan AI model YOLOv8
- ✅ Confidence score dengan animasi visual
- ✅ Detailed prediction dengan severity level

### Multi-Bahasa
- ✅ Dukungan penuh Bahasa Indonesia
- ✅ Dukungan penuh Bahasa English
- ✅ Toggle bahasa real-time tanpa reload halaman
- ✅ Sistem i18n yang mudah di-extend

### User Interface
- ✅ Dark theme modern dengan kontras optimal (WCAG AA)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Animasi halus (scan animation, progress ring, transitions)
- ✅ Toast notifications untuk feedback user
- ✅ Loading states yang jelas dan informatif

### Manajemen File
- ✅ Remove/Delete button pada image preview
- ✅ One-click reset ke state awal
- ✅ Auto-cleanup file upload setelah 1 jam
- ✅ Secure file handling dengan validation

### Galeri & Referensi
- ✅ Gallery contoh gambar untuk testing
- ✅ Model information dengan performance metrics
- ✅ Probability bars untuk semua class predictions
- ✅ Action recommendations berdasarkan hasil

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Flask 3.0+ (Python web framework)
- **ML Model**: YOLOv8 Small (Ultralytics YOLO)
- **Image Processing**: Pillow, OpenCV, NumPy
- **Web Server**: Werkzeug (built-in Flask)

### Frontend
- **UI Framework**: Alpine.js 3.x (Reactive JavaScript)
- **Styling**: Tailwind CSS (Atomic utility-first CSS)
- **Icons**: SVG inline
- **Fonts**: Inter font family (Google Fonts)

### DevOps
- **Python Version**: 3.10+
- **Package Manager**: pip
- **Virtual Environment**: venv atau Conda
- **Browser Support**: Chrome, Firefox, Safari, Edge (modern versions)

---

## 📥 Instalasi

### Prasyarat

- Python 3.10 atau lebih baru
- pip atau conda
- ~500MB disk space (untuk model + dependencies)
- Modern web browser

### Step 1: Clone/Setup Project

```bash
# Navigasi ke direktori project
cd flask_skin_classifier

# Atau jika dari fresh clone
git clone <repository-url>
cd flask_skin_classifier
```

### Step 2: Buat Virtual Environment

**Menggunakan venv (recommended):**
```bash
# Buat virtual environment
python3.10 -m venv venv

# Activate virtual environment
# MacOS / Linux:
source venv/bin/activate

# Windows:
venv\Scripts\activate
```

**Atau menggunakan Conda:**
```bash
# Buat conda environment
conda create -n flask_skin_classifier python=3.10 -y

# Activate conda environment
conda activate flask_skin_classifier
```

### Step 3: Install Dependencies

```bash
# Upgrade pip terlebih dahulu
pip install --upgrade pip

# Install dependencies dari requirements.txt
pip install -r requirements.txt
```

**Dependencies yang akan ter-install:**
- Flask - Web framework
- ultralytics - YOLOv8 model
- Pillow - Image processing
- NumPy - Numerical computing
- dan dependencies lainnya (lihat requirements.txt)

### Step 4: Verifikasi Model

Pastikan file model ada di direktori `models/`:

```bash
# Cek file model
ls -la models/

# Seharusnya ada file seperti:
# - yolo-skin.onnx (recommended)
# - best-skin.pt (alternative)
# - skin-best.pt (alternative)
```

Jika model belum ada, download dari repository atau path yang sesuai.

### Step 5: Konfigurasi (Optional)

Edit `config.py` untuk customize:

```python
# Model configuration
MODEL_PATH = "models/yolo-skin.onnx"  # Path ke model file

# Upload configuration
UPLOAD_FOLDER = "static/uploads"
UPLOAD_RETENTION_MINUTES = 60  # Cleanup setelah 60 menit

# Server configuration
DEBUG = False  # Set True hanya untuk development
MAX_CONTENT_LENGTH = 5 * 1024 * 1024  # Max file size 5MB
```

---

## 🚀 Cara Menjalankan

### Development Mode

```bash
# Pastikan virtual environment sudah active
source venv/bin/activate  # atau activate untuk Windows

# Jalankan Flask development server
python app.py

# Output akan seperti:
# WARNING: This is a development server. Do not use it in production.
# Running on http://127.0.0.1:5000
# Press CTRL+C to quit
```

### Akses Aplikasi

Buka browser dan navigate ke:
```
http://localhost:5000
```

Atau jika ingin akses dari device lain:
```
http://<your-ip-address>:5000
```

### Production Mode

Untuk production, gunakan production WSGI server:

```bash
# Gunakan Gunicorn (recommended)
pip install gunicorn

# Run dengan Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app

# Atau dengan waitress (Windows-friendly)
pip install waitress
waitress-serve --port=5000 app:app
```

---

## 📁 Struktur Folder

```
flask_skin_classifier/
│
├── app.py                          # Main Flask application
│   ├── Routes untuk: /, /predict, /set_language, /examples
│   ├── File upload handling
│   └── AI prediction logic
│
├── config.py                       # Konfigurasi aplikasi
│   ├── Translation strings (en/id)
│   ├── Model configuration
│   ├── Class names dan colors
│   └── Application settings
│
├── requirements.txt                # Python dependencies
│   ├── Flask==3.0.0
│   ├── ultralytics==8.0.0
│   └── ... (lihat file untuk lengkapnya)
│
├── documentation.md                # Dokumentasi teknis lengkap
│   ├── Arsitektur Alpine.js
│   ├── Struktur state
│   ├── Sistem i18n
│   ├── Cara menambah fitur
│   └── Best practices
│
├── README.md                       # File ini - dokumentasi user
│
├── static/                         # Static assets
│   ├── css/
│   │   └── custom.css             # Custom styling (dark theme, animations)
│   │       ├── Scan animation
│   │       ├── Pulse ring animation
│   │       └── Scrollbar styling
│   │
│   ├── js/
│   │   ├── main.js                # Alpine.js component (main logic)
│   │   │   ├── State management
│   │   │   ├── Event handlers
│   │   │   ├── API calls
│   │   │   └── Helper functions
│   │   │
│   │   └── translations.js        # i18n strings (English & Indonesian)
│   │       ├── English translations
│   │       ├── Indonesian translations
│   │       └── Nested key structure
│   │
│   ├── uploads/                   # User uploaded images (temp storage)
│   │   └── *.jpg (user images)
│   │
│   └── examples/                  # Example images for gallery
│       └── *.jpg (example images)
│
├── templates/
│   ├── index.html                 # Main HTML template
│   │   ├── Header dengan language toggle
│   │   ├── Upload area dengan drag-drop
│   │   ├── Tips card
│   │   ├── Results section
│   │   ├── Examples gallery
│   │   ├── Model info table
│   │   └── Footer
│   │
│   └── index.html.old             # Archive dari legacy vanilla JS version
│
├── models/                        # AI Model files (large files, not in repo)
│   ├── yolo-skin.onnx            # ONNX format (recommended - fast)
│   ├── best-skin.pt              # PyTorch format (alternative)
│   └── skin-best.pt              # PyTorch format (alternative)
│
└── __pycache__/                   # Python cache (auto-generated, ignore)
```

### File Penting

| File | Ukuran | Fungsi |
|------|--------|--------|
| `app.py` | ~2KB | Entry point & Flask routes |
| `config.py` | ~5KB | Config & translations |
| `main.js` | ~15KB | Alpine.js component logic |
| `translations.js` | ~8KB | i18n strings (en/id) |
| `custom.css` | ~3KB | Dark theme styling |
| `index.html` | ~15KB | HTML template dengan Alpine directives |
| `yolo-skin.onnx` | ~50MB | Pre-trained YOLOv8 model |

---

## 🔌 API Endpoints

### 1. GET `/`

**Deskripsi**: Menampilkan halaman utama aplikasi

**Response**: HTML halaman dengan Alpine.js component

**Contoh**:
```bash
curl http://localhost:5000/
```

---

### 2. POST `/predict`

**Deskripsi**: Analisis gambar dan prediksi penyakit kulit

**Request**:
```
Content-Type: multipart/form-data

Parameter:
- file: <binary image file> (required, JPG/PNG)
```

**Response (Success - HTTP 200)**:
```json
{
  "success": true,
  "result": {
    "name": "Jerawat",
    "description": "Jerawat adalah kondisi kulit yang ditandai dengan komedo, papula, atau pustula...",
    "confidence": 0.95,
    "severity": "Moderate",
    "action": "Konsultasi dengan dokter kulit untuk treatment yang tepat",
    "sorted_probs": [
      ["acne", 0.95],
      ["eksim", 0.03],
      ["herpes", 0.01],
      ["panu", 0.01],
      ["rosacea", 0.00]
    ],
    "class_colors": {
      "acne": "#ef4444",
      "eksim": "#f97316",
      "herpes": "#eab308",
      "panu": "#06b6d4",
      "rosacea": "#a855f7"
    }
  }
}
```

**Response (Error)**:
```json
{
  "error": "File size exceeds 5MB limit"
}
```

**Contoh (cURL)**:
```bash
curl -X POST -F "file=@skin_image.jpg" http://localhost:5000/predict
```

**Contoh (JavaScript/Fetch)**:
```javascript
const formData = new FormData();
formData.append('file', imageFile);

const response = await fetch('/predict', {
  method: 'POST',
  body: formData
});

const data = await response.json();
console.log(data.result);
```

---

### 3. POST `/set_language`

**Deskripsi**: Mengubah bahasa aplikasi (en/id)

**Request**:
```json
{
  "lang": "id"  // atau "en"
}
```

**Response (Success - HTTP 200)**:
```json
{
  "success": true,
  "lang": "id"
}
```

**Response (Error)**:
```json
{
  "success": false,
  "message": "Unsupported language"
}
```

**Contoh**:
```javascript
await fetch('/set_language', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ lang: 'id' })
});
```

---

### 4. GET `/examples`

**Deskripsi**: Mengambil daftar contoh gambar untuk galeri

**Response (HTTP 200)**:
```json
{
  "examples": [
    {
      "url": "/static/examples/acne_1.jpg",
      "class": "acne"
    },
    {
      "url": "/static/examples/eksim_1.jpg",
      "class": "eksim"
    },
    ...
  ]
}
```

**Contoh**:
```bash
curl http://localhost:5000/examples
```

---

## 📊 Informasi Model

### Spesifikasi Model

| Atribut | Nilai |
|---------|-------|
| **Arsitektur** | YOLOv8 Small (Classification) |
| **Format** | ONNX (recommended), PyTorch |
| **Ukuran File** | ~50MB (ONNX), ~25MB (PT) |
| **Input Size** | 224×224 pixels |
| **Output** | 5 class probabilities |
| **Inference Time** | ~50-100ms per image |

### Class Performance

| Penyakit | Precision | Recall | F1-Score | Support |
|----------|-----------|--------|----------|---------|
| Jerawat (Acne) | 100.00% | 100.00% | 100.00% | 147 |
| Eksim (Eczema) | 100.00% | 96.77% | 98.36% | 31 |
| Herpes | 96.77% | 100.00% | 98.36% | 31 |
| Panu (Tinea Versicolor) | 100.00% | 100.00% | 100.00% | 48 |
| Rosacea | 100.00% | 100.00% | 100.00% | 45 |
| **Weighted Avg** | **99.34%** | **99.34%** | **99.34%** | 302 |

### Dataset

- **Total Images**: 1,494 images
- **Classes**: 5 skin diseases
- **Split**: 70% train / 20% validation / 10% test
- **Image Formats**: JPG, PNG
- **Resolution**: 224×224 pixels (standardized)

### Limitations

⚠️ **Important Notes**:

1. **Accuracy**: Model dilatih pada dataset terbatas, akurasi bisa berbeda untuk gambar dengan kualitas rendah
2. **Lighting**: Cahaya yang buruk atau shadow dapat mengurangi akurasi
3. **Angle**: Model bekerja optimal untuk foto straight-on, bukan angle ekstrem
4. **Image Quality**: Foto blur atau low-resolution memberikan hasil kurang akurat
5. **Medical Disclaimer**: Hasil ini adalah preliminary assessment, BUKAN diagnosis medis

---

## 📚 Dokumentasi Teknis

Untuk dokumentasi teknis lengkap tentang arsitektur, struktur code, dan cara mengembangkan fitur baru:

👉 **[Lihat documentation.md](./documentation.md)**

Dokumentasi mencakup:
- Arsitektur Alpine.js
- Struktur state dan lifecycle
- Sistem i18n (internationalization)
- Cara menambah bahasa baru
- Cara menambah fitur baru
- Best practices
- Troubleshooting teknis

---

## 🐛 Troubleshooting

### Problem: "Module not found: flask"

**Solusi**:
```bash
# Pastikan virtual environment active
source venv/bin/activate  # MacOS/Linux
# atau
venv\Scripts\activate     # Windows

# Install dependencies lagi
pip install -r requirements.txt
```

---

### Problem: "Model file not found"

**Solusi**:
```bash
# Cek path model di config.py
cat config.py | grep MODEL_PATH

# Pastikan file ada
ls -la models/yolo-skin.onnx

# Jika tidak ada, download atau copy dari folder lain
# Atau update MODEL_PATH di config.py ke path yang benar
```

---

### Problem: "Port 5000 already in use"

**Solusi**:
```bash
# Run di port berbeda
python app.py --port 5001

# Atau kill process yang menggunakan port 5000
lsof -i :5000         # MacOS/Linux
netstat -ano | grep 5000  # Windows
```

---

### Problem: "File upload failed / Image not recognized"

**Solusi**:
1. Pastikan file adalah format JPG/PNG
2. Cek ukuran file (max 5MB)
3. Pastikan folder `static/uploads/` writable
4. Delete file corrupt dan try again

---

### Problem: "Slow prediction / Timeout"

**Penyebab & Solusi**:
- Model loading time lama → normal, tunggu ~30 detik pertama kali
- Server CPU tinggi → stop proses lain, atau upgrade hardware
- Large image → aplikasi auto-resize, tapi image quality besar bisa slow

---

### Problem: Dark theme text tidak terbaca

**Solusi**:
1. Clear browser cache (Ctrl+Shift+Del)
2. Reload page (F5)
3. Try browser lain
4. Cek kontras di DevTools → Inspect → Accessibility

---

## ⚠️ Disclaimer

### Disclaimer Medis

🔴 **PENTING**: 

Aplikasi ini adalah **EDUCATIONAL TOOL** dan **BUKAN PENGGANTI** untuk diagnosis medis profesional.

- ❌ Jangan gunakan untuk self-diagnosis
- ❌ Jangan menunda konsultasi dokter berdasarkan hasil ini
- ✅ Selalu konsultasi dengan dermatolog atau dokter profesional
- ✅ Hasil AI adalah preliminary assessment saja

**Risk Disclaimer**: Ketergantungan pada hasil AI tanpa konsultasi medis bisa menyebabkan delay dalam treatment dan kondisi lebih parah.

---

### Liability

- Aplikasi dibuat untuk tujuan pendidikan (educational use)
- Developer tidak bertanggung jawab atas misdiagnosis atau medical consequences
- User menggunakan aplikasi sesuai risiko mereka sendiri
- Privacy policy: Gambar yang di-upload akan dihapus otomatis setelah 1 jam

---

## 📞 Support & Kontribusi

### Lapor Bug

Jika menemukan bug atau issue:
1. Capture screenshot
2. Note browser/OS version
3. Describe steps to reproduce
4. Report via GitHub Issues atau email

### Kontribusi

Untuk kontribusi (fix, feature, improvement):
1. Fork repository
2. Buat branch fitur: `git checkout -b feature/nama-fitur`
3. Commit changes: `git commit -m "Add feature xyz"`
4. Push ke branch: `git push origin feature/nama-fitur`
5. Create Pull Request dengan deskripsi jelas

---

## 📄 License

Project ini dibuat untuk tujuan pendidikan. Pastikan memiliki rights yang sesuai untuk:
- Menggunakan YOLOv8 model (Ultralytics open source)
- Menggunakan dataset
- Deploy aplikasi

---

## 👥 Credits

Terima kasih kepada:
- **Ultralytics** - YOLOv8 model
- **Tailwind CSS** - Styling framework
- **Alpine.js** - Reactive JavaScript framework
- **Flask** - Web framework

---

**Developed with ❤️ for skin health awareness**

**Last Updated**: 12 Februari 2026  
**Status**: Production Ready  
**Version**: 1.0
