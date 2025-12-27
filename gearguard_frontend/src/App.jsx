// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './layout/layout';
import Dashboard from './pages/Dashboard';
import Equipment from './pages/Equipments';
import Profile from './pages/Profile';
import MaintenanceRequests from "./pages/MaintenanceRequest";
import MaintenanceTeams from "./pages/MaintenanceTeams";
import Calendar from "./pages/Calendar";
import Reports from "./pages/Reports";
import ProtectedRoute from "./routes/ProtectedRoutes";
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes with layout */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="Dashboard" element={<Dashboard />} />
            <Route path="MaintenanceRequest" element={<MaintenanceRequests />} />
            <Route path="MaintenanceTeams" element={<MaintenanceTeams />} />
            <Route path="Calendar" element={<Calendar />} />
            <Route path="Reports" element={<Reports />} />
            <Route path="equipment" element={<Equipment />} />
            <Route path="profile" element={<Profile />} />
            {/* Add more protected routes here */}
          </Route>
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;