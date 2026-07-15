import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import DetectSpam from "./pages/DetectSpam";
import History from "./pages/History";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import PostTweet from "./pages/PostTweet";
import ViewTweets from "./pages/ViewTweets";
import Reviews from "./pages/Reviews";

import AdminDashboard from "./pages/AdminDashboard";
import ManageUsers from "./pages/ManageUsers";
import ManageTweets from "./pages/ManageTweets";
import ManageReviews from "./pages/ManageReviews";

function App() {
  return (
    <Routes>

      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      

      {/* User Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/detect"
        element={
          <ProtectedRoute>
            <DetectSpam />
          </ProtectedRoute>
        }
      />

      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/post-tweet"
        element={
          <ProtectedRoute>
            <PostTweet />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tweets"
        element={
          <ProtectedRoute>
            <ViewTweets />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reviews"
        element={
          <ProtectedRoute>
            <Reviews />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <AdminProtectedRoute>
            <ManageUsers />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/admin/tweets"
        element={
          <AdminProtectedRoute>
            <ManageTweets />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/admin/reviews"
        element={
          <AdminProtectedRoute>
            <ManageReviews />
          </AdminProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;