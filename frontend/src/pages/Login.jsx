import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../services/api";
import useAuthStore from "../store/authStore";

export default function Login() {
  const navigate = useNavigate();

  const setAuth = useAuthStore((state) => state.setAuth);

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await api.post("/auth/login", form);

      setAuth(data.user, data.accessToken);

      toast.success("Welcome back to TuneFlow!");

      navigate("/");

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-5">

      <form
        onSubmit={handleSubmit}
        className="bg-[#202020] p-8 rounded-2xl w-full max-w-md space-y-5"
      >

        <h1 className="text-3xl text-green-500 font-bold text-center">
          TuneFlow
        </h1>

        <h2 className="text-2xl font-bold text-center">
          Log in
        </h2>

        <input
          type="email"
          placeholder="Email address"
          required
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          className="w-full p-3 rounded-lg bg-[#303030] outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          className="w-full p-3 rounded-lg bg-[#303030] outline-none"
        />

        <button
          disabled={loading}
          className="w-full bg-green-500 text-black font-bold p-3 rounded-full hover:bg-green-400 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        <p className="text-center text-gray-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-green-400">
            Sign up
          </Link>
        </p>

      </form>
    </div>
  );
}