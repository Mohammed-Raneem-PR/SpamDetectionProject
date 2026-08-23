import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import API from "../config/api";

function formatRelativeTime(dateValue) {
  // SQLite CURRENT_TIMESTAMP is UTC but has no timezone suffix.
  const date = new Date(`${dateValue.replace(" ", "T")}Z`);
  const differenceInSeconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));

  if (differenceInSeconds < 60) return "Just now";

  const intervals = [
    [31536000, "year"],
    [2592000, "month"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
  ];

  for (const [seconds, label] of intervals) {
    const amount = Math.floor(differenceInSeconds / seconds);
    if (amount >= 1) return `${amount} ${label}${amount === 1 ? "" : "s"} ago`;
  }

  return "Just now";
}

export default function Trending() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const response = await axios.get(`${API}/tweets`, {
          params: { user_id: user?.id },
        });
        setTweets(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Unable to load trending tweets.");
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, []);

  const cityTrends = useMemo(() => {
    const counts = tweets.reduce((result, tweet) => {
      const city = tweet.city?.trim() || "Unknown city";
      result[city] = (result[city] || 0) + 1;
      return result;
    }, {});

    return Object.entries(counts)
      .sort(([, firstCount], [, secondCount]) => secondCount - firstCount)
      .slice(0, 5);
  }, [tweets]);

  const trendingTweets = useMemo(() => {
    if (cityTrends.length === 0) return [];

    const highestPostCount = cityTrends[0][1];
    const trendingCities = new Set(
      cityTrends
        .filter(([, count]) => count === highestPostCount)
        .map(([city]) => city)
    );

    return tweets.filter((tweet) => {
      const city = tweet.city?.trim() || "Unknown city";
      return trendingCities.has(city);
    });
  }, [cityTrends, tweets]);

  const spamCount = trendingTweets.filter((tweet) => tweet.prediction === "Spam").length;
  const hamCount = trendingTweets.length - spamCount;

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Trending</h1>
            <p className="text-gray-600 mt-2">Tweets from the city or cities with the most activity.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-3 rounded-lg font-semibold"
          >
            ← Back to dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-gray-500 font-medium">Trending posts</p>
            <p className="text-4xl font-bold mt-2 text-indigo-600">{trendingTweets.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-gray-500 font-medium">Spam detected</p>
            <p className="text-4xl font-bold mt-2 text-red-600">{spamCount}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-gray-500 font-medium">Legitimate posts</p>
            <p className="text-4xl font-bold mt-2 text-green-600">{hamCount}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-5">Trending tweets</h2>
            {loading ? (
              <p className="text-gray-500 py-8 text-center">Loading tweets…</p>
            ) : trendingTweets.length === 0 ? (
              <p className="text-gray-500 py-8 text-center">No trending tweets yet.</p>
            ) : (
              <div className="space-y-4">
                {trendingTweets.slice(0, 5).map((tweet) => (
                  <article key={tweet.id} className="border rounded-lg p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-bold text-lg">{tweet.title}</h3>
                        <p className="text-gray-600 mt-1 break-words">{tweet.tweet}</p>
                      </div>
                      <span
                        className={`shrink-0 px-3 py-1 rounded-full text-sm font-semibold text-white ${
                          tweet.prediction === "Spam" ? "bg-red-500" : "bg-green-600"
                        }`}
                      >
                        {tweet.prediction}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-3">
                      {tweet.city} · {formatRelativeTime(tweet.date)}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>

          <aside className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-5">Top cities</h2>
            {loading ? (
              <p className="text-gray-500">Loading…</p>
            ) : cityTrends.length === 0 ? (
              <p className="text-gray-500">No city data yet.</p>
            ) : (
              <ol className="space-y-4">
                {cityTrends.map(([city, count], index) => (
                  <li key={city} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <span className="font-medium">#{index + 1} {city}</span>
                    <span className="bg-indigo-100 text-indigo-700 rounded-full px-3 py-1 text-sm font-semibold">
                      {count} {count === 1 ? "post" : "posts"}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
