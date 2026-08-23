import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import API from "../config/api";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("user");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {

    if (!username || !password) {
      toast.error("Please enter username and password");
      return;
    }

    // ------------------------
    // ADMIN LOGIN
    // ------------------------

    if (role === "admin") {

      if (username === "admin" && password === "admin123") {

        localStorage.setItem("admin", "true");

        toast.success("Admin Login Successful");

        navigate("/admin");

      } else {

        toast.error("Invalid Admin Credentials");

      }

      return;
    }

    // ------------------------
    // USER LOGIN
    // ------------------------

    try {

      const response = await axios.post(
        `${API}/login`,
        {
          username,
          password,
        }
      );

      if (response.data.success) {

        localStorage.setItem(
          "user",
          JSON.stringify(response.data)
        );

        toast.success(response.data.message);

        navigate("/dashboard");

      } else {

        toast.error(response.data.message);

      }

    } catch (error) {

      console.log(error);

      toast.error("Backend Connection Failed");

    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-indigo-800 to-violet-700 p-5">

      <div className="bg-white/95 backdrop-blur p-7 sm:p-9 rounded-2xl shadow-2xl w-full max-w-md">

        <h1 className="text-3xl font-bold text-center text-indigo-700">
          AI-Based Spam Detection
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-6">
          Login to continue
        </p>

        {/* Role Selection */}

        <div className="flex justify-center gap-6 mb-6">

          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="user"
              checked={role === "user"}
              onChange={() => setRole("user")}
            />
            User
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="admin"
              checked={role === "admin"}
              onChange={() => setRole("admin")}
            />
            Admin
          </label>

        </div>

        <input
          type="text"
          placeholder={role === "admin" ? "Admin Username" : "Username"}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border p-3 rounded mb-4"
        />

        <div className="relative mb-5">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-3 pr-12 rounded"
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

        <button
          onClick={handleLogin}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg"
        >
          {role === "admin" ? "Admin Login" : "User Login"}
        </button>

        {role === "user" && (
          <Link to="/register" className="block w-full border border-slate-300 p-3 rounded-lg mt-3 text-center font-medium hover:bg-slate-50">
            Register
          </Link>
        )}

      </div>

    </div>
  );
}
