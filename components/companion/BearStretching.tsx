export function BearStretching() {
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      {/* Ears */}
      <circle cx="70" cy="68" r="18" fill="#8B6B4A" />
      <circle cx="130" cy="68" r="18" fill="#8B6B4A" />
      <circle cx="70" cy="68" r="11" fill="#A0845C" />
      <circle cx="130" cy="68" r="11" fill="#A0845C" />

      {/* Body */}
      <ellipse cx="100" cy="152" rx="38" ry="34" fill="#8B6B4A" />

      {/* Head */}
      <circle cx="100" cy="94" r="38" fill="#A0845C" />

      {/* Face / muzzle */}
      <ellipse cx="100" cy="104" rx="18" ry="13" fill="#F5E6D0" />

      {/* Eyes — gently closed, curved lines */}
      <path d="M 84 96 Q 88 93 92 96" stroke="#3D2B1F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 108 96 Q 112 93 116 96" stroke="#3D2B1F" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Peaceful smile */}
      <path d="M 90 110 Q 100 117 110 110" stroke="#6B4E35" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Nose */}
      <ellipse cx="100" cy="108" rx="4" ry="3" fill="#6B4E35" />

      {/* Rosy cheeks — soft */}
      <circle cx="80" cy="106" r="7" fill="#D4876A" opacity="0.3" />
      <circle cx="120" cy="106" r="7" fill="#D4876A" opacity="0.3" />

      {/* Left arm stretching up and out */}
      <ellipse cx="56" cy="112" rx="10" ry="26" fill="#8B6B4A" transform="rotate(-55 56 112)" />
      <circle cx="36" cy="92" r="10" fill="#A0845C" />

      {/* Right arm stretching up and out */}
      <ellipse cx="144" cy="112" rx="10" ry="26" fill="#8B6B4A" transform="rotate(55 144 112)" />
      <circle cx="164" cy="92" r="10" fill="#A0845C" />

      {/* Small stretch lines near paws */}
      <g stroke="#C4A882" strokeWidth="1.5" strokeLinecap="round" opacity="0.6">
        <line x1="28" y1="84" x2="22" y2="80" />
        <line x1="30" y1="90" x2="23" y2="90" />
        <line x1="32" y1="96" x2="26" y2="100" />
        <line x1="172" y1="84" x2="178" y2="80" />
        <line x1="170" y1="90" x2="177" y2="90" />
        <line x1="168" y1="96" x2="174" y2="100" />
      </g>

      {/* Legs */}
      <ellipse cx="84" cy="182" rx="14" ry="10" fill="#8B6B4A" />
      <ellipse cx="116" cy="182" rx="14" ry="10" fill="#8B6B4A" />
    </svg>
  );
}
