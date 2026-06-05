import pickle
import numpy as np
import os

# Load model
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'ml', 'model.pkl')

def load_model():
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
    return model

model = load_model()

def predict_dyslexia(features: dict, age: int):
    """
    Predict dyslexia risk from assessment features.
    Updated to be MULTIMODAL: incorporates gestures and gaze jitter.
    """
    base_names = [
        'reading_speed', 'reading_accuracy', 'spelling_score',
        'phonological_score', 'memory_score', 'confusion_score',
        'writing_error_rate', 'response_time_variance', 'ran_speed_score',
        'eye_tracking_score'
    ]
    base = {name: float(features.get(name, 0)) for name in base_names}
    base['ran_speed_score'] = 5000.0  # Constant for legacy reasons
    
    # Multimodal Features
    blinks = int(features.get('blink_count', 0))
    tilt_var = float(features.get('tilt_variance', 0))
    gaze_var_x = float(features.get('gaze_variance_x', 0))
    gaze_var_y = float(features.get('gaze_variance_y', 0))

    # Engineered features
    efficiency_score = base['reading_accuracy'] * base['reading_speed']
    error_confusion_ratio = base['writing_error_rate'] * base['confusion_score']

    # X vector for XGBoost (12 features)
    X = np.array([[
        base['reading_speed'], base['reading_accuracy'], base['spelling_score'],
        base['phonological_score'], base['memory_score'], base['confusion_score'],
        base['writing_error_rate'], base['response_time_variance'], base['ran_speed_score'],
        base['eye_tracking_score'], efficiency_score, error_confusion_ratio,
    ]])

    # Base ML Prediction
    risk_level = int(model.predict(X)[0])
    probabilities = model.predict_proba(X)[0]
    confidence = float(max(probabilities))

    # --- ADVANCED MULTIMODAL HEURISTIC ---
    # This logic differentiates between "mistakes" and "dyslexic patterns"
    adj_risk = risk_level

    # 1. Behavioral Stability Check
    # If eye movements and head tilts are VERY stable, mistakes are likely just slips.
    is_physically_stable = (gaze_var_x < 0.005 and tilt_var < 2.0)
    
    # 2. Eye Movement Pattern Check
    # High horizontal gaze variance (gaze_var_x) suggests erratic saccades common in dyslexia.
    is_erratic_eyes = (gaze_var_x > 0.02)

    if age <= 8:
        if base['confusion_score'] >= 4 and is_erratic_eyes:
            adj_risk = max(risk_level, 2) # Moderate Risk
        elif base['confusion_score'] < 2 and is_physically_stable:
            adj_risk = 0 # Normal
    else:
        # For older users, we look for "Compensated Dyslexia" (correct answers but high jitter)
        if base['reading_accuracy'] > 85 and is_erratic_eyes:
            adj_risk = max(risk_level, 1) # At least Mild Risk
        elif base['reading_accuracy'] < 70 and is_physically_stable:
            # Mistake but stable? Might not be dyslexia.
            adj_risk = max(0, risk_level - 1)

    # 3. Excessive Blinking Check (Visual Stress)
    if blinks > 50: # Arbitrary threshold for high stress
        adj_risk = min(3, adj_risk + 1)

    risk_level = max(0, min(3, adj_risk))
    
    # Clear Binary Labeling
    status_label = "Dyslexic" if risk_level > 0 else "Non-Dyslexic"
    intensity_label = ["Normal", "Mild", "Moderate", "Severe"][risk_level]

    recommendations = {
        0: ["Non-Dyslexic: Maintain standard literacy development.", "Continue monitoring reading fluency."],
        1: ["Mild Dyslexia: Use multisensory techniques.", "Focus on phonological awareness."],
        2: ["Moderate Dyslexia: Structured literacy intervention required.", "Consider assistive technologies."],
        3: ["Severe Dyslexia: Immediate specialist intervention.", "Implement comprehensive IEP."]
    }

    return {
        "risk_level": risk_level,
        "label": f"{status_label} ({intensity_label})",
        "confidence": round(confidence, 3),
        "recommendations": recommendations[risk_level],
    }
