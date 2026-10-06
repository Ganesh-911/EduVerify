import { Outlet } from "react-router";
import Navbar from "../components/common/Navbar";

function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default PublicLayout;