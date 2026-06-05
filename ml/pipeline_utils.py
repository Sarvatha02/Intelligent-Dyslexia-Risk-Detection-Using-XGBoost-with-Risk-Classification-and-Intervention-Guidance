import pandas as pd
import numpy as np
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler

def clean_data(df):
    """
    Step 4: Data Preprocessing / Cleaning
    - Handles missing values using median imputation
    """
    print("Pre-processing: Handling missing values...")
    imputer = SimpleImputer(strategy='median')
    
    # We don't want to impute the label
    cols_to_impute = df.columns.drop('label')
    df[cols_to_impute] = imputer.fit_transform(df[cols_to_impute])
    
    return df

def feature_engineering(df):
    """
    Step 6: Feature Engineering
    - Creates derived features to help the model learn complex relationships
    """
    print("Feature Engineering: Creating interaction features...")
    # Accuracy per Reading Speed (Efficiency indicator)
    df['efficiency_score'] = df['reading_accuracy'] * df['reading_speed']
    
    # Error vs Confusion (Complexity indicator)
    df['error_confusion_ratio'] = df['writing_error_rate'] * df['confusion_score']
    
    return df

def scale_features(X_train, X_test):
    """
    Step 4: Preprocessing (Scaling)
    """
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    return X_train_scaled, X_test_scaled, scaler
