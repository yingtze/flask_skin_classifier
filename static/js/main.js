document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const uploadArea = document.getElementById('upload-area');
    const imageUpload = document.getElementById('image-upload');
    const previewContainer = document.getElementById('preview-container');
    const previewImage = document.getElementById('preview-image');
    const uploadPlaceholder = document.getElementById('upload-placeholder');
    const analyzeBtn = document.getElementById('analyze-btn');
    const removeBtn = document.getElementById('remove-btn');
    const scanOverlay = document.getElementById('scan-overlay');

    // Result Elements
    const emptyState = document.getElementById('empty-state');
    const loadingState = document.getElementById('loading-state');
    const resultContent = document.getElementById('result-content');
    const diagnosisName = document.getElementById('diagnosis-name');
    const diagnosisDesc = document.getElementById('diagnosis-desc');
    const confidenceValue = document.getElementById('confidence-value');
    const confidenceRing = document.getElementById('confidence-ring');
    const severityIndicator = document.getElementById('severity-indicator');
    const severityText = document.getElementById('severity-text');
    const actionText = document.getElementById('action-text');
    const probabilityBars = document.getElementById('probability-bars');

    const CIRCUMFERENCE = 2 * Math.PI * 40;
    confidenceRing.style.strokeDasharray = `${CIRCUMFERENCE} ${CIRCUMFERENCE}`;
    confidenceRing.style.strokeDashoffset = CIRCUMFERENCE;

    // --- State ---
    let currentFile = null;

    // --- Event Listeners ---

    // 1. Upload Interaction
    uploadArea.addEventListener('click', () => imageUpload.click());

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    imageUpload.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    });

    function handleFile(file) {
        if (!file.type.match('image.*')) {
            alert('Please upload an image file (JPG, PNG).');
            return;
        }

        currentFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.src = e.target.result;
            previewContainer.classList.remove('hidden');
            uploadPlaceholder.classList.add('opacity-0');
            resetResults();
        };
        reader.readAsDataURL(file);
    }

    // 2. Analyze
    analyzeBtn.addEventListener('click', async () => {
        if (!currentFile) {
            alert('Please select an image first.');
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('file', currentFile);

        try {
            const response = await fetch('/predict', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Prediction failed');
            }

            const data = await response.json();
            if (data.success) {
                displayResults(data.result);
            } else {
                throw new Error(data.error || 'Unknown error');
            }
        } catch (error) {
            alert(error.message);
            setLoading(false);
        }
    });

    // 3. Remove Image
    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent opening upload dialog
        removeImage();
    });

    // Keyboard support for remove button
    removeBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            removeImage();
        }
    });

    function removeImage() {
        if (!currentFile && !previewImage.src) return;

        // Reset State
        currentFile = null;
        imageUpload.value = ''; // Clear file input (critical for re-uploading same file)

        // Reset UI with animation
        previewImage.classList.add('scale-95', 'opacity-0');

        setTimeout(() => {
            previewImage.src = '';
            previewImage.classList.remove('scale-95', 'opacity-0');
            previewContainer.classList.add('hidden');
            uploadPlaceholder.classList.remove('opacity-0');

            // Show Toast
            showToast('Image removed. Ready for new upload.');
        }, 200);

        // Deep Reset of Analysis
        resetResults();
        setLoading(false);
    }

    // Toast Logic
    const toastContainer = document.getElementById('toast-container');
    const toastMessage = document.getElementById('toast-message');
    let toastTimeout;

    window.hideToast = function () {
        toastContainer.classList.add('translate-x-full', 'opacity-0');
    }

    function showToast(msg) {
        toastMessage.textContent = msg;
        toastContainer.classList.remove('translate-x-full', 'opacity-0');

        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            hideToast();
        }, 3000);
    }

    // 4. UI Helpers
    function setLoading(isLoading) {
        if (isLoading) {
            analyzeBtn.disabled = true;
            analyzeBtn.innerHTML = '<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Processing...';

            scanOverlay.classList.remove('hidden');

            emptyState.classList.add('hidden');
            resultContent.classList.add('hidden');
            loadingState.classList.remove('hidden');
        } else {
            analyzeBtn.disabled = false;
            analyzeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg><span>Analyze</span>`;

            scanOverlay.classList.add('hidden');
            loadingState.classList.add('hidden');
        }
    }

    function resetResults() {
        // Hide results
        emptyState.classList.remove('hidden');
        resultContent.classList.add('hidden');
        loadingState.classList.add('hidden');

        // Deep Clean Text & Values
        confidenceValue.textContent = '0%';
        setProgress(0);

        diagnosisName.textContent = 'Diagnosis Name';
        diagnosisDesc.textContent = 'Description will appear here after analysis.';

        severityText.textContent = '-';
        severityIndicator.className = 'w-2.5 h-2.5 rounded-full bg-gray-600';

        actionText.textContent = '-';

        probabilityBars.innerHTML = ''; // Clear prior bars
    }

    function setProgress(percent) {
        const offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;
        confidenceRing.style.strokeDashoffset = offset;
    }

    function displayResults(result) {
        setLoading(false);

        // 1. Confidence
        let rawConf = parseFloat(result.confidence) * 100;
        let displayConf = rawConf;

        if (rawConf > 99.0) {
            displayConf = 99;
            confidenceValue.innerHTML = `99<span class="text-xs align-top">+</span>%`;
        } else {
            confidenceValue.textContent = `${displayConf.toFixed(1)}%`;
        }

        // 2. Animate Ring
        setTimeout(() => setProgress(displayConf), 100);

        // 3. Text
        diagnosisName.textContent = result.name;
        diagnosisDesc.textContent = result.description;

        // 4. Badges
        const severityMap = {
            'Mild': 'bg-green-500', 'Ringan': 'bg-green-500',
            'Moderate': 'bg-yellow-500', 'Sedang': 'bg-yellow-500',
            'Severe': 'bg-red-500', 'Parah': 'bg-red-500',
            'Variable': 'bg-blue-500', 'Bervariasi': 'bg-blue-500',
            'Chronic': 'bg-orange-500', 'Kronis': 'bg-orange-500',
            'Moderate to Chronic': 'bg-yellow-500', 'Sedang hingga Kronis': 'bg-yellow-500',
            'Moderate (Contagious)': 'bg-red-500', 'Sedang (Menular)': 'bg-red-500'
        };
        const sevColor = severityMap[result.severity] || 'bg-blue-500';

        severityIndicator.className = `w-2.5 h-2.5 rounded-full ${sevColor}`;
        severityText.textContent = result.severity;
        actionText.textContent = result.action;

        // 5. Probability Bars
        probabilityBars.innerHTML = '';

        result.sorted_probs.forEach((item, index) => {
            const [name, prob] = item;
            const percentage = (prob * 100).toFixed(1);
            const color = result.class_colors[name] || '#6b7280';

            const barHTML = `
                <div class="flex items-center justify-between text-xs mb-1">
                    <span class="font-medium text-gray-300 capitalize">${name}</span>
                    <span class="text-gray-400 font-mono">${percentage}%</span>
                </div>
                <div class="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-1000 ease-out" style="width: 0%; background-color: ${color}" data-width="${percentage}%"></div>
                </div>
            `;
            const div = document.createElement('div');
            div.innerHTML = barHTML;
            probabilityBars.appendChild(div);

            setTimeout(() => {
                div.querySelector('div[data-width]').style.width = percentage + '%';
            }, 100 + (index * 100));
        });

        // Show Content
        resultContent.classList.remove('hidden');
    }

    // 4. Language Toggle
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const lang = e.target.getAttribute('data-lang');

            try {
                const response = await fetch('/set_language', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ lang })
                });
                const data = await response.json();
                if (data.success) {
                    location.reload();
                }
            } catch (err) {
                console.error(err);
            }
        });
    });

    // 5. Tab Switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => {
                b.classList.remove('text-blue-400', 'border-b-2', 'border-blue-500', 'bg-white/[0.02]');
                b.classList.add('text-gray-500');
            });

            e.target.classList.remove('text-gray-500');
            e.target.classList.add('text-blue-400', 'border-b-2', 'border-blue-500', 'bg-white/[0.02]');

            document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));

            const tabId = e.target.getAttribute('data-tab');
            document.getElementById(`tab-${tabId}`).classList.remove('hidden');
        });
    });

    // 6. Load Examples
    loadExamples();

    async function loadExamples() {
        try {
            const res = await fetch('/examples');
            const data = await res.json();
            const grid = document.getElementById('examples-grid');
            grid.innerHTML = '';

            if (data.examples && data.examples.length > 0) {
                data.examples.forEach(ex => {
                    const div = document.createElement('div');
                    div.className = 'group relative aspect-square rounded-xl overflow-hidden cursor-pointer bg-gray-900 border border-white/5 hover:border-blue-500/30 transition-all';
                    div.innerHTML = `
                        <img src="${ex.url}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="${ex.class}">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-2">
                            <span class="text-white text-[10px] font-bold uppercase tracking-wider">${ex.class}</span>
                        </div>
                    `;
                    div.addEventListener('click', async () => {
                        try {
                            const imgRes = await fetch(ex.url);
                            const blob = await imgRes.blob();
                            const file = new File([blob], `${ex.class}.jpg`, { type: 'image/jpeg' });
                            handleFile(file);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        } catch (e) {
                            console.error("Failed to load example", e);
                        }
                    });

                    grid.appendChild(div);
                });
            } else {
                grid.innerHTML = '<p class="col-span-full text-gray-500 text-center text-sm py-8">No examples found.</p>';
            }
        } catch (e) {
            console.error(e);
        }
    }
});
