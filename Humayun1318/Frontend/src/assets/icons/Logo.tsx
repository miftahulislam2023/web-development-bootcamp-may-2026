export default function Logo() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background */}
      <rect width="40" height="40" rx="10" fill="url(#gradient)" />

      {/* Dollar Sign */}
      <text
        x="20"
        y="28"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize="20"
        fontWeight="bold"
        fill="white"
      >
        $
      </text>

      {/* Trend Line */}
      <path
        d="M8 32 L16 24 L24 26 L32 18"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />

      <defs>
        <linearGradient
          id="gradient"
          x1="0"
          y1="0"
          x2="40"
          y2="40"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
    </svg>
  );
}
