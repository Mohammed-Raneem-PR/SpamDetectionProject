import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function AppLayout({ children, title, subtitle, actions }) {
  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-800 flex flex-col md:flex-row antialiased selection:bg-indigo-600 selection:text-white">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-64 min-w-0 min-h-screen">
        {/* Top Navbar */}
        <Navbar title={title} subtitle={subtitle} actions={actions} />

        {/* Dynamic Page Content */}
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-[1600px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

