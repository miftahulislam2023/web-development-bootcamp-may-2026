"use client";

import { motion } from "motion/react";
import ProfileCard from "./ProfileCard";
import GeneralSettings from "./GeneralSettings";
import SecuritySettings from "./SecuritySettings";
import DangerZone from "./DangerZone";

interface ProfileManagerProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role: string;
    createdAt: Date;
  };
  stats: {
    transactionCount: number;
    budgetCount: number;
  };
}

export default function ProfileManager({ user, stats }: ProfileManagerProps) {
  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Profile Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-1/3"
        >
          <div className="sticky top-24">
            <ProfileCard user={user} stats={stats} />
          </div>
        </motion.div>

        {/* Right Column: Settings */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full lg:w-2/3"
        >
          <GeneralSettings user={{ name: user.name }} />
          <SecuritySettings />
          <DangerZone />
        </motion.div>

      </div>
    </div>
  );
}
