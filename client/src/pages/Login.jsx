import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await login(formData);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-sky-50 to-emerald-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-slate-800 text-center">
          Welcome Back 👋
        </h1>

        <p className="text-slate-500 text-center mt-2">
          Login to manage your finances
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="text-sm font-medium text-slate-600">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="raj@gmail.com"
              className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="******"
              className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-violet-600 text-white py-3 rounded-xl font-semibold hover:bg-violet-700 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-slate-500 mt-6">
          New here?{" "}
          <Link to="/register" className="text-violet-600 font-semibold">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;