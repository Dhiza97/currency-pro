import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function AuthCallback() {
  const { login } = useContext(AuthContext);
  const navigate  = useNavigate();

  useEffect(() => {
    // Token is in the URL fragment (#), not query string — never sent to server
    const params = new URLSearchParams(window.location.hash.slice(1));
    const token  = params.get("token");
    const name   = params.get("name");
    const email  = params.get("email");

    if (token) {
      login({ accessToken: token, user: { name, email } });
      // Clear fragment from URL
      window.history.replaceState(null, "", window.location.pathname);
      navigate("/", { replace: true });
    } else {
      navigate("/login?error=google", { replace: true });
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0f]">
      <p className="text-gray-500 animate-pulse">Signing you in...</p>
    </div>
  );
}