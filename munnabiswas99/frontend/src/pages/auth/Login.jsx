import React from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router";
import Logo from "../../components/logo/Logo";
import useAuth from "../../hooks/useAuth";
import Swal from 'sweetalert2'

const Login = () => {
  const { signInUser } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleRegister = (data) => {
    signInUser(data.email, data.password)
      .then((res) => {
        console.log(res.user);
        navigate("/");
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${error.message}`,
        });
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side */}
        <div className="hidden lg:flex flex-col justify-center bg-primary p-12">
          <div className="mb-6">
            <Logo></Logo>
          </div>

          <h1 className="text-4xl font-bold leading-tight">
            Welcome Back <br />
            to Expense Tracker
          </h1>

          <p className="mt-5 text-lg">Track and manage your expense here ...</p>
        </div>

        {/* Right Side */}
        <div className="p-8 md:p-12">
          <div className="mb-8 text-center">
            <div className="flex flex-col items-center lg:hidden mb-4 bg-primary rounded-2xl p-5">
              <div>
                <Logo />
              </div>
              <p className="font-bold text-2xl my-5">Welcome Back</p>
            </div>

            <h2 className="text-3xl font-bold text-gray-800">Login Now!</h2>

            <p className="text-gray-500 mt-2">
              Login to start buying and selling.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(handleRegister)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                DIU Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-black"
                {...register("email", {
                  required: "Email is required",
                })}
              />

              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-black"
                {...register("password", {
                  required: "Password is required",
                })}
              />

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-primary hover:bg-secondary text-white font-semibold py-3 rounded-xl mt-3 cursor-pointer"
            >
              Login
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Do not have an account?
            <NavLink to="/register">
              {" "}
              <span className="text-primary font-medium cursor-pointer ml-1">
                Register
              </span>
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
