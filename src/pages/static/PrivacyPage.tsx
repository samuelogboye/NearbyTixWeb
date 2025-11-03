import { MainLayout } from '@components/layout/MainLayout';

export const PrivacyPage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="mt-4 text-sm text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="mt-8 space-y-8 text-gray-700">
            <section>
              <h2 className="text-2xl font-bold text-gray-900">1. Information We Collect</h2>
              <p className="mt-4 leading-relaxed">
                We collect information you provide directly to us when you create an account, book tickets, or contact us for support. This may include:
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-6">
                <li>Name, email address, and contact information</li>
                <li>Location data (with your permission) to show nearby events</li>
                <li>Payment information (processed securely through third-party providers)</li>
                <li>Event preferences and booking history</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">2. How We Use Your Information</h2>
              <p className="mt-4 leading-relaxed">
                We use the information we collect to:
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-6">
                <li>Provide, maintain, and improve our services</li>
                <li>Process your ticket bookings and payments</li>
                <li>Send you event recommendations based on your location</li>
                <li>Communicate with you about your account and bookings</li>
                <li>Detect and prevent fraud and abuse</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">3. Location Data</h2>
              <p className="mt-4 leading-relaxed">
                We use your location data to show you events near you. This feature requires your explicit permission and can be disabled at any time in your browser settings or account preferences.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">4. Information Sharing</h2>
              <p className="mt-4 leading-relaxed">
                We do not sell your personal information. We may share your information with:
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-6">
                <li>Event organizers (only name and ticket details for events you book)</li>
                <li>Service providers who help us operate our platform</li>
                <li>Law enforcement when required by law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">5. Data Security</h2>
              <p className="mt-4 leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">6. Your Rights</h2>
              <p className="mt-4 leading-relaxed">
                You have the right to:
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-6">
                <li>Access and update your personal information</li>
                <li>Delete your account and data</li>
                <li>Opt-out of marketing communications</li>
                <li>Disable location tracking</li>
                <li>Request a copy of your data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">7. Cookies and Tracking</h2>
              <p className="mt-4 leading-relaxed">
                We use cookies and similar tracking technologies to improve your experience. See our Cookie Policy for more details.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">8. Children's Privacy</h2>
              <p className="mt-4 leading-relaxed">
                Our services are not intended for children under 13. We do not knowingly collect information from children under 13.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">9. Changes to This Policy</h2>
              <p className="mt-4 leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">10. Contact Us</h2>
              <p className="mt-4 leading-relaxed">
                If you have questions about this privacy policy, please contact us at: privacy@nearbytix.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
