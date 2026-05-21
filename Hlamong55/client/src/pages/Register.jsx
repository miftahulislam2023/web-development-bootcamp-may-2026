import { useState } from "react";
import { Link } from "react-router-dom";

import axiosInstance from "../lib/axios";
import AuthLayout from "../layouts/AuthLayout";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
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
      const response = await axiosInstance.post("/auth/register", formData);

      console.log(response.data);

      alert("Registration successful ");
    } catch (error) {
      console.log(error.response.data);

      alert(error.response.data.message);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Create Account</h1>

          <p className="text-gray-700 mt-2">
            Join the realtime chat app 🚀
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="input input-bordered border-purple-950 w-full h-12 rounded-xl"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="input input-bordered border-purple-950 w-full h-12 rounded-xl"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input border border-purple-950 w-full h-12 rounded-xl"
            value={formData.password}
            onChange={handleChange}
          />

          <button className="btn btn-primary w-full h-12 rounded-xl text-base hover:scale-105 hover:bg-purple-900 transition">
            Register
          </button>
        </form>

        <p className="text-center text-gray-600 ">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;
