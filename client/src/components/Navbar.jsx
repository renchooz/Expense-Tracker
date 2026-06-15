import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-violet-600">
          FinTrack
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-slate-600 hover:text-violet-600 font-medium"
          >
            Dashboard
          </Link>

          <Link
            to="/transactions"
            className="text-slate-600 hover:text-violet-600 font-medium"
          >
            Transactions
          </Link>

          <div className="hidden sm:flex items-center gap-2 bg-violet-50 px-4 py-2 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="font-semibold text-slate-700">{user?.name}</span>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-50 text-red-500 px-4 py-2 rounded-xl font-semibold hover:bg-red-100 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
