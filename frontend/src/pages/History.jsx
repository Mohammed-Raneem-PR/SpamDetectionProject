import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import API from "../config/api";
import AppLayout from "../components/AppLayout";
import {
  History as HistoryIcon,
  Search,
  Filter,
  ShieldAlert,
  ShieldCheck,
  MapPin,
  Calendar,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [predictionFilter, setPredictionFilter] = useState("All");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    loadHistory();
  }, [user?.id]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      if (!user?.id) throw new Error("No signed-in user");
      const response = await axios.get(`${API}/tweets`, {
        params: { user_id: user.id },
      });
      setHistory(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load history.");
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter(
    (item) =>
      (predictionFilter === "All" || item.prediction === predictionFilter) &&
      (item.title?.toLowerCase().includes(search.toLowerCase()) ||
        item.tweet?.toLowerCase().includes(search.toLowerCase()) ||
        item.city?.toLowerCase().includes(search.toLowerCase()))
  );

  const spamCount = history.filter((h) => h.prediction === "Spam").length;
  const safeCount = history.filter((h) => h.prediction === "Ham").length;

  return (
    <AppLayout
      title="Prediction & Audit History"
      subtitle="Complete chronological log of analyzed posts with confidence scores and verdict tags"
      actions={
        <button
          onClick={loadHistory}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 transition shadow-xs"
        >
          <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
          <span>Refresh</span>
        </button>
      }
    >
      <div className="space-y-5">
        {/* Top Summary & Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search history by title, keywords, or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2">
              <div className="flex items-center p-1 rounded-xl bg-slate-100 text-xs font-semibold">
                <button
                  onClick={() => setPredictionFilter("All")}
                  className={`px-3 py-1 rounded-lg transition ${
                    predictionFilter === "All"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  All ({history.length})
                </button>
                <button
                  onClick={() => setPredictionFilter("Ham")}
                  className={`px-3 py-1 rounded-lg transition ${
                    predictionFilter === "Ham"
                      ? "bg-white text-emerald-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Safe ({safeCount})
                </button>
                <button
                  onClick={() => setPredictionFilter("Spam")}
                  className={`px-3 py-1 rounded-lg transition ${
                    predictionFilter === "Spam"
                      ? "bg-white text-rose-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Spam ({spamCount})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {loading ? (
            <div className="py-20 text-center">
              <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700">Loading prediction history...</p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="py-16 text-center">
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                <HistoryIcon className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No History Records Found</h3>
              <p className="text-xs text-slate-400 mt-1">
                Your post classifications will appear in this audit log automatically.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4 font-bold">Title</th>
                    <th className="py-3.5 px-4 font-bold">Message Content</th>
                    <th className="py-3.5 px-4 font-bold">Location</th>
                    <th className="py-3.5 px-4 font-bold">Verdict</th>
                    <th className="py-3.5 px-4 font-bold">Confidence</th>
                    <th className="py-3.5 px-4 font-bold">Logged Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredHistory.map((item) => {
                    const isSpam = item.prediction === "Spam";
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                          {item.title}
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 max-w-md">
                          <p className="line-clamp-2 leading-relaxed">{item.tweet}</p>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-slate-400" />
                            <span>{item.city || "—"}</span>
                          </span>
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
                            {item.prediction}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-800 whitespace-nowrap">
                          {item.confidence || 95}%
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                          <span className="flex items-center gap-1 text-[11px]">
                            <Calendar className="h-3 w-3 text-slate-400" />
                            <span>{item.date ? item.date.slice(0, 10) : "Recent"}</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
