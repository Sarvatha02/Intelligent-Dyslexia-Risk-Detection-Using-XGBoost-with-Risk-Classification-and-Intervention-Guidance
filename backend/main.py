import os
import sys

# Ensure the parent directory is in sys.path so 'backend.*' imports work when run directly
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Any
import uuid

# ✅ Using backend.* imports (works with VS Code fix)
try:
    from .schemas import (
        UserSignup,
        UserLogin,
        StudentProfile,
        AssessmentData,
        AssessmentResponse,
        AssessmentContent
    )
    from .database import get_db
    from .model_loader import predict_dyslexia
    from .content_library import get_content_for_age
except ImportError:
    from backend.schemas import (
        UserSignup,
        UserLogin,
        StudentProfile,
        AssessmentData,
        AssessmentResponse,
        AssessmentContent
    )
    from backend.database import get_db
    from backend.model_loader import predict_dyslexia
    from backend.content_library import get_content_for_age

app = FastAPI(title="Dyslexia Risk Detection API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db = get_db()


@app.get("/")
def read_root():
    return {"message": "Dyslexia Risk Detection API is running"}


@app.post("/signup")
def signup(user: UserSignup):
    try:
        response = db.table("users").insert({
            "email": user.email,
            "password_hash": user.password
        }).execute()

        rows: Any = response.data if hasattr(response, 'data') else response[1]
        if not rows:
            raise HTTPException(status_code=400, detail="Signup failed — no rows returned")

        return {
            "message": "User created successfully",
            "user_id": rows[0]["id"]
        }

    except Exception as e:
        error_msg = str(e)
        if "getaddrinfo failed" in error_msg or "ConnectError" in error_msg:
            raise HTTPException(status_code=503, detail="Database Connectivity Error: Your Supabase project might be paused. Please check your dashboard or SUPABASE_URL in .env.")
        raise HTTPException(status_code=400, detail=error_msg)


@app.post("/login")
def login(user: UserLogin):
    try:
        response = db.table("users").select("*").eq("email", user.email).execute()
        user_data: Any = response.data if hasattr(response, 'data') else response[1]

        if not user_data or user_data[0]["password_hash"] != user.password:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        return {
            "message": "Login successful",
            "user_id": user_data[0]["id"]
        }

    except Exception as e:
        error_msg = str(e)
        if "getaddrinfo failed" in error_msg or "ConnectError" in error_msg:
            raise HTTPException(status_code=503, detail="Database Connectivity Error: Your Supabase project might be paused. Please check your dashboard or SUPABASE_URL in .env.")
        raise HTTPException(status_code=401, detail=error_msg)


@app.post("/student")
def create_student(student: StudentProfile, user_id: str):
    try:
        response = db.table("students").insert({
            "user_id": user_id,
            "name": student.name,
            "age": student.age,
            "grade": student.grade
        }).execute()

        rows: Any = response.data if hasattr(response, 'data') else response[1]
        return {
            "message": "Student profile created",
            "student_id": rows[0]["id"]
        }

    except Exception as e:
        error_str = str(e)
        if "22P02" in error_str or "invalid input syntax for type uuid" in error_str:
             raise HTTPException(status_code=400, detail="Invalid User Identity. Your session identifier is not in the correct format. Please refresh the page to recalibrate your neural link.")
        raise HTTPException(status_code=400, detail=error_str)


@app.post("/predict", response_model=AssessmentResponse)
def get_prediction(data: AssessmentData):
    print(f"RECEIVED ASSESSMENT DATA: {data}")
    try:
        features = data.dict()
        student_id = features.pop("student_id")
        age = features.pop("age")

        prediction = predict_dyslexia(features, age)

        # Attempt to save to database, but don't block the response if it fails
        try:
            # Skip DB insert if student_id is "anonymous" or clearly invalid
            if student_id and student_id != "anonymous":
                db.table("test_results").insert({
                    "student_id": student_id,
                    "reading_speed": data.reading_speed,
                    "reading_accuracy": data.reading_accuracy,
                    "spelling_score": data.spelling_score,
                    "phonological_score": data.phonological_score,
                    "memory_score": data.memory_score,
                    "confusion_score": data.confusion_score,
                    "writing_error_rate": data.writing_error_rate,
                    "response_time_variance": data.response_time_variance,
                    "ran_speed_score": data.ran_speed_score,
                    "eye_tracking_score": data.eye_tracking_score,
                    "risk_level": prediction["risk_level"],
                    "confidence": prediction["confidence"]
                }).execute()
        except Exception as db_err:
            print(f"DATABASE INSERT FAILED: {db_err}")
            # We continue because we want to return the prediction to the user anyway

        return prediction

    except Exception as e:
        print(f"PREDICTION FAILED: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/history/{student_id}")
def get_history(student_id: str):
    try:
        response = (
            db.table("test_results")
            .select("*")
            .eq("student_id", student_id)
            .order("created_at", desc=True)
            .execute()
        )

        return response.data

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@app.get("/assessment/content", response_model=AssessmentContent)
def get_assessment_content(age: int, student_id: Optional[str] = None):
    try:
        set_index = 0
        if student_id and student_id != "anonymous":
            try:
                response = db.table("test_results").select("id", count="exact").eq("student_id", student_id).execute()
                # If using postgrest-py >= 0.10.0, it might have .count
                # If not, we check response.count or len(response.data)
                test_count = getattr(response, 'count', len(response.data) if hasattr(response, 'data') else 0)
                set_index = test_count % 100
            except Exception as db_err:
                print(f"Failed to fetch test count: {db_err}")
                
        content = get_content_for_age(age, set_index)
        return content
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ✅ Run server directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)