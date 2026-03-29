export function BearWorking() {
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      {/* Ears */}
      <circle cx="68" cy="72" r="18" fill="#8B6B4A" />
      <circle cx="132" cy="72" r="18" fill="#8B6B4A" />
      <circle cx="68" cy="72" r="11" fill="#A0845C" />
      <circle cx="132" cy="72" r="11" fill="#A0845C" />

      {/* Body */}
      <ellipse cx="100" cy="148" rx="42" ry="36" fill="#8B6B4A" />

      {/* Head */}
      <circle cx="100" cy="98" r="38" fill="#A0845C" />

      {/* Face / muzzle */}
      <ellipse cx="100" cy="108" rx="18" ry="13" fill="#F5E6D0" />

      {/* Eyes — looking down at screen (dot eyes) */}
      <circle cx="88" cy="100" r="4" fill="#3D2B1F" />
      <circle cx="112" cy="100" r="4" fill="#3D2B1F" />
      {/* Pupils shifted down-right to suggest looking at screen */}
      <circle cx="89.5" cy="101.5" r="1.8" fill="#6B4E35" />
      <circle cx="113.5" cy="101.5" r="1.8" fill="#6B4E35" />

      {/* Nose */}
      <ellipse cx="100" cy="110" rx="4" ry="3" fill="#6B4E35" />

      {/* Arms resting on desk */}
      <ellipse cx="62" cy="152" rx="14" ry="9" fill="#8B6B4A" transform="rotate(-15 62 152)" />
      <ellipse cx="138" cy="152" rx="14" ry="9" fill="#8B6B4A" transform="rotate(15 138 152)" />

      {/* Desk surface */}
      <rect x="40" y="162" width="120" height="8" rx="3" fill="#6B4E35" />

      {/* Laptop base */}
      <rect x="68" y="155" width="64" height="38" rx="4" fill="#4A4A4A" />
      <rect x="70" y="157" width="60" height="33" rx="3" fill="#2A2A2A" />

      {/* Laptop screen glow */}
      <rect x="72" y="159" width="56" height="29" rx="2" fill="#D4E8F0" opacity="0.7" />

      {/* Tiny code lines on screen */}
      <rect x="76" y="164" width="24" height="2" rx="1" fill="#6B8FA0" opacity="0.8" />
      <rect x="76" y="169" width="36" height="2" rx="1" fill="#6B8FA0" opacity="0.8" />
      <rect x="76" y="174" width="18" height="2" rx="1" fill="#6B8FA0" opacity="0.8" />
      <rect x="76" y="179" width="30" height="2" rx="1" fill="#6B8FA0" opacity="0.8" />

      {/* Laptop hinge */}
      <rect x="68" y="190" width="64" height="5" rx="2" fill="#5A5A5A" />
    </svg>
  );
}
