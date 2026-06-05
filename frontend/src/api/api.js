import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Auth
export const signup = (email, password) =>
  api.post('/signup', { email, password });

export const login = (email, password) =>
  api.post('/login', { email, password });

// Student
export const createStudent = (userId, { name, age, grade }) =>
  api.post(`/student?user_id=${userId}`, { name, age, grade });

// Prediction
export const submitAssessment = (data) =>
  api.post('/predict', data);

// History
export const getHistory = (studentId) =>
  api.get(`/history/${studentId}`);

export const getAssessmentContent = (age, studentId = "anonymous") =>
  api.get(`/assessment/content?age=${age}&student_id=${studentId}`);

export default api;
