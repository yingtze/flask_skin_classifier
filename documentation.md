# Dokumentasi Teknis: AI Skin Classifier

Dokumentasi lengkap untuk memahami arsitektur, struktur state, sistem i18n, dan cara mengembangkan fitur baru pada aplikasi Skin Classifier berbasis Alpine.js.

---

## Daftar Isi

1. [Penjelasan Sistem](#penjelasan-sistem)
2. [Arsitektur Alpine.js](#arsitektur-alpinejs)
3. [Struktur State](#struktur-state)
4. [Status UI dan Transisi](#status-ui-dan-transisi)
5. [Sistem Internasionalisasi (i18n)](#sistem-internasionalisasi-i18n)
6. [Menambah Bahasa Baru](#menambah-bahasa-baru)
7. [Menambah Fitur Baru](#menambah-fitur-baru)
8. [Alur Upload hingga Hasil](#alur-upload-hingga-hasil)
9. [Struktur File](#struktur-file)
10. [Best Practices](#best-practices)

---

## Penjelasan Sistem

AI Skin Classifier adalah aplikasi web untuk mendeteksi penyakit kulit menggunakan model YOLOv8 deep learning. Aplikasi dibangun dengan:

- **Backend**: Flask (Python) - API untuk prediksi dan manajemen file
- **Frontend**: Alpine.js - Reactive UI framework untuk state management
- **Styling**: Tailwind CSS - Atomic CSS framework untuk styling responsive
- **i18n**: Custom translation system - Support Bahasa Indonesia dan English

### Fitur Utama

1. **Upload Gambar**: User upload foto dengan preview real-time
2. **Analisis AI**: Mengirim gambar ke backend untuk prediksi penyakit
3. **Multi-Bahasa**: Dukungan penuh untuk Bahasa Indonesia dan English
4. **Dark Theme**: Interface gelap dengan kontras optimal (WCAG AA compliant)
5. **Remove Button**: Tombol untuk menghapus gambar dan reset state
6. **Toast Notifications**: Notifikasi untuk success/error dengan auto-dismiss
7. **Galeri Contoh**: Kumpulan contoh gambar untuk testing

---

## Arsitektur Alpine.js

Aplikasi menggunakan Alpine.js component-based architecture dengan single component utama: `skinAnalyzer()`.

### Konsep Utama

**Alpine.js** adalah lightweight reactive framework untuk JavaScript vanilla. Struktur kode:

```html
<div x-data="skinAnalyzer()" x-init="init()">
  <!-- Reactive content -->
</div>
```

Setiap directive Alpine:

| Directive | Fungsi | Contoh |
|-----------|--------|--------|
| `x-data` | Inisialisasi component dengan state object | `x-data="skinAnalyzer()"` |
| `x-show` | Toggle visibility berdasarkan condition | `x-show="status === 'idle'"` |
| `x-text` | Set text content | `x-text="t('header')"` |
| `x-html` | Set HTML content | `x-html="t('tips_content')"` |
| `x-model` | Two-way binding dengan input | `x-model="lang"` |
| `x-for` | Loop elements | `x-for="item in examples"` |
| `@click` | Event listener | `@click="analyze()"` |
| `@change` | Change event | `@change="handleUpload"` |
| `@drop` | Drag-drop event | `@drop.prevent="handleDrop"` |
| `:class` | Dynamic class binding | `:class="{active: isOpen}"` |
| `:style` | Dynamic style binding | `:style="`width: ${percent}%`"` |
| `x-init` | Run initialization | `x-init="init()"` |

### Reactive Pattern

Alpine menggunakan **JavaScript reactivity** murni tanpa virtual DOM. Setiap perubahan state otomatis trigger re-render elemen yang menggunakan state tersebut.

---

## Struktur State

Component `skinAnalyzer()` memiliki state terstruktur:

### State Utama

```javascript
{
  image: null,              // File object yang di-upload
  previewUrl: null,         // Blob URL untuk image preview
  result: null,             // Hasil prediksi dari server
  status: 'idle',           // State machine: idle/analyzing/success/error
  lang: 'id',               // Language: 'id' atau 'en'
  errorMsg: '',             // Error message jika ada
  examples: []              // Array contoh gambar dari API
}
```

### State UI (Non-Critical)

```javascript
{
  toast: {
    show: false,
    message: '',
    type: 'success'
  },
  tab: 'examples',          // Active tab: examples/info
  percent: 0,               // Progress ring animation (0-100)
  circumference: 251.2      // Konstanta untuk SVG progress ring
}
```

### Penjelasan Setiap Property

| Property | Tipe | Deskripsi |
|----------|------|-----------|
| `image` | File | File object dari input file atau drag-drop |
| `previewUrl` | string | Blob URL untuk menampilkan preview |
| `result` | object | Response dari `/predict` endpoint |
| `status` | string | State machine: idle/analyzing/success/error |
| `lang` | string | Bahasa aktif untuk t() lookup |
| `errorMsg` | string | Pesan error untuk ditampilkan |
| `examples` | Array | Daftar contoh gambar dari `/examples` endpoint |
| `toast` | object | Kontrol toast notification |
| `tab` | string | Tab aktif: examples/info |
| `percent` | number | Nilai 0-100 untuk animate progress ring |

---

## Status UI dan Transisi

Aplikasi menggunakan **state machine** dengan 4 status utama:

```
IDLE → ANALYZING → SUCCESS/ERROR → (remove) → IDLE
```

### State Transitions

| Dari | Trigger | Ke | Deskripsi |
|------|---------|----|------------|
| IDLE | Upload image | IDLE | Gambar baru, reset analysis |
| IDLE | Click Analyze | ANALYZING | Mulai fetch ke server |
| ANALYZING | ✅ Success | SUCCESS | Simpan result, animate |
| ANALYZING | ❌ Error | ERROR | Tampilkan error message |
| SUCCESS | Click Analyze | ANALYZING | Analisis gambar lain |
| SUCCESS | Click Remove | IDLE | Hapus preview, reset |
| ERROR | Click Analyze | ANALYZING | Retry analysis |
| ANY | Click Remove | IDLE | Reset total ke awal |

---

## Sistem Internasionalisasi (i18n)

### Konsep

Semua UI text disimpan di file `translations.js` dengan struktur nested object:

```javascript
const translations = {
  id: {
    header: "AI Skin Classifier",
    tabs: { examples: "Contoh", info: "Info Model" },
    classes: { acne: "Jerawat", eksim: "Eksim" }
  },
  en: {
    header: "AI Skin Classifier",
    tabs: { examples: "Examples", info: "Model Info" },
    classes: { acne: "Acne", eksim: "Eczema" }
  }
}
```

### Cara Mengakses Translation

Method `t(key)` menggunakan dot notation:

```javascript
t('header')           // → "AI Skin Classifier"
t('tabs.examples')    // → "Contoh" (jika lang='id')
t('classes.acne')     // → "Jerawat" (jika lang='id')
```

### HTML Usage

```html
<!-- Text -->
<h1 x-text="t('header')"></h1>

<!-- HTML Content -->
<div x-html="t('tips_content')"></div>

<!-- Attributes -->
<button :aria-label="t('remove_label')"></button>

<!-- Conditional -->
<span x-text="status === 'analyzing' ? t('analyzing_btn') : t('analyze_btn')"></span>
```

---

## Menambah Bahasa Baru

### Langkah 1: Edit `/static/js/translations.js`

```javascript
const translations = {
  id: { /* existing */ },
  en: { /* existing */ },
  
  // Bahasa baru: Jepang (ja)
  ja: {
    title: "AI肌病検出",
    header: "AIスキン分類器",
    // Copy semua keys dari 'id' atau 'en', terjemahkan values
    tabs: {
      examples: "例",
      info: "モデル情報"
    },
    classes: {
      acne: "ニキビ",
      eksim: "湿疹",
      herpes: "ヘルペス",
      panu: "癜風",
      rosacea: "酒さ"
    }
    // Lengkapi semua key lainnya
  }
}
```

### Langkah 2: Tambah Button Toggle di `index.html`

```html
<!-- Cari section Language Toggle di header -->
<button @click="toggleLang('ja')"
  class="px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200"
  :class="lang === 'ja' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'text-slate-500 hover:text-slate-300'">
  JA
</button>
```

### Langkah 3: Backend Support (Optional)

Di `/app.py`:

```python
@app.route('/set_language', methods=['POST'])
def set_language():
    data = request.json
    lang = data.get('lang', 'id')
    
    if lang in ['en', 'id', 'ja']:  # Tambahkan 'ja'
        session['lang'] = lang
        return {'success': True}
    return {'success': False}, 400
```

---

## Menambah Fitur Baru

### Template: Button Baru dengan State

Contoh: Menambah button "Save to Favorites"

#### 1. Tambah State di `main.js`

```javascript
function skinAnalyzer() {
  return {
    // ... existing state ...
    favorites: [],
    isSaving: false,
    
    saveFavorite() {
      if (!this.result) return;
      
      this.isSaving = true;
      
      fetch('/save_favorite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result: this.result, image_id: this.image.name })
      })
      .then(r => r.json())
      .then(data => {
        this.favorites.push(data.id);
        this.showToast('Saved to favorites!');
      })
      .catch(e => {
        this.showToast('Failed to save', 'error');
        console.error(e);
      })
      .finally(() => {
        this.isSaving = false;
      });
    }
  };
}
```

#### 2. Tambah Translation Keys

Edit `translations.js`:

```javascript
const translations = {
  id: {
    save_favorite_btn: "Simpan ke Favorit",
    favorite_saved: "Ditambahkan ke favorit!"
  },
  en: {
    save_favorite_btn: "Save to Favorites",
    favorite_saved: "Added to favorites!"
  }
}
```

#### 3. Tambah UI di `index.html`

```html
<button @click="saveFavorite()" 
  :disabled="isSaving"
  class="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 py-2 px-4 rounded-xl transition-all"
  x-text="isSaving ? 'Saving...' : t('save_favorite_btn')">
</button>
```

#### 4. Backend Support (Flask)

```python
@app.route('/save_favorite', methods=['POST'])
def save_favorite():
    data = request.json
    result = data.get('result')
    
    try:
        favorite_id = str(datetime.now().timestamp())
        # Save logic...
        return {'success': True, 'id': favorite_id}
    except Exception as e:
        return {'success': False, 'error': str(e)}, 500
```

---

## Alur Upload hingga Hasil

### Timeline

```
User Upload Image
  ↓
processFile() - Validate & create blob URL
  ↓ (x-show="previewUrl" triggers)
User sees Preview
  ↓
Click Analyze Button
  ↓
analyze() - Set status='analyzing'
  ↓ (Loading UI appears)
fetch('/predict') - Send FormData
  ↓
Server processes image with YOLOv8 model
  ↓
Response with result object
  ↓ (animate percent, status='success')
Display Results with confidence ring
```

### Endpoint Contract

**POST /predict**
```json
Request Body: FormData { file: File }

Response (200):
{
  "success": true,
  "result": {
    "name": "Jerawat",
    "description": "...",
    "confidence": 0.95,
    "severity": "Moderate",
    "action": "Konsultasi dokter",
    "sorted_probs": [["acne", 0.95], ...],
    "class_colors": {"acne": "#ef4444", ...}
  }
}
```

---

## Struktur File

```
flask_skin_classifier/
├── app.py                          # Flask app utama
├── config.py                       # Config & backend translations
├── requirements.txt                # Python dependencies
├── README.md                       # User documentation
├── documentation.md                # Technical documentation (ini)
│
├── static/
│   ├── css/custom.css             # Dark theme & animations
│   ├── js/main.js                 # Alpine.js component logic
│   ├── js/translations.js         # i18n strings (en/id)
│   └── uploads/                   # Temp uploaded images
│
├── templates/
│   ├── index.html                 # Main HTML template
│   └── index.html.old             # Archive dari legacy version
│
└── models/
    ├── best-skin.pt               # YOLOv8 models
    └── yolo-skin.onnx
```

---

## Best Practices

### ✅ State Management

```javascript
// Gunakan method untuk mengubah state
this.status = 'analyzing';
this.reset();  // Systematic reset
```

### ✅ Async Operations

```javascript
async analyze() {
  try {
    const data = await fetch('/predict').then(r => r.json());
    this.result = data.result;
  } catch (error) {
    this.showToast(error.message, 'error');
  }
}
```

### ✅ Translations

```html
<h1 x-text="t('header')"></h1>
<span x-text="status === 'analyzing' ? t('analyzing_btn') : t('analyze_btn')"></span>
```

### ✅ Event Handling

```html
<input @change="handleUpload">
<div @drop.prevent="handleDrop">
<button @click="removeImage()">
```

### ✅ CSS & Styling

```html
<!-- Tailwind classes -->
<button class="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded">

<!-- Dynamic classes -->
<div :class="{'opacity-0': !previewUrl}">
```

### ✅ Error Handling

```javascript
try {
  const response = await fetch('/predict');
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  if (!data.success) throw new Error(data.error);
} catch (error) {
  console.error('❌ Error:', error);
  this.showToast(error.message, 'error');
}
```

---

**Terakhir Updated**: 12 Februari 2026  
**Versi**: 1.0  
**Status**: Production Ready
