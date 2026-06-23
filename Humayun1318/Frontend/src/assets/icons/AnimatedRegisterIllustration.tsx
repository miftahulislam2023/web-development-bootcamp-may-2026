export default function AnimatedRegisterIllustration() {
  return (
    <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="graphGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#10b981", stopOpacity: 1 }} />
          <stop
            offset="100%"
            style={{ stopColor: "#34d399", stopOpacity: 1 }}
          />
        </linearGradient>

        <filter id="softGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Rotating dashed ring */}
      <circle
        cx="200"
        cy="200"
        r="160"
        stroke="#10b981"
        strokeWidth="3"
        strokeDasharray="8 8"
        fill="none"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="360 200 200"
          to="0 200 200"
          dur="15s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Growing graph line */}
      <g>
        <path
          d="M60 300 L140 220 L200 250 L280 160 L340 190"
          stroke="url(#graphGradient)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        >
          <animate
            attributeName="stroke-dasharray"
            values="0 500;500 0"
            dur="3s"
            repeatCount="indefinite"
          />
        </path>

        {/* Graph points with pulse animation */}
        {[
          { cx: 60, cy: 300, delay: "0s" },
          { cx: 140, cy: 220, delay: "0.5s" },
          { cx: 200, cy: 250, delay: "1s" },
          { cx: 280, cy: 160, delay: "1.5s" },
          { cx: 340, cy: 190, delay: "2s" },
        ].map((point, idx) => (
          <circle
            key={idx}
            cx={point.cx}
            cy={point.cy}
            r="6"
            fill="#10b981"
            filter="url(#softGlow)"
          >
            <animate
              attributeName="r"
              values="6;10;6"
              dur="1.5s"
              begin={point.delay}
              repeatCount="indefinite"
            />
            <animate
              attributeName="fillOpacity"
              values="1;0.5;1"
              dur="1.5s"
              begin={point.delay}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </g>

      {/* Floating coins with different animations */}
      {/* Coin 1 - Floating up */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 0; 0 -15; 0 0"
          dur="2s"
          repeatCount="indefinite"
        />
        <circle
          cx="100"
          cy="100"
          r="18"
          fill="url(#graphGradient)"
          opacity="0.8"
        />
        <text
          x="100"
          y="107"
          textAnchor="middle"
          fill="#fff"
          fontSize="12"
          fontWeight="bold"
        >
          +
        </text>
      </g>

      {/* Coin 2 - Rotating */}
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 300 100"
          to="360 300 100"
          dur="3s"
          repeatCount="indefinite"
        />
        <circle cx="300" cy="100" r="14" fill="#fbbf24" opacity="0.9" />
        <text
          x="300"
          y="106"
          textAnchor="middle"
          fill="#fff"
          fontSize="10"
          fontWeight="bold"
        >
          $
        </text>
      </g>

      {/* Growing bar chart */}
      <g transform="translate(260, 250)">
        {/* Bar 1 */}
        <rect
          x="0"
          y="20"
          width="20"
          height="60"
          rx="3"
          fill="#10b981"
          opacity="0.6"
        >
          <animate
            attributeName="height"
            values="20;60;20"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y"
            values="60;20;60"
            dur="2s"
            repeatCount="indefinite"
          />
        </rect>

        {/* Bar 2 */}
        <rect
          x="25"
          y="10"
          width="20"
          height="70"
          rx="3"
          fill="#34d399"
          opacity="0.7"
        >
          <animate
            attributeName="height"
            values="30;70;30"
            dur="2.5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y"
            values="50;10;50"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </rect>

        {/* Bar 3 */}
        <rect
          x="50"
          y="30"
          width="20"
          height="50"
          rx="3"
          fill="#10b981"
          opacity="0.8"
        >
          <animate
            attributeName="height"
            values="40;80;40"
            dur="1.8s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y"
            values="40;0;40"
            dur="1.8s"
            repeatCount="indefinite"
          />
        </rect>
      </g>

      {/* Pulsing center */}
      <circle
        cx="200"
        cy="200"
        r="50"
        fill="none"
        stroke="#10b981"
        strokeWidth="1"
        opacity="0.3"
      >
        <animate
          attributeName="r"
          values="50;70;50"
          dur="2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.3;0;0.3"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>

      <circle cx="200" cy="200" r="35" fill="#10b981" fillOpacity="0.15">
        <animate
          attributeName="r"
          values="35;45;35"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </circle>

      {/* User icon with pulse */}
      <g filter="url(#softGlow)">
        <circle
          cx="200"
          cy="195"
          r="15"
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
        >
          <animate
            attributeName="stroke"
            values="#10b981;#34d399;#10b981"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
        <path
          d="M180 230 Q200 215 220 230"
          stroke="#10b981"
          strokeWidth="2"
          fill="none"
        >
          <animate
            attributeName="stroke"
            values="#10b981;#34d399;#10b981"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>
      </g>
    </svg>
  );
}
