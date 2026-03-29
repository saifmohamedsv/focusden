export function BearIdle() {
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      {/* Zzz text */}
      <g fill="#B8A090" opacity="0.7" fontSize="11" fontFamily="serif" fontWeight="bold">
        <text x="148" y="72" fontSize="10">z</text>
        <text x="156" y="62" fontSize="13">z</text>
        <text x="166" y="50" fontSize="16">Z</text>
      </g>

      {/* Ears — slightly drooped */}
      <circle cx="70" cy="76" r="18" fill="#8B6B4A" />
      <circle cx="130" cy="76" r="18" fill="#8B6B4A" />
      <circle cx="70" cy="76" r="11" fill="#A0845C" />
      <circle cx="130" cy="76" r="11" fill="#A0845C" />

      {/* Body — slumped forward */}
      <ellipse cx="100" cy="158" rx="42" ry="32" fill="#8B6B4A" />

      {/* Head — tilted slightly */}
      <circle cx="100" cy="102" r="38" fill="#A0845C" />

      {/* Face / muzzle */}
      <ellipse cx="100" cy="112" rx="18" ry="13" fill="#F5E6D0" />

      {/* Half-closed eyes (— — shape) */}
      <rect x="82" y="102" width="12" height="3.5" rx="1.5" fill="#3D2B1F" />
      <rect x="106" y="102" width="12" height="3.5" rx="1.5" fill="#3D2B1F" />

      {/* Droopy upper eyelids */}
      <path d="M 82 102 Q 88 99 94 102" fill="#A0845C" />
      <path d="M 106 102 Q 112 99 118 102" fill="#A0845C" />

      {/* Nose */}
      <ellipse cx="100" cy="114" rx="4" ry="3" fill="#6B4E35" />

      {/* Yawning open mouth */}
      <path d="M 90 120 Q 100 132 110 120" fill="#6B4E35" />
      <path d="M 90 120 Q 100 122 110 120" fill="#F5E6D0" />
      {/* Inner mouth */}
      <ellipse cx="100" cy="124" rx="7" ry="5" fill="#5A3A2A" />

      {/* Arms resting/drooping at sides */}
      <ellipse cx="64" cy="155" rx="12" ry="18" fill="#8B6B4A" transform="rotate(10 64 155)" />
      <ellipse cx="136" cy="155" rx="12" ry="18" fill="#8B6B4A" transform="rotate(-10 136 155)" />

      {/* Paws */}
      <circle cx="62" cy="170" r="9" fill="#A0845C" />
      <circle cx="138" cy="170" r="9" fill="#A0845C" />

      {/* Legs */}
      <ellipse cx="84" cy="185" rx="14" ry="9" fill="#8B6B4A" />
      <ellipse cx="116" cy="185" rx="14" ry="9" fill="#8B6B4A" />
    </svg>
  );
}
