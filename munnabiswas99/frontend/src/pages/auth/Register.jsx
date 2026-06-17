import React from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router";
import Logo from "../../components/logo/Logo";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Register = () => {
  const { registerUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const handleRegistration = (data) => {
    
    const profileImg = data.photo[0];
    registerUser(data.email, data.password)
      .then((res) => {
        console.log(res.user)
        const formData = new FormData();
        formData.append('image', profileImg);
        const image_API_URL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_Image_Host_API_Key}`

        axios.post(image_API_URL, formData)
        .then(res => {
          const photoURL = res.data.data.url;

          // Upadate user profile
          const userProfile = {
            displayName: data.name,
            photoURL : photoURL

          }

          const userInfo = {
            email: data.email,
            displayName: data.name,
            photoURL: photoURL
          }

          axiosSecure.post('/users', userInfo)
          .then(() => {
            // console.log(res.data)
          })

          updateUserProfile(userProfile)
          .then(()=>{
            console.log("Profile Updated");
          })
          .catch(error => {
            console.log(error)
          })
        })

        navigate('/');
      })
      .catch((error) => {
        console.log(error);
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
            Welcome to <br />
            Expense Tracker
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
              <p className="font-bold text-2xl my-5">Welcome Here!</p>
            </div>

            <h2 className="text-3xl font-bold text-gray-800">SignUp Now!</h2>

            <p className="text-gray-500 mt-2">
              SignUp to start buying and selling.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(handleRegistration)} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Name
              </label>

              <input
                type="text"
                placeholder="Enter your Name"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-black"
                {...register("name", {
                  required: "Name is required",
                })}
              />

              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            
            {/* Profile Photo */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Profile Photo
              </label>

              <input
                type="file"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-black"
                {...register("photo", {
                  required: "Profile photo is required",
                })}
              />

              {errors.photo && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.photo.message}
                </p>
              )}
            </div>

              {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email
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
                placeholder="Create a password"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-black"
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/,
                    message:
                      "Password must be at least 8 characters and contain 1 uppercase letter, 1 digit, and 1 special character",
                  },
                })}
              />

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Confirm Password
              </label>

              <input
                type="password"
                placeholder="Confirm password"
                className="w-full border border-gray-300 text-black rounded-xl px-4 py-3"
                {...register("confirmPassword", {
                  required: "Confirm password is required",
                  validate: (value) =>
                    value === watch("password") || "Passwords did not matched",
                })}
              />

              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-primary hover:bg-secondary text-white font-semibold py-3 rounded-xl mt-3 cursor-pointer"
            >
              SignUp
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?
            <NavLink to="/login" className="text-primary font-medium ml-2">
                Login
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
