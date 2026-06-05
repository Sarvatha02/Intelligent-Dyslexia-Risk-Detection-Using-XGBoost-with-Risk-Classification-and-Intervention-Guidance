import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split, RandomizedSearchCV, StratifiedKFold, cross_val_score
from sklearn.metrics import classification_report, confusion_matrix
import pickle
import os
from pipeline_utils import clean_data, feature_engineering, scale_features

def train_professional_model():
    print("=== Step 7, 8, 9: AI/ML Pipeline Initiation ===")
    
    data_path = os.path.join(os.path.dirname(__file__), 'dyslexia_data.csv')
    if not os.path.exists(data_path):
        print(f"Data file not found at {data_path}. Run generate_data.py first.")
        return

    # 1. Load Data
    df = pd.read_csv(data_path)
    
    # 2. Clean & Preprocess (Step 4 & 5)
    df = clean_data(df)
    
    # 3. Feature Engineering (Step 6)
    df = feature_engineering(df)
    
    X = df.drop('label', axis=1)
    y = df['label']
    
    # 4. Train/Test Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # 5. Hyperparameter Tuning (Step 10)
    print("\n--- Step 10: Hyperparameter Tuning via RandomizedSearchCV ---")
    param_dist = {
        'n_estimators': [50, 100, 200],
        'max_depth': [3, 6, 10],
        'learning_rate': [0.01, 0.1, 0.2],
        'subsample': [0.8, 1.0],
    }
    
    base_model = xgb.XGBClassifier(objective='multi:softprob', num_class=4, random_state=42)
    
    random_search = RandomizedSearchCV(
        base_model, param_distributions=param_dist, 
        n_iter=5, cv=3, random_state=42, n_jobs=-1
    )
    
    print("Searching for best configuration...")
    random_search.fit(X_train, y_train)
    
    best_model = random_search.best_estimator_
    print(f"Best Parameters: {random_search.best_params_}")
    
    # 6. Cross-Validation (Step 10)
    print("\n--- Step 11: Cross-Validation ---")
    skf = StratifiedKFold(n_splits=5)
    cv_scores = cross_val_score(best_model, X_train, y_train, cv=skf)
    print(f"CV Accuracy Scores: {cv_scores}")
    print(f"Mean CV Accuracy: {cv_scores.mean():.4f}")
    
    # 7. Final Training & Evaluation
    best_model.fit(X_train, y_train)
    y_pred = best_model.predict(X_test)
    
    print("\n--- Final Performance Report ---")
    print(classification_report(y_test, y_pred))
    
    # 8. Save Model & Metadata
    model_save_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
    print(f"\nSaving model to {model_save_path}...")
    with open(model_save_path, 'wb') as f:
        # We save the model. Note: In a real app, you'd also save the scaler if you used one.
        # But for simplistic XGBoost usage on raw inputs, we'll keep it direct.
        pickle.dump(best_model, f)
    
    print("Model Upgrade Complete. Ready for Deployment.")

if __name__ == "__main__":
    train_professional_model()
