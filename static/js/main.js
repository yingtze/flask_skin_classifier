/**
 * Logic Utama Aplikasi Skin Classifier
 * Menggunakan Alpine.js untuk manajemen state reaktif.
 * 
 * Sistem:
 * - State management: Menyimpan semua data aplikasi (gambar, hasil, status, bahasa)
 * - Event handlers: Menangani upload, analisis, pembersihan
 * - Helpers: Fungsi utilitas untuk UI, bahasa, dan visualisasi
 * - Data loading: Mengambil contoh gambar dari server
 */

function skinAnalyzer() {
    return {
        // ========== STATE UTAMA ==========
        // Menyimpan informasi tentang gambar dan hasil analisis
        
        image: null,           // File object yang diunggah pengguna (File)
        previewUrl: null,      // URL blob untuk menampilkan preview gambar (string)
        result: null,          // Objek hasil analisis dari server API /predict (object)
        status: 'idle',        // Status UI: 'idle' (menunggu), 'analyzing' (proses), 'success' (berhasil), 'error' (gagal)
        lang: 'id',            // Bahasa aktif: 'id' (Indonesia) atau 'en' (English)
        errorMsg: '',          // Pesan error yang ditampilkan jika terjadi kesalahan (string)
        examples: [],          // Daftar contoh gambar dari server untuk galeri (array)

        // ========== STATE UI TAMBAHAN ==========
        // Kontrol tampilan berbagai elemen interface
        
        toast: {
            show: false,       // Apakah notifikasi toast ditampilkan (boolean)
            message: '',       // Teks pesan toast (string)
            type: 'success'    // Tipe toast: 'success' atau 'error' (string)
        },
        tab: 'examples',       // Tab aktif: 'examples' (galeri contoh) atau 'info' (informasi model) (string)
        percent: 0,            // Nilai progress ring confidence (0-100) untuk animasi (number)

        // ========== KONFIGURASI ==========
        // Konstanta untuk perhitungan visual
        
        circumference: 2 * Math.PI * 40, // Keliling lingkaran progress ring (R=40) ≈ 251.2 px (number)

        // ========== INISIALISASI ==========
        // Dijalankan ketika komponen Alpine.js dimuat di DOM
        
        init() {
            console.log('⚙️ Skin Analyzer Alpine Component Initialized');
            this.loadExamples(); // Ambil daftar contoh gambar saat aplikasi dimulai
        },

        // ========== SISTEM BAHASA (i18n) ==========
        // Mengambil teks terjemahan berdasarkan kunci dot-notation
        // Sistem ini memungkinkan dukungan multi-bahasa tanpa hardcoded strings
        
        /**
         * Mengambil teks terjemahan berdasarkan kunci
         * @param {string} key - Kunci terjemahan dengan dot notation (misal: 'tabs.examples')
         * @return {string} Teks terjemahan dalam bahasa aktif (this.lang)
         */
        t(key) {
            // Split kunci dengan pemisah titik untuk nested access
            // Contoh: 'classes.acne' → ['classes', 'acne']
            const keys = key.split('.');
            let value = translations[this.lang]; // Ambil object bahasa aktif dari translations.js

            // Traverse melalui setiap level nested menggunakan loop
            for (const k of keys) {
                if (value && value[k] !== undefined) {
                    value = value[k]; // Lanjut ke level berikutnya
                } else {
                    return key; // Fallback: return kunci asli jika tidak ditemukan
                }
            }
            return value;
        },

        // ========== LOGIKA UPLOAD FILE ==========
        // Menangani pengunggahan gambar dari pengguna
        
        /**
         * Handler untuk perubahan input file
         * Dipanggil ketika pengguna memilih file dari dialog atau drag-drop
         * @param {Event} event - Event dari input type="file" atau drop event
         */
        handleUpload(event) {
            // Ambil file pertama dari file list (pengguna hanya bisa pilih 1)
            const file = event.target.files ? event.target.files[0] : null;
            this.processFile(file);
        },

        /**
         * Handler untuk drag-drop file
         * Dipanggil ketika pengguna melepas file di area upload
         * @param {DragEvent} event - Event dari @drop directive
         */
        handleDrop(event) {
            // Ambil file yang di-drop (hanya file pertama)
            const file = event.dataTransfer.files ? event.dataTransfer.files[0] : null;
            this.processFile(file);
        },

        /**
         * Proses file yang dipilih/di-drop
         * Melakukan validasi dan membuat preview URL
         * @param {File} file - Objek File untuk diproses
         */
        processFile(file) {
            if (!file) return; // Abaikan jika tidak ada file

            // Validasi tipe file harus gambar (JPG/PNG)
            if (!file.type.match('image.*')) {
                this.showToast('File must be an image (JPG/PNG)', 'error');
                return;
            }

            // Simpan file dan buat blob URL untuk preview
            this.image = file;
            // URL.createObjectURL lebih efisien daripada FileReader base64
            // karena tidak perlu encoding dan lebih cepat rendering
            this.previewUrl = URL.createObjectURL(file);

            // Reset hasil analisis sebelumnya saat gambar baru diunggah
            // Ini memastikan pengguna tidak melihat hasil lama
            this.resetAnalysisState();
        },

        // ========== LOGIKA HAPUS GAMBAR ==========
        // Menghapus gambar yang diunggah dan reset semua state terkait
        
        /**
         * Menghapus gambar preview dan reset ke status awal
         * Dipanggil ketika pengguna klik tombol remove (X) pada preview
         * Lifecycle:
         *   1. Bersihkan memory blob URL (URL.revokeObjectURL)
         *   2. Reset semua state ke nilai awal
         *   3. Kosongkan value input file
         *   4. Tampilkan notifikasi toast
         */
        removeImage() {
            // Bersihkan memori dengan revoke object URL yang tidak lagi digunakan
            // Ini mencegah memory leak jika aplikasi berjalan lama
            if (this.previewUrl) {
                URL.revokeObjectURL(this.previewUrl);
            }

            // Reset nilai state ke null/awal
            this.image = null;           // Hapus referensi file
            this.previewUrl = null;      // Hapus preview URL
            this.reset();                // Reset status ke 'idle' dan hasil ke null

            // Kosongkan value input file agar file yang sama bisa diupload ulang
            // Tanpa ini, jika pengguna upload file yang sama, tidak ada change event
            const fileInput = document.getElementById('image-upload');
            if (fileInput) {
                fileInput.value = '';
            }

            // Tampilkan notifikasi bahwa gambar telah dihapus
            this.showToast(this.t('toast_removed'), 'success');
        },

        // ========== LOGIKA ANALISIS ==========
        // Menjalankan prediksi AI di server
        
        /**
         * Menjalankan analisis gambar via API /predict
         * Mengirim gambar ke backend untuk mendapatkan prediksi penyakit kulit
         * Lifecycle:
         *   1. Set status ke 'analyzing' untuk tampil loading UI
         *   2. POST gambar sebagai FormData ke endpoint /predict
         *   3. Parse response dan simpan di this.result
         *   4. Animate progress ring confidence score
         *   5. Transition status ke 'success' atau 'error'
         */
        async analyze() {
            if (!this.image) return; // Abaikan jika tidak ada gambar

            // Set status ke 'analyzing' untuk trigger loading animation
            this.status = 'analyzing';
            this.errorMsg = '';

            // Buat FormData untuk mengirim file (required untuk upload)
            const formData = new FormData();
            formData.append('file', this.image);

            try {
                // POST ke endpoint /predict di backend Flask
                const response = await fetch('/predict', {
                    method: 'POST',
                    body: formData
                    // Note: Jangan set Content-Type header, browser akan set boundary otomatis
                });

                // Validasi response dari server
                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.error || 'Prediction failed');
                }

                // Parse JSON response
                const data = await response.json();

                // Handle success response
                if (data.success) {
                    // Simpan hasil analisis lengkap (nama, deskripsi, confidence, dll)
                    this.result = data.result;
                    this.status = 'success';

                    // Animate progress ring dengan transisi smooth
                    // Timeout kecil agar CSS transition berjalan (stroke-dashoffset change)
                    setTimeout(() => {
                        this.percent = parseFloat(this.result.confidence) * 100;
                    }, 100);
                } else {
                    throw new Error(data.error || 'Unknown error');
                }

            } catch (error) {
                // Handle error - log ke console dan tampilkan ke pengguna
                console.error('❌ Analysis error:', error);
                this.status = 'error';
                this.errorMsg = error.message;
                this.showToast(error.message, 'error');
            }
        },

        // ========== MANAJEMEN STATUS ==========
        // Fungsi untuk mengubah status aplikasi
        
        /**
         * Reset semua state ke kondisi awal (idle)
         * Digunakan setelah analisis selesai atau pengguna hapus gambar
         */
        reset() {
            this.status = 'idle';     // Kembali ke status menunggu
            this.result = null;       // Hapus hasil analisis
            this.percent = 0;         // Reset progress ring
            this.errorMsg = '';       // Hapus pesan error
        },

        /**
         * Reset hanya hasil analisis, tidak reset gambar
         * Berbeda dengan reset(), ini gunakan jika pengguna upload gambar baru
         * tapi ingin tetap membuat preview gambar lama hilang
         */
        resetAnalysisState() {
            this.status = 'idle';     // Set status ke idle
            this.result = null;       // Hapus hasil sebelumnya
            this.percent = 0;         // Reset progress ring
            // Note: Tidak reset image dan previewUrl, masih ada untuk upload berikutnya
        },

        // ========== UTILITAS UI ==========
        // Helper functions untuk interaksi UI
        
        /**
         * Toggle bahasa aplikasi antara Indonesia dan English
         * @param {string} newLang - Bahasa tujuan: 'id' atau 'en'
         */
        toggleLang(newLang) {
            this.lang = newLang; // Ubah bahasa aktif
            // Alpine.js otomatis re-render semua text yang menggunakan x-text="t(...)"
        },

        /**
         * Tampilkan notifikasi toast dengan pesan dan tipe
         * Toast akan otomatis hilang setelah 3 detik
         * @param {string} message - Teks notifikasi
         * @param {string} type - Tipe notifikasi: 'success' atau 'error' (default: 'success')
         */
        showToast(message, type = 'success') {
            this.toast.message = message;
            this.toast.type = type;
            this.toast.show = true;

            // Auto-hide toast setelah 3 detik
            setTimeout(() => {
                this.toast.show = false;
            }, 3000);
        },

        // ========== HELPERS VISUALISASI ==========
        // Fungsi untuk menghitung dan mendeteksi nilai untuk CSS/SVG
        
        /**
         * Hitung stroke-dashoffset untuk progress ring confidence
         * Nilai ini mengontrol berapa persen lingkaran yang "terisi"
         * Formula: offset = circumference - (percent/100 * circumference)
         * @return {number} Dashoffset dalam pixel
         */
        getConfidenceDashOffset() {
            // Circumference = 2 * PI * R = 2 * PI * 40 ≈ 251.2 px
            const max = this.circumference;
            // Hitung offset berdasarkan percent (0-100)
            return max - (this.percent / 100) * max;
        },

        /**
         * Get warna badge berdasarkan severity level
         * Mapping: Mild=hijau, Moderate=kuning, Severe=merah, dll
         * Support bahasa Indonesia dan English
         * @param {string} severity - Teks severity dari result API
         * @return {string} Tailwind class color (misal: 'bg-green-500')
         */
        getSeverityColor(severity) {
            const map = {
                'Mild': 'bg-green-500',
                'Ringan': 'bg-green-500',
                'Moderate': 'bg-yellow-500',
                'Sedang': 'bg-yellow-500',
                'Severe': 'bg-red-500',
                'Parah': 'bg-red-500',
                'Variable': 'bg-blue-500',
                'Bervariasi': 'bg-blue-500',
                'Chronic': 'bg-orange-500',
                'Kronis': 'bg-orange-500'
            };
            return map[severity] || 'bg-blue-500'; // Default jika severity tidak dikenal
        },

        /**
         * Get warna untuk probability bar setiap class (penyakit)
         * Warna diambil dari response server (class_colors mapping)
         * @param {string} className - Nama class/penyakit (acne, eksim, herpes, dll)
         * @return {string} Hex color code (misal: '#ef4444' untuk acne)
         */
        getClassColor(className) {
            // Cek apakah server mengirim color mapping untuk class ini
            if (this.result && this.result.class_colors && this.result.class_colors[className]) {
                return this.result.class_colors[className];
            }
            // Fallback ke warna default jika tidak ada mapping
            return '#64748b'; // Slate-500
        },

        // ========== LOADING DATA EKSTERNAL ==========
        // Fungsi untuk mengambil data dari server API
        
        /**
         * Muat daftar contoh gambar dari server
         * Dipanggil di init() saat aplikasi pertama kali load
         * Endpoint: GET /examples
         * Response: { examples: [{ url: '...', class: 'acne' }, ...] }
         */
        async loadExamples() {
            try {
                // Fetch contoh gambar dari backend
                const res = await fetch('/examples');
                const data = await res.json();
                
                // Jika response berhasil, simpan array contoh
                if (data.examples) {
                    this.examples = data.examples;
                    console.log(`✅ Loaded ${data.examples.length} example images`);
                }
            } catch (e) {
                // Log error tapi jangan menggangu UX (galeri bisa kosong)
                console.error("❌ Failed to load examples:", e);
            }
        },

        /**
         * Muat contoh gambar dan process sebagai file untuk preview
         * Dipanggil ketika pengguna klik salah satu contoh di galeri
         * @param {string} url - URL gambar contoh
         * @param {string} className - Nama class untuk nama file
         */
        async loadExampleImage(url, className) {
            try {
                // Fetch blob dari URL gambar contoh
                const response = await fetch(url);
                const blob = await response.blob();
                
                // Buat File object dari blob
                const file = new File([blob], `${className}.jpg`, { type: "image/jpeg" });
                
                // Process file seperti upload normal
                this.processFile(file);
                
                // Scroll ke atas agar pengguna langsung lihat preview dan tombol analyze
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (e) {
                // Tampilkan error ke pengguna
                this.showToast("Gagal memuat gambar contoh", 'error');
                console.error(e);
            }
        }
    };
}

