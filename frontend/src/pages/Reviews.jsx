import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import API from "../config/api";
import AppLayout from "../components/AppLayout";
import {
  Star,
  Send,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  User,
} from "lucide-react";

export default function Reviews() {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setFetching(true);
    try {
      const response = await axios.get(`${API}/reviews`);
      setReviews(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load reviews.");
    } finally {
      setFetching(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!review.trim()) {
      toast.error("Please enter your feedback text.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API}/reviews`, {
        username: storedUser?.username || "Community User",
        rating,
        review: review.trim(),
      });

      toast.success("Thank you! Review submitted successfully.");
      setReview("");
      setRating(5);
      loadReviews();
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  // Average Rating
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / reviews.length).toFixed(1)
      : "5.0";

  return (
    <AppLayout
      title="Community Reviews & Feedback"
      subtitle="Share your experience and evaluate community feedback on our ML spam detection accuracy"
    >
      <div className="space-y-6">
        {/* Top Summary Banner */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-800 rounded-2xl p-6 sm:p-7 text-white shadow-md border border-indigo-700/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-semibold mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Verified System Feedback</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">User Satisfaction & Ratings</h2>
              <p className="text-xs sm:text-sm text-indigo-100/90 mt-1 max-w-lg">
                Help us continuously improve model performance and safeguard accuracy by submitting your evaluation.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/15 self-start sm:self-auto">
              <div className="text-center">
                <div className="text-3xl font-extrabold text-amber-300">{avgRating}</div>
                <div className="flex items-center gap-0.5 justify-center mt-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-3 w-3 fill-amber-300 text-amber-300" />
                  ))}
                </div>
              </div>
              <div className="h-8 w-px bg-white/20"></div>
              <div>
                <div className="text-base font-bold text-white">{reviews.length}</div>
                <div className="text-[11px] text-indigo-200">Reviews</div>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Split: Submit Form & Reviews List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Submit Feedback</h3>
              <p className="text-xs text-slate-500 mt-0.5">Rate detection precision and report your experience</p>
            </div>

            <form onSubmit={submitReview} className="space-y-4">
              {/* Star Rating Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Overall Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 rounded-lg hover:scale-110 transition"
                    >
                      <Star
                        className={`h-7 w-7 transition-colors ${
                          (hoverRating || rating) >= star
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-bold text-slate-700">
                    {rating} out of 5 stars
                  </span>
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Your Comments
                </label>
                <textarea
                  rows="5"
                  placeholder="Share details about model accuracy, false positives, or UI usability..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition leading-relaxed resize-y"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !review.trim()}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition shadow-md ${
                  loading || !review.trim()
                    ? "bg-slate-300 cursor-not-allowed shadow-none"
                    : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/25"
                }`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Submitting Review...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Submit Review</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Reviews Stream (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Community Feedback</h3>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                {reviews.length} reviews
              </span>
            </div>

            {fetching ? (
              <div className="py-16 text-center">
                <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-700">Loading reviews...</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="py-14 text-center">
                <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold text-slate-700">No reviews submitted yet</p>
                <p className="text-xs text-slate-400 mt-1">Be the first to share your feedback using the form on the left!</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {reviews.map((r) => (
                  <div key={r.id || r._id} className="py-4 space-y-2 group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center text-xs font-bold uppercase">
                          {r.username?.charAt(0) || "U"}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">
                            {r.username || "Verified User"}
                          </div>
                          <div className="flex items-center gap-0.5 mt-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${
                                  Number(r.rating) >= star
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-slate-200"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {r.date || "Verified"}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed pl-10 break-words">
                      {r.review}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}