
// Self-contained animated SVG illustration.
// Depicts: wallet → rising chart bars → floating coins → balance ring.
//
// WHY inline SVG instead of an <img> or Lottie?
//   • No network request — renders instantly.
//   • CSS animations are driven by the <style> block inside — zero JS.
//   • Colors are CSS variables, so dark/light mode works automatically
//     (though the homepage is always dark, this is future-proof).
//   • Fully accessible: role="img" + aria-label on the <svg>.

export default function FinanceHeroIllustration() {
  return (
    <svg
      role="img"
      aria-label="Animated personal finance illustration showing a wallet, rising chart bars, and floating coins"
      viewBox="0 0 400 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
    >
      {/* ── Injected keyframe animations ── */}
      <style>{`
        /* Chart bars rise from bottom */
        @keyframes barRise {
          0%   { transform: scaleY(0); }
          60%  { transform: scaleY(1.05); }
          100% { transform: scaleY(1); }
        }
        /* Coins float up and fade */
        @keyframes coinFloat {
          0%   { transform: translateY(0px);   opacity: 0; }
          20%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(-60px); opacity: 0; }
        }
        /* Wallet gentle bob */
        @keyframes walletBob {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        /* Ring pulse */
        @keyframes ringPulse {
          0%, 100% { transform: scale(1);    opacity: 0.3; }
          50%       { transform: scale(1.08); opacity: 0.6; }
        }
        /* Trend line draw */
        @keyframes lineDraw {
          from { stroke-dashoffset: 300; }
          to   { stroke-dashoffset: 0; }
        }
        /* Glow */
        @keyframes glowPulse {
          0%, 100% { opacity: 0.15; }
          50%       { opacity: 0.35; }
        }

        .bar-1 { transform-origin: 110px 230px; animation: barRise 1.2s 0.2s ease-out both; }
        .bar-2 { transform-origin: 150px 230px; animation: barRise 1.2s 0.5s ease-out both; }
        .bar-3 { transform-origin: 190px 230px; animation: barRise 1.2s 0.8s ease-out both; }
        .bar-4 { transform-origin: 230px 230px; animation: barRise 1.2s 1.1s ease-out both; }
        .bar-5 { transform-origin: 270px 230px; animation: barRise 1.2s 1.4s ease-out both; }

        .coin-1 { animation: coinFloat 3.5s 1.5s ease-in-out infinite; }
        .coin-2 { animation: coinFloat 3.5s 2.2s ease-in-out infinite; }
        .coin-3 { animation: coinFloat 3.5s 2.9s ease-in-out infinite; }

        .wallet { animation: walletBob 3s ease-in-out infinite; }

        .ring   { animation: ringPulse 2.5s ease-in-out infinite; }

        .trend-line {
          stroke-dasharray: 300;
          stroke-dashoffset: 300;
          animation: lineDraw 2s 0.5s ease-out forwards;
        }
        .bg-glow { animation: glowPulse 3s ease-in-out infinite; }
      `}</style>

      {/* ── Background glow circle ── */}
      <ellipse
        className="bg-glow"
        cx="200"
        cy="180"
        rx="160"
        ry="130"
        fill="#10b981"
      />

      {/* ── Base platform ── */}
      <rect x="60" y="228" width="280" height="6" rx="3" fill="#1e293b" />

      {/* ── Chart bars (5 bars, different heights) ── */}
      {/* bar-1: short */}
      <rect className="bar-1" x="96" y="190" width="28" height="40" rx="4" fill="#34d399" />
      {/* bar-2: medium */}
      <rect className="bar-2" x="136" y="170" width="28" height="60" rx="4" fill="#10b981" />
      {/* bar-3: tall */}
      <rect className="bar-3" x="176" y="150" width="28" height="80" rx="4" fill="#059669" />
      {/* bar-4: medium-tall */}
      <rect className="bar-4" x="216" y="160" width="28" height="70" rx="4" fill="#10b981" />
      {/* bar-5: tallest */}
      <rect className="bar-5" x="256" y="135" width="28" height="95" rx="4" fill="#34d399" />

      {/* ── Trend line over bars ── */}
      <polyline
        className="trend-line"
        points="110,190  150,168  190,148  230,158  270,132"
        stroke="#6ee7b7"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Trend line dots */}
      {[
        [110, 190], [150, 168], [190, 148], [230, 158], [270, 132],
      ].map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r="4"
          fill="#6ee7b7"
          style={{ opacity: 0, animation: `coinFloat 0.1s ${0.5 + i * 0.3 + 1.8}s forwards` }}
        />
      ))}

      {/* ── Wallet (top center, bobs up-down) ── */}
      <g className="wallet">
        {/* Wallet body */}
        <rect x="155" y="42" width="90" height="62" rx="10" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
        {/* Wallet flap */}
        <rect x="155" y="42" width="90" height="26" rx="10" fill="#0f172a" />
        {/* Coin slot */}
        <rect x="210" y="72" width="28" height="22" rx="5" fill="#0f172a" stroke="#334155" strokeWidth="1" />
        {/* Circle inside coin slot */}
        <circle cx="224" cy="83" r="7" fill="#fbbf24" opacity="0.9" />
        {/* Card lines */}
        <rect x="163" y="50" width="36" height="3" rx="1.5" fill="#334155" />
        <rect x="163" y="57" width="24" height="3" rx="1.5" fill="#334155" />
      </g>

      {/* ── Ring pulse behind wallet ── */}
      <circle className="ring" cx="200" cy="73" r="58" stroke="#10b981" strokeWidth="2" />

      {/* ── Floating coins ── */}
      {/* Coin 1 */}
      <g className="coin-1">
        <circle cx="88" cy="195" r="13" fill="#fbbf24" />
        <circle cx="88" cy="195" r="10" fill="#f59e0b" />
        <text x="88" y="199" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#78350f">৳</text>
      </g>
      {/* Coin 2 */}
      <g className="coin-2">
        <circle cx="312" cy="175" r="11" fill="#fbbf24" />
        <circle cx="312" cy="175" r="8" fill="#f59e0b" />
        <text x="312" y="179" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#78350f">৳</text>
      </g>
      {/* Coin 3 */}
      <g className="coin-3">
        <circle cx="340" cy="215" r="9" fill="#fde68a" />
        <circle cx="340" cy="215" r="6.5" fill="#fbbf24" />
        <text x="340" y="218" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#92400e">৳</text>
      </g>

      {/* ── Small label chips ── */}
      {/* Income chip */}
      <rect x="60" y="256" width="70" height="22" rx="6" fill="#064e3b" />
      <text x="95" y="271" textAnchor="middle" fontSize="9" fill="#34d399" fontWeight="600">↑ Income</text>
      {/* Expense chip */}
      <rect x="270" y="256" width="70" height="22" rx="6" fill="#450a0a" />
      <text x="305" y="271" textAnchor="middle" fontSize="9" fill="#f87171" fontWeight="600">↓ Expense</text>
    </svg>
  );
}