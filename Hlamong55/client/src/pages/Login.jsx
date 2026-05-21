import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import axiosInstance from "../lib/axios";

const Login = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const response = await axiosInstance.post(
        "/auth/login",
        formData
      );

      localStorage.setItem("token", response.data.token);

      localStorage.setItem("user",
        JSON.stringify(response.data.user)
      );

      alert("Login successful ✅");
      navigate("/chat");

    } catch (error) {
      console.log(error.response?.data);

      alert(
        error.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome Back 👋
          </h1>

          <p className="text-gray-700 mt-2">
            Login to continue chatting 💬
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="input input-bordered w-full h-12 rounded-xl"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input input-bordered w-full h-12 rounded-xl"
            value={formData.password}
            onChange={handleChange}
          />

          <button className="btn btn-primary w-full h-12 rounded-xl text-base hover:scale-105 hover:bg-purple-900 transition">
            Login
          </button>
        </form>

        <p className="text-center text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-primary font-medium hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;