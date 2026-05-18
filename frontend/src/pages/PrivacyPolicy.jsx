import { Link } from "react-router-dom";
import { BsCurrencyExchange } from "react-icons/bs";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <BsCurrencyExchange className="text-gold-500 text-2xl" />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-wider">
            CURRENCY<span className="text-gold-500">PRO</span>
          </h1>
        </div>

        <div className="card p-6 sm:p-10 space-y-6 text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
              Privacy Policy
            </h2>
            <p className="text-xs text-gray-400">Last updated: May 18, 2026</p>
          </div>

          <section className="space-y-2">
            <h3 className="font-semibold text-gray-800 dark:text-white">
              1. Information We Collect
            </h3>
            <p>
              When you create an account, we collect your name and email
              address. If you sign in with Google, we receive your name, email,
              and profile picture from Google. We do not collect payment
              information.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-semibold text-gray-800 dark:text-white">
              2. How We Use Your Information
            </h3>
            <p>We use your information to:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Create and manage your account</li>
              <li>Save your preferred currency pairs</li>
              <li>Store your conversion history</li>
              <li>Send notifications if you opt in</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="font-semibold text-gray-800 dark:text-white">
              3. Data Storage
            </h3>
            <p>
              Your data is stored securely in our database. Passwords are hashed
              and never stored in plain text. We use secure, encrypted
              connections (HTTPS) for all data transmission.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-semibold text-gray-800 dark:text-white">
              4. Third-Party Services
            </h3>
            <p>We use the following third-party services:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Google OAuth — for sign-in authentication</li>
              <li>ExchangeRate API — for live currency rates</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="font-semibold text-gray-800 dark:text-white">
              5. Cookies
            </h3>
            <p>
              We use HTTP-only cookies to maintain your login session securely.
              These cookies are not accessible to JavaScript and are used solely
              for authentication purposes.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-semibold text-gray-800 dark:text-white">
              6. Data Sharing
            </h3>
            <p>
              We do not sell, trade, or share your personal information with
              third parties except as required to operate the service or comply
              with the law.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-semibold text-gray-800 dark:text-white">
              7. Your Rights
            </h3>
            <p>
              You may request deletion of your account and associated data at
              any time by contacting us. You may also update your profile
              information from your account settings.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-semibold text-gray-800 dark:text-white">
              8. Contact
            </h3>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us at{" "}
              <span className="text-gold-500">support@currencypro.app</span>.
            </p>
          </section>
        </div>

        <p className="text-center mt-6 text-sm text-gray-400">
          <Link to="/" className="text-gold-500 hover:underline">
            ← Back to CurrencyPro
          </Link>
        </p>
      </div>
    </div>
  );
}