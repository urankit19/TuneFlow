import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../services/api";
import useAuthStore from "../store/authStore";

export default function Register() {
  const navigate = useNavigate();

  const setAuth = useAuthStore((state) => state.setAuth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await api.post("/auth/register", form);

      setAuth(data.user, data.accessToken);

      toast.success("Account created successfully!");

      navigate("/");

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration failed"
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
          Create your account
        </h2>

        <input
          type="text"
          placeholder="Full name"
          required
          minLength={2}
          maxLength={50}
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          className="w-full p-3 rounded-lg bg-[#303030] outline-none"
        />

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
          placeholder="Password (minimum 8 characters)"
          required
          minLength={8}
          maxLength={72}
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
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="text-center text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-green-400">
            Log in
          </Link>
        </p>

      </form>
    </div>
  );
}