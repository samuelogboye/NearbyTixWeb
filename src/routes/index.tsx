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
import { CreateEventPage } from '@pages/events/CreateEventPage';
import { MyTicketsPage } from '@pages/tickets/MyTicketsPage';
import { TicketDetailPage } from '@pages/tickets/TicketDetailPage';
import { TicketPaymentPage } from '@pages/tickets/TicketPaymentPage';
import { ForYouPage } from '@pages/recommendations/ForYouPage';
import { AboutPage } from '@pages/static/AboutPage';
import { ContactPage } from '@pages/static/ContactPage';
import { PrivacyPage } from '@pages/static/PrivacyPage';
import { TermsPage } from '@pages/static/TermsPage';
import { CookiesPage } from '@pages/static/CookiesPage';
import { SupportPage } from '@pages/static/SupportPage';

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
        path={ROUTES.CREATE_EVENT}
        element={
          <ProtectedRoute>
            <CreateEventPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.FOR_YOU}
        element={
          <ProtectedRoute>
            <ForYouPage />
          </ProtectedRoute>
        }
      />
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

      {/* Static Pages */}
      <Route path={ROUTES.ABOUT} element={<AboutPage />} />
      <Route path={ROUTES.CONTACT} element={<ContactPage />} />
      <Route path={ROUTES.PRIVACY} element={<PrivacyPage />} />
      <Route path={ROUTES.TERMS} element={<TermsPage />} />
      <Route path={ROUTES.COOKIES} element={<CookiesPage />} />
      <Route path={ROUTES.SUPPORT} element={<SupportPage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
};
