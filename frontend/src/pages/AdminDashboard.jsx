import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import API from "../config/api";
import AdminLayout from "../components/AdminLayout";
import {
  Users,
  MessageSquare,
  ShieldAlert,
  ShieldCheck,
  Star,
  ArrowRight,
  Shield,
  Activity,
  Layers,
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total_users: 0,
    total_tweets: 0,
    spam: 0,
    ham: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/dashboard`);
      setStats(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load admin metrics.");
    } finally {
      setLoading(false);
    }
  };

  const spamRatio = stats.total_tweets > 0 ? Math.round((stats.spam / stats.total_tweets) * 100) : 0;
  const safeRatio = stats.total_tweets > 0 ? Math.round((stats.ham / stats.total_tweets) * 100) : 0;

  return (
    <AdminLayout
      title="Admin Management Console"
      subtitle="System administration, content moderation, and verified user oversight"
    >
      <div className="space-y-6">
        {/* KPI Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>Registered Users</span>
              <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-slate-900">{stats.total_users}</div>
            <div className="mt-2 text-xs text-slate-400">Database user records</div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>Total Posts</span>
              <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <MessageSquare className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-slate-900">{stats.total_tweets}</div>
            <div className="mt-2 text-xs text-slate-400">Total processed tweets</div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>Spam Flags</span>
              <div className="h-9 w-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <ShieldAlert className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-rose-600">{stats.spam}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700">
                {spamRatio}%
              </span>
            </div>
            <div className="mt-2 text-xs text-slate-400">High-risk flagged content</div>
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
                {safeRatio}%
              </span>
            </div>
            <div className="mt-2 text-xs text-slate-400">Verified legitimate content</div>
          </div>
        </div>

        {/* Admin Navigation Hub Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between hover:shadow-md transition group">
            <div>
              <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-105 transition">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">User Management</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Inspect registered user accounts, manage credentials, verify emails, and delete suspicious profiles.
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/users")}
              className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition"
            >
              <span>Manage Users</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between hover:shadow-md transition group">
            <div>
              <div className="h-11 w-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-105 transition">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Tweet Moderation</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Review all user posts across cities, inspect SVM classification labels, and delete spam tweets.
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/tweets")}
              className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              <span>Manage Tweets</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between hover:shadow-md transition group">
            <div>
              <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-105 transition">
                <Star className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Feedback & Reviews</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Monitor user feedback, community satisfaction ratings, and moderate spam complaints.
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/reviews")}
              className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 transition"
            >
              <span>Manage Reviews</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}