import { Route, Routes } from "react-router";

import Home from "../pages/public/Home";
import VerifyCredential from "../pages/public/VerifyCredential";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import StudentDashboard from "../pages/student/StudentDashboard";
import DepartmentDashboard from "../pages/department/DepartmentDashboard";
import RegistrarDashboard from "../pages/registrar/RegistrarDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";

import NotFound from "../pages/NotFound";

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/verify" element={<VerifyCredential />} />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Student */}
      <Route
        path="/student/dashboard"
        element={<StudentDashboard />}
      />

      {/* Department Admin */}
      <Route
        path="/department/dashboard"
        element={<DepartmentDashboard />}
      />

      {/* Registrar */}
      <Route
        path="/registrar/dashboard"
        element={<RegistrarDashboard />}
      />

      {/* Super Admin */}
      <Route
        path="/admin/dashboard"
        element={<AdminDashboard />}
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;