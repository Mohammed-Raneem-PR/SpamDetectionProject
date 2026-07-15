import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import API from "../config/api";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total_users: 0,
    total_tweets: 0,
    spam: 0,
    ham: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await axios.get(`${API}/dashboard`);

      setStats(response.data);

    } catch (error) {

      console.error(error);

      toast.error("Unable to load dashboard.");

    }
  };

  const handleLogout = () => {
  localStorage.removeItem("admin");
  localStorage.removeItem("user");

  toast.success("Logged out successfully");

  navigate("/", { replace: true });
};

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-4xl font-bold">
          👨‍💼 Admin Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg"
        >
          Logout
        </button>

      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-gray-500">
            Total Users
          </h3>

          <p className="text-4xl font-bold mt-3">
            {stats.total_users}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-gray-500">
            Total Tweets
          </h3>

          <p className="text-4xl font-bold mt-3">
            {stats.total_tweets}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-gray-500">
            Spam Tweets
          </h3>

          <p className="text-4xl font-bold text-red-600 mt-3">
            {stats.spam}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-gray-500">
            Safe Tweets
          </h3>

          <p className="text-4xl font-bold text-green-600 mt-3">
            {stats.ham}
          </p>
        </div>

      </div>

      {/* Management */}

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white rounded-xl shadow-lg p-8">

          <h2 className="text-2xl font-bold mb-4">
            👥 Manage Users
          </h2>

          <p className="text-gray-500 mb-6">
            View all registered users.
          </p>

          <button
            onClick={() => navigate("/admin/users")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg"
          >
            Open
          </button>

        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">

          <h2 className="text-2xl font-bold mb-4">
            📝 Manage Tweets
          </h2>

          <p className="text-gray-500 mb-6">
            View and delete tweets.
          </p>

          <button
            onClick={() => navigate("/admin/tweets")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg"
          >
            Open
          </button>

        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">

          <h2 className="text-2xl font-bold mb-4">
            📊 Analytics
          </h2>

          <p className="text-gray-500 mb-6">
            Open project analytics.
          </p>

          <button
            onClick={() => navigate("/analytics")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg"
          >
            Open
          </button>

        </div>

      </div>
      <div className="bg-white rounded-xl shadow-lg p-8">

  <h2 className="text-2xl font-bold mb-4">
    ⭐ Manage Reviews
  </h2>

  <p className="text-gray-500 mb-6">
    View and delete user reviews.
  </p>

  <button
    onClick={() => navigate("/admin/reviews")}
    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg"
  >
    Open
  </button>

</div>

    </div>
  );
}