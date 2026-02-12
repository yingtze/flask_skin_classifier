document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const uploadArea = document.getElementById('upload-area');
    const imageUpload = document.getElementById('image-upload');
    const previewContainer = document.getElementById('preview-container');
    const previewImage = document.getElementById('preview-image');
    const uploadPlaceholder = document.getElementById('upload-placeholder');
    const analyzeBtn = document.getElementById('analyze-btn');
    const resultContainer = document.getElementById('result-container');
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
    const actionText = document.getElementById('action-text'); // Fixed ID
    const probabilityBars = document.getElementById('probability-bars');

    const CIRCUMFERENCE = 2 * Math.PI * 40; // r=40
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
            uploadPlaceholder.classList.add('opacity-0'); // Fade out placeholder

            // Generate basic slide-up animation
            previewImage.classList.add('animate-slide-up');

            // Reset Results
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

    // 3. UI Helpers
    function setLoading(isLoading) {
        if (isLoading) {
            analyzeBtn.disabled = true;
            analyzeBtn.innerHTML = '<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Processing...';

            scanOverlay.classList.remove('hidden'); // Show scan line

            emptyState.classList.add('hidden');
            resultContent.classList.add('hidden');
            loadingState.classList.remove('hidden');
        } else {
            analyzeBtn.disabled = false;
            analyzeBtn.innerHTML = `<span>Analyze Image</span>`; // Restore btn text (simplified)
            // Ideally fetch translation for button text again, but keeping simple for now

            scanOverlay.classList.add('hidden');
            loadingState.classList.add('hidden');
        }
    }

    function resetResults() {
        emptyState.classList.remove('hidden');
        resultContent.classList.add('hidden');
        loadingState.classList.add('hidden');
    }

    function setProgress(percent) {
        const offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;
        confidenceRing.style.strokeDashoffset = offset;
    }

    function displayResults(result) {
        setLoading(false); // Stop loading animation first

        // 1. Smart Confidence Logic
        let rawConf = parseFloat(result.confidence) * 100;
        let displayConf = rawConf;
        let label = "High Confidence";

        if (rawConf > 99.0) {
            displayConf = 99; // Cap visual number
            label = "Very High (>99%)";
            confidenceValue.innerHTML = `99<span class="text-sm align-top">+</span>%`;
        } else {
            confidenceValue.textContent = `${displayConf.toFixed(1)}%`;
        }

        // 2. Animate Ring
        setTimeout(() => setProgress(displayConf), 100);

        // 3. Text
        diagnosisName.textContent = result.name;
        diagnosisDesc.textContent = result.description;

        // 4. Badges
        // Severity Color Mapping
        const severityMap = {
            'Mild': 'bg-green-500',
            'Moderate': 'bg-yellow-500',
            'Severe': 'bg-red-500',
            'Critical': 'bg-red-700'
        };
        // Default to blue if unknown
        const sevColor = severityMap[result.severity] || 'bg-blue-500';

        severityIndicator.className = `w-3 h-3 rounded-full ${sevColor}`;
        severityText.textContent = result.severity;

        // Action
        actionText.textContent = result.action;

        // 5. Probability Bars
        probabilityBars.innerHTML = '';

        // Find max prob for relative scaling if needed, but 0-100 is standard
        result.sorted_probs.forEach((item, index) => {
            const [name, prob] = item;
            const percentage = (prob * 100).toFixed(1);

            // Color logic: Use specific class color
            const color = result.class_colors[name] || '#64748b'; // Default to slate-500

            const barHTML = `
                <div class="flex items-center justify-between text-xs mb-1">
                    <span class="font-medium text-slate-200 capitalize">${name}</span>
                    <span class="text-slate-400">${percentage}%</span>
                </div>
                <div class="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-1000 ease-out" style="width: 0%; background-color: ${color}" data-width="${percentage}%"></div>
                </div>
            `;
            const div = document.createElement('div');
            div.innerHTML = barHTML;
            probabilityBars.appendChild(div);

            // Trigger animation
            setTimeout(() => {
                div.querySelector('div[data-width]').style.width = percentage + '%';
            }, 100 + (index * 100)); // Stagger animations
        });

        // Show Content
        resultContent.classList.remove('hidden');
    }

    // 4. Tabs & Language (Simple implementation)
    // Language Toggle
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
                    location.reload(); // Simplest way to refresh translations
                }
            } catch (err) {
                console.error(err);
            }
        });
    });

    // Tab Switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from all buttons
            document.querySelectorAll('.tab-btn').forEach(b => {
                b.classList.remove('text-blue-600', 'border-b-2', 'border-blue-600', 'bg-white');
                b.classList.add('text-slate-500', 'hover:text-slate-700');
            });

            // Add active to clicked
            e.target.classList.remove('text-slate-500', 'hover:text-slate-700');
            e.target.classList.add('text-blue-600', 'border-b-2', 'border-blue-600', 'bg-white');

            // Hide all contents
            document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));

            // Show target
            const tabId = e.target.getAttribute('data-tab');
            document.getElementById(`tab-${tabId}`).classList.remove('hidden');
        });
    });

    // Load Examples (Stub)
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
                    div.className = 'group relative aspect-square rounded-lg overflow-hidden cursor-pointer bg-slate-100 hover:shadow-lg transition-all';
                    div.innerHTML = `
                        <img src="${ex.url}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="${ex.class}">
                        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                            <span class="text-white text-xs font-bold uppercase tracking-wider">${ex.class}</span>
                        </div>
                    `;
                    // Add click handler to auto-load example
                    div.addEventListener('click', async () => {
                        // Convert URL to Blob to simulate file upload
                        try {
                            const imgRes = await fetch(ex.url);
                            const blob = await imgRes.blob();
                            const file = new File([blob], `${ex.class}.jpg`, { type: 'image/jpeg' });
                            handleFile(file);
                            // Scroll up
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        } catch (e) {
                            console.error("Failed to load example", e);
                        }
                    });

                    grid.appendChild(div);
                });
            } else {
                grid.innerHTML = '<p class="col-span-full text-slate-400 text-center">No examples found.</p>';
            }
        } catch (e) {
            console.error(e);
        }
    }
});
