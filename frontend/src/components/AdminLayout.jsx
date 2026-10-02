import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { 
  ShieldCheck, 
  Users, 
  MessageSquare, 
  Star, 
  LayoutDashboard, 
  LogOut, 
  ArrowLeftRight 
} from "lucide-react";

export default function AdminLayout({ children, title, subtitle }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/", { replace: true });
  };

  const navItems = [
    { name: "Overview", path: "/admin", icon: LayoutDashboard },
    { name: "Manage Users", path: "/admin/users", icon: Users },
    { name: "Manage Tweets", path: "/admin/tweets", icon: MessageSquare },
    { name: "Manage Reviews", path: "/admin/reviews", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col md:flex-row antialiased">
      {/* Admin Sidebar */}
      <aside className="hidden md:flex w-64 h-screen flex-col bg-slate-900 text-white fixed border-r border-slate-800 z-30">
        <div className="p-6 border-b border-slate-800/80 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">Admin Console</h1>
            <span className="text-xs text-indigo-400 font-medium tracking-wide uppercase">AI Shield Guard</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto" aria-label="Admin Navigation">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Management
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/70"
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800/80 space-y-2">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white transition"
          >
            <ArrowLeftRight className="h-3.5 w-3.5" />
            Switch to User App
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 transition"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-64 min-w-0 min-h-screen">
        <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky top-0 z-20 shadow-xs">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">{title || "Admin Dashboard"}</h1>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Admin Authenticated
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-[1600px] mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation for Admin */}
      <nav className="fixed bottom-0 inset-x-0 z-40 flex overflow-x-auto bg-slate-900 text-slate-300 border-t border-slate-800 md:hidden px-2 py-2 justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-medium ${
                  isActive ? "bg-indigo-600 text-white" : "hover:text-white"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              <span>{item.name.replace("Manage ", "")}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}

