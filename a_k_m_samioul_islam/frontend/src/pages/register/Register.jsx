import React, { useContext, useState } from "react";
import TextType from "../../components/texttype/TextType";
import { Link, useNavigate } from "react-router";
import Prism from "../../components/prism/Prism";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AuthContext } from "../../providers/AuthProvider/AuthProvider";
import axiosSecure from "../../utils/axios/axioshelper";

const registerSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.email("Please enter a valid email"),
    currency: z.string().min(3, "Currency must be at least 3 characters").max(6,  "Currency must be less than or equal 6 characters"),
    photo: z.any().refine((files) => files?.length === 1, "Photo is required").refine((files) => files?.[0]?.size <= 2 * 1024 * 1024, "Max photo size is 2MB").refine(
        (files) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(files?.[0]?.type),
        "Only jpg, png or webp allowed"
      ),
    password: z.string().min(6, "Password must be at least 6 characters").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter"),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });


const Register = () => {
  const { registration, setLoading, setUser, updateUser, setUserData } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  // Register function

  const handleRegister = async (data) => {
    setLoading(true);
    try {
      const { name, email, currency, password, photo } = data;
      const photoFile = photo[0];

      const formData = new FormData();
      formData.append("image", photoFile);

      const imgbbKey = import.meta.env.VITE_IMGBB_API_KEY;

      const imageUploadRes = await fetch(
        `https://api.imgbb.com/1/upload?key=${imgbbKey}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const imageData = await imageUploadRes.json();

      if (!imageData.success) 
        throw new Error("Image upload failed");

      const photoURL = imageData.data.url;

      const result = await registration(email, password);
      const user = result.user;
      const token = await user.getIdToken();
      localStorage.setItem("access-token", token);

      const payload = {
        name,
        email,
        photoURL,
        currency
      }

      const res = await axiosSecure.post("/users", payload);

      setUserData(res.data.data);

      await updateUser({
        displayName: name,
        photoURL: photoURL,
      });

      setUser({
        ...user,
        displayName: name,
        photoURL
      });

      toast.success("Registered successfully");
      reset();
      navigate("/dashboard");

    } catch (error) {
      // console.error(error);
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-full flex inter">

      {/* Interactive Background */}

      <div
        className="hidden lg:flex lg:w-full lg:max-w-[50%]"
        style={{ width: "1080px", minHeight: "100vh", position: "relative" }}
      >
        <Prism
          animationType="rotate"
          timeScale={0.5}
          height={3.5}
          baseWidth={5.5}
          scale={3.6}
          hueShift={0}
          colorFrequency={1}
          noise={0}
          glow={1}
        />

        <div className="absolute h-auto inset-0 z-50 flex flex-col mt-50 items-center gap-5">
          <div className="w-[70%] text-5xl font-extrabold text-black min-h-15">
            <TextType
              text={"Be a part of WalletWatch"}
              typingSpeed={100}
              pauseDuration={1500}
              showCursor={false}
              startOnVisible={true}
              deletingSpeed={0}
              loop={false}
            />
          </div>
          <p className="w-[70%] text-justify text-gray-600 text-lg">
            Join other users who've taken control of their finances with WalletWatch
          </p>
        </div>
      </div>

      {/*Sign Up Form*/}

      <div className="w-full max-w-full lg:max-w-[50%] min-h-screen flex flex-col items-center justify-center p-10">
        <p className="font-bold text-black text-3xl md:text-5xl mb-5">
          Create Account
        </p>

        <form onSubmit={handleSubmit(handleRegister)} className="w-full max-w-125 mb-5">

          {/* Full Name */}

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Full Name</legend>
            <input
              type="text"
              className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Your Name"
              {...register("name")}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </fieldset>

          {/* Email Field */}

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Email</legend>
            <input
              type="email"
              className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="abc@email.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </fieldset>

          {/* Photo */}

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Your Photo</legend>
            <input
              type="file"
              className="w-full file-input focus:outline-none focus:ring-2 focus:ring-black"
              accept="image/*"
              {...register("photo")}
            />
            <label className="label">Max size 2MB</label>
            {errors.photo && (
              <p className="mt-1 text-sm text-red-600">
                {errors.photo.message?.toString()}
              </p>
            )}
          </fieldset>

          {/* Currency Field */}

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Currency</legend>
            <input
              type="text"
              className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Your currency"
              {...register("currency")}
            />
            {errors.currency && (
              <p className="mt-1 text-sm text-red-600">
                {errors.currency.message}
              </p>
            )}
          </fieldset>

          {/* Password Field */}

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Password</legend>
            <input
              type="password"
              className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="••••••"
              {...register("password")}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </fieldset>

          {/* Confirm Password Field */}

          <fieldset className="fieldset mb-5">
            <legend className="fieldset-legend">Confirm Password</legend>
            <input
              type="password"
              className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="••••••"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </fieldset>

          {/* Submit Button */}

          <button
            type="submit"
            className="btn w-full h-12 font-medium cursor-pointer text-lg bg-black text-white border-white hover:bg-white hover:text-black hover:border-black border transition-colors duration-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? <span className="loading loading-dots loading-md"></span> : "Create Account"}
          </button>
        </form>

          

        <button
          className="w-full max-w-[500px] h-12 btn bg-white text-black border-[#e5e5e5] mb-10 cursor-pointer"
        >
          <svg
            aria-label="Google logo"
            width="16"
            height="16"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <g>
              <path d="m0 0H512V512H0" fill="#fff"></path>
              <path
                fill="#34a853"
                d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
              ></path>
              <path
                fill="#4285f4"
                d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
              ></path>
              <path
                fill="#fbbc02"
                d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
              ></path>
              <path
                fill="#ea4335"
                d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
              ></path>
            </g>
          </svg>
          Continue with Google
        </button>

        <div className="text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 font-medium">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
