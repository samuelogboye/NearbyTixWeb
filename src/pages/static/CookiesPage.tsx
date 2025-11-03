import { MainLayout } from '@components/layout/MainLayout';

export const CookiesPage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-900">Cookie Policy</h1>
          <p className="mt-4 text-sm text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="mt-8 space-y-8 text-gray-700">
            <section>
              <h2 className="text-2xl font-bold text-gray-900">What Are Cookies</h2>
              <p className="mt-4 leading-relaxed">
                Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">How We Use Cookies</h2>
              <p className="mt-4 leading-relaxed">
                We use cookies for the following purposes:
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-6">
                <li><strong>Authentication:</strong> To keep you logged in and secure your account</li>
                <li><strong>Preferences:</strong> To remember your settings and preferences</li>
                <li><strong>Analytics:</strong> To understand how you use our service</li>
                <li><strong>Performance:</strong> To optimize loading times and functionality</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">Types of Cookies We Use</h2>

              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Essential Cookies</h3>
                  <p className="mt-2 leading-relaxed">
                    Required for the website to function properly. These cannot be disabled.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Functional Cookies</h3>
                  <p className="mt-2 leading-relaxed">
                    Enable personalization features like remembering your location preferences.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Analytics Cookies</h3>
                  <p className="mt-2 leading-relaxed">
                    Help us understand how visitors interact with our website by collecting anonymous usage data.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Marketing Cookies</h3>
                  <p className="mt-2 leading-relaxed">
                    Used to track visitors across websites to display relevant advertisements.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">Managing Cookies</h2>
              <p className="mt-4 leading-relaxed">
                You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed. However, if you do this, you may have to manually adjust some preferences every time you visit our site and some services may not function properly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">Third-Party Cookies</h2>
              <p className="mt-4 leading-relaxed">
                We use services from third parties such as Google Maps and payment processors that may set their own cookies. We have no control over these cookies and recommend reviewing their privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
              <p className="mt-4 leading-relaxed">
                If you have questions about our use of cookies, please contact us at privacy@nearbytix.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
