# Refactoring Guide: Flask to React + Vite

This guide outlines the steps to migrate the current Flask monolithic application to a decoupled architecture using a **React** frontend (powered by Vite) and keeping **Flask** as a pure API backend.

## 1. Architecture Overview

-   **Frontend**: React (Vite) + Tailwind CSS + Lucide React (icons).
-   **Backend**: Flask (API Mode) + CORS support.
-   **Communication**: REST API (initially) or WebSocket (for real-time progress).

## 2. Backend Changes (`app.py`)

Current Flask app serves HTML. It needs to only serve JSON.

### Steps:
1.  **Install Flask-CORS**:
    ```bash
    pip install flask-cors
    ```
2.  **Enable CORS**:
    ```python
    from flask_cors import CORS
    app = Flask(__name__)
    CORS(app) # Allow all origins in dev, restrict in prod
    ```
3.  **Remove View Routes**:
    -   Remove `@app.route('/')`.
    -   Remove `render_template`.
4.  **Keep API Routes**:
    -   `/predict` (POST) -> Returns JSON.
    -   `/examples` (GET) -> Returns JSON.
    -   `/static` -> Serve images (or move to S3/Cloudinary).

## 3. Frontend Setup (React + Vite)

### Initialization
```bash
npm create vite@latest skin-classifier-ui -- --template react
cd skin-classifier-ui
npm install
```

### Dependencies
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# UI Libraries
npm install framer-motion clsx tailwind-merge lucide-react
```

### Project Structure
```
src/
├── components/
│   ├── ui/             # Reusable atoms (Button, Card, ProgressBar)
│   ├── Layout/         # Header, Footer, MainLayout
│   ├── Upload/         # Dropzone logic
│   └── Results/        # ConfidenceRing, AnalysisCard
├── hooks/
│   └── usePrediction.js # Encapsulate API logic
├── App.jsx
└── main.jsx
```

## 4. Key Components to Build

### A. `UploadZone.jsx`
Use `react-dropzone` for robust drag-and-drop.
```jsx
// Pseudo-code
const onDrop = useCallback(acceptedFiles => {
  const file = acceptedFiles[0];
  setPreview(URL.createObjectURL(file));
  onFileSelect(file);
}, [])
```

### B. `ConfidenceRing.jsx`
Implement the SVG circle logic as a reusable component.
```jsx
const ConfidenceRing = ({ percent }) => {
  // stroke-dashoffset math
  return <svg>...</svg>
}
```

### C. `ResultsPanel.jsx`
Handle the "Smart Confidence" logic here (view logic), not in backend.
```jsx
const displayScore = rawScore > 99 ? 99 : rawScore;
const displayLabel = rawScore > 99 ? "Very High (>99%)" : "High Confidence";
```

## 5. API Integration Hook

Create a custom hook `useSkinAnalysis.js`:

```javascript
export const useSkinAnalysis = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const analyze = async (file) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            const res = await fetch('http://localhost:5001/predict', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            setResult(data.result);
        } catch (e) {
            setError(e);
        } finally {
            setLoading(false);
        }
    };

    return { analyze, loading, result, error };
};
```

## 6. Comparison: Deployment

| Strategy | Frontend | Backend | Pros | Cons |
| :--- | :--- | :--- | :--- | :--- |
| **Monolith (Current)** | Jinja2 Templates | Flask | Simple deployment (1 server) | Hard to manage complex state/UI |
| **Decoupled (Proposed)** | Netlify / Vercel | Render / Heroku / AWS | Better DX, faster UI, clear separation | CORS issues, 2 build pipelines |

## 7. Recommended Next Steps

1.  **Start Local**: Create the Vite app locally and proxy API requests to Flask.
    *   Vite config: `server: { proxy: { '/api': 'http://localhost:5001' } }`
2.  **Port logic**: Move the `main.js` logic into React components.
3.  **Refine animations**: Use `framer-motion` for smoother layout transitions (e.g., when results appear).
