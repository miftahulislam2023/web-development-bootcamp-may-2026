import React from "react";
import { NavLink } from "react-router";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { FcBarChart, FcOk } from "react-icons/fc";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Pagination, Autoplay } from "swiper/modules";

import img1 from "../../assets/banner/banner1.png";
import img2 from "../../assets/banner/banner2.png";
import img3 from "../../assets/banner/banner3.png";
import img4 from "../../assets/banner/banner4.png";

import { motion } from "framer-motion";

const Banner = () => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-10 w-full">
      {/* Left Side */}
      <section className="w-full md:w-1/2">
        <motion.h1
        initial={{ opacity: 0, x:100, y: 100 }}
        animate={{ opacity: 1, x:0, y: 0 }}
        transition={{ duration: 2 }}
        className="text-4xl md:text-6xl font-semibold">
          Smarter Finance, <br /> Made | Simple
        </motion.h1>
        <div className="flex gap-2 text-4xl my-5">
          <RiMoneyDollarCircleLine />
          <FcBarChart />
          <FcOk />
        </div>
        <p className="">
          Track your spending, investment, net worth <br /> and optimize your
          financial future.
        </p>
        <div className="flex gap-2 my-5">
          <NavLink
            to="/register"
            className="bg-primary-text text-secondary-text px-5 py-2 rounded"
          >
            Get started for free
          </NavLink>
          <NavLink
            to="/login"
            className="bg-mist-600 text-secondary-text px-3 py-2 rounded"
          >
           SignIn
          </NavLink>
        </div>
      </section>

      {/* Right Side */}
      <motion.section
        initial={{ opacity: 0, x:500 }}
        animate={{ opacity: 1, x:0, }}
        transition={{ duration: 2 }}
        className="w-full md:w-1/2 shadow rounded-lg">
        <Swiper
          pagination={{
            clickable: true,
          }}
          modules={[Pagination,Autoplay]}
          loop={true}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          className="mySwiper w-full h-50 md:h-90 rounded-2xl overflow-hidden"
        >
          <SwiperSlide className="h-full">
            <img className="w-full h-full" src={img1} alt="" />
          </SwiperSlide>

          <SwiperSlide className="h-full">
            <img className="w-full h-full" src={img2} alt="" />
          </SwiperSlide>

          <SwiperSlide className="h-full">
            <img className="w-full h-full" src={img3} alt="" />
          </SwiperSlide>

          <SwiperSlide className="h-full">
            <img className="w-full h-full" src={img4} alt="" />
          </SwiperSlide>
        </Swiper>
      </motion.section>
    </div>
  );
};

export default Banner;
