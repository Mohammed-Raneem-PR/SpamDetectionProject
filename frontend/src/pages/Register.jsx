import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import API from "../config/api";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  CheckCircle2,
  Send,
  Sparkles,
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpStatus, setOtpStatus] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (resendCooldown <= 0) return undefined;
    const timer = window.setInterval(() => {
      setResendCooldown((sec) => Math.max(0, sec - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [resendCooldown]);

  const handleSendOTP = async () => {
    if (!email) {
      toast.error("Please enter your email address first");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const response = await axios.post(`${API}/send-otp`, { email });
      toast.success(response.data.message || "OTP Sent!");
      setOtpSent(true);
      setOtpStatus("Verification code sent to your email. Please check your inbox.");
      setResendCooldown(response.data.resend_available_in_seconds || 30);
    } catch (error) {
      console.error(error);
      setOtpStatus("Could not send OTP. Please try again.");
      toast.error("Failed to send OTP email");
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      toast.error("Please enter the 6-digit OTP code");
      return;
    }

    try {
      const response = await axios.post(`${API}/verify-otp`, { email, otp: otp.trim() });
      if (response.data.verified) {
        toast.success("Email Verified! You can now register.");
        setOtpVerified(true);
      } else {
        toast.error(response.data.error || "Wrong OTP");
      }
    } catch (error) {
      console.error(error);
      toast.error("OTP Verification Failed");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!fullName || !username || !email || !password || !phone || !city) {
      toast.error("Please fill all required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    const phoneRegex = /^\d{10,}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, ""))) {
      toast.error("Please enter a valid phone number (at least 10 digits)");
      return;
    }

    if (!otpVerified) {
      toast.error("Please verify your email with OTP first.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/register`, {
        full_name: fullName.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
        phone: phone.trim(),
        city: city.trim(),
      });

      if (response.data.success) {
        toast.success(response.data.message || "Registration Successful!");
        navigate("/");
      } else {
        toast.error(response.data.message || "Registration Failed");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-10 relative overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl p-7 sm:p-9 border border-slate-100">
        <div className="text-center mb-6">
          <div className="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white items-center justify-center shadow-lg shadow-indigo-600/30 mb-3">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Create ShieldAI Account
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Join the community defense against social network spam and phishing
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-3.5">
          {/* Full Name & Username */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Username
              </label>
              <input
                type="text"
                placeholder="Choose username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 pl-9 pr-10 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Email with OTP Action */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  disabled={otpVerified}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-900 disabled:bg-slate-50"
                />
              </div>
              <button
                type="button"
                onClick={handleSendOTP}
                disabled={otpVerified || resendCooldown > 0}
                className={`px-3 py-2 rounded-xl text-xs font-bold text-white shrink-0 transition ${
                  otpVerified
                    ? "bg-emerald-600 cursor-default"
                    : resendCooldown > 0
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {otpVerified ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                  </span>
                ) : resendCooldown > 0 ? (
                  `Wait ${resendCooldown}s`
                ) : otpSent ? (
                  "Resend Code"
                ) : (
                  "Send OTP"
                )}
              </button>
            </div>
          </div>

          {/* OTP Verification Box */}
          {otpSent && !otpVerified && (
            <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 space-y-2">
              <p className="text-[11px] text-indigo-900 leading-tight">
                {otpStatus || "Enter the 6-digit verification code sent to your email."}
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="flex-1 rounded-lg border border-indigo-200 px-3 py-1.5 text-xs text-slate-900 font-mono tracking-widest text-center bg-white"
                />
                <button
                  type="button"
                  onClick={handleVerifyOTP}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-indigo-700 hover:bg-indigo-800 text-white"
                >
                  Verify
                </button>
              </div>
            </div>
          )}

          {/* Phone & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="10-digit number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                City / Region
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Bangalore"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !otpVerified}
            className={`w-full mt-3 py-3 rounded-xl text-sm font-bold text-white transition shadow-md ${
              loading || !otpVerified
                ? "bg-slate-300 cursor-not-allowed shadow-none"
                : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/25"
            }`}
          >
            {loading ? "Registering..." : "Create Verified Account"}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-slate-500">
          Already registered?{" "}
          <Link to="/" className="font-bold text-indigo-600 hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
