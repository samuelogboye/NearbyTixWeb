import { MainLayout } from '@components/layout/MainLayout';
import { Link } from 'react-router-dom';
import { ROUTES } from '@constants/index';

export const AboutPage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold text-gray-900">About NearbyTix</h1>
          <p className="mt-4 text-xl text-gray-600">
            Connecting people with amazing events in their neighborhood
          </p>
        </div>

        {/* Main Content */}
        <div className="mx-auto mt-12 max-w-4xl space-y-12">
          {/* Mission */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
            <p className="mt-4 text-lg leading-relaxed text-gray-700">
              NearbyTix was built with a simple goal: make discovering and attending local events
              as easy as possible. We believe that great experiences shouldn't be hard to find, and
              they should be right around the corner.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-gray-700">
              Using geolocation technology, we connect event-goers with experiences near them,
              helping local communities thrive and people discover new passions.
            </p>
          </section>

          {/* How It Works */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900">How It Works</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
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
                <h3 className="mt-4 text-lg font-semibold text-gray-900">Discover</h3>
                <p className="mt-2 text-gray-600">
                  Browse events near your location or search specific areas to find what interests
                  you.
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">Reserve</h3>
                <p className="mt-2 text-gray-600">
                  Reserve your tickets instantly. You have 2 minutes to complete your purchase.
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">Enjoy</h3>
                <p className="mt-2 text-gray-600">
                  Show your digital ticket at the venue and enjoy the experience!
                </p>
              </div>
            </div>
          </section>

          {/* Values */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900">Our Values</h2>
            <div className="mt-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Community First</h3>
                <p className="mt-2 text-gray-700">
                  We believe in supporting local events and helping communities connect.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Simplicity</h3>
                <p className="mt-2 text-gray-700">
                  Finding and booking events should be effortless. We keep things simple and
                  intuitive.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Trust & Safety</h3>
                <p className="mt-2 text-gray-700">
                  Your data and transactions are secure. We're committed to protecting your privacy.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-lg bg-primary-50 p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Ready to Get Started?</h2>
            <p className="mt-4 text-gray-700">
              Join thousands of people discovering amazing events near them.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Link
                to={ROUTES.EVENTS}
                className="rounded-lg bg-primary-600 px-6 py-3 font-medium text-white transition-colors hover:bg-primary-700"
              >
                Browse Events
              </Link>
              <Link
                to={ROUTES.CREATE_EVENT}
                className="rounded-lg border-2 border-primary-600 px-6 py-3 font-medium text-primary-600 transition-colors hover:bg-primary-50"
              >
                Create Event
              </Link>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};
