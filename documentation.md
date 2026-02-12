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
... (existing content) ...

## Informasi Model

### Arsitektur
Model yang digunakan adalah custom-trained **YOLOv8 (You Only Look Once version 8)** yang berbasis pada arsitektur **CNN (Convolutional Neural Network)**.

### Cara Mendapatkan Model
Model tidak disertakan dalam repository git karena ukurannya yang besar. Ada dua cara untuk mendapatkan model:

1. **Cek Direktori `models/`**:
   Jika Anda mendapatkan aplikasi ini dari distribusi lengkap, cek direktori `models/` untuk file `best-skin.pt` atau `yolo-skin.onnx`.

2. **Download dari Releases**:
   Jika folder `models/` kosong, silakan download model dari halaman **Releases** di repository GitHub project ini atau hubungi pengembang.
   
   Simpan file model yang di-download ke dalam folder `models/`.

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
├── models/
│   ├── best-skin.pt               # YOLOv8 models (CNN-based)
│   └── yolo-skin.onnx
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
