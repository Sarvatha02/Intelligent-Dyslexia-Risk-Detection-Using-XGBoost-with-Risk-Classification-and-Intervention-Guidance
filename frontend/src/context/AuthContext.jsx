import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [userId, setUserId] = useState(() => {
    const saved = localStorage.getItem('user_id');
    if (saved && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(saved)) {
      return saved;
    }
    // Generate fallback UUID for anonymous/test sessions
    const newId = '00000000-0000-4000-a000-' + Math.random().toString(16).slice(2, 14).padStart(12, '0');
    localStorage.setItem('user_id', newId);
    return newId;
  });
  const [studentId, setStudentId] = useState(() => localStorage.getItem('student_id'));
  const [studentName, setStudentName] = useState(() => localStorage.getItem('student_name'));
  const [studentAge, setStudentAge] = useState(() => localStorage.getItem('student_age'));
  const [studentGrade, setStudentGrade] = useState(() => localStorage.getItem('student_grade'));

  const login = (id) => {
    setUserId(id);
    localStorage.setItem('user_id', id);
  };

  const logout = () => {
    setUserId(null);
    setStudentId(null);
    setStudentName(null);
    setStudentAge(null);
    setStudentGrade(null);
    localStorage.removeItem('user_id');
    localStorage.removeItem('student_id');
    localStorage.removeItem('student_name');
    localStorage.removeItem('student_age');
    localStorage.removeItem('student_grade');
  };

  const saveStudent = (id, name, age, grade) => {
    setStudentId(id);
    setStudentName(name);
    setStudentAge(age);
    setStudentGrade(grade);
    localStorage.setItem('student_id', id);
    localStorage.setItem('student_name', name);
    localStorage.setItem('student_age', age);
    localStorage.setItem('student_grade', grade);
  };

  return (
    <AuthContext.Provider value={{ userId, studentId, studentName, studentAge, studentGrade, login, logout, saveStudent }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
