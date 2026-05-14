import React, { useState } from "react";
import TextType from "../../components/texttype/TextType";
import { Link } from "react-router";
import Prism from "../../components/prism/Prism";

const Register = () => {
  const [loading, setLoading] = useState(false);
  
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

        <form className="w-full max-w-125 mb-5">

          {/* Full Name */}

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Full Name</legend>
            <input
              type="text"
              name="name"
              className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Your Name"
              required
            />
          </fieldset>

          {/* Email Field */}

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Email</legend>
            <input
              type="email"
              name="email"
              className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="abc@email.com"
              required
            />
          </fieldset>

          {/* Photo */}

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Your Photo</legend>
            <input
              type="file"
              name="photo"
              className="w-full file-input focus:outline-none focus:ring-2 focus:ring-black"
              accept="image/*"
              required
            />
            <label className="label">Max size 2MB</label>
          </fieldset>

          {/* Password Field */}

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Password</legend>
            <input
              type="password"
              name="password"
              className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="••••••"
              required
            />
          </fieldset>
          {/* {error && (
            <p className="text-sm text-red-600 mb-1 text-justify">{error}</p>
          )} */}

          {/* Confirm Password Field */}

          <fieldset className="fieldset mb-5">
            <legend className="fieldset-legend">Confirm Password</legend>
            <input
              type="password"
              name="confirmPassword"
              className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="••••••"
              required
            />
          </fieldset>

          {/* Submit Button */}

          <button
            type="submit"
            className="btn w-full h-12 font-medium cursor-pointer text-lg bg-black text-white border-white hover:bg-white hover:text-black hover:border-black border transition-colors duration-500"
            disabled={loading}
          >
            {loading ? <span className="loading loading-dots loading-md"></span> : "Create Account"}
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
