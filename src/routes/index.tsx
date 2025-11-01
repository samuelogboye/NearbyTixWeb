import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from '@stores/authStore';
import { ProtectedRoute } from '@components/common/ProtectedRoute';
import { PublicRoute } from '@components/common/PublicRoute';
import { ROUTES } from '@constants/index';

// Lazy load pages for code splitting
import { LoginPage } from '@pages/auth/LoginPage';
import { RegisterPage } from '@pages/auth/RegisterPage';
import { HomePage } from '@pages/HomePage';
import { EventsPage } from '@pages/events/EventsPage';
import { EventDetailPage } from '@pages/events/EventDetailPage';
import { MyTicketsPage } from '@pages/tickets/MyTicketsPage';
import { TicketDetailPage } from '@pages/tickets/TicketDetailPage';
import { TicketPaymentPage } from '@pages/tickets/TicketPaymentPage';

export const AppRoutes = () => {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path={ROUTES.LOGIN}
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path={ROUTES.REGISTER}
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      {/* Public Event Browsing */}
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.EVENTS} element={<EventsPage />} />
      <Route path={ROUTES.EVENT_DETAIL} element={<EventDetailPage />} />

      {/* Protected Routes */}
      <Route
        path={ROUTES.MY_TICKETS}
        element={
          <ProtectedRoute>
            <MyTicketsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.TICKET_DETAIL}
        element={
          <ProtectedRoute>
            <TicketDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.TICKET_PAYMENT}
        element={
          <ProtectedRoute>
            <TicketPaymentPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
};
