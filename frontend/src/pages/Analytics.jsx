import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import API from "../config/api";
import AppLayout from "../components/AppLayout";
import AdminLayout from "../components/AdminLayout";

import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  BarChart3,
  PieChart,
  ShieldCheck,
  ShieldAlert,
  Users,
  MessageSquare,
  TrendingUp,
  Cpu,
  Layers,
  Award,
} from "lucide-react";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default function Analytics() {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("admin") === "true";
  const user = JSON.parse(localStorage.getItem("user"));

  const [stats, setStats] = useState({
    spam: 0,
    ham: 0,
    total: 0,
    users: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/analytics`, {
        params: isAdmin ? {} : { user_id: user?.id },
      });
      setStats(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load analytics metrics.");
    } finally {
      setLoading(false);
    }
  };

  const doughnutData = {
    labels: ["Safe Content (Ham)", "Spam Flagged"],
    datasets: [
      {
        data: [stats.ham, stats.spam],
        backgroundColor: ["#10b981", "#ef4444"],
        hoverBackgroundColor: ["#059669", "#dc2626"],
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          padding: 15,
          font: { size: 12, weight: 600 },
        },
      },
      tooltip: {
        backgroundColor: "#0f172a",
        padding: 10,
        cornerRadius: 8,
      },
    },
    cutout: "68%",
  };

  const barData = {
    labels: ["Community Users", "Total Posts", "Spam Blocked", "Safe Messages"],
    datasets: [
      {
        label: "Count",
        data: [stats.users, stats.total, stats.spam, stats.ham],
        backgroundColor: ["#6366f1", "#3b82f6", "#ef4444", "#10b981"],
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0f172a",
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "#f1f5f9" },
        ticks: { font: { size: 11 } },
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 11, weight: 600 } },
      },
    },
  };

  const spamPercent = stats.total > 0 ? Math.round((stats.spam / stats.total) * 100) : 0;
  const safePercent = stats.total > 0 ? Math.round((stats.ham / stats.total) * 100) : 0;

  const content = (
    <div className="space-y-6">
      {/* 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Total Evaluated</span>
            <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <MessageSquare className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900">{stats.total}</div>
          <p className="mt-2 text-xs text-slate-400">Total posts processed</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Spam Detected</span>
            <div className="h-9 w-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-600">{stats.spam}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700">
              {spamPercent}%
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400">Malicious or promotional risk</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Safe Messages</span>
            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600">{stats.ham}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
              {safePercent}%
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400">Natural conversation & events</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Community Users</span>
            <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900">{stats.users}</div>
          <p className="mt-2 text-xs text-slate-400">Monitored account profiles</p>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Doughnut Chart: Distribution (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Classification Distribution</h3>
                <p className="text-xs text-slate-500 mt-0.5">Ratio of safe posts vs detected spam</p>
              </div>
              <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <PieChart className="h-4 w-4" />
              </div>
            </div>

            <div className="relative h-64 flex items-center justify-center">
              {stats.total === 0 ? (
                <div className="text-center text-xs text-slate-400">No data available for chart</div>
              ) : (
                <Doughnut data={doughnutData} options={doughnutOptions} />
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-center">
            <div className="p-2 rounded-xl bg-emerald-50/60 border border-emerald-100">
              <div className="text-xs font-bold text-emerald-800">{safePercent}%</div>
              <div className="text-[10px] text-emerald-600 font-semibold">Safe Content</div>
            </div>
            <div className="p-2 rounded-xl bg-rose-50/60 border border-rose-100">
              <div className="text-xs font-bold text-rose-800">{spamPercent}%</div>
              <div className="text-[10px] text-rose-600 font-semibold">Spam / Risk</div>
            </div>
          </div>
        </div>

        {/* Bar Chart: Activity Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">System Activity Metrics</h3>
                <p className="text-xs text-slate-500 mt-0.5">Aggregate comparison across accounts and posts</p>
              </div>
              <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <BarChart3 className="h-4 w-4" />
              </div>
            </div>

            <div className="h-64">
              {stats.total === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No data available for chart
                </div>
              ) : (
                <Bar data={barData} options={barOptions} />
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Updated in real time</span>
            <span className="font-semibold text-indigo-600">Linear SVM Engine Active</span>
          </div>
        </div>
      </div>

      {/* Model Benchmark Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-5">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-sm">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Machine Learning Benchmark Matrix</h3>
            <p className="text-xs text-slate-500 mt-0.5">Comparative evaluation on held-out test datasets</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Dataset 1 Card */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide">
                Social Content Model
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                Primary Model
              </span>
            </div>
            <div className="text-sm font-bold text-slate-900">
              combined_social_network_spam.csv (7,528 posts)
            </div>
            <div className="grid grid-cols-4 gap-2 pt-2 text-center">
              <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-xs">
                <div className="text-[10px] text-slate-400">Accuracy</div>
                <div className="text-sm font-extrabold text-indigo-600">98.34%</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-xs">
                <div className="text-[10px] text-slate-400">Precision</div>
                <div className="text-sm font-bold text-slate-800">98.22%</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-xs">
                <div className="text-[10px] text-slate-400">Recall</div>
                <div className="text-sm font-bold text-slate-800">94.57%</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-xs">
                <div className="text-[10px] text-slate-400">F1 Score</div>
                <div className="text-sm font-bold text-slate-800">96.36%</div>
              </div>
            </div>
          </div>

          {/* Dataset 2 Card */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-violet-700 uppercase tracking-wide">
                Twitter Bot Benchmark
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-100 text-violet-800">
                TwiBot-20
              </span>
            </div>
            <div className="text-sm font-bold text-slate-900">
              Multimodal SVM (Text + Behavioral Metadata)
            </div>
            <div className="grid grid-cols-4 gap-2 pt-2 text-center">
              <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-xs">
                <div className="text-[10px] text-slate-400">Accuracy</div>
                <div className="text-sm font-extrabold text-violet-600">85.71%</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-xs">
                <div className="text-[10px] text-slate-400">Precision</div>
                <div className="text-sm font-bold text-slate-800">82.75%</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-xs">
                <div className="text-[10px] text-slate-400">Recall</div>
                <div className="text-sm font-bold text-slate-800">92.97%</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-xs">
                <div className="text-[10px] text-slate-400">F1 Score</div>
                <div className="text-sm font-bold text-slate-800">87.56%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return isAdmin ? (
    <AdminLayout title="Analytics & Model Intelligence" subtitle="System-wide metrics and performance evaluation">
      {content}
    </AdminLayout>
  ) : (
    <AppLayout title="Analytics & Intelligence" subtitle="Community statistics, spam risk distribution, and ML benchmark metrics">
      {content}
    </AppLayout>
  );
}
