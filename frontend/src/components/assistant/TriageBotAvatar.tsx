// TriageBotAvatar.tsx - Animated SVG mascot for SmartTriage (blink, scan, antenna sway).
import { cn } from "@/lib/utils";

type TriageBotAvatarProps = {
  className?: string;
  compact?: boolean;
};

export function TriageBotAvatar({ className, compact = false }: TriageBotAvatarProps) {
  const sizeClass = compact ? "h-20 w-20" : "h-72 w-72 md:h-80 md:w-80";

  return (
    <svg
      className={cn(sizeClass, "drop-shadow-[0_24px_44px_rgba(35,45,80,0.18)]", className)}
      viewBox="0 0 320 320"
      role="img"
      aria-label="TriageBot, trợ lý AI của SmartTriage"
    >
      <defs>
        <linearGradient id="triageBotBody" x1="80" x2="244" y1="78" y2="250" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#dbeafe" />
        </linearGradient>
        <linearGradient id="triageBotScreen" x1="93" x2="225" y1="118" y2="205" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2364d2" />
          <stop offset="1" stopColor="#153e8a" />
        </linearGradient>
        <clipPath id="triageBotScreenClip">
          <rect x="89" y="103" width="142" height="116" rx="38" />
        </clipPath>
      </defs>

      {/* antenna */}
      <g className="st-bot-part st-bot-antenna">
        <path d="M137 58c0-15 10-27 23-27s23 12 23 27" fill="none" stroke="#171725" strokeWidth="10" strokeLinecap="round" />
        <circle className="st-bot-part st-bot-glow" cx="160" cy="28" r="15" fill="#ff8a3d" />
        <circle cx="160" cy="28" r="12" fill="#ff8a3d" />
        <circle cx="156" cy="24" r="4" fill="#ffe3cc" />
      </g>

      {/* ears */}
      <path className="st-bot-part st-bot-ear-left" d="M68 168c-24 0-42 17-42 39s18 39 42 39" fill="#fff3d6" />
      <path className="st-bot-part st-bot-ear-right" d="M252 168c24 0 42 17 42 39s-18 39-42 39" fill="#fff3d6" />

      {/* body */}
      <path
        d="M77 146c0-49 37-88 83-88s83 39 83 88v35c0 49-37 88-83 88s-83-39-83-88v-35Z"
        fill="url(#triageBotBody)"
      />
      <path d="M74 126c-11 8-18 19-21 33M246 126c11 8 18 19 21 33" fill="none" stroke="#171725" strokeWidth="8" strokeLinecap="round" />

      {/* screen face */}
      <rect x="89" y="103" width="142" height="116" rx="38" fill="url(#triageBotScreen)" />
      <g clipPath="url(#triageBotScreenClip)">
        <rect className="st-bot-scanline" x="97" y="106" width="126" height="5" rx="2.5" fill="#7aa5ff" />
      </g>

      {/* eyes + cheeks + mouth */}
      <g className="st-bot-part st-bot-eye">
        <circle cx="132" cy="156" r="12" fill="#fffaf0" />
        <circle cx="136" cy="152" r="4" fill="#7aa5ff" />
      </g>
      <g className="st-bot-part st-bot-eye">
        <circle cx="188" cy="156" r="12" fill="#fffaf0" />
        <circle cx="192" cy="152" r="4" fill="#7aa5ff" />
      </g>
      <ellipse cx="112" cy="184" rx="10" ry="6.5" fill="#ff8a3d" opacity="0.45" />
      <ellipse cx="208" cy="184" rx="10" ry="6.5" fill="#ff8a3d" opacity="0.45" />
      <path d="M132 188c16 15 40 15 56 0" fill="none" stroke="#fffaf0" strokeWidth="9" strokeLinecap="round" />

      {/* base */}
      <path d="M108 240h104l-8 38h-88l-8-38Z" fill="#171725" />
      <path d="M126 240h68v22h-68z" fill="#ff8a3d" />

      {/* status blips */}
      <circle className="st-bot-part st-bot-blip" cx="90" cy="98" r="16" fill="#20a67a" />
      <circle
        className="st-bot-part st-bot-blip"
        cx="232"
        cy="94"
        r="13"
        fill="#f6b73c"
        style={{ animationDelay: "600ms" }}
      />
    </svg>
  );
}
