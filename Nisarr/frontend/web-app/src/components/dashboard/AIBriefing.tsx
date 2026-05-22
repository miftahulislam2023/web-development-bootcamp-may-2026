import { motion } from "framer-motion";
import { Sparkles, TrendingUp, AlertCircle, Lightbulb } from "lucide-react";

interface AIBriefingProps {
  insights: {
    summary: string;
    tips: string[];
    alerts: string[];
  };
}

export function AIBriefing({ insights }: AIBriefingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-card p-5 gradient-border"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <h3 className="font-semibold">AI Daily Briefing</h3>
      </div>

      {/* Summary */}
      <p className="text-sm text-muted-foreground mb-4">{insights.summary}</p>

      {/* Alerts */}
      {insights.alerts.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-warning" />
            <span className="text-xs font-medium text-warning">Attention Needed</span>
          </div>
          <ul className="space-y-1">
            {insights.alerts.map((alert, i) => (
              <li
                key={i}
                className="text-sm text-muted-foreground pl-6 relative before:absolute before:left-2 before:top-2 before:w-1 before:h-1 before:rounded-full before:bg-warning"
              >
                {alert}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tips */}
      {insights.tips.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary">Suggestions</span>
          </div>
          <ul className="space-y-1">
            {insights.tips.map((tip, i) => (
              <li
                key={i}
                className="text-sm text-muted-foreground pl-6 relative before:absolute before:left-2 before:top-2 before:w-1 before:h-1 before:rounded-full before:bg-primary"
              >
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}
