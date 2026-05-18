import { Link } from "react-router-dom";
import { BsCurrencyExchange } from "react-icons/bs";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Link to="/" className="inline-flex items-center gap-2 mb-10 group">
          <BsCurrencyExchange className="text-gold-500 text-xl" />
          <span className="font-bold text-gray-800 dark:text-white tracking-wider group-hover:text-gold-500 transition-colors">
            CURRENCY<span className="text-gold-500">PRO</span>
          </span>
        </Link>

        {/* Title */}
        <div className="border-b border-gray-200 dark:border-gray-800 pb-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Terms of Service
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Last updated: May 18, 2026
          </p>
        </div>

        <div className="space-y-8 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using CurrencyPro, you agree to be bound by these
              Terms. If you do not agree, please do not use the application.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              2. Description of Service
            </h2>
            <p>
              CurrencyPro provides real-time currency conversion, historical
              exchange rates, saved currency pairs, and user conversion history
              for informational purposes only.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              3. User Accounts
            </h2>
            <p>
              You may be required to create an account to access certain
              features. You are responsible for maintaining the confidentiality
              of your account and all activities under it.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              4. Data Accuracy
            </h2>
            <p>
              Exchange rates are provided by third-party APIs and may not always
              be 100% accurate or real-time. CurrencyPro is not responsible for
              financial decisions made using this data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              5. Prohibited Use
            </h2>
            <ul className="list-disc ml-5 space-y-1">
              <li>Using the service for illegal activities</li>
              <li>Attempting to reverse engineer or exploit the system</li>
              <li>Scraping or abusing API endpoints</li>
              <li>Interfering with service performance or security</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              6. Third-Party Services
            </h2>
            <p>
              CurrencyPro relies on third-party services such as authentication
              providers and exchange rate APIs. We are not responsible for
              outages or inaccuracies from these services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              7. Limitation of Liability
            </h2>
            <p>
              CurrencyPro is provided "as is" without warranties of any kind. We
              are not liable for any financial loss, damages, or decisions made
              using the platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              8. Termination
            </h2>
            <p>
              We reserve the right to suspend or terminate accounts that violate
              these Terms or misuse the platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              9. Changes to Terms
            </h2>
            <p>
              We may update these Terms from time to time. Continued use of the
              app means you accept the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              10. Contact Us
            </h2>
            <p>
              If you have questions about these Terms, contact us at{" "}
              <a
                href="mailto:support@currencypro.app"
                className="text-gold-500 hover:underline"
              >
                support@currencypro.app
              </a>
            </p>
          </section>
        </div>

        <div className="mt-10 border-t border-gray-200 dark:border-gray-800 pt-6">
          <Link to="/" className="text-sm text-gold-500 hover:underline">
            ← Back to CurrencyPro
          </Link>
        </div>
      </div>
    </div>
  );
}