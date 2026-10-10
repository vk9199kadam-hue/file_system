import React from "react";
import { useTheme } from "../ThemeContext.jsx";

/**
 * Official ApniLeap Logo Component
 * - Navy corporate wordmark: "ApniLeap" (Navy in bright mode, Crisp white in dark mode)
 * - Dual-chevron orange diagonal arrows pointing northeast (↗) above the terminal 'p'
 */
export default function ApniLeapLogo({ size = "md", showSubtitle = false, className = "", lightText = false }) {
  let isDark = true;
  try {
    const themeContext = useTheme();
    isDark = themeContext.isDark;
  } catch (e) {
    // fallback if outside context
  }

  const sizeMap = {
    sm: { fontSize: "text-lg", arrowScale: 0.75, gap: "gap-1" },
    md: { fontSize: "text-2xl", arrowScale: 1, gap: "gap-1.5" },
    lg: { fontSize: "text-3xl", arrowScale: 1.25, gap: "gap-2" },
    xl: { fontSize: "text-4xl", arrowScale: 1.5, gap: "gap-2.5" },
  };

  const currentSize = sizeMap[size] || sizeMap.md;
  const wordmarkColor = lightText ? "text-white" : isDark ? "text-white" : "text-[#10346c]";

  return (
    <div className={`inline-flex flex-col select-none ${className}`}>
      <div className={`inline-flex items-baseline ${currentSize.gap} relative`}>
        {/* ApniLeap Wordmark */}
        <span
          className={`font-black tracking-tight ${currentSize.fontSize} ${wordmarkColor} transition-colors`}
          style={{ fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" }}
        >
          ApniLeap
        </span>

        {/* Official Upward-Right Dual Orange Chevron */}
        <span className="relative -top-2 inline-flex items-center justify-center">
          <svg
            width={22 * currentSize.arrowScale}
            height={22 * currentSize.arrowScale}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transform transition-transform hover:scale-110"
          >
            {/* Lower / Inner Chevron */}
            <path
              d="M5 19L15 9M15 9V17M15 9H7"
              stroke="#ea580c"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Upper / Accent Chevron */}
            <path
              d="M17 5H21V9"
              stroke="#f97316"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      {showSubtitle && (
        <span className={`text-[10px] font-semibold tracking-wider uppercase font-mono -mt-1 ${
          isDark ? "text-slate-400" : "text-slate-500"
        }`}>
          Enterprise Smart Backup &amp; Disaster Recovery
        </span>
      )}
    </div>
  );
}

/**
 * Standalone Icon Mark (for small headers / favicon / avatars)
 */
export function ApniLeapIcon({ className = "w-9 h-9" }) {
  return (
    <div className={`rounded-xl bg-gradient-to-tr from-[#10346c] to-[#1e40af] p-1.5 flex items-center justify-center shadow-md shadow-blue-900/20 ${className}`}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <path
          d="M6 18L16 8M16 8V15M16 8H9"
          stroke="#ea580c"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17 5H21V9"
          stroke="#fb923c"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
