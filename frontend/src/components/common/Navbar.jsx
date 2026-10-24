
import { Link, useNavigate } from "react-router";

import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";

const dashboardByRole = {
  STUDENT: "/student/dashboard",
  DEPARTMENT_ADMIN: "/department/dashboard",
  REGISTRAR: "/registrar/dashboard",
  SUPER_ADMIN: "/admin/dashboard",
};

function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  const dashboardPath = user
    ? dashboardByRole[user.role]
    : null;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-3"
          aria-label="EduVerify home"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-700 text-sm font-bold text-white">
            E
          </div>

          <span className="text-lg font-bold tracking-tight text-slate-900">
            Edu<span className="text-brand-700">Verify</span>
          </span>
        </Link>

        <nav
          className="flex items-center gap-3 sm:gap-6"
          aria-label="Main navigation"
        >
          <Link
            to="/verify"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            Verify Credential
          </Link>

          {isAuthenticated ? (
            <>
              {dashboardPath && (
                <Link
                  to={dashboardPath}
                  className="hidden text-sm font-medium text-slate-600 transition-colors hover:text-brand-700 sm:inline"
                >
                  Dashboard
                </Link>
              )}

              <span
                className="hidden max-w-40 truncate text-sm text-slate-600 md:inline"
                title={user?.name}
              >
                {user?.name}
              </span>

              <Button
                variant="secondary"
                onClick={handleLogout}
                className="px-3 py-2"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
