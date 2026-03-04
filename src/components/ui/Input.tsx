import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const WOBBLY_RADIUS = "255px 15px 225px 15px / 15px 225px 15px 255px";

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = "", ...props }, ref) => {
    const borderColor = error ? "border-accent" : "border-foreground";
    const focusBorder = "focus:border-secondary focus:ring-2 focus:ring-secondary/20";

    return (
      <div className="w-full">
        <input
          ref={ref}
          className={`w-full font-body text-lg px-4 py-3 border-2 ${borderColor} bg-white text-foreground placeholder:text-foreground/40 outline-none ${focusBorder} transition-colors ${className}`}
          style={{ borderRadius: WOBBLY_RADIUS }}
          {...props}
        />
        {error && (
          <p className="mt-1 font-body text-sm text-accent">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
export type { InputProps };
