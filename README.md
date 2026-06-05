# 🧠 Intelligent Dyslexia Risk Detection System

An end-to-end AI/ML web application that detects dyslexia risk using XGBoost with level classification (Normal, Mild, Moderate, Severe) and personalized intervention guidance.

---

## 🏗️ Project Structure

```
Dyslexia/
├── backend/          # FastAPI backend
│   ├── main.py       # API routes
│   ├── database.py   # Supabase client
│   ├── schemas.py    # Pydantic models
│   ├── model_loader.py # XGBoost prediction
│   └── .env          # Supabase credentials
├── frontend/         # React + Vite + Tailwind v4
│   ├── src/
│   │   ├── pages/    # Auth, Home, Profile, Assessment, Results
│   │   ├── api/      # Axios API client
│   │   └── context/  # AuthContext
│   └── .env          # VITE_API_URL
├── ml/
│   ├── generate_data.py   # Synthetic dataset (1500 samples)
│   ├── train_model.py     # XGBoost training
│   ├── dyslexia_data.csv  # Generated dataset
│   └── model.pkl          # Trained model
├── supabase/
│   └── schema.sql         # PostgreSQL schema
└── requirements.txt
```

---

## ⚙️ Setup Instructions

### 1. Supabase Setup

1. Go to [https://supabase.com](https://supabase.com) and create a new project.
2. In the **SQL Editor**, run the contents of `supabase/schema.sql`.
3. Copy your **Project URL** and **anon public key** from Project Settings → API.

### 2. Backend Setup

```powershell
# From the project root
pip install -r requirements.txt

# Set your Supabase credentials in backend/.env:
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_ANON_KEY=your-anon-key

# Run the backend
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. ML Model (already done, optional re-train)

```powershell
python ml/generate_data.py   # Regenerate 1500 samples
python ml/train_model.py     # Retrain the XGBoost model
```

### 4. Frontend Setup

```powershell
cd frontend
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🚀 Usage Flow

1. **Sign up / Log in** at the home page
2. **Create a student profile** (name, age, grade)
3. **Complete the 6-part assessment**:
   - 📖 Reading Test (speed + accuracy)
   - 🔤 Spelling Test
   - 🔁 Letter Confusion Test (b/d/p/q)
   - 🗣️ Phonological Awareness Test
   - 🧠 Memory Recall Test
   - ✍️ Writing Error Test
4. **View Results**: risk level, confidence score, score breakdown, intervention guidance
5. **Track history** on the dashboard

---

## 📊 ML Model

- **Algorithm**: XGBoost Classifier (multi:softprob)
- **Classes**: 0=Normal, 1=Mild, 2=Moderate, 3=Severe
- **Features**: reading_speed, reading_accuracy, spelling_score, phonological_score, memory_score, confusion_score, writing_error_rate, response_time_variance
- **Dataset**: 1500 balanced synthetic samples
- **Accuracy**: ~94% on test split (realistic, not inflated)

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup` | Create user account |
| POST | `/login` | Authenticate user |
| POST | `/student?user_id={id}` | Create student profile |
| POST | `/predict` | Run XGBoost prediction |
| GET | `/history/{student_id}` | Get test history |

---

## 🛡️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, Tailwind CSS v4 |
| Backend | FastAPI, Uvicorn |
| ML | XGBoost, scikit-learn, pandas, numpy |
| Database | Supabase (PostgreSQL) |
| Auth | Custom (email + password via Supabase) |
