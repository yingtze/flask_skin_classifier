from flask import Flask, render_template, request, jsonify, session
from werkzeug.utils import secure_filename
from ultralytics import YOLO
from PIL import Image
import numpy as np
import os
import config
import uuid
import time
import threading

app = Flask(__name__)
app.secret_key = 'your-secret-key-here-change-in-production'
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'}

# Load YOLO model - use .pt file for better compatibility
model_path = config.MODEL_PATH.replace('.onnx', '.pt')
if not os.path.exists(model_path):
    model_path = config.MODEL_PATH  # Fallback to ONNX if .pt doesn't exist
model = YOLO(model_path)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def cleanup_old_uploads():
    """
    Deletes files in UPLOAD_FOLDER older than UPLOAD_RETENTION_MINUTES.
    """
    try:
        folder = app.config['UPLOAD_FOLDER']
        if not os.path.exists(folder):
            return

        retention_sec = config.UPLOAD_RETENTION_MINUTES * 60
        now = time.time()

        for filename in os.listdir(folder):
            filepath = os.path.join(folder, filename)
            # Skip if not a file
            if not os.path.isfile(filepath):
                continue
            
            # Check modification time
            file_age = now - os.path.getmtime(filepath)
            if file_age > retention_sec:
                try:
                    os.remove(filepath)
                    print(f"Deleted old file: {filename}")
                except Exception as e:
                    print(f"Error deleting {filename}: {e}")
    except Exception as e:
        print(f"Cleanup error: {e}")

def get_model_info():
    """
    Detects the model file in the models directory and returns its name and size.
    """
    try:
        models_dir = os.path.join(app.root_path, 'models')
        if not os.path.exists(models_dir):
            return "Unknown", "Unknown"
            
        # Prioritize .pt then .onnx
        files = os.listdir(models_dir)
        model_file = next((f for f in files if f.endswith('.pt')), None)
        if not model_file:
            model_file = next((f for f in files if f.endswith('.onnx')), None)
            
        if model_file:
            size_bytes = os.path.getsize(os.path.join(models_dir, model_file))
            size_mb = f"{size_bytes / (1024 * 1024):.1f} MB"
            return model_file, size_mb
    except Exception:
        pass
    return "Unknown", "Unknown"

def generate_result_data(probs, top_class, lang):
    """
    Generates result data for rendering.
    """
    t = config.TRANSLATIONS[lang]
    c_info = t["classes"][top_class]
    c_color = config.CLASS_COLORS[top_class]

    # Sort probabilities
    sorted_probs = sorted(probs.items(), key=lambda x: x[1], reverse=True)

    return {
        'confidence': probs[top_class],
        'color': c_color,
        'name': c_info['name'],
        'description': c_info['desc'],
        'severity': c_info['severity'],
        'action': c_info['action'],
        'sorted_probs': sorted_probs,
        'translations': t,
        'class_colors': config.CLASS_COLORS
    }

def predict_skin_disease(image_path, lang):
    """
    Predict skin disease from image.
    """
    if not lang:
        lang = "en"
    t = config.TRANSLATIONS[lang]

    try:
        # Load image and convert to RGB
        image = Image.open(image_path).convert('RGB')

        # Run prediction
        results = model.predict(image, verbose=False)
        
        if not results or len(results) == 0:
            return None, "Model did not return predictions"
        
        result = results[0]
        
        # Handle classification output
        if hasattr(result, 'probs') and result.probs is not None:
            probs = result.probs.data.cpu().numpy()
            
            # Create probability dictionary
            prob_dict = {config.CLASS_NAMES[i]: float(probs[i]) for i in range(len(config.CLASS_NAMES))}
            
            # Get top prediction
            top1_idx = result.probs.top1
            predicted_class = config.CLASS_NAMES[top1_idx]
            
            return generate_result_data(prob_dict, predicted_class, lang), None
        else:
            return None, "Model output format not recognized"

    except Exception as e:
        import traceback
        traceback.print_exc()
        return None, str(e)

@app.route('/')
def index():
    lang = session.get('lang', 'en')
    t = config.TRANSLATIONS[lang].copy() # Copy to avoid mutating global state
    
    # Inject dynamic model info
    model_name, model_size = get_model_info()
    try:
        t['model_info_text'] = t['model_info_text'].format(
            model_name=model_name,
            model_size=model_size
        )
    except KeyError:
        pass # Fallback if placeholders missing

    return render_template('index.html', translations=t, lang=lang)

@app.route('/set_language', methods=['POST'])
def set_language():
    data = request.get_json()
    lang = data.get('lang', 'en')
    session['lang'] = lang
    t = config.TRANSLATIONS[lang].copy()
    
    # Inject dynamic model info
    model_name, model_size = get_model_info()
    try:
        t['model_info_text'] = t['model_info_text'].format(
            model_name=model_name,
            model_size=model_size
        )
    except KeyError:
        pass

    return jsonify({'success': True, 'translations': t})

@app.route('/predict', methods=['POST'])
def predict():
    lang = session.get('lang', 'en')
    t = config.TRANSLATIONS[lang]

    if 'file' not in request.files:
        return jsonify({'error': t['error_no_image']}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': t['error_no_image']}), 400

    if file and allowed_file(file.filename):
        # Trigger cleanup in background
        threading.Thread(target=cleanup_old_uploads).start()

        # Secure Rename: timestamp based ID (e.g. upload_1700000000_a1b2.jpg)
        original_ext = file.filename.rsplit('.', 1)[1].lower()
        timestamp = int(time.time())
        unique_id = uuid.uuid4().hex[:4]
        unique_filename = f"upload_{timestamp}_{unique_id}.{original_ext}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        
        file.save(filepath)

        # Predict
        result_data, error = predict_skin_disease(filepath, lang)

        if error:
            # Try to cleanup the uploaded file if prediction fails
            if os.path.exists(filepath):
                os.remove(filepath)
            return jsonify({'error': f'Error: {error}'}), 500

        # Add image URL to result
        result_data['image_url'] = f'/static/uploads/{unique_filename}'

        return jsonify({'success': True, 'result': result_data})

    return jsonify({'error': 'Invalid file type'}), 400

@app.route('/examples')
def examples():
    """Return list of example images"""
    base_dir = os.path.dirname(os.path.abspath(__file__))
    example_files = {
        'acne': 'static/examples/acne.jpg',
        'eksim': 'static/examples/eksim.jpg',
        'herpes': 'static/examples/herpes.jpg',
        'panu': 'static/examples/panu.jpg',
        'rosacea': 'static/examples/rosacea.jpg',
    }

    examples = []
    for class_name, relative_path in example_files.items():
        full_path = os.path.join(base_dir, relative_path)
        if os.path.exists(full_path):
            examples.append({
                'path': full_path,
                'class': class_name,
                'url': f'/{relative_path}'
            })

    return jsonify({'examples': examples})

if __name__ == '__main__':
    # Create upload folder if it doesn't exist
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    app.run(
        host='0.0.0.0',
        port=5001,
        debug=True
    )
