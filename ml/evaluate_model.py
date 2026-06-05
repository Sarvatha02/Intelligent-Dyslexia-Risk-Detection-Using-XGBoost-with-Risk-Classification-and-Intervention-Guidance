import pickle
import pandas as pd
import numpy as np
from sklearn.metrics import accuracy_score
import os
from pipeline_utils import clean_data, feature_engineering

def run_evaluation():
    print("=== Step 11: Final Model Evaluation ===")
    
    if not os.path.exists('ml/model.pkl'):
        print("Model file not found. Run train_model.py first.")
        return
        
    if not os.path.exists('ml/dyslexia_data.csv'):
        print("Data file not found.")
        return

    # Load Model
    with open('ml/model.pkl', 'rb') as f:
        model = pickle.load(f)
    
    # Load original data to grab a 'unseen' slice or just re-verify
    df = pd.read_csv('ml/dyslexia_data.csv')
    df = clean_data(df)
    df = feature_engineering(df)
    
    X = df.drop('label', axis=1)
    y = df['label']
    
    # Predict
    y_pred = model.predict(X)
    acc = accuracy_score(y, y_pred)
    
    print(f"\nFinal Accuracy on Entire Dataset: {acc:.4f}")
    
    print("\nSample Predictions:")
    samples = X.head(5)
    real_labels = y.head(5)
    preds = model.predict(samples)
    
    for i in range(5):
        print(f"Sample {i+1}: Predicted Label {preds[i]}, Actual Label {real_labels[i]}")

if __name__ == "__main__":
    run_evaluation()
