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

      toast.success(response.data.message);

      navigate("/");

    } catch (error) {

      console.error(error);

      toast.error("Registration Failed");

    }

  };

  const handleSendOTP = async () => {

    if (!phone) {
      toast.error("Enter Phone Number");
      return;
    }

    try {

      const response = await axios.post(
        `${API}/send-otp`,
        {
          phone: phone
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

    try {

      const response = await axios.post(
        `${API}/verify-otp`,
        {
          phone: phone,
          otp: otp
        }
      );

      if (response.data.verified) {

        toast.success("OTP Verified");

        setOtpVerified(true);

      } else {

        toast.error("Wrong OTP");

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
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border rounded-lg p-3 mb-3"
        />

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border rounded-lg p-3 mb-3"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border rounded-lg p-3 mb-3"
        />

        <button
          type="button"
          onClick={handleSendOTP}
          className="w-full bg-blue-600 text-white p-3 rounded-lg mb-3"
        >
          Send OTP
        </button>

        {otpSent && (
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border rounded-lg p-3 mb-3"
          />
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