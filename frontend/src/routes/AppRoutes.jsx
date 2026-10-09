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

import NotFound from "../pages/NotFound";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/verify" element={<VerifyCredential />} />
        <Route
          path="/verify/:credentialId"
          element={<VerifyCredential />}
        />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/student/dashboard"
        element={<StudentDashboard />}
      />

      <Route
        path="/department/dashboard"
        element={<DepartmentDashboard />}
      />

      <Route
        path="/registrar/dashboard"
        element={<RegistrarDashboard />}
      />

      <Route
        path="/admin/dashboard"
        element={<AdminDashboard />}
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;