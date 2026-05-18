import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-auto py-6 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
        <span>© {new Date().getFullYear()} CurrencyPro. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <Link to="/privacy" className="hover:text-gold-500 transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-gold-500 transition-colors">
            Terms of Use
          </Link>
        </div>
      </div>
    </footer>
  );
}