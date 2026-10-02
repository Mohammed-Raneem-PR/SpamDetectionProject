import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import API from "../config/api";
import { Eye, EyeOff, ShieldCheck, Lock, User, Sparkles } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("user");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error("Please enter username and password");
      return;
    }

    setLoading(true);

    // ADMIN LOGIN
    if (role === "admin") {
      const isValidAdmin =
        (username.trim() === "admin" && password === "admin123") ||
        (username.trim() === "ranee" && password === "ranee123");

      if (isValidAdmin) {
        localStorage.setItem("admin", "true");
        toast.success("Admin Login Successful");
        navigate("/admin");
      } else {
        toast.error("Invalid Admin Credentials");
      }
      setLoading(false);
      return;
    }

    // USER LOGIN
    try {
      const response = await axios.post(`${API}/login`, {
        username: username.trim(),
        password,
      });

      if (response.data.success) {
        localStorage.setItem("user", JSON.stringify(response.data));
        toast.success(response.data.message || "Login Successful");
        navigate("/dashboard");
      } else {
        toast.error(response.data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Backend Connection Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-8 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl p-7 sm:p-9 border border-slate-100">
        {/* Brand Icon & Heading */}
        <div className="text-center mb-6">
          <div className="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white items-center justify-center shadow-lg shadow-indigo-600/30 mb-3">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            ShieldAI Spam Radar
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Machine Learning Powered Social Network Defense
          </p>
        </div>

        {/* Role Toggle Tabs */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 mb-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => setRole("user")}
            className={`py-2 rounded-lg transition ${
              role === "user"
                ? "bg-white text-indigo-700 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            User Login
          </button>
          <button
            type="button"
            onClick={() => setRole("admin")}
            className={`py-2 rounded-lg transition ${
              role === "admin"
                ? "bg-white text-indigo-700 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Admin Portal
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              {role === "admin" ? "Admin Username" : "Username"}
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder={role === "admin" ? "e.g. admin" : "Enter username"}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 pl-10 pr-11 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2"
          >
            {loading ? "Authenticating..." : role === "admin" ? "Access Admin Console" : "Sign In to Dashboard"}
          </button>
        </form>

        {/* Footer */}
        {role === "user" && (
          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account yet?{" "}
            <Link to="/register" className="font-bold text-indigo-600 hover:underline">
              Create account
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
