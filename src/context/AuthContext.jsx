// src/context/AuthContext.jsx

/*
 📚 LEARN: React Context
 
 Problem: Many components need to know "Is user logged in?"
 
 Without Context:
   App → passes user to Layout → passes to Sidebar → passes to...
   (Called "prop drilling" — messy!)
 
 With Context:
   ANY component can directly access user data.
   Like a "global variable" but the React way.
 
 AuthContext provides:
   - user (who is logged in)
   - login() function
   - logout() function
   - isAuthenticated (true/false)
*/

import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load — check if user was previously logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (phone, password) => {
    try {
      const response = await authAPI.login({ phone, password });
      const data = response.data.data;

      // Save to localStorage (survives page refresh)
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));

      setUser(data);
      toast.success(`Welcome back, ${data.fullName}! 🦐`);
      return true;
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Login failed'
      );
      return false;
    }
  };

  const register = async (formData) => {
    try {
      const response = await authAPI.register(formData);
      const data = response.data.data;

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));

      setUser(data);
      toast.success('Registration successful! 🎉');
      return true;
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Registration failed'
      );
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    farmId: user?.farmId,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — easy way to use auth in any component
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}