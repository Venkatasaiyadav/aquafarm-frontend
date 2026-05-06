// src/App.jsx

/*
 📚 LEARN: React Router
 
 Routes = URL → Component mapping
 test
 
 /login     → shows Login page
 /dashboard → shows Dashboard page
 /ponds     → shows Ponds list
 /feed/add  → shows Feed entry form
 
 ProtectedRoute → If NOT logged in, redirect to /login
 This prevents unauthorized access.
*/

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Ponds from "./pages/Ponds";
import PondDetail from "./pages/PondDetail";
import FeedEntry from "./pages/FeedEntry";
import GrowthEntry from "./pages/GrowthEntry";
import Expenses from "./pages/Expenses";
import Reports from "./pages/Reports";
import LoadingSpinner from "./components/common/LoadingSpinner";

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
}
// localStorage.clear();

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes — wrapped in MainLayout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="ponds" element={<Ponds />} />
        <Route path="ponds/:id" element={<PondDetail />} />
        <Route path="feed/add" element={<FeedEntry />} />
        <Route path="growth/add" element={<GrowthEntry />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="reports" element={<Reports />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
