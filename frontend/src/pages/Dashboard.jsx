import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import API from "../config/api";

export default function Dashboard() {
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
      const response = await axios.get(
        `${API}/dashboard`
      );

      setStats(response.data);

    } catch (error) {

      console.error(error);

      toast.error("Unable to load dashboard.");

    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64">

        <Navbar />

        <div className="p-8">

          <h2 className="text-3xl font-bold mb-6">
            Dashboard
          </h2>

          {/* Dashboard Cards */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            <div className="bg-white rounded-xl shadow-lg p-6">

              <h3 className="text-gray-500 text-lg">
                Total Posts
              </h3>

              <p className="text-4xl font-bold mt-4">
                {stats.total_tweets}
              </p>

            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">

              <h3 className="text-gray-500 text-lg">
                Spam Detected
              </h3>

              <p className="text-4xl font-bold mt-4 text-red-600">
                {stats.spam}
              </p>

            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">

              <h3 className="text-gray-500 text-lg">
                Safe Messages
              </h3>

              <p className="text-4xl font-bold mt-4 text-green-600">
                {stats.ham}
              </p>

            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">

              <h3 className="text-gray-500 text-lg">
                Total Users
              </h3>

              <p className="text-4xl font-bold mt-4">
                {stats.total_users}
              </p>

            </div>

          </div>

          {/* Recent Activity */}

          <div className="bg-white rounded-xl shadow-lg p-6 mt-10">

            <h3 className="text-2xl font-bold mb-4">
              Recent Activity
            </h3>

            <div className="space-y-3">

              <div className="flex justify-between border-b pb-2">
                <span>Total Registered Users</span>
                <span className="font-bold">
                  {stats.total_users}
                </span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span>Total Tweets Analyzed</span>
                <span className="font-bold">
                  {stats.total_tweets}
                </span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span>Spam Messages</span>
                <span className="text-red-600 font-bold">
                  {stats.spam}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Safe Messages</span>
                <span className="text-green-600 font-bold">
                  {stats.ham}
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}