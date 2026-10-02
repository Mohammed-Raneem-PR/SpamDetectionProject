import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import API from "../config/api";
import AppLayout from "../components/AppLayout";
import { normalizeCity } from "../utils/cityUtils";
import {
  MessageSquare,
  Search,
  Plus,
  Trash2,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Clock,
  Filter,
  RefreshCw,
  LayoutGrid,
  List,
} from "lucide-react";

export default function ViewTweets() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [tweets, setTweets] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all"); // "all" | "safe" | "spam"
  const [selectedCity, setSelectedCity] = useState("all");
  const [scope, setScope] = useState("all"); // "all" | "my"
  const [viewMode, setViewMode] = useState("cards"); // "cards" | "table"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTweets();
  }, [scope]);

  const fetchTweets = async () => {
    setLoading(true);
    try {
      const params = scope === "my" && user?.id ? { user_id: user.id } : {};
      const response = await axios.get(`${API}/tweets`, { params });
      setTweets(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load tweets feed.");
    } finally {
      setLoading(false);
    }
  };

  const deleteTweet = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tweet?")) return;

    try {
      const response = await axios.delete(`${API}/tweets/${id}`, {
        params: { user_id: user?.id },
      });
      toast.success(response.data.message || "Tweet deleted.");
      fetchTweets();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete tweet.");
    }
  };

  // Get unique list of cities (case-insensitive deduplication and Title Casing)
  const cities = [
    "all",
    ...Array.from(
      new Set(
        tweets
          .map((t) => normalizeCity(t.city))
          .filter((c) => c && c !== "Unknown")
      )
    ),
  ];

  // Filtering
  const filteredTweets = tweets.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.tweet?.toLowerCase().includes(search.toLowerCase()) ||
      item.city?.toLowerCase().includes(search.toLowerCase());

    const matchesType =
      filterType === "all"
        ? true
        : filterType === "safe"
        ? item.prediction === "Ham"
        : item.prediction === "Spam";

    const matchesCity =
      selectedCity.toLowerCase() === "all" ||
      normalizeCity(item.city).toLowerCase() === selectedCity.toLowerCase();

    return matchesSearch && matchesType && matchesCity;
  });

  const spamCount = tweets.filter((t) => t.prediction === "Spam").length;
  const safeCount = tweets.filter((t) => t.prediction === "Ham").length;

  return (
    <AppLayout
      title="Social Network Posts Feed"
      subtitle="View, search, and manage user tweets evaluated in real time by the Linear SVM classifier"
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/post-tweet")}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Tweet</span>
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by keywords, title, or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Scope Selector: Community vs My Posts */}
              <div className="flex items-center p-1 rounded-xl bg-slate-100 text-xs font-semibold">
                <button
                  onClick={() => setScope("all")}
                  className={`px-3 py-1 rounded-lg transition ${
                    scope === "all" ? "bg-white text-indigo-700 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Community Feed
                </button>
                <button
                  onClick={() => setScope("my")}
                  className={`px-3 py-1 rounded-lg transition ${
                    scope === "my" ? "bg-white text-indigo-700 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  My Posts Only
                </button>
              </div>

              {/* Prediction Filter Tabs */}
              <div className="flex items-center p-1 rounded-xl bg-slate-100 text-xs font-semibold">
                <button
                  onClick={() => setFilterType("all")}
                  className={`px-3 py-1 rounded-lg transition ${
                    filterType === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  All ({tweets.length})
                </button>
                <button
                  onClick={() => setFilterType("safe")}
                  className={`px-3 py-1 rounded-lg transition ${
                    filterType === "safe" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Safe ({safeCount})
                </button>
                <button
                  onClick={() => setFilterType("spam")}
                  className={`px-3 py-1 rounded-lg transition ${
                    filterType === "spam" ? "bg-white text-rose-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Spam ({spamCount})
                </button>
              </div>

              {/* City Dropdown */}
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c === "all" ? "All Locations" : c}
                  </option>
                ))}
              </select>

              {/* View Mode Toggle */}
              <div className="hidden sm:flex items-center p-1 rounded-xl bg-slate-100 text-slate-600">
                <button
                  onClick={() => setViewMode("cards")}
                  title="Card View"
                  className={`p-1.5 rounded-lg transition ${
                    viewMode === "cards" ? "bg-white text-indigo-600 shadow-xs" : "hover:text-slate-900"
                  }`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  title="Table View"
                  className={`p-1.5 rounded-lg transition ${
                    viewMode === "table" ? "bg-white text-indigo-600 shadow-xs" : "hover:text-slate-900"
                  }`}
                >
                  <List className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Stream */}
        {loading ? (
          <div className="py-20 text-center">
            <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700">Loading posts feed...</p>
          </div>
        ) : filteredTweets.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs py-16 text-center">
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Posts Match Your Filter</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search terms, location filter, or post a new tweet.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setFilterType("all");
                setSelectedCity("all");
              }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === "cards" ? (
          /* Cards Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredTweets.map((t) => {
              const isSpam = t.prediction === "Spam";
              const isOwner = user?.id && t.owner_user_id === user?.id;
              return (
                <div
                  key={t.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between group"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold uppercase shrink-0 ${
                          isOwner ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700"
                        }`}>
                          {isOwner ? user?.full_name?.charAt(0) || "U" : "C"}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-bold text-slate-900 truncate">{t.title}</h4>
                            <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                              isOwner ? "bg-indigo-50 text-indigo-700 border border-indigo-200" : "bg-slate-100 text-slate-500"
                            }`}>
                              {isOwner ? "You" : "Community"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                            {t.city && (
                              <span className="flex items-center gap-0.5">
                                <MapPin className="h-3 w-3 text-slate-400" />
                                {normalizeCity(t.city)}
                              </span>
                            )}
                            <span>·</span>
                            <span>{t.date ? t.date.slice(0, 10) : "Recent"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Verdict Badge */}
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold shrink-0 ${
                          isSpam
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {isSpam ? <AlertTriangle className="h-3 w-3" /> : <ShieldCheck className="h-3 w-3" />}
                        {isSpam ? "Spam" : "Safe"}
                      </span>
                    </div>

                    {/* Tweet Body */}
                    <p className="text-xs text-slate-700 leading-relaxed break-words line-clamp-4">
                      {t.tweet}
                    </p>
                  </div>

                  {/* Footer & Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-slate-500">Confidence:</span>
                      <span className="text-xs font-bold text-slate-800">{t.confidence || 95}%</span>
                    </div>

                    {isOwner ? (
                      <button
                        onClick={() => deleteTweet(t.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Delete your post"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400">Public post</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table View */
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4 font-bold">Title</th>
                    <th className="py-3.5 px-4 font-bold">Message Content</th>
                    <th className="py-3.5 px-4 font-bold">Location</th>
                    <th className="py-3.5 px-4 font-bold">Verdict</th>
                    <th className="py-3.5 px-4 font-bold">Confidence</th>
                    <th className="py-3.5 px-4 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTweets.map((t) => {
                    const isSpam = t.prediction === "Spam";
                    const isOwner = user?.id && t.owner_user_id === user?.id;
                    return (
                      <tr key={t.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                          {t.title}
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 max-w-md">
                          <p className="line-clamp-2">{t.tweet}</p>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                          {t.city ? normalizeCity(t.city) : "—"}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              isSpam
                                ? "bg-rose-50 text-rose-700 border border-rose-200"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            }`}
                          >
                            {isSpam ? <AlertTriangle className="h-3 w-3" /> : <ShieldCheck className="h-3 w-3" />}
                            {t.prediction}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-800 whitespace-nowrap">
                          {t.confidence || 95}%
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          {isOwner ? (
                            <button
                              onClick={() => deleteTweet(t.id)}
                              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="Delete your post"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400">Public</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
