// On a phone, 127.0.0.1 points to the phone itself. Use the hostname serving
// the frontend so the API works on both this computer and devices on its LAN.
const API = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000`;

export default API;
