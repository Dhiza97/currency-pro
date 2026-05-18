import { useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { BsCurrencyExchange, BsCalculator } from "react-icons/bs";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.email || !form.password)
      return toast.error("Please fill all fields");

    try {
      setLoading(true);

      const { data } = await API.post("/auth/login", form);

      login({
        accessToken: data.accessToken,
        user: data.user,
      });

      toast.success("Welcome back!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] flex items-center justify-center p-4 sm:p-6">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden hidden sm:block">
        <div className="absolute -top-40 -right-40 w-72 sm:w-80 h-72 sm:h-80 bg-gold-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-72 sm:w-80 h-72 sm:h-80 bg-gold-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm sm:max-w-md">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-gold-500/10 rounded-2xl mb-3 sm:mb-4">
            <BsCurrencyExchange className="text-gold-500 text-3xl sm:text-4xl" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 dark:text-white tracking-wider">
            CURRENCY<span className="text-gold-500">PRO</span>
          </h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-500 dark:text-gray-400">
            Professional Currency Exchange
          </p>
        </div>

        {/* Card */}
        <div className="card p-5 sm:p-8 animate-slide-up">
          <div className="flex items-center gap-2 mb-5 sm:mb-6">
            <BsCalculator className="text-gold-500 text-lg sm:text-base" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white tracking-wider">
              SIGN IN
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">
                Email
              </label>
              <input
                type="email"
                className="input text-sm sm:text-base py-3"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">
                Password
              </label>
              <input
                type="password"
                className="input text-sm sm:text-base py-3"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3"
            >
              {loading ? (
                <span className="animate-pulse text-sm sm:text-base">
                  AUTHENTICATING...
                </span>
              ) : (
                <span className="text-sm sm:text-base">LOGIN</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-4 sm:my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-[#1a1a2e] px-2 text-gray-400 tracking-widest">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Button */}
          <a
            href={`${import.meta.env.VITE_API_URL}/auth/google`}
            className="flex items-center justify-center gap-3 w-full border border-gray-200 dark:border-gray-700
                       rounded-lg py-3 text-sm font-semibold text-gray-700 dark:text-gray-300
                       hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </a>

          {/* Footer */}
          <p className="mt-5 sm:mt-6 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-gold-500 font-semibold hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
