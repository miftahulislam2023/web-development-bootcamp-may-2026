import React from "react";
import Prism from "../../components/prism/Prism";
import TextType from "../../components/texttype/TextType";
import { useNavigate } from "react-router";
import StatsCard from "../../components/statscard/StatsCard";
import FeatureCard from "../../components/featurecard/FeatureCard";
import { BarChart3 } from "lucide-react";
import { GiArtificialIntelligence } from "react-icons/gi";
import { SlNote } from "react-icons/sl";

const Home = () => {
  const navigate = useNavigate();

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
              className="px-10 py-4 rounded-lg cursor-pointer text-lg font-medium transition-colors duration-500 bg-black text-white border-white hover:bg-white hover:text-black hover:border-black"
            >
              Start for free
            </button>
          </div>
        </div>

        {/* Stats cards */}

        <div className="w-full flex flex-col items-center gap-10">
          <p className="text-5xl text-black font-bold text-center">
            Statistics
          </p>
          <div className="w-full grid grid-cols-1 md:grid-cols-3 md:gap-30 gap-10">
            <StatsCard title="Active users" value="100+"></StatsCard>
            <StatsCard title="Tracked Monthly" value="10K+"></StatsCard>
            <StatsCard title="Satisfaction" value="98%"></StatsCard>
          </div>
        </div>

        {/* Features */}

        <div className="w-full flex flex-col items-center gap-10">
          <p className="text-5xl text-black font-bold text-center">Features</p>
          <div className="w-full grid grid-cols-1 md:grid-cols-3 md:gap-30 gap-10">
            <FeatureCard
              icon={BarChart3}
              title="Real-time analytics"
              description="Visual charts that show where your money goes every day"
            ></FeatureCard>
            <FeatureCard
              icon={GiArtificialIntelligence}
              title="AI Advisor"
              description="AI analyzes your spending and suggests smarter habits"
            ></FeatureCard>
            <FeatureCard
              icon={SlNote}
              title="Budget Goals"
              description="Set your budget and track progress live"
            ></FeatureCard>
          </div>
        </div>

        {/* How to use */}
        <div className="w-full flex flex-col items-center gap-10 mb-30">
          <p className="text-5xl text-black font-bold text-center">
            How to use
          </p>
          <ul class="steps steps-vertical lg:steps-horizontal font-bold">
            <li class="step step-neutral">Sign up</li>
            <li class="step step-neutral">Log expenses and Incomes</li>
            <li class="step step-neutral">Set budgets</li>
            <li class="step step-neutral">Get insights and Track financial activities</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
