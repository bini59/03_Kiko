import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  decoration?: "tape" | "tack" | "none";
}

const WOBBLY_MD_RADIUS = "15px 225px 15px 255px / 255px 15px 225px 15px";

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ decoration = "none", className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`relative bg-white border-2 border-foreground shadow-[3px_3px_0px_0px_rgba(45,45,45,0.1)] p-6 ${className}`}
        style={{ borderRadius: WOBBLY_MD_RADIUS }}
        {...props}
      >
        {decoration === "tape" && (
          <div
            className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-foreground/10 rotate-1"
            style={{ borderRadius: "2px" }}
          />
        )}
        {decoration === "tack" && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-accent border-2 border-foreground" />
        )}
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export { Card };
export type { CardProps };
