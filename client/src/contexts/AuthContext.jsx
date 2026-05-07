import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Mock user data for demo
const MOCK_USER = {
  _id: 'user_001',
  name: 'Aimen',
  mobile: '+919876543210',
  avatar: null,
  role: 'student',
  semester: 4,
  college: 'NIT Calicut',
  online: true,
  createdAt: new Date().toISOString(),
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Auto-login for demo
    setUser(MOCK_USER);
    setIsAuthenticated(true);
    localStorage.setItem('StuNet_user', JSON.stringify(MOCK_USER));
    localStorage.setItem('StuNet_token', 'mock_jwt_token');
    setLoading(false);
  }, []);

  const login = (userData) => {
    const u = userData || MOCK_USER;
    setUser(u);
    setIsAuthenticated(true);
    localStorage.setItem('StuNet_user', JSON.stringify(u));
    localStorage.setItem('StuNet_token', 'mock_jwt_token');
  };

  const icon-512ut = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('StuNet_user');
    localStorage.removeItem('StuNet_token');
  };

  const updateProfile = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('StuNet_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, icon- 512ut, updateProfile }}>
      { children }
    </AuthContext.Provider >
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
