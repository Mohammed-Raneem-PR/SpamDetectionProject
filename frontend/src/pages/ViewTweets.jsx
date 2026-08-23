import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import API from "../config/api";
import { useNavigate } from "react-router-dom";

export default function ViewTweets() {
  const navigate = useNavigate();

  const [tweets, setTweets] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchTweets();
  }, []);

  const fetchTweets = async () => {
    try {
      if (!user?.id) throw new Error("No signed-in user");
      const response = await axios.get(`${API}/tweets`, {
        params: { user_id: user.id },
      });
      setTweets(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Unable to fetch tweets.");
    }

    setLoading(false);
  };

  const deleteTweet = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this tweet?"
    );

    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `${API}/tweets/${id}`,
        { params: { user_id: user?.id } }
      );

      toast.success(response.data.message);

      fetchTweets();

    } catch (error) {

      console.error(error);

      toast.error("Failed to delete tweet.");

    }
  };

  const filteredTweets = tweets.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.tweet.toLowerCase().includes(search.toLowerCase()) ||
      item.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-5 sm:p-8 lg:p-10">

      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mb-6">

        <div className="flex flex-wrap items-center gap-4">

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-lg"
          >
            ← Back
          </button>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            View All Tweets
          </h1>

        </div>

        <input
          type="text"
          placeholder="Search..."
          className="border rounded-lg p-3 w-full lg:w-80"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold">
          Total Tweets : {tweets.length}
        </h2>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">

        <table className="w-full">

          <thead className="bg-indigo-600 text-white">

            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Tweet</th>
              <th className="p-4">City</th>
              <th className="p-4">Prediction</th>
              <th className="p-4">Confidence</th>
              <th className="p-4">Date</th>
              <th className="p-4">Action</th>
            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>
                <td colSpan="7" className="text-center p-8">
                  Loading...
                </td>
              </tr>

            ) : filteredTweets.length === 0 ? (

              <tr>
                <td colSpan="7" className="text-center p-8">
                  No Tweets Found
                </td>
              </tr>

            ) : (

              filteredTweets.map((item) => (

                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-100"
                >

                  <td className="p-4">{item.title}</td>

                  <td className="p-4">{item.tweet}</td>

                  <td className="p-4">{item.city}</td>

                  <td className="p-4">

                    <span
                      className={`px-4 py-1 rounded-full text-white font-semibold ${
                        item.prediction === "Spam"
                          ? "bg-red-500"
                          : "bg-green-500"
                      }`}
                    >
                      {item.prediction}
                    </span>

                  </td>

                  <td className="p-4">
                    {item.confidence}%
                  </td>

                  <td className="p-4">
                    {item.date}
                  </td>

                  <td className="p-4">

                    <button
                      onClick={() => deleteTweet(item.id)}
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
