import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-xl font-semibold transition ${
      isActive
        ? "bg-violet-100 text-violet-600"
        : "text-slate-600 hover:text-violet-600 hover:bg-slate-100"
    }`;

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-3xl font-bold text-violet-600">
            FinTrack
          </Link>

          <div className="hidden md:flex items-center gap-3">
            <NavLink to="/" className={linkClass}>
              Dashboard
            </NavLink>

            <NavLink to="/transactions" className={linkClass}>
              Transactions
            </NavLink>

            <div className="flex items-center gap-2 bg-violet-50 px-4 py-2 rounded-xl">
              <div className="w-9 h-9 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="font-semibold text-slate-700">
                {user?.name}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-50 text-red-500 px-5 py-3 rounded-xl font-semibold hover:bg-red-100 transition"
            >
              Logout
            </button>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden bg-slate-100 text-slate-700 px-4 py-2 rounded-xl font-bold"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>

        {open && (
          <div className="md:hidden mt-5 bg-slate-50 rounded-2xl p-4 space-y-3">
            <NavLink
              to="/"
              onClick={() => setOpen(false)}
              className={linkClass}
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/transactions"
              onClick={() => setOpen(false)}
              className={linkClass}
            >
              Transactions
            </NavLink>

            <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl">
              <div className="w-9 h-9 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="font-semibold text-slate-700">
                {user?.name}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="w-full bg-red-50 text-red-500 px-5 py-3 rounded-xl font-semibold hover:bg-red-100 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
