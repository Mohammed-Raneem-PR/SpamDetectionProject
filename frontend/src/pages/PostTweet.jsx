import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import API from "../config/api";
import AppLayout from "../components/AppLayout";
import { normalizeCity } from "../utils/cityUtils";
import {
  Send,
  MapPin,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Eye,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function PostTweet() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [title, setTitle] = useState("");
  const [tweet, setTweet] = useState("");
  const [city, setCity] = useState("");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const popularCities = ["Bangalore", "New York", "London", "San Francisco", "Mumbai", "Tokyo"];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !tweet.trim() || !city.trim()) {
      toast.error("Please fill in the title, tweet content, and city.");
      return;
    }

    if (!user?.id) {
      toast.error("Please log in again before posting.");
      return;
    }

    setLoading(true);

    try {
      const normalizedCity = normalizeCity(city);
      const response = await axios.post(`${API}/post-tweet`, {
        title: title.trim(),
        text: tweet.trim(),
        city: normalizedCity,
        user_id: user.id,
      });

      setResult(response.data);
      toast.success(response.data.message || "Tweet posted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to post tweet. Backend connection issue.");
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setTitle("");
    setTweet("");
    setCity("");
    setResult(null);
  };

  return (
    <AppLayout
      title="Create Social Post"
      subtitle="Publish new posts with automated AI spam detection and real-time feed preview"
      actions={
        <button
          onClick={() => navigate("/tweets")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 transition shadow-xs"
        >
          <MessageSquare className="h-3.5 w-3.5 text-slate-500" />
          <span>View All Tweets</span>
        </button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Post Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Post Composer</h2>
              <p className="text-xs text-slate-500 mt-0.5">Content is scanned with calibrated Linear SVM upon submission</p>
            </div>
            <button
              type="button"
              onClick={clearForm}
              className="text-xs text-slate-400 hover:text-rose-500 font-medium"
            >
              Reset form
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title Input */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Post Headline / Title
              </label>
              <input
                type="text"
                placeholder="e.g. Campus Tech Workshop 2026 Announcement"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
            </div>

            {/* City / Location Input */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                City / Region
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Bangalore, London, New York..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>

              {/* City quick chips */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="text-[10px] text-slate-400 font-medium">Quick suggestions:</span>
                {popularCities.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCity(c)}
                    className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 border border-slate-200/80 transition"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Tweet Content */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Tweet Content
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {tweet.length} / 280
                </span>
              </div>
              <textarea
                rows="5"
                placeholder="Share an update, announce an event, or discuss a topic..."
                value={tweet}
                onChange={(e) => setTweet(e.target.value)}
                maxLength={280}
                className="w-full rounded-xl border border-slate-200 p-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition leading-relaxed resize-y"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={loading || !title.trim() || !tweet.trim() || !city.trim()}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition shadow-md ${
                  loading || !title.trim() || !tweet.trim() || !city.trim()
                    ? "bg-slate-300 cursor-not-allowed shadow-none"
                    : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/25"
                }`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Analyzing & Posting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Post Tweet with AI Inspection</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Feed Preview & Result (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Real-Time Live Feed Card Preview */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
                <Eye className="h-4 w-4" />
                <span>Live Feed Preview</span>
              </div>
              <span className="text-[10px] text-slate-400">Card rendering</span>
            </div>

            {/* Preview Box styled like modern social post */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold uppercase">
                  {user?.full_name?.charAt(0) || user?.username?.charAt(0) || "U"}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {user?.full_name || user?.username || "Authenticated User"}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    @{user?.username || "user"} · {city ? normalizeCity(city) : "Global"}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  {title || "Your Post Headline will appear here"}
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed break-words">
                  {tweet || "Type your tweet in the form on the left to see an instant real-time preview of how other users will see your post in the feed."}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
                <span>Just now</span>
                <span className="font-medium text-indigo-600">Pending AI Verification</span>
              </div>
            </div>
          </div>

          {/* AI Result Card after Submission */}
          {result && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
                      result.prediction === "Spam"
                        ? "bg-rose-100 text-rose-800 border border-rose-200"
                        : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    }`}
                  >
                    {result.prediction === "Spam" ? (
                      <>
                        <AlertTriangle className="h-4 w-4 text-rose-600" />
                        <span>Spam Flagged</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        <span>Safe Message</span>
                      </>
                    )}
                  </span>
                </div>
                <span className="text-xl font-extrabold text-slate-900">
                  {result.confidence}% Confidence
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {result.prediction === "Spam"
                  ? "Your post was detected as potential spam or promotional content and marked accordingly."
                  : "Your post passed AI evaluation and is verified safe for the community feed."}
              </p>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/tweets")}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <span>Go to Feed</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={clearForm}
                  className="text-xs font-medium text-slate-400 hover:text-slate-600"
                >
                  Compose Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
