import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@stores/authStore';
import { ROUTES } from '@constants/index';

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * PublicRoute - Redirects authenticated users away from public pages like login/register
 */
export const PublicRoute = ({ children }: PublicRouteProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    // Redirect to home if already authenticated
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <>{children}</>;
};
