import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, role, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center text-rose-400">
                <Loader2 className="animate-spin" size={40} />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        // Redirect based on role if unauthorized
        if (role === 'student') return <Navigate to="/my-attendance" replace />;
        if (role === 'admin') return <Navigate to="/students" replace />;
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
