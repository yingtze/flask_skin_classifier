import os

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Use local model file - prefer .pt over .onnx
pt_model = os.path.join(BASE_DIR, "models", "best-skin.pt")
MODEL_PATH = pt_model if os.path.exists(pt_model) else os.path.join(BASE_DIR, "models", "yolo-skin.onnx")

# Constants
CLASS_NAMES = ["acne", "eksim", "herpes", "panu", "rosacea"]

# Color Mapping for Conditions
CLASS_COLORS = {
    "acne": "#ef4444",    # Red
    "eksim": "#f97316",   # Orange
    "herpes": "#ec4899",  # Pink
    "panu": "#8b5cf6",    # Violet
    "rosacea": "#f43f5e"  # Rose
}

# Upload Configuration
UPLOAD_RETENTION_MINUTES = 60  # Delete files older than 1 hour

# Translations
TRANSLATIONS = {
    "en": {
        "title": "Skin Disease Classifier",
        "header": "Skin Disease Classifier",
        "header_subtitle": "YOLOv8 AI Model &middot; <strong>99.34% accuracy</strong>",
        "description_short": "Upload a clear, closeup image of the affected skin area for instant analysis.",
        "input_label": "Upload Image",
        "analyze_btn": "Analyze Image",
        "tips_title": "Tips for Best Results",
        "tips_content": "<p>&bull; Ensure good, even lighting on the skin area</p><p>&bull; Focus clearly on the affected area</p><p>&bull; Remove makeup or creams before capturing</p><p>&bull; Use a plain background if possible</p>",
        "output_title": "Detailed Analysis",
        "confidence_label": "Conf.",
        "severity_label": "Severity Level",
        "consult_label": "Recommended Action",
        "disclaimer_title": "Disclaimer",
        "disclaimer_text": "This AI tool is for educational purposes only and does not provide a medical diagnosis. Always consult a certified dermatologist for accurate diagnosis and treatment.",
        "model_stats": "Model Architecture & Performance",
        "loading_title": "Analyzing Pattern...",
        "loading_desc": "Running dermatological classification model",
        "loading_examples": "Loading examples...",
        "ready_title": "Ready for Analysis",
        "ready_desc": "Upload a clear photo of the skin condition to get an instant AI-powered assessment.",
        "primary_diagnosis": "Primary Diagnosis",
        "click_upload": "Click to upload or drag & drop",
        "file_hint": "JPG, PNG, JPEG (Max 16MB)",
        "footer": "Skin Disease Classifier &middot; For educational use only &middot; Not a substitute for medical advice",
        "model_info_text": """
        <div style='margin-bottom: 1rem;'>
            <strong>Architecture:</strong> YOLOv8 Small Classification<br>
            <strong>Model Size:</strong> {model_size}<br>
            <strong>Test Accuracy:</strong> 99.34%<br>
            <strong>Classes:</strong> Acne, Eczema, Herpes, Tinea Versicolor, Rosacea<br>
            <strong>Model File:</strong> {model_name}<br>
            <strong>Dataset:</strong> 1,494 images (70% train / 20% val / 10% test)
        </div>
        """,
        "error_no_image": "Please upload an image to analyze.",
        "error_invalid_file": "Invalid file type. Please upload a JPG, PNG, or JPEG image.",
        "error_prediction_failed": "An error occurred during analysis. Please try again.",
        "tabs": {"examples": "Example Gallery", "info": "Model Info"},
        "classes": {
            "acne": {
                "name": "Acne Vulgaris",
                "desc": "A common skin condition occurring when hair follicles become plugged with oil and dead skin cells, leading to whiteheads, blackheads, or pimples.",
                "severity": "Variable",
                "action": "Consult dermatologist if symptoms persist"
            },
            "eksim": {
                "name": "Eczema (Dermatitis)",
                "desc": "A condition causing skin to become itchy, red, dry, and cracked. Often triggered by irritants, allergens, or stress.",
                "severity": "Moderate to Chronic",
                "action": "Avoid triggers, use moisturizer regularly"
            },
            "herpes": {
                "name": "Herpes Simplex",
                "desc": "A viral infection causing contagious sores, often appearing as fluid-filled blisters around the mouth or genitals.",
                "severity": "Moderate (Contagious)",
                "action": "Seek antiviral medication promptly"
            },
            "panu": {
                "name": "Tinea Versicolor (Panu)",
                "desc": "A fungal infection caused by yeast overgrowth, resulting in small discolored patches that may be lighter or darker than surrounding skin.",
                "severity": "Mild",
                "action": "Apply antifungal treatment"
            },
            "rosacea": {
                "name": "Rosacea",
                "desc": "A chronic skin condition causing persistent redness, visible blood vessels, and sometimes small bumps on the face.",
                "severity": "Chronic",
                "action": "Manage triggers, seek medical therapy"
            }
        },
        "table_cols": ["Class", "Precision", "Recall", "F1-Score"]
    },
    "id": {
        "title": "Klasifikasi Penyakit Kulit",
        "header": "Klasifikasi Penyakit Kulit",
        "header_subtitle": "Model AI YOLOv8 &middot; <strong>Akurasi 99,34%</strong>",
        "description_short": "Unggah foto closeup area kulit yang terdampak untuk analisis instan.",
        "input_label": "Unggah Gambar",
        "analyze_btn": "Analisis Gambar",
        "tips_title": "Tips Hasil Terbaik",
        "tips_content": "<p>&bull; Pastikan pencahayaan cukup terang dan merata</p><p>&bull; Fokuskan kamera pada area kulit yang bermasalah</p><p>&bull; Bersihkan area dari makeup atau krim sebelum foto</p><p>&bull; Gunakan latar belakang polos jika memungkinkan</p>",
        "output_title": "Analisis Detail",
        "confidence_label": "Keyak.",
        "severity_label": "Tingkat Keparahan",
        "consult_label": "Saran Tindakan",
        "disclaimer_title": "Penafian",
        "disclaimer_text": "Alat AI ini ditujukan hanya untuk keperluan edukasi dan bukan pengganti diagnosis medis profesional. Selalu konsultasikan dengan dokter spesialis kulit untuk diagnosis dan penanganan yang tepat.",
        "model_stats": "Arsitektur & Performa Model",
        "loading_title": "Menganalisis Pola...",
        "loading_desc": "Menjalankan model klasifikasi dermatologis",
        "loading_examples": "Memuat contoh...",
        "ready_title": "Siap Menganalisis",
        "ready_desc": "Unggah foto kondisi kulit yang jelas untuk mendapatkan penilaian instan berbasis AI.",
        "primary_diagnosis": "Diagnosis Utama",
        "click_upload": "Klik untuk unggah atau seret & lepas",
        "file_hint": "JPG, PNG, JPEG (Maks 16MB)",
        "footer": "Klasifikasi Penyakit Kulit &middot; Hanya untuk edukasi &middot; Bukan pengganti saran medis",
        "model_info_text": """
        <div style='margin-bottom: 1rem;'>
            <strong>Arsitektur:</strong> YOLOv8 Small Classification<br>
            <strong>Ukuran Model:</strong> {model_size}<br>
            <strong>Akurasi Pengujian:</strong> 99,34%<br>
            <strong>Kelas:</strong> Jerawat, Eksim, Herpes, Panu, Rosacea<br>
            <strong>File Model:</strong> {model_name}<br>
            <strong>Dataset:</strong> 1.494 gambar (70% latih / 20% validasi / 10% uji)
        </div>
        """,
        "error_no_image": "Silakan unggah gambar terlebih dahulu untuk dianalisis.",
        "error_invalid_file": "Jenis file tidak valid. Silakan unggah gambar JPG, PNG, atau JPEG.",
        "error_prediction_failed": "Terjadi kesalahan saat analisis. Silakan coba lagi.",
        "tabs": {"examples": "Galeri Contoh", "info": "Info Model"},
        "classes": {
            "acne": {
                "name": "Jerawat (Acne Vulgaris)",
                "desc": "Kondisi kulit umum yang terjadi ketika folikel rambut tersumbat oleh minyak dan sel kulit mati, menyebabkan komedo putih, komedo hitam, atau jerawat meradang.",
                "severity": "Bervariasi",
                "action": "Konsultasi ke dokter kulit jika gejala menetap"
            },
            "eksim": {
                "name": "Eksim (Dermatitis)",
                "desc": "Kondisi peradangan kulit yang menyebabkan kulit menjadi gatal, merah, kering, dan pecah-pecah. Sering dipicu oleh iritan, alergen, atau stres.",
                "severity": "Sedang hingga Kronis",
                "action": "Hindari pemicu, gunakan pelembab secara rutin"
            },
            "herpes": {
                "name": "Herpes Simplex",
                "desc": "Infeksi virus yang menyebabkan luka melepuh yang menular, sering muncul sebagai lepuhan berisi cairan di sekitar mulut atau area genital.",
                "severity": "Sedang (Menular)",
                "action": "Segera minta pengobatan antivirus"
            },
            "panu": {
                "name": "Panu (Tinea Versicolor)",
                "desc": "Infeksi jamur yang disebabkan oleh pertumbuhan berlebihan ragi pada kulit, menghasilkan bercak-bercak kecil yang lebih terang atau lebih gelap dari kulit sekitarnya.",
                "severity": "Ringan",
                "action": "Gunakan obat antijamur"
            },
            "rosacea": {
                "name": "Rosacea",
                "desc": "Kondisi kulit kronis yang menyebabkan kemerahan persisten, pembuluh darah terlihat, dan terkadang benjolan kecil pada wajah.",
                "severity": "Kronis",
                "action": "Kelola pemicu, jalani terapi medis"
            }
        },
        "table_cols": ["Kelas", "Presisi", "Recall", "Skor F1"]
    }
}

# Model performance data
MODEL_PERFORMANCE = [
    ["acne", "100.00%", "100.00%", "100.00%"],
    ["eksim", "100.00%", "96.77%", "98.36%"],
    ["herpes", "96.77%", "100.00%", "98.36%"],
    ["panu", "100.00%", "100.00%", "100.00%"],
    ["rosacea", "100.00%", "100.00%", "100.00%"]
]
