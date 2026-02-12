/**
 * Sistem Internasionalisasi (i18n) Aplikasi Skin Classifier
 * Berisi terjemahan untuk semua teks UI dalam bahasa Inggris dan Indonesia
 * 
 * Struktur: translations[bahasa][kunci] membentuk pohon nested
 * Contoh akses: t('tabs.examples') akan mencari translations[lang].tabs.examples
 */

const translations = {
    /**
     * Terjemahan Bahasa Indonesia
     * Digunakan untuk pengguna lokal dan default
     */
    id: {
        title: "Deteksi Penyakit Kulit AI",
        header: "AI Skin Classifier",
        header_subtitle: "Analisis Kesehatan Kulit Berbasis <span>AI</span>",
        input_label: "Unggah Gambar",
        click_upload: "Klik untuk memilih gambar",
        file_hint: "JPG, PNG (Maks 5MB)",
        analyze_btn: "Analisis Sekarang",
        analyzing_btn: "Sedang Menganalisis...",
        tips_title: "Tips Foto",
        tips_content: `
            <ul class="list-disc pl-4 space-y-1">
                <li>Fokuskan pada area kulit yang bermasalah.</li>
                <li>Gunakan pencahayaan yang cukup.</li>
                <li>Hindari bayangan atau blur yang berlebihan.</li>
            </ul>
        `,
        disclaimer_title: "Penting",
        disclaimer_text: "Hasil ini hanya dugaan AI dan bukan pengganti diagnosis medis dokter.",
        ready_title: "Siap Menganalisis",
        ready_desc: "Silakan unggah foto kondisi kulit untuk mendapatkan prediksi awal.",
        loading_title: "Menganalisis...",
        loading_desc: "AI sedang memproses gambar Anda",
        primary_diagnosis: "Diagnosis Utama",
        confidence_label: "Akurasi",
        severity_label: "Tingkat Keparahan",
        consult_label: "Saran Tindakan",
        output_title: "Kemungkinan Lain",
        footer: "© 2026 AI Skin Classifier",
        model_stats: "Informasi Model",
        model_info_text: "Model ini dilatih menggunakan dataset gambar penyakit kulit klinis dengan arsitektur CNN modern.",
        table_cols: ["Kondisi", "Recall", "Precision", "F1-Score"],
        remove_label: "Hapus gambar",
        toast_removed: "Gambar dihapus. Silakan unggah baru.",
        tabs: {
            examples: "Contoh",
            info: "Info Model"
        },
        classes: {
            acne: "Jerawat",
            eksim: "Eksim",
            herpes: "Herpes",
            panu: "Panu",
            rosacea: "Rosacea"
        },
        loading_examples: "Memuat contoh..."
    },

    /**
     * Terjemahan Bahasa Inggris
     * Untuk pengguna internasional
     */
    en: {
        title: "AI Skin Disease Detection",
        header: "AI Skin Classifier",
        header_subtitle: "AI-Based Skin Health <span>Analysis</span>",
        input_label: "Upload Image",
        click_upload: "Click to select image",
        file_hint: "JPG, PNG (Max 5MB)",
        analyze_btn: "Analyze Now",
        analyzing_btn: "Analyzing...",
        tips_title: "Photo Tips",
        tips_content: `
            <ul class="list-disc pl-4 space-y-1">
                <li>Focus on the affected skin area.</li>
                <li>Use sufficient lighting.</li>
                <li>Avoid excessive shadows or blur.</li>
            </ul>
        `,
        disclaimer_title: "Important",
        disclaimer_text: "This result is an AI prediction and NOT a substitute for professional medical diagnosis.",
        ready_title: "Ready to Analyze",
        ready_desc: "Please upload a photo of the skin condition to get a preliminary prediction.",
        loading_title: "Analyzing...",
        loading_desc: "AI is processing your image",
        primary_diagnosis: "Primary Diagnosis",
        confidence_label: "Confidence",
        severity_label: "Severity",
        consult_label: "Action",
        output_title: "Other Probabilities",
        footer: "© 2026 AI Skin Classifier",
        model_stats: "Model Information",
        model_info_text: "This model is trained using a clinical skin disease image dataset with modern CNN architecture.",
        table_cols: ["Condition", "Recall", "Precision", "F1-Score"],
        remove_label: "Remove image",
        toast_removed: "Image removed. Upload a new one.",
        tabs: {
            examples: "Examples",
            info: "Model Info"
        },
        classes: {
            acne: "Acne",
            eksim: "Eczema",
            herpes: "Herpes",
            panu: "Tinea Versicolor",
            rosacea: "Rosacea"
        },
        loading_examples: "Loading examples..."
    }
};
