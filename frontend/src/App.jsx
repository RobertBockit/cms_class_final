// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavbarComponent from './components/NavbarComponent'; // Import your Navbar
import LoginPage from './pages/LoginPage.jsx'; // Your existing LoginPage
import RegistrationPage from './pages/RegistrationPage'; // Placeholder for RegistrationPage
import DashboardPage from './pages/DashboardPage'; // Placeholder for DashboardPage
import EventDetailsPage from './pages/EventDetailsPage';

// Ensure Bootstrap CSS is imported here (or in main.jsx)
import 'bootstrap/dist/css/bootstrap.min.css';
// Ensure your custom global CSS (if any) is imported
import './index.css';

/**
 * @typedef {object} AppProps
 * Main application component responsible for routing and layout.
 */
export default function App() {
    return (
        <Router>
            <NavbarComponent /> {/* Render the Navbar at the top */}
            <div className="container mt-4"> {/* Bootstrap container for page content */}
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegistrationPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/event/:id" element={<EventDetailsPage />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </div>
        </Router>
    );
}
