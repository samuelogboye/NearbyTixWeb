import { MainLayout } from '@components/layout/MainLayout';
import { Link } from 'react-router-dom';
import { ROUTES } from '@constants/index';

export const SupportPage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold text-gray-900">Help & Support</h1>
          <p className="mt-4 text-xl text-gray-600">
            Find answers to common questions or get in touch with our support team
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-5xl">
          {/* Quick Links */}
          <div className="grid gap-6 md:grid-cols-3">
            <Link
              to={ROUTES.CONTACT}
              className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Contact Support</h3>
              <p className="mt-2 text-sm text-gray-600">
                Get help from our support team
              </p>
            </Link>

            <Link
              to={ROUTES.EVENTS}
              className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
            >
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
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Browse Events</h3>
              <p className="mt-2 text-sm text-gray-600">
                Discover events near you
              </p>
            </Link>

            <Link
              to={ROUTES.MY_TICKETS}
              className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">My Tickets</h3>
              <p className="mt-2 text-sm text-gray-600">
                View your purchased tickets
              </p>
            </Link>
          </div>

          {/* FAQ */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>

            <div className="mt-8 space-y-6">
              <details className="group rounded-lg border border-gray-200 bg-white p-6">
                <summary className="cursor-pointer font-semibold text-gray-900">
                  How do I reserve a ticket?
                </summary>
                <p className="mt-4 text-gray-700">
                  Browse events, click on an event you're interested in, and click the "Reserve Ticket" button. You'll have 2 minutes to complete your purchase before the reservation expires.
                </p>
              </details>

              <details className="group rounded-lg border border-gray-200 bg-white p-6">
                <summary className="cursor-pointer font-semibold text-gray-900">
                  What happens if my reservation expires?
                </summary>
                <p className="mt-4 text-gray-700">
                  If you don't complete payment within 2 minutes, your reservation will automatically be cancelled and the ticket will become available for others to purchase.
                </p>
              </details>

              <details className="group rounded-lg border border-gray-200 bg-white p-6">
                <summary className="cursor-pointer font-semibold text-gray-900">
                  Can I get a refund?
                </summary>
                <p className="mt-4 text-gray-700">
                  Refunds are only available if the event is cancelled by the organizer or postponed to a date you cannot attend. All other sales are final.
                </p>
              </details>

              <details className="group rounded-lg border border-gray-200 bg-white p-6">
                <summary className="cursor-pointer font-semibold text-gray-900">
                  How do I show my ticket at the event?
                </summary>
                <p className="mt-4 text-gray-700">
                  Once you've purchased a ticket, you can access it from "My Tickets" in your account. Show the QR code at the venue entrance for scanning.
                </p>
              </details>

              <details className="group rounded-lg border border-gray-200 bg-white p-6">
                <summary className="cursor-pointer font-semibold text-gray-900">
                  How do I create an event?
                </summary>
                <p className="mt-4 text-gray-700">
                  Log in to your account and navigate to "Create Event" from the main menu. Fill in your event details, set the location on the map, and specify the number of tickets available.
                </p>
              </details>

              <details className="group rounded-lg border border-gray-200 bg-white p-6">
                <summary className="cursor-pointer font-semibold text-gray-900">
                  Why do I need to share my location?
                </summary>
                <p className="mt-4 text-gray-700">
                  Location sharing is optional and only used to show you events near you in the "For You" section. You can still browse all events without sharing your location.
                </p>
              </details>

              <details className="group rounded-lg border border-gray-200 bg-white p-6">
                <summary className="cursor-pointer font-semibold text-gray-900">
                  How do I change my account information?
                </summary>
                <p className="mt-4 text-gray-700">
                  Navigate to your Profile page from the user menu. You can update your name, email, and location preferences there.
                </p>
              </details>

              <details className="group rounded-lg border border-gray-200 bg-white p-6">
                <summary className="cursor-pointer font-semibold text-gray-900">
                  Is my payment information secure?
                </summary>
                <p className="mt-4 text-gray-700">
                  Yes. We use industry-standard encryption and work with trusted payment processors. We never store your full credit card information on our servers.
                </p>
              </details>
            </div>
          </div>

          {/* Still Need Help */}
          <div className="mt-12 rounded-lg bg-primary-50 p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Still need help?</h2>
            <p className="mt-4 text-gray-700">
              Our support team is here to assist you with any questions or issues.
            </p>
            <div className="mt-6">
              <Link
                to={ROUTES.CONTACT}
                className="inline-block rounded-lg bg-primary-600 px-6 py-3 font-medium text-white transition-colors hover:bg-primary-700"
              >
                Contact Support
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              Email us at: support@nearbytix.com
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
