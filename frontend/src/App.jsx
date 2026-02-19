import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected: Patient */}
                    <Route
                        path="/patient/dashboard"
                        element={
                            <ProtectedRoute allowedRole="patient">
                                <PatientDashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* Protected: Doctor */}
                    <Route
                        path="/doctor/dashboard"
                        element={
                            <ProtectedRoute allowedRole="doctor">
                                <DoctorDashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* Default redirect */}
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
