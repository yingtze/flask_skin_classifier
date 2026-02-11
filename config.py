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
        "header": "Skin Disease Classification with YOLOv8",
        "header_subtitle": "Achieves <strong>99.34% accuracy</strong> on independent test set.",
        "description_short": "Upload a clear, closeup image of the affected skin area for instant analysis.",
        "input_label": "Upload Image",
        "analyze_btn": "Analyze Image",
        "tips_title": "💡 Tips for Best Results",
        "tips_content": "• Ensure good lighting\n• Focus clearly on the affected area\n• Remove makeup or creams before capturing",
        "output_title": "Analysis Results",
        "confidence_label": "Confidence Score",
        "severity_label": "Severity Level",
        "consult_label": "Recommended Action",
        "disclaimer_title": "Educational Use Only",
        "disclaimer_text": "This AI tool is for educational purposes only and does not provide a medical diagnosis. Always consult a certified dermatologist for professional advice.",
        "model_stats": "Model Architecture & Performance",
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
        "tabs": {"examples": "Example Gallery", "info": "Model Architecture"},
        "classes": {
            "acne": {
                "name": "Acne Vulgaris",
                "desc": "A common skin condition occurring when hair follicles become plugged with oil and dead skin cells.",
                "severity": "Variable",
                "action": "Consult if symptoms persist"
            },
            "eksim": {
                "name": "Eczema (Dermatitis)",
                "desc": "A condition causing skin to become itchy, red, dry, and cracked. Often triggered by irritants or allergies.",
                "severity": "Moderate to Chronic",
                "action": "Avoid triggers, use moisturizer"
            },
            "herpes": {
                "name": "Herpes Simplex",
                "desc": "A viral infection causing contagious sores, often around the mouth or genitals.",
                "severity": "Moderate (Contagious)",
                "action": "Antiviral medication"
            },
            "panu": {
                "name": "Tinea Versicolor (Panu)",
                "desc": "A fungal infection causing small discolored patches (lighter or darker) on the skin.",
                "severity": "Mild",
                "action": "Antifungal treatment"
            },
            "rosacea": {
                "name": "Rosacea",
                "desc": "A chronic skin condition causing redness and visible blood vessels in the face.",
                "severity": "Chronic",
                "action": "Trigger management, medical therapy"
            }
        },
        "table_cols": ["Class", "Precision", "Recall", "F1-Score"]
    },
    "id": {
        "title": "Klasifikasi Penyakit Kulit",
        "header": "Klasifikasi Penyakit Kulit dengan YOLOv8",
        "header_subtitle": "Model mencapai <strong>akurasi 99.34%</strong> pada data pengujian independen.",
        "description_short": "Unggah foto closeup area kulit yang terdampak untuk analisis instan.",
        "input_label": "Unggah Gambar",
        "analyze_btn": "Analisis Gambar",
        "tips_title": "💡 Tips Hasil Terbaik",
        "tips_content": "• Pastikan pencahayaan cukup terang\n• Fokuskan kamera pada area yang sakit\n• Bersihkan area dari makeup/krim",
        "output_title": "Hasil Analisis",
        "confidence_label": "Skor Kepercayaan",
        "severity_label": "Tingkat Keparahan",
        "consult_label": "Saran Tindakan",
        "disclaimer_title": "Penafian (Disclaimer)",
        "disclaimer_text": "Alat AI ini ditujukan hanya untuk keperluan edukasi dan bukan pengganti diagnosis medis. Selalu konsultasikan dengan dokter kulit untuk penanganan tepat.",
        "model_stats": "Informasi & Performa Model",
        "model_info_text": """
        <div style='margin-bottom: 1rem;'>
            <strong>Arsitektur:</strong> YOLOv8 Small Classification<br>
            <strong>Ukuran Model:</strong> {model_size}<br>
            <strong>Akurasi Tes:</strong> 99.34%<br>
            <strong>Kelas:</strong> Jerawat, Eksim, Herpes, Panu, Rosacea<br>
            <strong>Nama File:</strong> {model_name}<br>
            <strong>Dataset:</strong> 1,494 gambar (70% latih / 20% validasi / 10% tes)
        </div>
        """,
        "error_no_image": "Silakan unggah gambar terlebih dahulu untuk dianalisis.",
        "tabs": {"examples": "Galeri Contoh", "info": "Arsitektur Model"},
        "classes": {
            "acne": {
                "name": "Jerawat (Acne Vulgaris)",
                "desc": "Kondisi umum dimana folikel rambut tersumbat oleh minyak dan sel kulit mati.",
                "severity": "Bervariasi",
                "action": "Konsultasi jika gejala menetap"
            },
            "eksim": {
                "name": "Eksim (Dermatitis)",
                "desc": "Peradangan kulit yang menyebabkan gatal, kemerahan, kering, dan pecah-pecah.",
                "severity": "Sedang hingga Kronis",
                "action": "Hindari pemicu, gunakan pelembab"
            },
            "herpes": {
                "name": "Herpes Simplex",
                "desc": "Infeksi virus yang menyebabkan luka melepuh yang menular, sering di area mulut.",
                "severity": "Sedang (Menular)",
                "action": "Pengobatan antivirus"
            },
            "panu": {
                "name": "Panu (Tinea Versicolor)",
                "desc": "Infeksi jamur yang menyebabkan bercak warna kulit berbeda (terang/gelap).",
                "severity": "Ringan",
                "action": "Pengobatan antijamur"
            },
            "rosacea": {
                "name": "Rosacea",
                "desc": "Kondisi kronis yang menyebabkan wajah memerah dan pembuluh darah terlihat.",
                "severity": "Kronis",
                "action": "Kelola pemicu, terapi medis"
            }
        },
        "table_cols": ["Kelas", "Presisi", "Recall", "F1-Score"]
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
