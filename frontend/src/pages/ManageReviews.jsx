import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../config/api";
import AdminLayout from "../components/AdminLayout";
import {
  Star,
  Search,
  Trash2,
  Calendar,
  RefreshCw,
  MessageSquare,
} from "lucide-react";

export default function ManageReviews() {
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/reviews`);
      setReviews(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load reviews.");
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      const response = await axios.delete(`${API}/reviews/${id}`);
      toast.success(response.data.message || "Review deleted.");
      loadReviews();
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete review.");
    }
  };

  const filteredReviews = reviews.filter((item) =>
    item.username?.toLowerCase().includes(search.toLowerCase()) ||
    item.review?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout
      title="Feedback Moderation"
      subtitle="Review community satisfaction ratings and moderate user feedback"
      actions={
        <button
          onClick={loadReviews}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 transition shadow-xs"
        >
          <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
          <span>Refresh</span>
        </button>
      }
    >
      <div className="space-y-5">
        {/* Search Toolbar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search reviews by username or feedback text..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
            </div>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 self-start sm:self-auto">
              Total: {reviews.length} Reviews
            </span>
          </div>
        </div>

        {/* Reviews Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {loading ? (
            <div className="py-20 text-center">
              <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700">Loading reviews...</p>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="py-16 text-center">
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                <Star className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No Reviews Found</h3>
              <p className="text-xs text-slate-400 mt-1">Try adjusting your search query.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4 font-bold">Username</th>
                    <th className="py-3.5 px-4 font-bold">Rating</th>
                    <th className="py-3.5 px-4 font-bold">Review Text</th>
                    <th className="py-3.5 px-4 font-bold">Date</th>
                    <th className="py-3.5 px-4 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredReviews.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold uppercase">
                            {item.username?.charAt(0) || "U"}
                          </div>
                          <span className="font-bold text-slate-900">{item.username}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3.5 w-3.5 ${
                                Number(item.rating) >= star
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-200"
                              }`}
                            />
                          ))}
                          <span className="ml-1 text-[11px] font-bold text-slate-600">
                            {item.rating}/5
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 max-w-md">
                        <p className="line-clamp-2 leading-relaxed">{item.review}</p>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        <span className="flex items-center gap-1 text-[11px]">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          <span>{item.date || "Recent"}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => deleteReview(item.id)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200/60 transition inline-flex items-center gap-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}