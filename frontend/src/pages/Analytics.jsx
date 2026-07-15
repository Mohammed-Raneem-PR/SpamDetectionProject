import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import API from "../config/api";
import { useNavigate } from "react-router-dom";

import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default function Analytics() {
  const [stats, setStats] = useState({
    spam: 0,
    ham: 0,
    total: 0,
    users: 0,
  });

  const navigate = useNavigate();

  const isAdmin = localStorage.getItem("admin") === "true";

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await axios.get(
        `${API}/analytics`
      );

      setStats(response.data);

    } catch (error) {

      console.error(error);

      toast.error("Unable to load analytics.");

    }
  };

  const pieData = {
    labels: ["Spam", "Ham"],
    datasets: [
      {
        data: [stats.spam, stats.ham],
        backgroundColor: ["#EF4444", "#22C55E"],
      },
    ],
  };

  const barData = {
    labels: ["Users", "Tweets", "Spam", "Ham"],
    datasets: [
      {
        label: "Statistics",
        data: [
          stats.users,
          stats.total,
          stats.spam,
          stats.ham,
        ],
        backgroundColor: [
          "#3B82F6",
          "#8B5CF6",
          "#EF4444",
          "#22C55E",
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="flex justify-between items-center mb-8">

  <div className="flex items-center gap-4">

    <button
  onClick={() => navigate(isAdmin ? "/admin" : "/dashboard")}
  className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-lg"
>
  ← Back
</button>

    <h1 className="text-4xl font-bold">
      Analytics Dashboard
    </h1>

  </div>

</div>

      {/* Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-gray-500">Users</h3>
          <p className="text-4xl font-bold">
            {stats.users}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-gray-500">Tweets</h3>
          <p className="text-4xl font-bold">
            {stats.total}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-gray-500">Spam</h3>
          <p className="text-4xl font-bold text-red-600">
            {stats.spam}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-gray-500">Ham</h3>
          <p className="text-4xl font-bold text-green-600">
            {stats.ham}
          </p>
        </div>

      </div>

      {/* Charts */}

      <div className="grid md:grid-cols-2 gap-8">

        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="text-2xl font-bold mb-4">
            Spam vs Ham
          </h2>

          <Pie data={pieData} />

        </div>

        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="text-2xl font-bold mb-4">
            Overall Statistics
          </h2>

          <Bar data={barData} />

        </div>

      </div>

    </div>
  );
}