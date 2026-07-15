import Header from "../components/Header";
import PredictionHistory from "../components/PredictionHistory";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import API from "../config/api";

export default function DetectSpam() {

  const navigate = useNavigate();

  const isAdmin = localStorage.getItem("admin") === "true";

  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [history, setHistory] = useState([]);

  const [totalPredictions, setTotalPredictions] = useState(0);
  const [spamCount, setSpamCount] = useState(0);
  const [hamCount, setHamCount] = useState(0);

  useEffect(() => {

    const savedHistory =
      localStorage.getItem("predictionHistory");

    if (savedHistory) {

      setHistory(JSON.parse(savedHistory));

    }

  }, []);

  const detectSpam = async () => {

    setLoading(true);

    try {

      // ---------------- FILE PREDICTION ----------------

      if (selectedFile) {

        const formData = new FormData();

        formData.append("file", selectedFile);

        const response = await axios.post(
          `${API}/predict-file`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setResult(response.data);

        toast.success("File Analysis Completed!");

      }

      // ---------------- SINGLE MESSAGE ----------------

      else {

        if (!text.trim()) {

          toast.error("Please enter a message.");

          setLoading(false);

          return;

        }

        const response = await axios.post(
          `${API}/predict`,
          {
            text,
          }
        );

        setResult(response.data);

        toast.success("Prediction Completed!");

        const newPrediction = {

          message: text,

          prediction: response.data.prediction,

          confidence: response.data.confidence,

          time: new Date().toLocaleString(),

        };

        const updatedHistory =
          [newPrediction, ...history].slice(0, 10);

        setHistory(updatedHistory);

        localStorage.setItem(
          "predictionHistory",
          JSON.stringify(updatedHistory)
        );

        setTotalPredictions((prev) => prev + 1);

        if (response.data.prediction === "Spam") {

          setSpamCount((prev) => prev + 1);

        } else {

          setHamCount((prev) => prev + 1);

        }

      }

    } catch (error) {

      console.error(error);

      toast.error("Unable to connect to backend.");

    }

    setLoading(false);

  };

  const clearAll = () => {

    setText("");

    setResult(null);

    setSelectedFile(null);

    toast.success("Cleared Successfully");

  };
    return (

    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500 p-6">

      <div className="max-w-5xl mx-auto">

        {/* Header */}

        <div className="flex justify-between items-center mb-8">

          <div className="flex items-center gap-4">

            <button
              onClick={() => navigate(isAdmin ? "/admin" : "/dashboard")}
              className="bg-white text-indigo-700 hover:bg-gray-100 px-5 py-3 rounded-xl font-semibold shadow-lg transition"
            >
              ← Back
            </button>

            <Header />

          </div>

        </div>

        {/* Statistics */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

          <div className="bg-blue-100 rounded-2xl shadow-lg p-5 text-center">

            <h2 className="text-3xl font-bold text-blue-700">
              {totalPredictions}
            </h2>

            <p className="text-gray-700 font-semibold mt-2">
              Total Predictions
            </p>

          </div>

          <div className="bg-red-100 rounded-2xl shadow-lg p-5 text-center">

            <h2 className="text-3xl font-bold text-red-600">
              {spamCount}
            </h2>

            <p className="text-gray-700 font-semibold mt-2">
              Spam Detected
            </p>

          </div>

          <div className="bg-green-100 rounded-2xl shadow-lg p-5 text-center">

            <h2 className="text-3xl font-bold text-green-600">
              {hamCount}
            </h2>

            <p className="text-gray-700 font-semibold mt-2">
              Safe Messages
            </p>

          </div>

        </div>

        {/* Main Card */}

        <div className="bg-white rounded-3xl shadow-2xl p-8">

          <textarea
            rows="6"
            className="w-full border rounded-xl p-4 text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Type your message here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {/* File Upload */}

          <div className="mt-5">

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload a Text File (.txt)
            </label>

            <input
              type="file"
              accept=".txt"
              onChange={(e) => {

                const file = e.target.files[0];

                if (!file) return;

                setSelectedFile(file);

                const reader = new FileReader();

                reader.onload = (event) => {

                  setText(event.target.result);

                };

                reader.readAsText(file);

              }}
              className="w-full border border-gray-300 rounded-xl p-3 cursor-pointer"
            />

            {selectedFile && (

              <div className="mt-3 p-3 bg-green-100 border border-green-300 rounded-xl">

                <p className="text-green-700 font-medium">
                  📄 Selected File: {selectedFile.name}
                </p>

              </div>

            )}

          </div>

          {/* Buttons */}

          <div className="flex gap-4 mt-6">

            <button
              onClick={detectSpam}
              disabled={loading}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl text-lg font-semibold transition"
            >
              {loading ? "Analyzing..." : "Detect Spam"}
            </button>

            <button
              onClick={clearAll}
              className="bg-gray-300 hover:bg-gray-400 px-6 rounded-xl font-semibold transition"
            >
              Clear
            </button>

          </div>
                   {/* Prediction Result */}

          {result && !result.results && (

            <div className="mt-8 bg-gray-50 rounded-2xl p-6 shadow-md">

              <div className="flex justify-between items-center">

                <h2 className="text-2xl font-bold">
                  {result.prediction === "Spam"
                    ? "🚨 Spam Detected"
                    : "✅ Safe Message"}
                </h2>

                <span
                  className={`px-4 py-2 rounded-full text-white font-semibold ${
                    result.prediction === "Spam"
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                >
                  {result.prediction}
                </span>

              </div>

              <div className="mt-6">

                <div className="flex justify-between mb-2">

                  <span className="font-medium">
                    Confidence
                  </span>

                  <span>
                    {result.confidence}%
                  </span>

                </div>

                <div className="w-full bg-gray-200 rounded-full h-4">

                  <div
                    className={`h-4 rounded-full ${
                      result.prediction === "Spam"
                        ? "bg-red-500"
                        : "bg-green-500"
                    }`}
                    style={{
                      width: `${result.confidence}%`,
                    }}
                  />

                </div>

              </div>

              <div className="mt-6 p-4 rounded-xl bg-white border">

                <h3 className="font-semibold text-lg mb-2">
                  AI Explanation
                </h3>

                <p className="text-gray-600">

                  {result.prediction === "Spam"

                    ? "⚠️ This message appears to contain spam-like characteristics. Avoid clicking unknown links or sharing sensitive information."

                    : "🎉 This message appears safe according to the trained machine learning model."}

                </p>

              </div>

            </div>

          )}

          {/* File Analysis */}

          {result?.results && (

            <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">

              <h2 className="text-2xl font-bold mb-4">
                📄 File Analysis
              </h2>

              <div className="overflow-x-auto">

                <table className="w-full border-collapse">

                  <thead>

                    <tr className="bg-gray-100">

                      <th className="border p-3">
                        Message
                      </th>

                      <th className="border p-3">
                        Prediction
                      </th>

                      <th className="border p-3">
                        Confidence
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {result.results.map((item, index) => (

                      <tr key={index}>

                        <td className="border p-3">
                          {item.message}
                        </td>

                        <td
                          className={`border p-3 font-bold ${
                            item.prediction === "Spam"
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {item.prediction}
                        </td>

                        <td className="border p-3">
                          {item.confidence}%
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

              <div className="mt-6 grid grid-cols-3 gap-4">

                <div className="bg-blue-100 rounded-xl p-4 text-center">

                  <h3 className="text-2xl font-bold">
                    {result.total}
                  </h3>

                  <p>Total</p>

                </div>

                <div className="bg-red-100 rounded-xl p-4 text-center">

                  <h3 className="text-2xl font-bold">
                    {result.spam}
                  </h3>

                  <p>Spam</p>

                </div>

                <div className="bg-green-100 rounded-xl p-4 text-center">

                  <h3 className="text-2xl font-bold">
                    {result.ham}
                  </h3>

                  <p>Ham</p>

                </div>

              </div>

            </div>

          )}

          {/* Prediction History */}

          {history.length > 0 && (

            <PredictionHistory history={history} />

          )}

        </div>

      </div>

    </div>

  );

} 