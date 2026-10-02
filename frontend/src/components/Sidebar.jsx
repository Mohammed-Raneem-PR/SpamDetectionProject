import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  ShieldAlert,
  Send,
  MessageSquare,
  Flame,
  BarChart3,
  History,
  Star,
  User,
  LogOut,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Detect Spam", path: "/detect", icon: ShieldAlert, badge: "AI" },
    { name: "Post Tweet", path: "/post-tweet", icon: Send },
    { name: "View Tweets", path: "/tweets", icon: MessageSquare },
    { name: "Trending", path: "/trending", icon: Flame },
    { name: "Analytics", path: "/analytics", icon: BarChart3 },
    { name: "History", path: "/history", icon: History },
    { name: "Reviews", path: "/reviews", icon: Star },
    { name: "Profile", path: "/profile", icon: User },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("admin");
    toast.success("Logged out successfully!");
    navigate("/");
  };

  return (
    <>
      {/* Desktop Persistent Left Sidebar */}
      <aside className="hidden md:flex w-64 h-screen flex-col bg-slate-900 text-white fixed border-r border-slate-800 z-30 select-none shadow-xl">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold text-white tracking-tight">ShieldAI</span>
                <span className="px-1.5 py-0.5 text-[9px] font-semibold tracking-wider uppercase rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  ML
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Social Spam Guard</p>
            </div>
          </div>
        </div>

        {/* Model Status Pill */}
        <div className="mx-3 mt-4 mb-2 p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-800/40 flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-semibold text-slate-200 truncate">Linear SVM Active</div>
            <div className="text-[10px] text-indigo-300 truncate">98.34% Accuracy · Dual TF-IDF</div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="mt-2 flex-1 overflow-y-auto px-3 py-2 space-y-1" aria-label="Main navigation">
          <div className="px-3 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Workspace
          </div>

          {menu.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold"
                      : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-white" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-400/20">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Card & Logout Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/60">
          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold uppercase shrink-0">
                {user?.full_name?.charAt(0) || user?.username?.charAt(0) || "U"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate">
                  {user?.full_name || user?.username || "Authenticated User"}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  @{user?.username || "member"}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Floating Bottom Bar */}
      <nav
        className="fixed bottom-0 inset-x-0 z-40 flex items-center overflow-x-auto bg-slate-900/95 backdrop-blur-md text-slate-300 border-t border-slate-800 px-2 py-2 md:hidden shadow-2xl"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center gap-1 mx-auto">
          {menu.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-medium shrink-0 transition ${
                    isActive
                      ? "bg-indigo-600 text-white font-semibold shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                <span className="whitespace-nowrap">{item.name}</span>
              </NavLink>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-medium text-rose-400 shrink-0 hover:bg-rose-500/10"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </>
  );
}
