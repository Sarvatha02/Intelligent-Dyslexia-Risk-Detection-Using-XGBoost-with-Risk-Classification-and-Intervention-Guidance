-- ============================================================
-- Dyslexia Risk Detection — Supabase Schema
-- Run this in your Supabase project: SQL Editor → New Query
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── 1. Users ─────────────────────────────────────────────────
DROP TABLE IF EXISTS test_results;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email         TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ── 2. Students ───────────────────────────────────────────────
CREATE TABLE students (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
    name       TEXT NOT NULL,
    age        INTEGER,
    grade      TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ── 3. Test Results ───────────────────────────────────────────
CREATE TABLE test_results (
    id                     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id             UUID REFERENCES students(id) ON DELETE CASCADE,
    reading_speed          FLOAT,
    reading_accuracy       FLOAT,
    spelling_score         FLOAT,
    phonological_score     FLOAT,
    memory_score           FLOAT,
    confusion_score        FLOAT,
    writing_error_rate     FLOAT,
    response_time_variance FLOAT,
    ran_speed_score        FLOAT,
    eye_tracking_score     FLOAT,
    risk_level             INTEGER, -- 0:Normal 1:Mild 2:Moderate 3:Severe
    confidence             FLOAT,
    created_at             TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ── 4. Enable RLS ────────────────────────────────────────────
ALTER TABLE users        ENABLE ROW LEVEL SECURITY;
ALTER TABLE students     ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

-- ── 5. Permissive Policies (allow all via anon key) ──────────
-- users
CREATE POLICY "allow_all_users"        ON users        FOR ALL USING (true) WITH CHECK (true);
-- students
CREATE POLICY "allow_all_students"     ON students     FOR ALL USING (true) WITH CHECK (true);
-- test_results
CREATE POLICY "allow_all_test_results" ON test_results FOR ALL USING (true) WITH CHECK (true);
