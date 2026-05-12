import React from "react";
import Prism from "../../components/prism/Prism";
import TextType from "../../components/texttype/TextType";
import { useNavigate } from "react-router";
import StatsCard from "../../components/statscard/StatsCard";

const Home = () => {
  const navigate= useNavigate();

  return (
    <div className="w-full min-h-screen inter">
      <div className="w-full max-w-360 px-5 mx-auto flex flex-col gap-20">

        {/* Hero section */}

        <div className="relative h-125 bg-white">
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
          <div className="absolute inset-0 flex flex-col gap-5 items-center justify-center z-10">
            <div className="text-black text-3xl lg:text-5xl font-bold text-center">
              <TextType
                text={"Your money finally under control"}
                typingSpeed={100}
                pauseDuration={1500}
                showCursor={false}
                startOnVisible={true}
                deletingSpeed={0}
                loop={false}
              />
            </div>

            <p className="text-gray-600 text-center">
              Track expenses, set budgets and get AI powered insights - all in
              one clean dashboard
            </p>

            <button
              onClick={() => navigate("/register")}
              className="px-4 py-2 rounded-lg cursor-pointer text-sm font-medium transition-colors duration-500 bg-black text-white border-white hover:bg-white hover:text-black hover:border-black"
            >
              Start for free
            </button>
          </div>
        </div>

        {/* Stats cards */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-30">
            <StatsCard title="Active users" value="100+"></StatsCard>
            <StatsCard title="Tracked Monthly" value="10K+"></StatsCard>
            <StatsCard title="Satisfaction" value="98%"></StatsCard>
        </div>
      </div>
    </div>
  );
};

export default Home;
