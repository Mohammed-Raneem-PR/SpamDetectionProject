const PredictionHistory = ({ history }) => {
  if (history.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-3xl font-bold mb-4">
        📜 Prediction History
      </h2>

      <div className="space-y-4">
        {history.map((item, index) => (
          <div
            key={index}
            className="border rounded-xl p-4 shadow"
          >
            <div className="flex justify-between items-center mb-2">
              <span
                className={`font-bold ${
                  item.prediction === "Spam"
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {item.prediction === "Spam"
                  ? "🚨 Spam"
                  : "✅ Ham"}
              </span>

              <span className="font-semibold">
                {item.confidence.toFixed(2)}%
              </span>
            </div>

            <p>{item.message}</p>

            <p className="text-gray-500 text-sm mt-2">
              {item.time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PredictionHistory;