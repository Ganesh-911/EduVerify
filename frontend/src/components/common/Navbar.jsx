import { Link } from "react-router";

function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-700 text-sm font-bold text-white">
            E
          </div>

          <span className="text-lg font-bold tracking-tight text-slate-900">
            Edu<span className="text-brand-700">Verify</span>
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            to="/verify"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-700"
          >
            Verify Credential
          </Link>

          <Link
            to="/login"
            className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;