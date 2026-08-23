import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import API from "../config/api";

export default function Register() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [fullName, setFullName] = useState("");
  const [username, setUsername] =useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

    } catch (error) {

      console.log(error);

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
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500">

      <div className="bg-white p-10 rounded-2xl shadow-xl w-96">

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

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg p-3 mb-3"
        />

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

        {otpSent && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border rounded-lg p-3 mb-3"
            />
            <p className="text-sm text-gray-600 mb-2">OTP expires in 5 minutes</p>
          </>
        )}

        {otpSent && !otpVerified && (
          <button
            type="button"
            onClick={handleVerifyOTP}
            className="w-full bg-green-600 text-white p-3 rounded-lg mb-3"
          >
            Verify OTP
          </button>
        )}

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