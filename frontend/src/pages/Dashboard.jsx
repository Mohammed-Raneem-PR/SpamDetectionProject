import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import API from "../config/api";
import AppLayout from "../components/AppLayout";
import {
  MessageSquare,
  ShieldAlert,
  ShieldCheck,
  Users,
  Send,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [stats, setStats] = useState({
    total_users: 0,
    total_tweets: 0,
    spam: 0,
    ham: 0,
  });

  const [recentTweets, setRecentTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickText, setQuickText] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [dashRes, tweetsRes] = await Promise.all([
        axios.get(`${API}/dashboard`, { params: { user_id: user?.id } }),
        axios.get(`${API}/tweets`, { params: { user_id: user?.id } }).catch(() => ({ data: [] })),
      ]);

      setStats(dashRes.data);
      setRecentTweets(Array.isArray(tweetsRes.data) ? tweetsRes.data.slice(0, 6) : []);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load dashboard metrics.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickScan = (e) => {
    e.preventDefault();
    if (!quickText.trim()) return;
    navigate("/detect", { state: { prefillText: quickText } });
  };

  const spamRatio = stats.total_tweets > 0 ? Math.round((stats.spam / stats.total_tweets) * 100) : 0;
  const safeRatio = stats.total_tweets > 0 ? Math.round((stats.ham / stats.total_tweets) * 100) : 0;

  return (
    <AppLayout
      title="Security Dashboard"
      subtitle="Real-time monitoring, live feed analysis, and ML model performance metrics"
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/post-tweet")}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 transition shadow-xs"
          >
            <Send className="h-3.5 w-3.5 text-slate-500" />
            <span>Post Tweet</span>
          </button>
          <button
            onClick={() => navigate("/detect")}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm shadow-indigo-600/25"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Scan with AI</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Hero Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-800 text-white p-6 sm:p-8 shadow-xl shadow-indigo-950/15 border border-indigo-700/50">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-indigo-200 text-xs font-medium mb-3">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Social Network Defense Engine v2.4 Online
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {user?.full_name || user?.username || "Researcher"} 👋
            </h2>
            <p className="mt-2 text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              Your network is guarded by a dual-level TF-IDF feature union with calibrated Linear SVM, achieving{" "}
              <strong className="text-white font-semibold">98.34% accuracy</strong> across 7,528 social network posts.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate("/detect")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white text-indigo-900 hover:bg-indigo-50 transition shadow-md"
              >
                <ShieldCheck className="h-4 w-4 text-indigo-600" />
                Scan Message or Poster
              </button>
              <button
                onClick={() => navigate("/analytics")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition backdrop-blur-sm"
              >
                <TrendingUp className="h-4 w-4" />
                View Detailed Analytics
              </button>
            </div>
          </div>

          {/* Decorative Background Elements */}
          <div className="absolute right-0 top-0 -bottom-10 w-96 bg-gradient-to-l from-violet-600/30 to-transparent pointer-events-none transform translate-x-20 -rotate-12 rounded-full blur-2xl"></div>
        </div>

        {/* 4 Primary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: Total Posts */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Posts</span>
              <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition">
                <MessageSquare className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{stats.total_tweets}</span>
              <span className="text-xs font-semibold text-slate-400">analyzed</span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Network volume</span>
              <span className="font-semibold text-indigo-600">Active</span>
            </div>
          </div>

          {/* Card 2: Spam Detected */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Spam Blocked</span>
              <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition">
                <ShieldAlert className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-rose-600 tracking-tight">{stats.spam}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100">
                {spamRatio}%
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Risk flags</span>
              <span className="font-semibold text-rose-600">High precision</span>
            </div>
          </div>

          {/* Card 3: Safe Messages */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Safe Content</span>
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-emerald-600 tracking-tight">{stats.ham}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                {safeRatio}%
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Verified genuine</span>
              <span className="font-semibold text-emerald-600">Clean</span>
            </div>
          </div>

          {/* Card 4: Total Users */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Community</span>
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{stats.total_users}</span>
              <span className="text-xs font-semibold text-slate-400">members</span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Protected accounts</span>
              <span className="font-semibold text-blue-600">Monitored</span>
            </div>
          </div>
        </div>

        {/* 2-Column Split Activity & Intelligence Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Recent Activity Feed (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">Recent Live Detection Stream</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Latest social posts analyzed by the machine learning pipeline</p>
                </div>
                <button
                  onClick={() => navigate("/tweets")}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
                >
                  View all
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition" />
                </button>
              </div>

              {recentTweets.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto mb-3">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">No recent posts found</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Try posting a tweet or scanning custom text to test real-time spam detection.
                  </p>
                  <button
                    onClick={() => navigate("/post-tweet")}
                    className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition"
                  >
                    Post First Tweet
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {recentTweets.map((t) => {
                    const isSpam = t.prediction === "Spam";
                    return (
                      <div key={t.id} className="py-3.5 flex items-start justify-between gap-3 group">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                isSpam
                                  ? "bg-rose-50 text-rose-700 border border-rose-200"
                                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              }`}
                            >
                              {isSpam ? <AlertTriangle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                              {isSpam ? "Spam" : "Safe"}
                            </span>
                            <span className="text-xs font-semibold text-slate-900 truncate">{t.title}</span>
                            {t.city && (
                              <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                                {t.city}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{t.tweet}</p>
                        </div>
                        <div className="text-right shrink-0">
                          {t.confidence ? (
                            <span className="text-xs font-bold text-slate-700">{t.confidence}%</span>
                          ) : null}
                          <div className="text-[10px] text-slate-400 flex items-center justify-end gap-1 mt-0.5">
                            <Clock className="h-3 w-3" />
                            <span>{t.date ? t.date.slice(0, 10) : "Recent"}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Scan Input Widget */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-6 text-white border border-slate-800 shadow-md">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Instant Message Pre-Check</span>
              </div>
              <h4 className="text-lg font-bold text-white tracking-tight">Test any message for phishing or spam</h4>
              <p className="text-xs text-slate-300 mt-1 mb-4">
                Paste a link, comment, or flyer text below to test against our calibrated Linear SVM model.
              </p>

              <form onSubmit={handleQuickScan} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="e.g. Claim free cash prize now at http://bit.ly/prize..."
                  value={quickText}
                  onChange={(e) => setQuickText(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800/90 text-sm text-white placeholder-slate-400 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition shrink-0 flex items-center justify-center gap-1.5 shadow-md"
                >
                  <span>Analyze</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Model Specs & Architecture (1 Col) */}
          <div className="space-y-6">
            {/* Model Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Cpu className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Model Specifications</h3>
                  <p className="text-[11px] text-slate-400">Calibrated Linear Support Vector Machine</p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Benchmark Accuracy</span>
                  <span className="font-extrabold text-indigo-600 text-sm">98.34%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: "98.34%" }}></div>
                </div>

                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="text-slate-500">Precision (Ham & Spam)</span>
                  <span className="font-bold text-slate-800">98.22%</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Recall (Sensitivity)</span>
                  <span className="font-bold text-slate-800">94.57%</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">F1 Score</span>
                  <span className="font-bold text-slate-800">96.36%</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-[11px]">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-slate-400" />
                    Feature Engineering
                  </span>
                  <span className="font-semibold text-slate-800">Word + Char TF-IDF</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    False Alarm Rate
                  </span>
                  <span className="font-semibold text-emerald-600">&lt; 0.52%</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
                    Safeguards
                  </span>
                  <span className="font-semibold text-slate-800">Gov/College Context</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Shortcuts */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Quick Navigation</h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => navigate("/detect")}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-indigo-50/50 hover:border-indigo-100 text-left transition"
                >
                  <ShieldCheck className="h-4 w-4 text-indigo-600 mb-1" />
                  <div className="text-xs font-bold text-slate-800">Detect Spam</div>
                  <div className="text-[10px] text-slate-400">Scan text or poster</div>
                </button>

                <button
                  onClick={() => navigate("/post-tweet")}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-indigo-50/50 hover:border-indigo-100 text-left transition"
                >
                  <Send className="h-4 w-4 text-indigo-600 mb-1" />
                  <div className="text-xs font-bold text-slate-800">Post Tweet</div>
                  <div className="text-[10px] text-slate-400">Create new tweet</div>
                </button>

                <button
                  onClick={() => navigate("/trending")}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-indigo-50/50 hover:border-indigo-100 text-left transition"
                >
                  <TrendingUp className="h-4 w-4 text-indigo-600 mb-1" />
                  <div className="text-xs font-bold text-slate-800">Trending</div>
                  <div className="text-[10px] text-slate-400">Top active cities</div>
                </button>

                <button
                  onClick={() => navigate("/analytics")}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-indigo-50/50 hover:border-indigo-100 text-left transition"
                >
                  <Cpu className="h-4 w-4 text-indigo-600 mb-1" />
                  <div className="text-xs font-bold text-slate-800">Analytics</div>
                  <div className="text-[10px] text-slate-400">Charts & metrics</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
