import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
const user = localStorage.getItem("user");

const admin = localStorage.getItem("admin");

if (!user && admin !== "true") {

  return <Navigate to="/" replace />;

}

return children;
}