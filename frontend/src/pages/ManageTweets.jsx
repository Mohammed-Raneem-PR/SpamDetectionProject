import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import API from "../config/api";

export default function ManageTweets() {
  const navigate = useNavigate();

  const [tweets, setTweets] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTweets();
  }, []);

  const fetchTweets = async () => {
    try {
      const response = await axios.get(`${API}/tweets`);
      setTweets(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Unable to fetch tweets.");
    }

    setLoading(false);
  };

  const deleteTweet = async (id) => {
    if (!window.confirm("Delete this tweet?")) return;

    try {
      const response = await axios.delete(
        `${API}/tweets/${id}`
      );

      toast.success(response.data.message);

      fetchTweets();

    } catch (error) {

      console.error(error);

      toast.error("Delete Failed");

    }
  };

  const filteredTweets = tweets.filter((item) => {

    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.tweet.toLowerCase().includes(search.toLowerCase()) ||
      item.city.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" ||
      item.prediction === filter;

    return matchesSearch && matchesFilter;

  });

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-4xl font-bold">
          👨‍💼 Manage Tweets
        </h1>

        <button
          onClick={() => navigate("/admin")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-lg"
        >
          Back
        </button>

      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">

        <div className="flex flex-wrap gap-4 justify-between">

          <h2 className="text-2xl font-semibold">
            Total Tweets : {tweets.length}
          </h2>

          <input
            type="text"
            placeholder="Search..."
            className="border rounded-lg p-3"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-lg p-3"
          >
            <option>All</option>
            <option>Spam</option>
            <option>Ham</option>
          </select>

        </div>

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
                      className={`px-4 py-1 rounded-full text-white ${
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