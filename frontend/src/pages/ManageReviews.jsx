import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import API from "../config/api";
import { useNavigate } from "react-router-dom";

export default function ManageReviews() {

  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

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

    setLoading(false);

  };

  const deleteReview = async (id) => {

    if (!window.confirm("Delete this review?")) return;

    try {

      const response = await axios.delete(
        `${API}/reviews/${id}`
      );

      toast.success(response.data.message);

      loadReviews();

    } catch (error) {

      console.error(error);

      toast.error("Unable to delete review.");

    }

  };

  const filteredReviews = reviews.filter((item) =>
    item.username.toLowerCase().includes(search.toLowerCase()) ||
    item.review.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <div className="min-h-screen bg-gray-100 p-8">

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-4xl font-bold">
            ⭐ Manage Reviews
          </h1>

          <p className="text-gray-500 mt-2">
            View and manage user feedback.
          </p>

        </div>

        <button
          onClick={() => navigate("/admin")}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg"
        >
          ← Back
        </button>

      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">

        <div className="flex justify-between items-center">

          <h2 className="text-2xl font-semibold">
            Total Reviews : {reviews.length}
          </h2>

          <input
            type="text"
            placeholder="Search reviews..."
            className="border rounded-lg p-3 w-80"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

      </div>
            <div className="overflow-x-auto bg-white rounded-xl shadow-lg">

        <table className="w-full">

          <thead className="bg-indigo-600 text-white">

            <tr>

              <th className="p-4">Username</th>
              <th className="p-4">Rating</th>
              <th className="p-4">Review</th>
              <th className="p-4">Date</th>
              <th className="p-4">Action</th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td colSpan="5" className="text-center p-8">
                  Loading...
                </td>

              </tr>

            ) : filteredReviews.length === 0 ? (

              <tr>

                <td colSpan="5" className="text-center p-8">
                  No Reviews Found
                </td>

              </tr>

            ) : (

              filteredReviews.map((item) => (

                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-100"
                >

                  <td className="p-4 font-semibold">
                    {item.username}
                  </td>

                  <td className="p-4 text-yellow-500">
                    {"⭐".repeat(item.rating)}
                  </td>

                  <td className="p-4">
                    {item.review}
                  </td>

                  <td className="p-4">
                    {item.created_at}
                  </td>

                  <td className="p-4">

                    <button
                      onClick={() => deleteReview(item.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}