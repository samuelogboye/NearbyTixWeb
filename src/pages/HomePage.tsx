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
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-4 top-0 h-72 w-72 animate-pulse rounded-full bg-primary-400 opacity-20 blur-3xl"></div>
          <div className="absolute -right-4 bottom-0 h-96 w-96 animate-pulse rounded-full bg-primary-300 opacity-20 blur-3xl animation-delay-2000"></div>
          <div className="absolute left-1/2 top-1/2 h-80 w-80 animate-pulse rounded-full bg-primary-500 opacity-10 blur-3xl animation-delay-4000"></div>
        </div>

        <div className="container relative mx-auto px-4 py-20 sm:py-32">
          <div className="mx-auto max-w-4xl text-center">
            {/* Animated badge */}
            <div className="mb-8 inline-block animate-fade-in-down">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                </span>
                Live Events Near You
              </span>
            </div>

            {/* Hero heading with animation */}
            <h1 className="mb-6 animate-fade-in-up text-5xl font-extrabold leading-tight text-white sm:text-6xl md:text-7xl animation-delay-200">
              Discover Events
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Near You
              </span>
            </h1>

            <p className="mb-10 animate-fade-in-up text-lg text-primary-100 sm:text-xl md:text-2xl animation-delay-400">
              Book tickets instantly for concerts, sports, festivals, and more.
              <span className="block mt-2">Your next adventure is just around the corner.</span>
            </p>

            {/* CTA Buttons */}
            <div className="animate-fade-in-up animation-delay-600">
              {isAuthenticated && user ? (
                <div className="space-y-6">
                  <p className="text-xl font-medium text-white">
                    Welcome back, <span className="text-yellow-300">{user.name}</span>!
                  </p>
                  <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                    <Link to={ROUTES.EVENTS}>
                      <Button
                        size="lg"
                        variant="ghost"
                        className="group relative overflow-hidden !bg-white !text-primary-600 shadow-lg transition-all duration-300 hover:!bg-gray-50 hover:scale-105 hover:shadow-2xl"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          Browse Events
                          <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </span>
                      </Button>
                    </Link>
                    <Link to={ROUTES.FOR_YOU}>
                      <Button
                        size="lg"
                        variant="ghost"
                        className="!border-2 !border-white !bg-transparent !text-white transition-all duration-300 hover:!bg-white hover:!text-primary-600 hover:scale-105 hover:shadow-lg"
                      >
                        For You
                      </Button>
                    </Link>
                    <Link to={ROUTES.MY_TICKETS}>
                      <Button
                        size="lg"
                        variant="ghost"
                        className="!bg-primary-500 !text-white transition-all duration-300 hover:!bg-primary-400 hover:scale-105 hover:shadow-lg"
                      >
                        My Tickets
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Link to={ROUTES.REGISTER}>
                    <Button
                      size="lg"
                      variant="ghost"
                      className="group relative overflow-hidden !bg-white !text-primary-600 shadow-lg transition-all duration-300 hover:!bg-gray-50 hover:scale-105 hover:shadow-2xl"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Get Started Free
                        <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </Button>
                  </Link>
                  <Link to={ROUTES.EVENTS}>
                    <Button
                      size="lg"
                      variant="ghost"
                      className="!border-2 !border-white !bg-transparent !text-white transition-all duration-300 hover:!bg-white hover:!text-primary-600 hover:scale-105 hover:shadow-lg"
                    >
                      Browse Events
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Trust indicators */}
            <div className="mt-12 animate-fade-in animation-delay-800">
              <p className="mb-4 text-sm font-medium text-primary-200">Trusted by event-goers everywhere</p>
              <div className="flex flex-wrap items-center justify-center gap-8 text-primary-100">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">10K+</div>
                  <div className="text-sm">Events</div>
                </div>
                <div className="h-8 w-px bg-primary-400"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">50K+</div>
                  <div className="text-sm">Tickets Sold</div>
                </div>
                <div className="h-8 w-px bg-primary-400"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">25K+</div>
                  <div className="text-sm">Happy Users</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">Why Choose NearbyTix?</h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Experience the easiest way to discover and book tickets for amazing events in your area
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="group transform rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg transition-transform group-hover:scale-110">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              <h3 className="mb-3 text-2xl font-bold text-gray-900">Location-Based Discovery</h3>
              <p className="mb-4 text-gray-600">
                Our smart geospatial system finds the best events happening near you, so you never miss out on what's happening in your neighborhood.
              </p>
              <Link to={ROUTES.FOR_YOU} className="inline-flex items-center font-semibold text-blue-600 hover:text-blue-700">
                Discover now
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="group transform rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg transition-transform group-hover:scale-110">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">Instant Booking</h3>
              <p className="mb-4 text-gray-600">
                Reserve your tickets in seconds with our streamlined booking process. Simple, fast, and secure - get your tickets before they're gone!
              </p>
              <Link to={ROUTES.EVENTS} className="inline-flex items-center font-semibold text-purple-600 hover:text-purple-700">
                Start booking
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="group transform rounded-2xl bg-gradient-to-br from-green-50 to-green-100 p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg transition-transform group-hover:scale-110">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">Real-Time Availability</h3>
              <p className="mb-4 text-gray-600">
                See live ticket availability and get instant updates. Our fair booking system ensures everyone has an equal chance to secure tickets.
              </p>
              <Link to={ROUTES.EVENTS} className="inline-flex items-center font-semibold text-green-600 hover:text-green-700">
                View events
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">How It Works</h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Get started in three simple steps
            </p>
          </div>

          <div className="mx-auto max-w-5xl">
            <div className="grid gap-12 md:grid-cols-3">
              {/* Step 1 */}
              <div className="relative text-center">
                <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary-600 text-2xl font-bold text-white shadow-lg">
                  1
                </div>
                <div className="absolute left-1/2 top-10 hidden h-1 w-full bg-primary-200 md:block"></div>
                <h3 className="mb-3 text-xl font-bold text-gray-900">Create Account</h3>
                <p className="text-gray-600">
                  Sign up for free in seconds and set your location preferences
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative text-center">
                <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary-600 text-2xl font-bold text-white shadow-lg">
                  2
                </div>
                <div className="absolute left-1/2 top-10 hidden h-1 w-full bg-primary-200 md:block"></div>
                <h3 className="mb-3 text-xl font-bold text-gray-900">Find Events</h3>
                <p className="text-gray-600">
                  Browse events near you or get personalized recommendations
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative text-center">
                <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary-600 text-2xl font-bold text-white shadow-lg">
                  3
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900">Book Tickets</h3>
                <p className="text-gray-600">
                  Reserve and pay for your tickets in under 2 minutes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              Ready to Experience Amazing Events?
            </h2>
            <p className="mb-10 text-xl text-primary-100">
              Join thousands of event-goers who trust NearbyTix for their entertainment needs
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              {!isAuthenticated && (
                <>
                  <Link to={ROUTES.REGISTER}>
                    <Button
                      size="lg"
                      variant="ghost"
                      className="!bg-white !text-primary-600 shadow-lg transition-all duration-300 hover:!bg-gray-50 hover:scale-105 hover:shadow-2xl"
                    >
                      Create Free Account
                    </Button>
                  </Link>
                  <Link to={ROUTES.EVENTS}>
                    <Button
                      size="lg"
                      variant="ghost"
                      className="!border-2 !border-white !bg-transparent !text-white transition-all duration-300 hover:!bg-white hover:!text-primary-600 hover:scale-105 hover:shadow-lg"
                    >
                      Explore Events
                    </Button>
                  </Link>
                </>
              )}
              {isAuthenticated && (
                <Link to={ROUTES.EVENTS}>
                  <Button
                    size="lg"
                    variant="ghost"
                    className="!bg-white !text-primary-600 shadow-lg transition-all duration-300 hover:!bg-gray-50 hover:scale-105 hover:shadow-2xl"
                  >
                    Discover Events Now
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add custom animations to global styles */}
      <style>{`
        @keyframes fade-in-down {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.6s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          animation-fill-mode: both;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
          animation-fill-mode: both;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
          animation-fill-mode: both;
        }

        .animation-delay-800 {
          animation-delay: 0.8s;
          animation-fill-mode: both;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </MainLayout>
  );
};
