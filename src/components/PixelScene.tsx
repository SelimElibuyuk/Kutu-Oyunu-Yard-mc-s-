import React from 'react';

export const PixelScene: React.FC = () => {
  return (
    <div className="w-full relative overflow-hidden select-none pointer-events-none">
      <svg
        viewBox="0 0 800 220"
        className="w-full h-auto max-h-56 block mx-auto"
        preserveAspectRatio="xMidYBottom meet"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft Sky Background is handled by parent, but let's add pixel clouds */}
        {/* Cloud 1 */}
        <g opacity="0.9">
          <rect x="60" y="30" width="80" height="20" fill="white" stroke="#0f172a" strokeWidth="2.5" />
          <rect x="80" y="16" width="40" height="20" fill="white" stroke="#0f172a" strokeWidth="2.5" />
          <rect x="70" y="24" width="60" height="15" fill="white" />
        </g>

        {/* Cloud 2 */}
        <g opacity="0.85">
          <rect x="640" y="40" width="90" height="20" fill="white" stroke="#0f172a" strokeWidth="2.5" />
          <rect x="665" y="26" width="45" height="20" fill="white" stroke="#0f172a" strokeWidth="2.5" />
          <rect x="655" y="34" width="65" height="15" fill="white" />
        </g>

        {/* Floating 8-Bit Dice in Sky */}
        <g transform="translate(180, 25) rotate(-10)">
          <rect x="0" y="0" width="30" height="30" rx="4" fill="#fef08a" stroke="#0f172a" strokeWidth="2.5" />
          <circle cx="8" cy="8" r="2.5" fill="#0f172a" />
          <circle cx="22" cy="8" r="2.5" fill="#0f172a" />
          <circle cx="15" cy="15" r="2.5" fill="#0f172a" />
          <circle cx="8" cy="22" r="2.5" fill="#0f172a" />
          <circle cx="22" cy="22" r="2.5" fill="#0f172a" />
        </g>

        {/* Floating Meeple in Sky */}
        <g transform="translate(580, 20) rotate(12)">
          {/* Pixel Meeple shape */}
          <rect x="12" y="2" width="10" height="10" fill="#38bdf8" stroke="#0f172a" strokeWidth="2" />
          <rect x="5" y="12" width="24" height="8" fill="#38bdf8" stroke="#0f172a" strokeWidth="2" />
          <rect x="7" y="20" width="20" height="12" fill="#38bdf8" stroke="#0f172a" strokeWidth="2" />
          <rect x="2" y="30" width="10" height="8" fill="#38bdf8" stroke="#0f172a" strokeWidth="2" />
          <rect x="22" y="30" width="10" height="8" fill="#38bdf8" stroke="#0f172a" strokeWidth="2" />
        </g>

        {/* Rolling Green Hills in background */}
        <path
          d="M-20 220 C120 130, 240 145, 400 170 C560 195, 680 140, 820 180 L820 220 L-20 220 Z"
          fill="#86efac"
          stroke="#0f172a"
          strokeWidth="3"
        />

        {/* Main Rolling Green Hill Foreground */}
        <path
          d="M-20 220 Q180 150 400 165 Q620 180 820 160 L820 220 L-20 220 Z"
          fill="#4ade80"
          stroke="#0f172a"
          strokeWidth="3.5"
        />

        {/* Pine Trees (Pixel Style) Left */}
        <g transform="translate(100, 110)">
          {/* Trunk */}
          <rect x="18" y="45" width="8" height="15" fill="#78350f" stroke="#0f172a" strokeWidth="2" />
          {/* Leaves */}
          <polygon points="22,5 4,45 40,45" fill="#15803d" stroke="#0f172a" strokeWidth="2.5" />
          <polygon points="22,18 8,45 36,45" fill="#22c55e" />
        </g>
        <g transform="translate(60, 125) scale(0.8)">
          <rect x="18" y="45" width="8" height="15" fill="#78350f" stroke="#0f172a" strokeWidth="2" />
          <polygon points="22,5 4,45 40,45" fill="#15803d" stroke="#0f172a" strokeWidth="2.5" />
          <polygon points="22,18 8,45 36,45" fill="#22c55e" />
        </g>

        {/* Pine Trees Right */}
        <g transform="translate(660, 115)">
          <rect x="18" y="45" width="8" height="15" fill="#78350f" stroke="#0f172a" strokeWidth="2" />
          <polygon points="22,5 4,45 40,45" fill="#15803d" stroke="#0f172a" strokeWidth="2.5" />
          <polygon points="22,18 8,45 36,45" fill="#22c55e" />
        </g>
        <g transform="translate(710, 125) scale(0.85)">
          <rect x="18" y="45" width="8" height="15" fill="#78350f" stroke="#0f172a" strokeWidth="2" />
          <polygon points="22,5 4,45 40,45" fill="#15803d" stroke="#0f172a" strokeWidth="2.5" />
          <polygon points="22,18 8,45 36,45" fill="#22c55e" />
        </g>

        {/* PIXEL CASTLE (CENTER) */}
        <g transform="translate(340, 60)">
          {/* Castle Main Wall Base */}
          <rect x="15" y="45" width="90" height="70" fill="#f8fafc" stroke="#0f172a" strokeWidth="3" />
          {/* Main Wall Stones decoration */}
          <rect x="30" y="55" width="14" height="6" fill="#cbd5e1" stroke="#0f172a" strokeWidth="1.5" />
          <rect x="70" y="65" width="14" height="6" fill="#cbd5e1" stroke="#0f172a" strokeWidth="1.5" />
          <rect x="40" y="80" width="14" height="6" fill="#cbd5e1" stroke="#0f172a" strokeWidth="1.5" />

          {/* Castle Gate */}
          <path d="M47 115 L47 88 Q60 76 73 88 L73 115 Z" fill="#78350f" stroke="#0f172a" strokeWidth="3" />
          <line x1="60" y1="80" x2="60" y2="115" stroke="#451a03" strokeWidth="2" />
          <line x1="47" y1="95" x2="73" y2="95" stroke="#451a03" strokeWidth="2" />
          <line x1="47" y1="105" x2="73" y2="105" stroke="#451a03" strokeWidth="2" />

          {/* Center Battlements */}
          <rect x="25" y="37" width="12" height="10" fill="#f8fafc" stroke="#0f172a" strokeWidth="2.5" />
          <rect x="45" y="37" width="12" height="10" fill="#f8fafc" stroke="#0f172a" strokeWidth="2.5" />
          <rect x="65" y="37" width="12" height="10" fill="#f8fafc" stroke="#0f172a" strokeWidth="2.5" />
          <rect x="85" y="37" width="12" height="10" fill="#f8fafc" stroke="#0f172a" strokeWidth="2.5" />

          {/* Left Tower */}
          <rect x="0" y="25" width="26" height="90" fill="#e2e8f0" stroke="#0f172a" strokeWidth="3" />
          <rect x="8" y="50" width="8" height="14" rx="3" fill="#0f172a" />
          {/* Left Tower Battlements */}
          <rect x="-2" y="16" width="9" height="11" fill="#e2e8f0" stroke="#0f172a" strokeWidth="2.5" />
          <rect x="10" y="16" width="8" height="11" fill="#e2e8f0" stroke="#0f172a" strokeWidth="2.5" />
          <rect x="20" y="16" width="8" height="11" fill="#e2e8f0" stroke="#0f172a" strokeWidth="2.5" />
          {/* Left Tower Flag */}
          <line x1="13" y1="16" x2="13" y2="-5" stroke="#0f172a" strokeWidth="2.5" />
          <polygon points="13,-5 28,0 13,6" fill="#ef4444" stroke="#0f172a" strokeWidth="2" />

          {/* Right Tower */}
          <rect x="94" y="25" width="26" height="90" fill="#e2e8f0" stroke="#0f172a" strokeWidth="3" />
          <rect x="104" y="50" width="8" height="14" rx="3" fill="#0f172a" />
          {/* Right Tower Battlements */}
          <rect x="92" y="16" width="8" height="11" fill="#e2e8f0" stroke="#0f172a" strokeWidth="2.5" />
          <rect x="102" y="16" width="8" height="11" fill="#e2e8f0" stroke="#0f172a" strokeWidth="2.5" />
          <rect x="114" y="16" width="8" height="11" fill="#e2e8f0" stroke="#0f172a" strokeWidth="2.5" />
          {/* Right Tower Flag */}
          <line x1="107" y1="16" x2="107" y2="-5" stroke="#0f172a" strokeWidth="2.5" />
          <polygon points="107,-5 122,0 107,6" fill="#3b82f6" stroke="#0f172a" strokeWidth="2" />

          {/* Center High Spire */}
          <rect x="46" y="12" width="28" height="28" fill="#f1f5f9" stroke="#0f172a" strokeWidth="2.5" />
          <polygon points="60,-12 42,14 78,14" fill="#38bdf8" stroke="#0f172a" strokeWidth="2.5" />
          <line x1="60" y1="-12" x2="60" y2="-24" stroke="#0f172a" strokeWidth="2.5" />
          <polygon points="60,-24 76,-18 60,-13" fill="#facc15" stroke="#0f172a" strokeWidth="2" />
        </g>

        {/* Little pixel flowers & grass blades on hill */}
        <g transform="translate(240, 185)">
          <circle cx="0" cy="0" r="3" fill="#fef08a" stroke="#0f172a" strokeWidth="1.5" />
          <circle cx="8" cy="-2" r="3" fill="#f43f5e" stroke="#0f172a" strokeWidth="1.5" />
        </g>
        <g transform="translate(520, 180)">
          <circle cx="0" cy="0" r="3" fill="#f43f5e" stroke="#0f172a" strokeWidth="1.5" />
          <circle cx="7" cy="2" r="3" fill="#fef08a" stroke="#0f172a" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
};
