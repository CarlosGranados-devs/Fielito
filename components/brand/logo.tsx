import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  variant = "default",
  showWordmark = true,
  size = "md",
}: {
  className?: string;
  variant?: "default" | "light";
  showWordmark?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const markSize = { sm: "h-8 w-8", md: "h-10 w-10", lg: "h-12 w-12" }[size];
  const textSize = { sm: "text-lg", md: "text-xl", lg: "text-2xl" }[size];

  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "relative grid place-items-center rounded-[30%] bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-white shadow-[0_8px_20px_-8px_rgba(245,158,11,0.9)] ring-1 ring-white/40",
          markSize,
        )}
      >
        <svg viewBox="0 0 32 32" fill="none" className="h-[62%] w-[62%]" aria-hidden>
          <path
            d="M11 24V9.5C11 8.12 12.12 7 13.5 7H23"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M11.5 15.2H19.5"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="23" cy="23" r="2.4" fill="currentColor" />
        </svg>
      </span>
      {showWordmark && (
        <span
          className={cn(
            "font-display font-bold tracking-tight",
            textSize,
            variant === "light" ? "text-white" : "text-slate-900",
          )}
        >
          fielito
          <span className="text-amber-500">.</span>
        </span>
      )}
    </Link>
  );
}
