import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import API from "../config/api";
import AppLayout from "../components/AppLayout";
import {
  Flame,
  MapPin,
  MessageSquare,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
} from "lucide-react";
import { normalizeCity } from "../utils/cityUtils";

export default function Trending() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCityFilter, setSelectedCityFilter] = useState("all"); // "all" (All Locations) | specific city name

  useEffect(() => {
    const fetchTweets = async () => {
      setLoading(true);
      try {
        // Fetch all community posts across all users for public trending calculations
        const response = await axios.get(`${API}/tweets`);
        setTweets(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error(error);
        toast.error("Unable to load trending posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, []);

  // City counts & trends with case-insensitive canonicalization
  const cityTrends = useMemo(() => {
    const counts = tweets.reduce((acc, t) => {
      const city = normalizeCity(t.city);
      acc[city] = (acc[city] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8);
  }, [tweets]);

  // Tweets to display based on selected filter (case-insensitive)
  const displayedTweets = useMemo(() => {
    if (!selectedCityFilter || selectedCityFilter.toLowerCase() === "all") return tweets;
    return tweets.filter(
      (t) => normalizeCity(t.city).toLowerCase() === selectedCityFilter.toLowerCase()
    );
  }, [tweets, selectedCityFilter]);

  const spamCount = displayedTweets.filter((t) => t.prediction === "Spam").length;
  const safeCount = displayedTweets.length - spamCount;
  const topCityCount = cityTrends.length > 0 ? cityTrends[0][1] : 0;

  return (
    <AppLayout
      title="Trending Locations & Topics"
      subtitle="Discover locations with peak network activity and inspect their spam vs safe ratio in real time"
      actions={
        <button
          onClick={() => navigate("/post-tweet")}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm"
        >
          <TrendingUp className="h-3.5 w-3.5" />
          <span>Post to Trending</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Hero Trending Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 rounded-2xl p-6 sm:p-7 text-white shadow-lg border border-orange-500/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold mb-2">
                <Flame className="h-3.5 w-3.5 text-amber-200 fill-amber-200" />
                <span>Peak City Activity</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {selectedCityFilter === "all" ? "Trending Across All Locations" : `Trending in ${selectedCityFilter}`}
              </h2>
              <p className="text-xs sm:text-sm text-orange-100 mt-1 max-w-xl">
                {selectedCityFilter === "all"
                  ? "Showing all community posts across the network with automated Linear SVM spam screening."
                  : `Showing posts from ${selectedCityFilter} with real-time spam detection metrics.`}
              </p>
            </div>

            <div className="flex items-center gap-3 bg-black/20 backdrop-blur-md p-3 rounded-xl border border-white/10 self-start sm:self-auto">
              <div className="text-center px-2">
                <div className="text-xl font-extrabold text-white">{displayedTweets.length}</div>
                <div className="text-[10px] text-orange-200">Total Posts</div>
              </div>
              <div className="h-7 w-px bg-white/20"></div>
              <div className="text-center px-2">
                <div className="text-xl font-extrabold text-emerald-300">{safeCount}</div>
                <div className="text-[10px] text-emerald-100">Safe</div>
              </div>
              <div className="h-7 w-px bg-white/20"></div>
              <div className="text-center px-2">
                <div className="text-xl font-extrabold text-rose-300">{spamCount}</div>
                <div className="text-[10px] text-rose-100">Spam</div>
              </div>
            </div>
          </div>
        </div>

        {/* City Filter Pills */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <span>Filter City:</span>
          </span>

          {/* All Locations Pill */}
          <button
            onClick={() => setSelectedCityFilter("all")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedCityFilter === "all"
                ? "bg-indigo-600 text-white shadow-xs font-bold"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <span>All Locations</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                selectedCityFilter === "all" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
              }`}
            >
              {tweets.length}
            </span>
          </button>

          {cityTrends.map(([cityName, count]) => {
            const isActive = selectedCityFilter.toLowerCase() === cityName.toLowerCase();
            return (
              <button
                key={cityName}
                onClick={() => setSelectedCityFilter(cityName)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-xs font-bold"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                <MapPin className="h-3 w-3" />
                <span>{cityName}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 2-Column Split: Leaderboard & City Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: City Activity Leaderboard (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">City Activity Leaderboard</h3>
              <Flame className="h-4 w-4 text-orange-500" />
            </div>

            {cityTrends.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No location activity recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {cityTrends.map(([cityName, count], idx) => {
                  const percentage = topCityCount > 0 ? Math.round((count / topCityCount) * 100) : 0;
                  const isSelected = selectedCityFilter.toLowerCase() === cityName.toLowerCase();
                  return (
                    <div
                      key={cityName}
                      onClick={() => setSelectedCityFilter(cityName)}
                      className={`p-3 rounded-xl border transition cursor-pointer ${
                        isSelected
                          ? "bg-indigo-50/70 border-indigo-200"
                          : "bg-slate-50/60 border-slate-100 hover:border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-400 font-mono">#{idx + 1}</span>
                          <span>{cityName}</span>
                        </span>
                        <span className="font-bold text-indigo-600">{count} posts</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-1.5 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Trending Posts Feed (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Posts Stream: {selectedCityFilter === "all" ? "All Locations" : selectedCityFilter}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedCityFilter === "all"
                    ? "Real-time community tweets across all geographic sectors"
                    : `Real-time community tweets from ${selectedCityFilter}`}
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                {displayedTweets.length} results
              </span>
            </div>

            {displayedTweets.length === 0 ? (
              <div className="py-14 text-center">
                <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold text-slate-700">No posts in this location</p>
                <p className="text-xs text-slate-400 mt-1">Be the first to post a tweet from this city!</p>
                <button
                  onClick={() => navigate("/post-tweet")}
                  className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition"
                >
                  Post Tweet
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {displayedTweets.map((t) => {
                  const isSpam = t.prediction === "Spam";
                  const isOwner = user?.id && t.owner_user_id === user?.id;
                  return (
                    <div key={t.id} className="py-4 space-y-2 group">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                              isSpam
                                ? "bg-rose-50 text-rose-700 border border-rose-200"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            }`}
                          >
                            {isSpam ? <AlertTriangle className="h-3 w-3" /> : <ShieldCheck className="h-3 w-3" />}
                            {t.prediction}
                          </span>
                          <span className="text-xs font-bold text-slate-900">{t.title}</span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                            isOwner ? "bg-indigo-50 text-indigo-700 border border-indigo-200" : "bg-slate-100 text-slate-500"
                          }`}>
                            {isOwner ? "You (Author)" : "Community Post"}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-slate-700">{t.confidence || 95}% Conf</span>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed break-words">{t.tweet}</p>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{normalizeCity(t.city)}</span>
                        </span>
                        <span>{t.date ? t.date.slice(0, 10) : "Recent"}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
