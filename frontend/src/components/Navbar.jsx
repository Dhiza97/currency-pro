import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { CiLight, CiDark } from "react-icons/ci";
import { BsCurrencyExchange } from "react-icons/bs";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer group min-w-0"
          >
            <div className="p-2 bg-gold-500/10 rounded-lg group-hover:bg-gold-500/20 transition-colors shrink-0">
              <BsCurrencyExchange className="text-gold-500 text-xl" />
            </div>

            <span className="font-bold text-gray-800 dark:text-white tracking-wider
              text-sm sm:text-base md:text-lg truncate"
            >
              CURRENCY<span className="text-gold-500">PRO</span>
            </span>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-4">

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-xl bg-gray-100 dark:bg-zinc-800 
              hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all 
              cursor-pointer hover:scale-105 shrink-0"
              title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? (
                <CiLight className="text-gold-500 text-lg" />
              ) : (
                <CiDark className="text-gold-500 text-lg" />
              )}
            </button>

            {user ? (
              <>
                {/* User Info (hidden on mobile) */}
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-30">
                    {user.name || user.email}
                  </p>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base 
                  btn-secondary text-gold-500 border-gold-500 
                  hover:bg-gold-500/10 transition-all cursor-pointer whitespace-nowrap"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base 
                btn-primary whitespace-nowrap"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}