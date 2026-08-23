import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const menu = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Post Tweet", path: "/post-tweet" },
    { name: "View Tweets", path: "/tweets" },
    { name: "Reviews", path: "/reviews" },
    { name: "Trending", path: "/trending" },
    { name: "Detect Spam", path: "/detect" },
    { name: "History", path: "/history" },
    { name: "Analytics", path: "/analytics" },
    { name: "Profile", path: "/profile" },
    { name: "Logout", path: "/" },
  ];

  return (
    <>
    <aside className="hidden md:flex w-64 h-screen flex-col bg-gradient-to-b from-indigo-800 to-indigo-950 text-white fixed shadow-2xl shadow-indigo-950/20">

      <h1 className="text-2xl font-bold text-center py-6 border-b">
        AI Spam Detection
      </h1>

      <nav className="mt-4 flex-1 overflow-y-auto px-3 pb-4" aria-label="Main navigation">

        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `block rounded-xl px-4 py-3 mb-1 font-medium ${
                isActive
                  ? "bg-white text-indigo-800 shadow-lg"
                  : "text-indigo-100 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}

      </nav>

    </aside>

    <nav className="fixed bottom-0 inset-x-0 z-20 flex overflow-x-auto bg-indigo-950 text-indigo-100 shadow-[0_-8px_24px_rgb(15_23_42/0.18)] md:hidden" aria-label="Mobile navigation">
      {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
            `min-w-20 shrink-0 px-3 py-3 text-center text-xs font-medium ${isActive ? "bg-white text-indigo-800" : "hover:bg-white/10"}`
            }
        >
          {item.name}
        </NavLink>
      ))}
    </nav>
    </>
  );
}
