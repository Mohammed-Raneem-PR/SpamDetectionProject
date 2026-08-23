import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");

    alert("Logged out successfully!");

    navigate("/");
  };

  return (
    <header className="bg-white/90 backdrop-blur border-b border-slate-200 px-4 py-4 sm:px-6 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">

      <h1 className="text-lg sm:text-xl font-bold text-slate-800">
        AI-Based Spam Detection in Social Networks
      </h1>

      <div className="flex items-center justify-between sm:justify-normal gap-3 sm:gap-5">

        <span className="font-semibold text-sm sm:text-base text-slate-600">
          Welcome {user?.full_name || user?.username || "User"} 👋
        </span>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold shadow-sm"
        >
          Logout
        </button>

      </div>

    </header>
  );
}
