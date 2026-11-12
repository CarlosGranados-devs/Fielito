import { cn, initials } from "@/lib/utils";

interface AvatarProps {
  name: string;
  emoji?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "h-8 w-8 text-[11px]",
  md: "h-10 w-10 text-xs",
  lg: "h-14 w-14 text-base",
};

export function Avatar({ name, emoji, className, size = "md" }: AvatarProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-amber-200 font-semibold text-amber-900 ring-2 ring-white",
        sizes[size],
        className,
      )}
      aria-hidden
    >
      {emoji ?? initials(name)}
    </div>
  );
}
