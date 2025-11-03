import { MainLayout } from '@components/layout/MainLayout';
import { Link } from 'react-router-dom';
import { ROUTES } from '@constants/index';

export const TermsPage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
          <p className="mt-4 text-sm text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="mt-8 space-y-8 text-gray-700">
            <section>
              <h2 className="text-2xl font-bold text-gray-900">1. Acceptance of Terms</h2>
              <p className="mt-4 leading-relaxed">
                By accessing and using NearbyTix, you accept and agree to be bound by the terms and provisions of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">2. Use License</h2>
              <p className="mt-4 leading-relaxed">
                Permission is granted to temporarily access NearbyTix for personal, non-commercial use. This license shall automatically terminate if you violate any of these restrictions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">3. Ticket Purchases</h2>
              <p className="mt-4 leading-relaxed">
                When you reserve a ticket, you have 2 minutes to complete your purchase. Reservations automatically expire if not completed within this timeframe. All ticket sales are final unless an event is cancelled by the organizer.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">4. Refund Policy</h2>
              <p className="mt-4 leading-relaxed">
                Refunds are only provided if:
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-6">
                <li>The event is cancelled by the organizer</li>
                <li>The event is postponed and you cannot attend the new date</li>
                <li>There was a technical error in processing your payment</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">5. Event Organizers</h2>
              <p className="mt-4 leading-relaxed">
                Event organizers are responsible for:
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-6">
                <li>Providing accurate event information</li>
                <li>Hosting events as advertised</li>
                <li>Complying with all local laws and regulations</li>
                <li>Issuing refunds if events are cancelled</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">6. User Conduct</h2>
              <p className="mt-4 leading-relaxed">
                You agree not to:
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-6">
                <li>Use the service for any illegal purpose</li>
                <li>Resell tickets at unauthorized markups</li>
                <li>Create multiple accounts to circumvent ticket limits</li>
                <li>Interfere with the operation of our services</li>
                <li>Misrepresent yourself or impersonate others</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">7. Account Termination</h2>
              <p className="mt-4 leading-relaxed">
                We reserve the right to terminate accounts that violate these terms or engage in fraudulent activity.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">8. Limitation of Liability</h2>
              <p className="mt-4 leading-relaxed">
                NearbyTix is not liable for any direct, indirect, incidental, or consequential damages arising from your use of the service or attendance at events booked through our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">9. Changes to Terms</h2>
              <p className="mt-4 leading-relaxed">
                We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">10. Contact Information</h2>
              <p className="mt-4 leading-relaxed">
                Questions about the Terms of Service should be sent to us at legal@nearbytix.com or via our{' '}
                <Link to={ROUTES.CONTACT} className="text-primary-600 hover:underline">
                  contact page
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
