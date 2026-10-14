import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  variant?: "primary" | "ghost";
};

export function ButtonLink({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonLinkProps) {
  return (
    <a
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-md px-5 text-sm font-medium transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark",
        variant === "primary" &&
          "bg-white text-dark hover:bg-light hover:shadow-[0_0_40px_rgba(255,255,255,0.18)]",
        variant === "ghost" &&
          "border border-white/12 bg-white/[0.03] text-light hover:border-white/24 hover:bg-white/[0.07]",
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}
