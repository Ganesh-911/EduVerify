
import { Outlet } from "react-router";

import Navbar from "../components/common/Navbar";

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="min-h-[calc(100vh-4rem)]">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
