import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import API from "../config/api";

export default function Reviews() {

  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [reviews, setReviews] = useState([]);

  const [rating, setRating] = useState(5);

  const [review, setReview] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {

    loadReviews();

  }, []);

  const loadReviews = async () => {

    try {

      const response = await axios.get(`${API}/reviews`);

      setReviews(response.data);

    } catch (error) {

      console.error(error);

      toast.error("Unable to load reviews.");

    }

  };

  const submitReview = async () => {

    if (!review.trim()) {

      toast.error("Please write your review.");

      return;

    }

    setLoading(true);

    try {

      await axios.post(`${API}/reviews`, {

        username: storedUser?.username,

        rating,

        review,

      });

      toast.success("Review Submitted Successfully");

      setReview("");

      setRating(5);

      loadReviews();

    } catch (error) {

      console.error(error);

      toast.error("Failed to submit review.");

    }

    setLoading(false);

  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500 p-8">

      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-8">

          <div className="flex items-center gap-4">

            <button
              onClick={() => navigate("/dashboard")}
              className="bg-white text-indigo-700 px-5 py-3 rounded-xl font-semibold shadow hover:scale-105 transition"
            >
              ← Back
            </button>

            <div>

              <h1 className="text-4xl font-bold text-white">
                Reviews & Feedback
              </h1>

              <p className="text-indigo-100 mt-1">
                Share your experience about the spam detection system.
              </p>

            </div>

          </div>

        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white rounded-2xl shadow-xl p-6 text-center">

            <h2 className="text-4xl font-bold text-indigo-700">
              {reviews.length}
            </h2>

            <p className="text-gray-600 mt-2">
              Total Reviews
            </p>

          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 text-center">

            <h2 className="text-4xl font-bold text-yellow-500">
              ⭐ {rating}
            </h2>

            <p className="text-gray-600 mt-2">
              Your Rating
            </p>

          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 text-center">

            <h2 className="text-2xl font-bold text-green-600">
              {storedUser?.username}
            </h2>

            <p className="text-gray-600 mt-2">
              Logged In User
            </p>

          </div>

        </div>
                <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">

          <h2 className="text-3xl font-bold text-center mb-2">
            Rate Your Experience
          </h2>

          <p className="text-center text-gray-500 mb-8">
            Your feedback helps us improve the AI-Based Spam Detection System.
          </p>

          <div className="flex justify-center gap-4 mb-8">

            {[1, 2, 3, 4, 5].map((star) => (

              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-5xl transition transform hover:scale-125 ${
                  star <= rating
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              >
                ★
              </button>

            ))}

          </div>

          <div className="mb-6">

            <label className="block font-semibold text-lg mb-2">
              Username
            </label>

            <input
              type="text"
              value={storedUser?.username || ""}
              disabled
              className="w-full border rounded-xl p-4 bg-gray-100"
            />

          </div>

          <div className="mb-8">

            <label className="block font-semibold text-lg mb-2">
              Your Review
            </label>

            <textarea
              rows="6"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience about the AI-Based Spam Detection System..."
              className="w-full border rounded-xl p-4 resize-none focus:ring-2 focus:ring-indigo-500"
            />

          </div>

          <div className="flex justify-center">

            <button
              onClick={submitReview}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-xl text-lg font-semibold shadow-lg transition hover:scale-105 disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>

          </div>

        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">

          <div className="flex justify-between items-center mb-8">

            <h2 className="text-3xl font-bold">
              Recent Reviews
            </h2>

            <span className="bg-indigo-600 text-white px-5 py-2 rounded-full font-semibold">
              {reviews.length} Reviews
            </span>

          </div>
          {reviews.length === 0 ? (

            <div className="text-center py-12">

              <h3 className="text-2xl font-semibold text-gray-500">
                No Reviews Yet
              </h3>

              <p className="text-gray-400 mt-2">
                Be the first to share your experience.
              </p>

            </div>

          ) : (

            <div className="space-y-6">

              {reviews.map((item) => (

                <div
                  key={item.id}
                  className="border rounded-2xl p-6 shadow hover:shadow-xl transition bg-gray-50"
                >

                  <div className="flex justify-between items-start">

                    <div className="flex items-center gap-4">

                      <div className="w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold">

                        {item.username?.charAt(0).toUpperCase()}

                      </div>

                      <div>

                        <h3 className="text-xl font-bold">
                          {item.username}
                        </h3>

                        <p className="text-yellow-500 text-lg">
                          {"⭐".repeat(item.rating)}
                        </p>

                      </div>

                    </div>

                    <span className="text-gray-500 text-sm">
                      {item.created_at}
                    </span>

                  </div>

                  <p className="mt-5 text-gray-700 leading-7">
                    {item.review}
                  </p>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>

  );

}