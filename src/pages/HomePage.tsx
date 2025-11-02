import { Link } from 'react-router-dom';
import { useAuthStore } from '@stores/authStore';
import { Button } from '@components/common/Button';
import { MainLayout } from '@components/layout/MainLayout';
import { ROUTES } from '@constants/index';

export const HomePage = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  return (
    <MainLayout hideFooter={false}>
      <div className="bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="mb-6 text-6xl font-bold text-primary-600">NearbyTix</h1>
          <p className="mb-8 text-2xl text-gray-700">
            Discover and book tickets for events near you
          </p>

          {isAuthenticated && user ? (
            <div className="space-y-4">
              <p className="text-xl text-gray-600">Welcome back, {user.name}!</p>
              <div className="flex justify-center gap-4">
                <Link to={ROUTES.EVENTS}>
                  <Button size="lg">Browse Events</Button>
                </Link>
                <Link to={ROUTES.MY_TICKETS}>
                  <Button size="lg" variant="secondary">
                    My Tickets
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex justify-center gap-4">
              <Link to={ROUTES.LOGIN}>
                <Button size="lg">Sign In</Button>
              </Link>
              <Link to={ROUTES.REGISTER}>
                <Button size="lg" variant="secondary">
                  Create Account
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold">Location-Based</h3>
            <p className="text-gray-600">
              Find events happening near you with our geospatial recommendation system
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold">Easy Booking</h3>
            <p className="text-gray-600">
              Reserve tickets instantly and complete payment within 2 minutes
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold">Real-Time Updates</h3>
            <p className="text-gray-600">
              Live ticket availability and automatic expiration for fair booking
            </p>
          </div>
        </div>
      </div>
      </div>
    </MainLayout>
  );
};
