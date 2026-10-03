# Intelligent Dyslexia Risk Detection System

An AI-powered web application for assessing dyslexia-related risk indicators using machine learning, interactive assessments, and behavioral signals.

## Features

* User registration and authentication
* Student profile management
* Age-based assessment activities
* Reading and spelling assessment
* Phonological and memory assessment
* Visual and behavioral assessment
* XGBoost-based risk classification
* Risk level and confidence prediction
* Personalized intervention guidance
* Assessment history
* Supabase database integration
* REST API using FastAPI
* Interactive React frontend

## Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* React Router
* Axios
* MediaPipe

### Backend

* Python
* FastAPI
* Uvicorn
* Pydantic

### Machine Learning

* XGBoost
* Scikit-learn
* Pandas
* NumPy

### Database

* Supabase
* PostgreSQL

## System Architecture

```text
React.js Frontend
       |
       | REST API
       v
FastAPI Backend
       |
       +------------------+
       |                  |
       v                  v
XGBoost Model          Supabase
       |               PostgreSQL
       v
Risk Classification
       |
       v
Intervention Guidance
```

## Machine Learning

The system uses an XGBoost classification model to analyze assessment features such as:

* Reading speed
* Reading accuracy
* Spelling performance
* Phonological performance
* Memory performance
* Visual confusion
* Writing errors
* Response-time variation
* Eye-tracking-related indicators

The model classifies assessment results into four risk levels:

```text
0 → Normal
1 → Mild
2 → Moderate
3 → Severe
```

## Project Structure

```text
Dyslexia/
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── model_loader.py
│   ├── schemas.py
│   └── content_library.py
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── ml/
│   ├── dyslexia_data.csv
│   ├── generate_data.py
│   ├── train_model.py
│   ├── evaluate_model.py
│   ├── eda_analysis.py
│   └── model.pkl
│
├── supabase/
│   └── schema.sql
│
└── README.md
```

## Installation

### Clone the Repository

```bash
git clone https://github.com/Sarvatha02/Dyslexia.git
cd Dyslexia
```

### Backend

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install fastapi uvicorn pandas numpy scikit-learn xgboost supabase python-dotenv
```

### Environment Variables

Create:

```text
backend/.env
```

Add:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Run Backend

```bash
python -m backend.main
```

Backend:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Model Training

To generate the dataset:

```bash
python ml/generate_data.py
```

To train the model:

```bash
python ml/train_model.py
```

To evaluate the model:

```bash
python ml/evaluate_model.py
```

The trained model is saved as:

```text
ml/model.pkl
```

## Database

The database schema is available in:

```text
supabase/schema.sql
```

The application uses Supabase PostgreSQL for storing student profiles and assessment results.

