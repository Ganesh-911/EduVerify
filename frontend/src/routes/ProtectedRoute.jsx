
import { Navigate, Outlet, useLocation } from "react-router";

import { useAuth } from "../context/AuthContext";

const dashboardByRole = {
  STUDENT: "/student/dashboard",
  DEPARTMENT_ADMIN: "/department/dashboard",
  REGISTRAR: "/registrar/dashboard",
  SUPER_ADMIN: "/admin/dashboard",
};

function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (!allowedRoles.includes(user.role)) {
    const ownDashboard = dashboardByRole[user.role];

    return (
      <Navigate
        to={ownDashboard || "/"}
        replace
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;
