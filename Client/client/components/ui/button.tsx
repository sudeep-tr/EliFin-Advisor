import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const base = "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none";
    const styles =
      variant === "outline"
        ? "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50"
        : "bg-primary text-primary-foreground hover:opacity-90";
    return <button ref={ref} className={cn(base, styles, className)} {...props} />;
  }
);
Button.displayName = "Button";
