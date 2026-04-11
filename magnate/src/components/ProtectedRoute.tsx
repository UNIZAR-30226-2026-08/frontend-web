import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  // Si no están loggeados se van a la página de login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si la ruta es /home reemplaza <Outlet /> por <Home /> y así con todas
  return <Outlet />;
};
