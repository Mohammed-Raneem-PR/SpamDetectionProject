import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import API from "../config/api";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
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
        `${API}/dashboard`,
        { params: { user_id: user?.id } }
      );

      setStats(response.data);

    } catch (error) {

      console.error(error);

      toast.error("Unable to load dashboard.");

    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 md:ml-64">

        <Navbar />

        <main className="p-5 pb-24 sm:p-8 lg:p-10 md:pb-10 max-w-7xl mx-auto">

          <h2 className="text-3xl font-bold tracking-tight mb-2">
            Dashboard
          </h2>
          <p className="text-slate-500 mb-8">Monitor your community’s spam-detection activity.</p>

          {/* Dashboard Cards */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-6 hover:-translate-y-0.5 hover:shadow-md">

              <h3 className="text-gray-500 text-lg">
                Total Posts
              </h3>

              <p className="text-4xl font-bold mt-4">
                {stats.total_tweets}
              </p>

            </div>

            <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-6 hover:-translate-y-0.5 hover:shadow-md">

              <h3 className="text-gray-500 text-lg">
                Spam Detected
              </h3>

              <p className="text-4xl font-bold mt-4 text-red-600">
                {stats.spam}
              </p>

            </div>

            <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-6 hover:-translate-y-0.5 hover:shadow-md">

              <h3 className="text-gray-500 text-lg">
                Safe Messages
              </h3>

              <p className="text-4xl font-bold mt-4 text-green-600">
                {stats.ham}
              </p>

            </div>

            <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-6 hover:-translate-y-0.5 hover:shadow-md">

              <h3 className="text-gray-500 text-lg">
                Total Users
              </h3>

              <p className="text-4xl font-bold mt-4">
                {stats.total_users}
              </p>

            </div>

          </div>

          {/* Recent Activity */}

          <section className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-6 mt-10">

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

          </section>

        </main>

      </div>

    </div>
  );
}
