import sys
import os
from pathlib import Path

# Fix path to include project root
root = str(Path(__file__).parent.parent)
sys.path.append(root)

from backend.database import get_db

def debug_signup():
    print("--- Diagnostic Signup Test ---")
    db = get_db()
    test_email = "test_debug@example.com"
    test_pass = "password123"
    
    try:
        print(f"Attempting to insert user: {test_email}...")
        response = db.table("users").insert({
            "email": test_email,
            "password_hash": test_pass
        }).execute()
        
        print("Response received!")
        print(f"Data: {response.data}")
        print("Signup works in the diagnostic script!")
        
    except Exception as e:
        print("\n!!! SIGNUP FAILED !!!")
        print(f"Error Type: {type(e).__name__}")
        print(f"Error Message: {str(e)}")
        
        if "relation \"users\" does not exist" in str(e).lower():
            print("\nSUGGESTION: The 'users' table is missing. Did you run the SQL schema in Supabase?")
        elif "duplicate key value violates unique constraint" in str(e).lower():
            print("\nSUGGESTION: This email is already registered.")
        else:
            print("\nSUGGESTION: Check your Supabase URL, Key, and RLS policies.")

if __name__ == "__main__":
    debug_signup()
