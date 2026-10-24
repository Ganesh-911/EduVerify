
import { Route, Routes } from "react-router";

import PublicLayout from "../layouts/PublicLayout";

import Home from "../pages/public/Home";
import VerifyCredential from "../pages/public/VerifyCredential";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import StudentDashboard from "../pages/student/StudentDashboard";
import DepartmentDashboard from "../pages/department/DepartmentDashboard";
import RegistrarDashboard from "../pages/registrar/RegistrarDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "../pages/NotFound";

function AppRoutes() {
  return (
    <Routes>
      {/* Public pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/verify" element={<VerifyCredential />} />
        <Route
          path="/verify/:credentialId"
          element={<VerifyCredential />}
        />
      </Route>

      {/* Authentication pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      
      {/* Student dashboard */}
      <Route element={<ProtectedRoute allowedRoles={["STUDENT"]} />}>
        <Route element={<DashboardLayout />}>
          <Route
            path="/student/dashboard"
            element={<StudentDashboard />}
          />
        </Route>
      </Route>

      {/* Department administrator dashboard */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["DEPARTMENT_ADMIN"]} />
        }
      >
        <Route element={<DashboardLayout />}>
          <Route
            path="/department/dashboard"
            element={<DepartmentDashboard />}
          />
        </Route>
      </Route>

      {/* Registrar dashboard */}
      <Route element={<ProtectedRoute allowedRoles={["REGISTRAR"]} />}>
        <Route element={<DashboardLayout />}>
          <Route
            path="/registrar/dashboard"
            element={<RegistrarDashboard />}
          />
        </Route>
      </Route>

      {/* Super administrator dashboard */}
      <Route element={<ProtectedRoute allowedRoles={["SUPER_ADMIN"]} />}>
        <Route element={<DashboardLayout />}>
          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />
        </Route>
      </Route>


      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
