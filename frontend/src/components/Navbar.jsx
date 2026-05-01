import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { CiLight } from "react-icons/ci";
import { CiDark } from "react-icons/ci";
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
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="p-2 bg-gold-500/10 rounded-lg group-hover:bg-gold-500/20 transition-colors">
              <BsCurrencyExchange className="text-gold-500 text-xl" />
            </div>
            <span className="text-xl font-bold text-gray-800 dark:text-white tracking-wider">
              CURRENCY<span className="text-gold-500">PRO</span>
            </span>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all cursor-pointer hover:scale-105"
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
                {/* User Info */}
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user.name || user.email}
                  </p>
                </div>
                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="btn-secondary text-gold-500 border-gold-500 hover:bg-gold-500/10 transition-all cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="btn-primary"
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