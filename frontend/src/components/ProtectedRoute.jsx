import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRole }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="page-loader">
                <div className="spinner"></div>
                Loading...
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRole && user.role !== allowedRole) {
        // Redirect to the correct dashboard based on role
        return <Navigate to={user.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'} replace />;
    }

    return children;
};

export default ProtectedRoute;
