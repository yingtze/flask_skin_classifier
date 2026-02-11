# Skin Disease Classifier - Flask Web Application

A Flask-based web application for classifying skin diseases using YOLOv8 deep learning model. This is a Flask conversion of the original Gradio application.

## Features

- **Image Upload & Analysis**: Upload skin images for instant disease classification
- **Multi-language Support**: English and Indonesian language options
- **Real-time Predictions**: Instant analysis with confidence scores
- **5 Disease Classes**: Acne, Eczema, Herpes, Tinea Versicolor (Panu), and Rosacea
- **99.34% Accuracy**: High-performance YOLOv8 model
- **Beautiful UI**: Modern, responsive design with dark theme

## Installation

1. **Clone or navigate to the project directory**:
```bash
cd flask_skin_classifier
```

2. **Create a virtual environment** (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**:
```bash
pip install -r requirements.txt
```

4. **Configure the model path**:
Edit `config.py` and update the `MODEL_PATH` to point to your YOLOv8 model file:
```python
MODEL_PATH = "/path/to/your/yolo-skin.onnx"
```

## Usage

1. **Run the Flask application**:
```bash
python app.py
```

2. **Open your browser** and navigate to:
```
http://localhost:5000
```

3. **Upload an image**:
   - Click the upload area or drag and drop an image
   - The app will automatically analyze the image
   - View detailed results including confidence scores and recommendations

## Project Structure

```
flask_skin_classifier/
├── app.py                 # Main Flask application
├── config.py              # Configuration and translations
├── requirements.txt       # Python dependencies
├── README.md             # This file
├── templates/
│   └── index.html        # Main HTML template
├── static/
│   ├── css/
│   │   └── style.css     # Stylesheet
│   ├── js/
│   │   └── main.js       # JavaScript for interactivity
│   └── uploads/          # Uploaded images directory
└── models/               # Model files (not included)
```

## API Endpoints

- `GET /` - Main application page
- `POST /predict` - Image prediction endpoint
- `POST /set_language` - Language switching endpoint
- `GET /examples` - Get example images (if available)

## Model Information

- **Architecture**: YOLOv8 Small Classification
- **Model Size**: 9.8 MB
- **Test Accuracy**: 99.34%
- **Classes**: 5 skin conditions
- **Dataset**: 1,494 images (70% train / 20% val / 10% test)

## Performance Metrics

| Class    | Precision | Recall  | F1-Score |
|----------|-----------|---------|----------|
| Acne     | 100.00%   | 100.00% | 100.00%  |
| Eczema   | 100.00%   | 96.77%  | 98.36%   |
| Herpes   | 96.77%    | 100.00% | 98.36%   |
| Panu     | 100.00%   | 100.00% | 100.00%  |
| Rosacea  | 100.00%   | 100.00% | 100.00%  |

## Disclaimer

⚠️ **Educational Use Only**

This AI tool is for educational purposes only and does not provide a medical diagnosis. Always consult a certified dermatologist for professional advice.

## Tips for Best Results

- Ensure good lighting
- Focus clearly on the affected area
- Remove makeup or creams before capturing

## Configuration

You can customize the application by editing `config.py`:

- `MODEL_PATH`: Path to your YOLO model
- `CLASS_NAMES`: List of disease classes
- `CLASS_COLORS`: Color scheme for each class
- `TRANSLATIONS`: Multi-language text content

## Technologies Used

- **Backend**: Flask 3.0
- **ML Model**: YOLOv8 (Ultralytics)
- **Image Processing**: Pillow, NumPy
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **UI Design**: Custom CSS with modern dark theme

## License

This project is for educational purposes. Please ensure you have the appropriate rights to use the YOLOv8 model and dataset.

## Original Project

This is a Flask conversion of the original Gradio-based skin disease classifier located at `~/trainML/web_classification`.

## Troubleshooting

### Model not found
- Ensure the `MODEL_PATH` in `config.py` points to the correct location
- The model file should be a valid YOLOv8 ONNX file

### Upload errors
- Check file size (max 16MB)
- Ensure the `static/uploads` directory exists and is writable
- Verify the uploaded file is a valid image format

### Dependencies issues
- Make sure you're using Python 3.8 or higher
- Try upgrading pip: `pip install --upgrade pip`
- Install dependencies one by one if batch install fails
