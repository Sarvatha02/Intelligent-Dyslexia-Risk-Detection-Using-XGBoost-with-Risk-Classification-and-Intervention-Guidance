@echo off
echo [1/3] Activating virtual environment...
if not exist venv (
    echo Virtual environment not found. Creating one...
    python -m venv venv
)
call venv\Scripts\activate

echo [2/3] Installing all required packages (FastAPI, Supabase, XGBoost, etc.)...
python -m pip install --upgrade pip
python -m pip install fastapi uvicorn xgboost scikit-learn pandas numpy supabase python-dotenv pydantic pydantic-settings python-multipart email-validator

echo [3/3] Done! All imports should now be resolved.
echo Please restart your VS Code to refresh the errors.
pause
