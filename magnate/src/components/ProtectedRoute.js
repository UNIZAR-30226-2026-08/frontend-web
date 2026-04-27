import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
export const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth();
    // Si no están loggeados se van a la página de login
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    // Si la ruta es /home reemplaza <Outlet /> por <Home /> y así con todas
    return _jsx(Outlet, {});
};
