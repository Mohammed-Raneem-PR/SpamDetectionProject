import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

        <div className="relative mb-6">
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
