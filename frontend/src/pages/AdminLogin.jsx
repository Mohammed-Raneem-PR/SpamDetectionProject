import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {

    if (!username || !password) {
      toast.error("Please enter username and password");
      return;
    }

    if (
      username === "ranee" &&
      password === "ranee123"
    ) {

      localStorage.setItem("admin", "true");

      toast.success("Admin Login Successful");

      navigate("/admin");

    } else {

      toast.error("Invalid Admin Credentials");

    }

  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-700 to-indigo-800">

      <div className="bg-white p-10 rounded-2xl shadow-xl w-96">

        <h1 className="text-3xl font-bold text-center mb-8">
          Admin Login
        </h1>

        <input
          type="text"
          placeholder="Admin Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border rounded-lg p-3 mb-4"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg p-3 mb-6"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg"
        >
          Login
        </button>

      </div>

    </div>
  );
}