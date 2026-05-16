function LogoMark({ className = 'h-10 w-10' }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect height="48" rx="14" width="48" fill="#17212b" />
      <path
        d="M14 18.75C14 15.574 16.574 13 19.75 13h8.5C31.426 13 34 15.574 34 18.75v4.5C34 26.426 31.426 29 28.25 29H23l-6.2 5.2c-.81.68-2.05.104-2.05-.954V28.35A5.75 5.75 0 0114 23.25v-4.5z"
        fill="#2aabee"
      />
      <path
        d="M20 19h8M20 23h5.5"
        stroke="white"
        strokeLinecap="round"
        strokeWidth="2.4"
      />
      <path
        d="M34 30.5c-2.65 2.06-5.945 3.25-9.5 3.25-2.176 0-4.247-.446-6.125-1.25"
        stroke="#9bdcff"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function BrandLogo({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <LogoMark />
      {!compact && (
        <div>
          <p className="text-xl font-semibold leading-6 text-[#111827]">EchoLine</p>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#64748b]">
            Real-time chat
          </p>
        </div>
      )}
    </div>
  );
}

export { BrandLogo, LogoMark };
