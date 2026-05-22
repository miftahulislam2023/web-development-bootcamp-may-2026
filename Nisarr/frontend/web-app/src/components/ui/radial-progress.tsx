import React from 'react';

export function RadialProgress({
  progress,
  size = 52,
  strokeWidth = 5,
  color = "#00D4AA",
  children
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  children?: React.ReactNode;
}) {
  const r = (size - strokeWidth) / 2;
  const c = r * 2 * Math.PI;
  const o = c - (Math.min(100, Math.max(0, progress)) / 100) * c;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor"
          strokeWidth={strokeWidth} className="text-muted-foreground/10" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color}
          strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={o}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }} />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">{children}</div>
      )}
    </div>
  );
}
