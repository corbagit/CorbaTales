/**
 * CorbaTales Logo — SVG Component
 *
 * Based on brand guidelines:
 * - Icon: Open book with crescent moon + star emerging from pages
 * - Colors: Warm Golden Amber (#F5A623) on dark backgrounds
 * - Tagline: "Every night, a new story." in Nunito
 */

interface LogoProps {
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
  iconOnly?: boolean;
}

export function Logo({ showTagline = false, size = "md", iconOnly = false }: LogoProps) {
  const iconSize = size === "sm" ? 28 : size === "lg" ? 48 : 36;
  const textSize = size === "sm" ? "text-lg" : size === "lg" ? "text-3xl" : "text-xl";
  const taglineSize = size === "sm" ? "text-[10px]" : size === "lg" ? "text-sm" : "text-xs";

  return (
    <div className="flex items-center gap-2.5">
      {/* Storybook + Moon Icon */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="CorbaTales logo"
      >
        {/* Open book pages */}
        <path
          d="M6 12L24 6L42 12V36L24 42L6 36V12Z"
          fill="#1B1B3A"
          stroke="#F5A623"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Book spine */}
        <line x1="24" y1="6" x2="24" y2="42" stroke="#F5A623" strokeWidth="1.5" />
        {/* Left page detail */}
        <path
          d="M10 15L24 10V38L10 33V15Z"
          fill="none"
          stroke="#C4A1E0"
          strokeWidth="0.8"
          strokeOpacity="0.5"
        />
        {/* Right page detail */}
        <path
          d="M38 15L24 10V38L38 33V15Z"
          fill="none"
          stroke="#C4A1E0"
          strokeWidth="0.8"
          strokeOpacity="0.5"
        />
        {/* Crescent Moon */}
        <path
          d="M32 10C32 10 36 14 36 18C36 22 32 26 32 26C34.5 24 36.5 21 36.5 18C36.5 15 34.5 12 32 10Z"
          fill="#F5A623"
        />
        {/* Star */}
        <path
          d="M37 12L38.5 8.5L40 12L43.5 13.5L40 15L38.5 18.5L37 15L33.5 13.5L37 12Z"
          fill="#FFD700"
        />
        {/* Magic sparkles */}
        <circle cx="13" cy="20" r="1" fill="#F5A623" fillOpacity="0.6" />
        <circle cx="15" cy="28" r="0.8" fill="#F5A623" fillOpacity="0.4" />
        <circle cx="33" cy="20" r="0.8" fill="#F5A623" fillOpacity="0.6" />
        <circle cx="31" cy="28" r="1" fill="#F5A623" fillOpacity="0.4" />
      </svg>

      {!iconOnly && (
        <div className="flex flex-col">
          <span className={`${textSize} font-heading font-bold tracking-tight text-white`}>
            CorbaTales
          </span>
          {showTagline && (
            <span className={`${taglineSize} font-body tracking-wider text-amber-300/70`}>
              Every night, a new story.
            </span>
          )}
        </div>
      )}
    </div>
  );
}