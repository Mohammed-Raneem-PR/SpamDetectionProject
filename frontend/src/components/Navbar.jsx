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
    <div className="bg-white shadow p-5 flex justify-between items-center">

      <h1 className="text-2xl font-bold">
        AI-Based Spam Detection in Social Networks
      </h1>

      <div className="flex items-center gap-5">

        <span className="font-semibold text-lg">
          Welcome {user?.full_name || user?.username || "User"} 👋
        </span>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
        >
          Logout
        </button>

      </div>

    </div>
  );
}