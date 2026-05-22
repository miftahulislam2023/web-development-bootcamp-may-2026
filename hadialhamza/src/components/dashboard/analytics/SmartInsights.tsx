"use client";

import { motion } from "motion/react";
import { 
  Lightbulb, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Tag, 
  AlertCircle 
} from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

interface Insight {
  type: 'warning' | 'success' | 'info';
  text: string;
  icon: string;
}

interface SmartInsightsProps {
  insights: Insight[];
  isLoading: boolean;
}

const InsightIcon = ({ name, className }: { name: string; className?: string }) => {
  switch (name) {
    case 'TrendingUp': return <TrendingUp className={className} />;
    case 'TrendingDown': return <TrendingDown className={className} />;
    case 'Wallet': return <Wallet className={className} />;
    case 'Tag': return <Tag className={className} />;
    case 'AlertCircle': return <AlertCircle className={className} />;
    default: return <Lightbulb className={className} />;
  }
};

export default function SmartInsights({ insights, isLoading }: SmartInsightsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 px-2">
        <Lightbulb className="w-5 h-5 text-amber-500" />
        <h3 className="text-xl font-black text-foreground">Smart Insights</h3>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          [1, 2, 3].map(i => <Skeleton key={`insight-skeleton-${i}`} className="w-full h-24 rounded-2xl" />)
        ) : insights.length > 0 ? (
          insights.map((insight, i) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i}
              className={cn(
                "p-6 rounded-2xl border-2 flex gap-4 items-start relative overflow-hidden group hover:scale-[1.02] transition-all",
                insight.type === 'warning' ? "bg-rose-500/5 border-rose-500/10" :
                insight.type === 'success' ? "bg-emerald-500/5 border-emerald-500/10" :
                "bg-primary/5 border-primary/10"
              )}
            >
              <div className={cn(
                "p-3 rounded-xl",
                insight.type === 'warning' ? "bg-rose-500/10 text-rose-500" :
                insight.type === 'success' ? "bg-emerald-500/10 text-emerald-500" :
                "bg-primary/10 text-primary"
              )}>
                <InsightIcon name={insight.icon} className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-black text-foreground leading-snug">
                  {insight.text}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">
                  Auto-generated insight
                </p>
              </div>
              
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <InsightIcon name={insight.icon} className="w-12 h-12" />
              </div>
            </motion.div>
          ))
        ) : (
          <div className="p-10 border-2 border-dashed border-border rounded-2xl text-center">
            <p className="text-sm font-bold text-muted-foreground">More data needed for insights</p>
          </div>
        )}
      </div>
    </div>
  );
}
