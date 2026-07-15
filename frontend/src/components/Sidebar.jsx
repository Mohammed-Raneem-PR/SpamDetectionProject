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
    <div className="w-64 h-screen bg-indigo-700 text-white fixed">

      <h1 className="text-2xl font-bold text-center py-6 border-b">
        AI Spam Detection
      </h1>

      <div className="mt-4">

        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className="block px-6 py-4 hover:bg-indigo-800"
          >
            {item.name}
          </NavLink>
        ))}

      </div>

    </div>
  );
}