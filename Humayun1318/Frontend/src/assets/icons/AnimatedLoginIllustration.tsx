export default function AnimatedLoginIllustration() {
  return (
    <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="coinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#fbbf24", stopOpacity: 1 }} />
          <stop
            offset="100%"
            style={{ stopColor: "#f59e0b", stopOpacity: 1 }}
          />
        </linearGradient>

        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Rotating outer ring */}
      <circle
        cx="200"
        cy="200"
        r="180"
        stroke="#10b981"
        strokeWidth="2"
        strokeDasharray="10 10"
        fill="none"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 200 200"
          to="360 200 200"
          dur="20s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Pulsing inner circle */}
      <circle cx="200" cy="200" r="40" fill="#10b981" fillOpacity="0.2">
        <animate
          attributeName="r"
          values="40;45;40"
          dur="2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="fillOpacity"
          values="0.2;0.3;0.2"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Bouncing money bag */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 0; 0 -10; 0 0"
          dur="1.5s"
          repeatCount="indefinite"
        />
        <rect
          x="180"
          y="160"
          width="40"
          height="60"
          rx="8"
          fill="#10b981"
          fillOpacity="0.9"
        >
          <animate
            attributeName="fillOpacity"
            values="0.9;0.7;0.9"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </rect>
        <path
          d="M160 220 L240 220 L220 260 L180 260 Z"
          fill="#10b981"
          fillOpacity="0.7"
        />
      </g>

      {/* Spinning coin 1 */}
      <g transform="translate(120, 120)">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 120 120"
          to="360 120 120"
          dur="3s"
          repeatCount="indefinite"
        />
        <circle
          cx="120"
          cy="120"
          r="20"
          fill="url(#coinGradient)"
          filter="url(#glow)"
        />
        <text
          x="120"
          y="127"
          textAnchor="middle"
          fill="#fff"
          fontSize="14"
          fontWeight="bold"
        >
          ৳
        </text>
      </g>

      {/* Spinning coin 2 - opposite direction */}
      <g transform="translate(280, 280)">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="360 280 280"
          to="0 280 280"
          dur="4s"
          repeatCount="indefinite"
        />
        <circle
          cx="280"
          cy="280"
          r="15"
          fill="url(#coinGradient)"
          filter="url(#glow)"
        />
        <text
          x="280"
          y="286"
          textAnchor="middle"
          fill="#fff"
          fontSize="11"
          fontWeight="bold"
        >
          ৳
        </text>
      </g>

      {/* Pulsing center icon */}
      <g filter="url(#glow)">
        <circle cx="200" cy="200" r="30" fill="#10b981" fillOpacity="0.3">
          <animate
            attributeName="r"
            values="30;35;30"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
        <text
          x="200"
          y="212"
          textAnchor="middle"
          fill="#10b981"
          fontSize="32"
          fontWeight="bold"
        >
          ৳
          <animate
            attributeName="fill"
            values="#10b981;#34d399;#10b981"
            dur="2s"
            repeatCount="indefinite"
          />
        </text>
      </g>

      {/* Animated rays */}
      <g opacity="0.3">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <line
            key={angle}
            x1="200"
            y1="200"
            x2="200"
            y2="140"
            stroke="#10b981"
            strokeWidth="2"
            transform={`rotate(${angle} 200 200)`}
          >
            <animate
              attributeName="y2"
              values="140;120;140"
              dur="1.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="strokeOpacity"
              values="0.3;0.6;0.3"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </line>
        ))}
      </g>
    </svg>
  );
}
