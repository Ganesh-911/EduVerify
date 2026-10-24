
import { useState } from "react";
import { Link, useNavigate } from "react-router";

import apiClient from "../../services/apiClient";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";

const dashboardByRole = {
  STUDENT: "/student/dashboard",
  DEPARTMENT_ADMIN: "/department/dashboard",
  REGISTRAR: "/registrar/dashboard",
  SUPER_ADMIN: "/admin/dashboard",
};

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await apiClient.post("/auth/login", {
        email: email.trim(),
        password,
      });

      const result = response.data?.data;
      const token = result?.token;
      const user = result?.user;

      if (!response.data?.success || !token || !user) {
        throw new Error("Invalid login response from server.");
      }

      const dashboard = dashboardByRole[user.role];

      if (!dashboard) {
        throw new Error("Your account has an unsupported role.");
      }

      login({ token, user });
      navigate(dashboard, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="text-2xl font-bold text-brand-700"
          >
            EduVerify
          </Link>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Sign in to access your academic credentials.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Need an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-brand-700 hover:underline"
          >
            Register
          </Link>
        </p>

        <p className="mt-4 text-center text-xs text-slate-500">
          Secure academic credential management and verification
        </p>
      </div>
    </main>
  );
}

export default Login;
