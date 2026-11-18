/** Logo van de bordeaux-uitvoering: twee klinkende glazen met PROOST MEE ernaast. Volgt `currentColor`. */
export function WineLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`} role="img" aria-label="Proost Mee">
      <svg viewBox="0 0 64 52" className="h-[2.1em] w-auto shrink-0" aria-hidden fill="none">
        <g transform="rotate(-16 22 30)">
          <path d="M11 6h20l-1.5 15a8.5 8.5 0 0 1-17 0z" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round" />
          <path d="M12.6 15h16.8l-.6 6.4a7.6 7.6 0 0 1-15.6 0z" fill="#ee6b4a" />
          <path d="M21 29.5V43M15 44h12" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        </g>
        <g transform="rotate(16 42 30)">
          <path d="M33 6h20l-1.5 15a8.5 8.5 0 0 1-17 0z" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round" />
          <path d="M34.6 15h16.8l-.6 6.4a7.6 7.6 0 0 1-15.6 0z" fill="#f4a3b6" />
          <path d="M43 29.5V43M37 44h12" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        </g>
        <path d="M32 2v6M29 5h6" stroke="#ee6b4a" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className="font-sans text-[1.05em] leading-[0.9] font-black tracking-[0.02em]">
        PROOST
        <br />
        MEE
      </span>
    </span>
  );
}
