import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import API from "../config/api";

export default function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("user");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-xl w-96">

        <h1 className="text-3xl font-bold text-center text-red-600">
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

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-3 rounded mb-5"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg"
        >
          {role === "admin" ? "Admin Login" : "User Login"}
        </button>

        {role === "user" && (
          <Link to="/register">
            <button className="w-full border border-gray-400 p-3 rounded-lg mt-3 hover:bg-gray-100">
              Register
            </button>
          </Link>
        )}

      </div>

    </div>
  );
}