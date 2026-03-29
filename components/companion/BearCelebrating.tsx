export function BearCelebrating() {
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      {/* Sparkles */}
      <g fill="#E8C84A" opacity="0.9">
        {/* Top-left sparkle */}
        <polygon points="28,32 30,26 32,32 38,30 32,34 30,40 28,34 22,30" />
        {/* Top-right sparkle */}
        <polygon points="168,28 170,22 172,28 178,26 172,30 170,36 168,30 162,26" />
        {/* Small dots */}
        <circle cx="45" cy="22" r="3" />
        <circle cx="155" cy="38" r="3" />
        <circle cx="22" cy="52" r="2" />
        <circle cx="178" cy="55" r="2" />
        <circle cx="35" cy="65" r="2.5" opacity="0.6" />
        <circle cx="165" cy="68" r="2.5" opacity="0.6" />
      </g>

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

      {/* Eyes — happy ^ ^ shape */}
      <path d="M 84 94 Q 88 89 92 94" stroke="#3D2B1F" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M 108 94 Q 112 89 116 94" stroke="#3D2B1F" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Rosy cheeks */}
      <circle cx="80" cy="104" r="7" fill="#D4876A" opacity="0.4" />
      <circle cx="120" cy="104" r="7" fill="#D4876A" opacity="0.4" />

      {/* Big smile */}
      <path d="M 88 108 Q 100 118 112 108" stroke="#6B4E35" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Nose */}
      <ellipse cx="100" cy="106" rx="4" ry="3" fill="#6B4E35" />

      {/* Arms raised in celebration */}
      {/* Left arm up */}
      <ellipse cx="58" cy="118" rx="10" ry="22" fill="#8B6B4A" transform="rotate(-40 58 118)" />
      <circle cx="42" cy="104" r="10" fill="#A0845C" />

      {/* Right arm up */}
      <ellipse cx="142" cy="118" rx="10" ry="22" fill="#8B6B4A" transform="rotate(40 142 118)" />
      <circle cx="158" cy="104" r="10" fill="#A0845C" />

      {/* Legs */}
      <ellipse cx="84" cy="182" rx="14" ry="10" fill="#8B6B4A" />
      <ellipse cx="116" cy="182" rx="14" ry="10" fill="#8B6B4A" />
    </svg>
  );
}
