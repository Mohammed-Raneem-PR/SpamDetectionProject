import { Navigate } from "react-router-dom";

export default function AdminProtectedRoute({ children }) {
  const admin = localStorage.getItem("admin");

  if (admin !== "true") {
    return <Navigate to="/" replace />;
  }

  return children;
}