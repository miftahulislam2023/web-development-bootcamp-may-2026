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

  const reviews = [
    {
      name: "Nafisa Rahman",
      role: "Student",
      text: "Budget tracking feels effortless now. The dashboard is clean and easy to understand.",
    },
    {
      name: "Siam Ahmed",
      role: "Freelancer",
      text: "The AI insights helped me spot unnecessary spending and manage my monthly budget better.",
    },
    {
      name: "Tanvir Hasan",
      role: "Developer",
      text: "Simple, fast and genuinely useful for keeping daily expenses organized.",
    },
    {
      name: "Aisha Khan",
      role: "Entrepreneur",
      text: "I love how quickly I can log expenses and see where my money is going.",
    },
    {
      name: "Daniel Brooks",
      role: "Marketing Executive",
      text: "This app made budgeting much less stressful. Everything feels intuitive and smooth.",
    },
    {
      name: "Sophia Turner",
      role: "Graphic Designer",
      text: "The interface is beautiful and the spending insights are surprisingly helpful.",
    },
    {
      name: "Michael Reed",
      role: "Remote Worker",
      text: "I finally have a clear picture of my monthly expenses without using complicated spreadsheets.",
    },
    {
      name: "Emma Collins",
      role: "Teacher",
      text: "It keeps my personal finances organized and helps me stay within budget every month.",
    },
    {
      name: "James Walker",
      role: "Small Business Owner",
      text: "A practical and polished tool that makes expense management feel simple.",
    },
    {
      name: "Olivia Bennett",
      role: "Content Creator",
      text: "Tracking my spending habits has never been this easy. The experience feels seamless.",
    },
  ];

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

        <div className="w-full flex flex-col items-center gap-10">
          <p className="text-5xl text-black font-bold text-center">
            How to use
          </p>
          <ul class="steps steps-vertical lg:steps-horizontal font-bold">
            <li class="step step-neutral">Sign up</li>
            <li class="step step-neutral">Log expenses and Incomes</li>
            <li class="step step-neutral">Set budgets</li>
            <li class="step step-neutral">
              Get insights and Track financial activities
            </li>
          </ul>
        </div>

        {/* Review section */}

        <div className="w-full flex flex-col gap-8 overflow-hidden mb-30">
          <p className="text-5xl text-black font-bold text-center">
            What users say
          </p>

          <div className="overflow-hidden w-full">
            <div className="flex w-max gap-6 animate-[marquee_40s_linear_infinite] hover:[animation-play-state:paused]">
              {
              reviews.map((review, index) => (
                  <div
                    key={index}
                    className="flex flex-col justify-between min-w-[320px] max-w-[320px] rounded-3xl border-2 border-white bg-black text-white p-6"
                  >
                    <p className="text-sm leading-7 text-gray-300">
                      "{review.text}"
                    </p>
                    <div className="mt-5">
                      <h3 className="text-lg font-semibold">{review.name}</h3>
                      <p className="text-sm text-gray-400">{review.role}</p>
                    </div>
                  </div>
                )
              )
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
