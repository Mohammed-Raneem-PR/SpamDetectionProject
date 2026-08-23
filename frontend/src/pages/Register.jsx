import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import API from "../config/api";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpStatus, setOtpStatus] = useState("");

  const [fullName, setFullName] = useState("");
  const [username, setUsername] =useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  const handleRegister = async () => {

    // Check all fields are filled
    if (
      !fullName ||
      !username ||
      !email ||
      !password ||
      !phone ||
      !city
    ) {
      toast.error("Please fill all fields.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Password validation (min 6 characters)
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    // Phone validation (at least 10 digits)
    const phoneRegex = /^\d{10,}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, ""))) {
      toast.error("Please enter a valid phone number (at least 10 digits)");
      return;
    }

    // Check if email is verified via OTP
    if (!otpVerified) {
      toast.error("Please verify your email with OTP first.");
      return;
    }

    try {

      const response = await axios.post(
        `${API}/register`,
        {
          full_name: fullName,
          username,
          email,
          password,
          phone,
          city,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/");
      } else {
        toast.error(response.data.message || "Registration Failed");
      }

    } catch (error) {

      console.error(error);

      toast.error(error.response?.data?.message || "Registration Failed");

    }

  };

  const handleSendOTP = async () => {

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {

      const response = await axios.post(
        `${API}/send-otp`,
        {
          email: email
        }
      );

      toast.success(response.data.message);

      setOtpSent(true);
      setOtpStatus("OTP generated. Enter the six-digit code below, then verify it.");

    } catch (error) {

      console.log(error);

      setOtpStatus("Could not generate an OTP. Please try again.");
      toast.error("Failed to Send OTP");

    }

  };

  const handleVerifyOTP = async () => {

    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }

    try {

      const response = await axios.post(
        `${API}/verify-otp`,
        {
          email: email,
          otp: otp
        }
      );

      if (response.data.verified) {

        toast.success("Email Verified! You can now register.");

        setOtpVerified(true);

      } else {

        toast.error(response.data.error || "Wrong OTP");

      }

    } catch (error) {

      console.log(error);

      toast.error("OTP Verification Failed");

    }

  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-950 via-indigo-800 to-violet-700 p-5">

      <div className="bg-white/95 backdrop-blur p-7 sm:p-10 rounded-2xl shadow-2xl w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-8">
          Register
        </h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border rounded-lg p-3 mb-3"
        />

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border rounded-lg p-3 mb-3"
        />

        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg p-3 pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700"
            aria-label={showPassword ? "Hide password" : "Show password"}
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg p-3 mb-3"
        />

        <button
          type="button"
          onClick={handleSendOTP}
          disabled={otpVerified}
          className={`w-full p-3 rounded-lg mb-3 text-white font-semibold ${
            otpVerified
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {otpVerified ? "✓ Email Verified" : "Send OTP to Email"}
        </button>

        <input
          type="text"
          inputMode="numeric"
          maxLength="6"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border rounded-lg p-3 mb-2"
        />
        <p className="text-sm text-gray-600 mb-2">OTP expires in 5 minutes</p>
        {otpStatus && <p className="text-sm text-blue-700 mb-3">{otpStatus}</p>}

        <button
          type="button"
          onClick={handleVerifyOTP}
          disabled={!otpSent || otpVerified}
          className={`w-full p-3 rounded-lg mb-3 text-white font-semibold ${
            otpSent && !otpVerified
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Verify OTP
        </button>

        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border rounded-lg p-3 mb-3"
        />

        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full border rounded-lg p-3 mb-5"
        />

        <button
          onClick={handleRegister}
          disabled={!otpVerified}
          className={`w-full text-white p-3 rounded-lg ${
            otpVerified
              ? "bg-purple-600 hover:bg-purple-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Register
        </button>

        <button
          onClick={() => navigate("/")}
          className="w-full border border-gray-400 p-3 rounded-lg mt-3 hover:bg-gray-100"
        >
          Back to Login
        </button>

      </div>

    </div>
  );
}
