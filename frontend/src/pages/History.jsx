import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import API from "../config/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [predictionFilter, setPredictionFilter] = useState("All");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      if (!user?.id) throw new Error("No signed-in user");
      const response = await axios.get(`${API}/tweets`, {
        params: { user_id: user.id },
      });
      setHistory(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load history.");
    }

    setLoading(false);
  };

  const filteredHistory = history.filter(
    (item) =>
      (predictionFilter === "All" || item.prediction === predictionFilter) &&
      (item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.tweet.toLowerCase().includes(search.toLowerCase()) ||
        item.city.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex min-h-screen bg-slate-50">

      <Sidebar />

      <div className="flex-1 md:ml-64">

        <Navbar />

        <main className="p-5 pb-24 sm:p-8 lg:p-10 md:pb-10 max-w-7xl mx-auto">

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
            Prediction History
          </h1>

          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">

              <h2 className="text-2xl font-semibold">
                Total Predictions : {history.length}
              </h2>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <select
                  className="border rounded-lg p-3 bg-white"
                  value={predictionFilter}
                  onChange={(e) => setPredictionFilter(e.target.value)}
                  aria-label="Filter prediction history by result"
                >
                  <option value="All">All results</option>
                  <option value="Spam">Spam</option>
                  <option value="Ham">Ham</option>
                </select>

                <input
                  type="text"
                  placeholder="Search..."
                  className="border rounded-lg p-3 w-full sm:w-80"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

            </div>

          </div>

          <div className="overflow-x-auto bg-white rounded-xl shadow-lg">

            <table className="w-full">

              <thead className="bg-purple-600 text-white">

                <tr>

                  <th className="p-4">Title</th>
                  <th className="p-4">Tweet</th>
                  <th className="p-4">City</th>
                  <th className="p-4">Prediction</th>
                  <th className="p-4">Confidence</th>
                  <th className="p-4">Date</th>

                </tr>

              </thead>

              <tbody>

                {loading ? (

                  <tr>
                    <td colSpan="6" className="text-center p-8">
                      Loading...
                    </td>
                  </tr>

                ) : filteredHistory.length === 0 ? (

                  <tr>
                    <td colSpan="6" className="text-center p-8">
                      No Prediction History Found
                    </td>
                  </tr>

                ) : (

                  filteredHistory.map((item) => (

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

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </main>

      </div>

    </div>
  );
}
