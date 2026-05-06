// src/hooks/useAuth.js

/*
 📚 LEARN: Custom Hook Re-export
 
 We already created useAuth inside AuthContext.jsx
 This file re-exports it so you can import from either location:
 
 import { useAuth } from '../hooks/useAuth'
       OR
 import { useAuth } from '../context/AuthContext'
 
 Both work! This is a common pattern in React projects
 for cleaner imports.
*/

export { useAuth } from '../context/AuthContext';