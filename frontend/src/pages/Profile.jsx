import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import API from "../config/api";
import AppLayout from "../components/AppLayout";
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Edit3,
  Save,
  X,
  Lock,
  Calendar,
} from "lucide-react";

export default function Profile() {
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};

  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState(storedUser);
  const [formData, setFormData] = useState({
    full_name: storedUser.full_name || "",
    email: storedUser.email || "",
    phone: storedUser.phone || "",
    city: storedUser.city || "",
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put(`${API}/profile`, {
        id: user.id,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
      });

      toast.success(response.data.message || "Profile updated successfully!");

      const updated = {
        ...user,
        ...formData,
      };

      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      setEditing(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout
      title="User Account & Security"
      subtitle="View and manage your personal profile information, monitored city, and security credentials"
    >
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Avatar & Summary Card (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 text-center space-y-4">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center text-4xl font-extrabold shadow-lg shadow-indigo-500/25 mx-auto">
                {user.full_name?.charAt(0)?.toUpperCase() || user.username?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <span className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-xs">
                <ShieldCheck className="h-3.5 w-3.5 text-white" />
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                {user.full_name || "Community Member"}
              </h3>
              <p className="text-xs font-semibold text-indigo-600">
                @{user.username || "username"}
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Verified Account</span>
            </div>

            <div className="pt-4 border-t border-slate-100 text-left text-xs space-y-2.5 text-slate-600">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Account ID</span>
                <span className="font-mono font-semibold text-slate-800">#{user.id || "USR-01"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Primary City</span>
                <span className="font-semibold text-slate-800">{user.city || "Not Set"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Model Role</span>
                <span className="font-semibold text-indigo-600">Contributor</span>
              </div>
            </div>
          </div>

          {/* Right Column: Profile Details & Edit Form (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Personal Details</h3>
                <p className="text-xs text-slate-500 mt-0.5">Keep your account details up to date</p>
              </div>

              {!editing ? (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      full_name: user.full_name || "",
                      email: user.email || "",
                      phone: user.phone || "",
                      city: user.city || "",
                    });
                    setEditing(false);
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Cancel</span>
                </button>
              )}
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      disabled={!editing}
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm text-slate-900 disabled:bg-slate-50 disabled:text-slate-600 transition"
                    />
                  </div>
                </div>

                {/* Username (Read Only) */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Username (Fixed)
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      disabled
                      value={user.username || ""}
                      className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm text-slate-500 bg-slate-50 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      disabled={!editing}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm text-slate-900 disabled:bg-slate-50 disabled:text-slate-600 transition"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      disabled={!editing}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm text-slate-900 disabled:bg-slate-50 disabled:text-slate-600 transition"
                    />
                  </div>
                </div>

                {/* City */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Monitored City / Geographic Region
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      disabled={!editing}
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Bangalore, London, New York"
                      className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm text-slate-900 disabled:bg-slate-50 disabled:text-slate-600 transition"
                    />
                  </div>
                </div>
              </div>

              {editing && (
                <div className="pt-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm"
                  >
                    <Save className="h-4 w-4" />
                    <span>{loading ? "Saving..." : "Save Changes"}</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
