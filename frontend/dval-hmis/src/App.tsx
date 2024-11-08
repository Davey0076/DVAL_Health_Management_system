import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './components/modules/Auth/Login';
import Signup from './components/modules/Auth/Signup';
import PatientManagementPage from './components/modules/patientManagement/PatientManagementPage';
import Dashboard from './components/Dashboard';
import PatientRegistration from './components/modules/patientManagement/patientRegistration/PatientRegistration.component';
import AppointmentForm from './components/modules/patientManagement/appointments/AppointmentForm.component';
import AllAppointmentsPage from './components/modules/patientManagement/appointments/AllAppointmentsPage';
import ProtectedRoute from './components/ProtectedRoutes'; // import ProtectedRoute component
import './App.css';
import LandingPage from './components/landingpage/LandingPage';

const TOKEN_EXPIRATION_TIME = 60 * 60 * 1000; // 60 minutes in milliseconds

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenTimestamp');
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const tokenTimestamp = localStorage.getItem('tokenTimestamp');
      if (tokenTimestamp && Date.now() - parseInt(tokenTimestamp) > TOKEN_EXPIRATION_TIME) {
        handleLogout();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<LandingPage />} />
        

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient-management"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <PatientManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register-patient"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <PatientRegistration />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <AppointmentForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/all-appointments"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <AllAppointmentsPage />
            </ProtectedRoute>
          }
        />

        {/* Redirect to login if the path does not match any routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
