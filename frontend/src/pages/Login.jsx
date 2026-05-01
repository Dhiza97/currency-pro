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

    if (!form.email || !form.password) {
      return toast.error("Please fill all fields");
    }

    try {
      setLoading(true);

      const { data } = await API.post("/auth/login", form);

      // Store user object with token at top level
      login({ ...data.user, token: data.token });
      toast.success("Welcome back!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center p-4 bg-gold-500/10 rounded-2xl mb-4">
            <BsCurrencyExchange className="text-gold-500 text-4xl" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white tracking-wider">
            CURRENCY<span className="text-gold-500">PRO</span>
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Professional Currency Exchange</p>
        </div>

        <div className="card p-8 animate-slide-up">
          <div className="flex items-center gap-2 mb-6">
            <BsCalculator className="text-gold-500" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white tracking-wider">
              SIGN IN
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

        <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">Email</label>
              <input
                type="email"
                className="input"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

        <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">Password</label>
              <input
                type="password"
                className="input"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

        <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? <span className="animate-pulse">AUTHENTICATING...</span> : "LOGIN"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-gold-500 font-semibold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}