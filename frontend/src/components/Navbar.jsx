import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ShieldCheck, LogOut, Sparkles, User, Bell } from "lucide-react";

export default function Navbar({ title, subtitle, actions }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("admin");
    toast.success("Logged out successfully!");
    navigate("/");
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3.5 sticky top-0 z-20 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Breadcrumbs / Title */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight truncate">
              {title || "AI-Based Spam Detection"}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              98.34% Acc
            </span>
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-0.5 truncate">{subtitle}</p>
          )}
        </div>

        {/* Right: Actions, Status & User Pill */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5 sm:gap-4 shrink-0">
          {actions && <div className="flex items-center gap-2">{actions}</div>}

          {/* User profile & Logout */}
          <div className="flex items-center gap-3 pl-2 sm:border-l sm:border-slate-200">
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-slate-100 transition text-left"
            >
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center text-xs font-bold uppercase shadow-sm">
                {user?.full_name?.charAt(0) || user?.username?.charAt(0) || "U"}
              </div>
              <div className="hidden lg:block">
                <p className="text-xs font-semibold text-slate-800 leading-tight">
                  {user?.full_name || user?.username || "Account"}
                </p>
                <p className="text-[10px] text-slate-400 leading-tight">Active User</p>
              </div>
            </button>

            <button
              onClick={handleLogout}
              title="Logout"
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200/60 transition flex items-center gap-1.5 shadow-xs"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
