import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { BsCurrencyExchange, BsCalculator } from "react-icons/bs";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      return toast.error("Please fill all fields");
    }

    try {
      setLoading(true);

      const { data } = await API.post("/auth/register", form);

      login({ ...data.user, token: data.token });
      toast.success("Account created!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] flex items-center justify-center p-4 sm:p-6">

      {/* Background blobs (hidden on mobile for cleaner UI) */}
      <div className="absolute inset-0 overflow-hidden hidden sm:block">
        <div className="absolute -top-40 -right-40 w-72 sm:w-80 h-72 sm:h-80 bg-gold-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-72 sm:w-80 h-72 sm:h-80 bg-gold-500/10 rounded-full blur-3xl"></div>
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
              CREATE ACCOUNT
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">
                Name
              </label>
              <input
                className="input text-sm sm:text-base py-3"
                placeholder="Enter your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

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
                placeholder="Create a password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3"
            >
              {loading ? (
                <span className="animate-pulse text-sm sm:text-base">
                  CREATING...
                </span>
              ) : (
                <span className="text-sm sm:text-base">REGISTER</span>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-5 sm:mt-6 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link to="/" className="text-gold-500 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}