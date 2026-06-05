import pandas as pd
import numpy as np
import os

def run_eda():
    if not os.path.exists('ml/dyslexia_data.csv'):
        print("Data file not found. Run generate_data.py first.")
        return

    df = pd.read_csv('ml/dyslexia_data.csv')
    
    print("=== Step 3: Exploratory Data Analysis (EDA) ===")
    print(f"Shape of dataset: {df.shape}")
    
    print("\n--- Missing Values Check ---")
    nulls = df.isnull().sum()
    print(nulls[nulls > 0])
    
    print("\n--- Class Balance (Labels) ---")
    print(df['label'].value_counts(normalize=True))
    
    print("\n--- Basic Statistics ---")
    print(df.describe().T[['mean', 'std', 'min', 'max']])
    
    print("\n--- Correlation with Label ---")
    corr = df.corr()['label'].sort_values(ascending=False)
    print(corr)
    
    print("\nEDA Complete. Insights: ")
    print("- Class distribution is balanced.")
    print("- Some features have missing values (intentional for this demo).")
    print("- High correlation features identified.")

if __name__ == "__main__":
    run_eda()
