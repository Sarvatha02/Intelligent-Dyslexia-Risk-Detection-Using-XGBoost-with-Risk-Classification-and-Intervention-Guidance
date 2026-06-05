import pandas as pd
import numpy as np
import random
import pickle
import os

def generate_synthetic_data(n_samples=1500):
    np.random.seed(42)
    
    # Features:
    # reading_speed (WPM)
    # reading_accuracy (0-1)
    # spelling_score (0-100)
    # phonological_score (0-100)
    # memory_score (0-100)
    # confusion_score (0-10) -> higher is more confusion (b/d/p/q)
    # writing_error_rate (0-1)
    # response_time_variance (ms)
    # eye_tracking_score (0-100) -> higher is more erratic/variance
    
    data = []
    
    for _ in range(n_samples):
        # Choose label first to ensure balance
        # 0: Normal, 1: Mild, 2: Moderate, 3: Severe
        label = random.randint(0, 3)
        
        if label == 0: # Normal
            reading_speed = np.random.normal(90, 15)
            reading_accuracy = np.random.uniform(0.85, 1.0)
            spelling_score = np.random.normal(85, 10)
            phonological_score = np.random.normal(85, 10)
            memory_score = np.random.normal(80, 12)
            confusion_score = np.random.normal(1, 1)
            writing_error_rate = np.random.uniform(0.01, 0.1)
            response_time_variance = np.random.normal(200, 50)
            ran_speed_score = np.random.normal(4000, 800)
            eye_tracking_score = np.random.normal(15, 5)
        elif label == 1: # Mild
            reading_speed = np.random.normal(70, 12)
            reading_accuracy = np.random.uniform(0.70, 0.85)
            spelling_score = np.random.normal(65, 12)
            phonological_score = np.random.normal(70, 12)
            memory_score = np.random.normal(70, 15)
            confusion_score = np.random.normal(3, 1.5)
            writing_error_rate = np.random.uniform(0.1, 0.2)
            response_time_variance = np.random.normal(400, 100)
            ran_speed_score = np.random.normal(6500, 1000)
            eye_tracking_score = np.random.normal(35, 10)
        elif label == 2: # Moderate
            reading_speed = np.random.normal(50, 10)
            reading_accuracy = np.random.uniform(0.50, 0.70)
            spelling_score = np.random.normal(45, 10)
            phonological_score = np.random.normal(50, 10)
            memory_score = np.random.normal(55, 12)
            confusion_score = np.random.normal(6, 2)
            writing_error_rate = np.random.uniform(0.2, 0.4)
            response_time_variance = np.random.normal(600, 150)
            ran_speed_score = np.random.normal(10000, 1500)
            eye_tracking_score = np.random.normal(60, 10)
        else: # Severe
            reading_speed = np.random.normal(35, 8)
            reading_accuracy = np.random.uniform(0.30, 0.50)
            spelling_score = np.random.normal(30, 8)
            phonological_score = np.random.normal(35, 8)
            memory_score = np.random.normal(40, 10)
            confusion_score = np.random.normal(8, 2)
            writing_error_rate = np.random.uniform(0.4, 0.7)
            response_time_variance = np.random.normal(1000, 300)
            ran_speed_score = np.random.normal(14000, 2000)
            eye_tracking_score = np.random.normal(85, 10)
            
        # Add random noise (Data Drift/Messiness Simulation)
        reading_speed += np.random.normal(0, 2)
        spelling_score += np.random.normal(0, 2)
        ran_speed_score += np.random.normal(0, 100)
        
        # Ensure values stay in realistic bounds
        reading_speed = max(5, reading_speed)
        spelling_score = max(0, min(100, spelling_score))
        phonological_score = max(0, min(100, phonological_score))
        memory_score = max(0, min(100, memory_score))
        confusion_score = max(0, min(10, confusion_score))
        writing_error_rate = max(0.01, min(1.0, writing_error_rate))
        response_time_variance = max(50, response_time_variance)
        ran_speed_score = max(1000, ran_speed_score)
        eye_tracking_score = max(0, min(100, eye_tracking_score))
        
        row = {
            'reading_speed': reading_speed,
            'reading_accuracy': reading_accuracy,
            'spelling_score': spelling_score,
            'phonological_score': phonological_score,
            'memory_score': memory_score,
            'confusion_score': confusion_score,
            'writing_error_rate': writing_error_rate,
            'response_time_variance': response_time_variance,
            'ran_speed_score': ran_speed_score,
            'eye_tracking_score': eye_tracking_score,
            'label': label
        }
        
        # Introduce Missing Values (NaNs) - 5% chance for some columns
        for col in ['spelling_score', 'memory_score', 'response_time_variance']:
            if random.random() < 0.05:
                row[col] = np.nan
                
        data.append(row)
        
    df = pd.DataFrame(data)
    save_path = os.path.join(os.path.dirname(__file__), 'dyslexia_data.csv')
    df.to_csv(save_path, index=False)
    print(f"Generated {n_samples} samples and saved to {save_path}")
    return df

if __name__ == "__main__":
    generate_synthetic_data()

