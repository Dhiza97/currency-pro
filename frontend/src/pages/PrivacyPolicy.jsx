// pages/PrivacyPolicy.jsx
import { Link } from "react-router-dom";
import { BsCurrencyExchange } from "react-icons/bs";

const sections = [
  { id: "information", title: "1. Information We Collect" },
  { id: "usage", title: "2. How We Use Your Information" },
  { id: "storage", title: "3. Data Storage & Security" },
  { id: "third-party", title: "4. Third-Party Services" },
  { id: "cookies", title: "5. Cookies" },
  { id: "sharing", title: "6. Data Sharing" },
  { id: "rights", title: "7. Your Rights" },
  { id: "contact", title: "8. Contact Us" },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Brand header */}
        <Link to="/" className="inline-flex items-center gap-2 mb-10 group">
          <BsCurrencyExchange className="text-gold-500 text-xl" />
          <span className="font-bold text-gray-800 dark:text-white tracking-wider group-hover:text-gold-500 transition-colors">
            CURRENCY<span className="text-gold-500">PRO</span>
          </span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sticky Table of Contents (desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-8 space-y-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                On this page
              </p>

              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block text-sm text-gray-500 dark:text-gray-400 hover:text-gold-500 
                             transition-colors py-1 border-l-2 border-transparent 
                             hover:border-gold-500 pl-3"
                >
                  {s.title}
                </a>
              ))}
            </div>
          </aside>

          {/* Main content */}
          <main className="lg:col-span-3 space-y-10">
            {/* Title block */}
            <div className="border-b border-gray-200 dark:border-gray-800 pb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Privacy Policy
              </h1>
              <p className="text-sm text-gray-400">
                Last updated:{" "}
                <span className="text-gray-500 dark:text-gray-300">
                  May 18, 2026
                </span>
              </p>
              <p className="mt-3 text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                CurrencyPro is committed to protecting your privacy. This policy
                explains what data we collect, why we collect it, and how we
                handle it.
              </p>
            </div>

            <Section id="information" title="1. Information We Collect">
              <p>
                When you register, we collect your <strong>name</strong> and{" "}
                <strong>email address</strong>. If you use Google Sign-In, we
                also receive your profile picture from Google. We do not collect
                payment or financial information.
              </p>
            </Section>

            <Section id="usage" title="2. How We Use Your Information">
              <p>
                Your information is used exclusively to operate CurrencyPro:
              </p>
              <List
                items={[
                  "Create and manage your account",
                  "Save your preferred currency pairs",
                  "Store your conversion history",
                  "Send notifications if you opt in",
                ]}
              />
            </Section>

            <Section id="storage" title="3. Data Storage & Security">
              <p>
                All data is stored in a secured, encrypted database. Passwords
                are hashed using bcrypt and are never stored or transmitted in
                plain text. All connections use HTTPS/TLS encryption.
              </p>
            </Section>

            <Section id="third-party" title="4. Third-Party Services">
              <p>We integrate with the following trusted services:</p>
              <List
                items={[
                  "Google OAuth — for secure sign-in authentication",
                  "ExchangeRate API — for real-time currency exchange rates",
                  "MongoDB Atlas — for secure database hosting",
                ]}
              />
            </Section>

            <Section id="cookies" title="5. Cookies">
              <p>
                We use a single <strong>HTTP-only cookie</strong> to maintain
                your authenticated session. This cookie cannot be accessed by
                JavaScript, protecting you from XSS attacks. No advertising or
                tracking cookies are used.
              </p>
            </Section>

            <Section id="sharing" title="6. Data Sharing">
              <p>
                We do not sell, rent, or trade your personal information. Data
                is only shared with the third-party services listed above, which
                are necessary to operate the app.
              </p>
            </Section>

            <Section id="rights" title="7. Your Rights">
              <p>You have the right to:</p>
              <List
                items={[
                  "Access the personal data we hold about you",
                  "Request correction of inaccurate data",
                  "Request deletion of your account and all associated data",
                  "Withdraw consent for notifications at any time from your profile settings",
                ]}
              />
            </Section>

            <Section id="contact" title="8. Contact Us">
              <p>
                Questions about this policy? Reach us at{" "}
                <a
                  href="mailto:support@currencypro.app"
                  className="text-gold-500 hover:underline"
                >
                  support@currencypro.app
                </a>
              </p>
            </Section>

            <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
              <Link to="/" className="text-sm text-gold-500 hover:underline">
                ← Back to CurrencyPro
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// Reusable section component
function Section({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-8 space-y-3">
      <h2 className="text-lg font-bold text-gray-800 dark:text-white border-l-4 border-gold-500 pl-3">
        {title}
      </h2>
      <div className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed space-y-2">
        {children}
      </div>
    </section>
  );
}

function List({ items }) {
  return (
    <ul className="space-y-1 ml-4">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="text-gold-500 mt-1">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}