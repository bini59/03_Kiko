import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

const WOBBLY_RADIUS = "255px 15px 225px 15px / 15px 225px 15px 255px";

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", children, ...props }, ref) => {
    const base =
      "font-body text-lg px-6 py-3 border-[3px] border-foreground transition-all duration-100 cursor-pointer";

    const variants = {
      primary:
        "bg-white text-foreground shadow-hard hover:bg-accent hover:text-white hover:shadow-hard-sm hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]",
      secondary:
        "bg-muted text-foreground shadow-hard hover:bg-secondary hover:text-white hover:shadow-hard-sm hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]",
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${className}`}
        style={{ borderRadius: WOBBLY_RADIUS }}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps };
