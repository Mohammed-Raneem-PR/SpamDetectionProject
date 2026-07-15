import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import API from "../config/api";
import { useNavigate } from "react-router-dom";

export default function PostTweet() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [tweet, setTweet] = useState("");
  const [city, setCity] = useState("");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tweet.trim()) {
      toast.error("Please enter a tweet.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API}/predict`,
        {
          title,
          text: tweet,
          city,
        }
      );

      setResult(response.data);

    } catch (error) {
      console.error(error);
      toast.error("Backend Connection Failed!");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">

        <div className="flex justify-between items-center mb-8">

          <div className="flex items-center gap-4">

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-lg"
            >
              ← Back
            </button>

            <h1 className="text-4xl font-bold">
              Post Your Tweet
            </h1>

          </div>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="mb-5">

            <label className="font-semibold">
              Tweet Title
            </label>

            <input
              type="text"
              className="w-full border rounded-lg p-3 mt-2"
              placeholder="Enter your tweet title here..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

          </div>

          <div className="mb-5">

            <label className="font-semibold">
              Tweet Description
            
            </label>

            <textarea
              rows="6"
              className="w-full border rounded-lg p-3 mt-2"
              placeholder="Enter your tweet here..."
              value={tweet}
              onChange={(e) => setTweet(e.target.value)}
            />

          </div>

          <div className="mb-6">

            <label className="font-semibold">
              City
            </label>

            <input
              type="text"
              className="w-full border rounded-lg p-3 mt-2"
              placeholder="Enter your city..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold p-4 rounded-lg"
          >
            {loading ? "Detecting..." : "Submit Tweet"}
          </button>

        </form>
                {result && (

          <div className="mt-8 bg-gray-100 rounded-lg p-6">

            <h2 className="text-2xl font-bold mb-4">
              Prediction Result
            </h2>

            <p className="text-lg mb-3">
              <strong>Prediction:</strong>{" "}
              <span
                className={
                  result.prediction === "Spam"
                    ? "text-red-600 font-bold"
                    : "text-green-600 font-bold"
                }
              >
                {result.prediction}
              </span>
            </p>

            <p className="text-lg">
              <strong>Confidence:</strong>{" "}
              {result.confidence}%
            </p>

            <div className="mt-6">

              <div className="flex justify-between mb-2">
                <span className="font-medium">
                  Confidence Score
                </span>

                <span>
                  {result.confidence}%
                </span>
              </div>

              <div className="w-full bg-gray-300 rounded-full h-4">

                <div
                  className={`h-4 rounded-full ${
                    result.prediction === "Spam"
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{
                    width: `${result.confidence}%`,
                  }}
                ></div>

              </div>

            </div>

            <div className="mt-6 p-4 rounded-xl bg-white border">

              <h3 className="font-semibold text-lg mb-2">
                AI Explanation
              </h3>

              <p className="text-gray-600">

                {result.prediction === "Spam"
                  ? "⚠️ This tweet contains characteristics commonly associated with spam messages. Users should avoid clicking unknown links or sharing personal information."
                  : "✅ This tweet appears to be a legitimate message according to the trained machine learning model."}

              </p>

            </div>

          </div>

        )}

      </div>

    </div>

  );
}