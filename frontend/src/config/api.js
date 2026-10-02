// Automatically resolve API URL:
// - If VITE_API_URL is set, use it.
// - If running on Vite dev server (port 5173), route to backend port 8000.
// - In single-service production deployment (same origin), use relative paths ("").
const API =
  import.meta.env.VITE_API_URL ||
  (window.location.port === "5173"
    ? `http://${window.location.hostname}:8000`
    : "");

export default API;
