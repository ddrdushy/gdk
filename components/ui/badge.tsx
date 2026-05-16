import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-navy-900 text-white",
        secondary:
          "border-transparent bg-navy-100 text-navy-900",
        outline:
          "border-navy-200 text-navy-700 bg-transparent",
        verified:
          "border-emerald-200 bg-emerald-50 text-emerald-700",
        pending:
          "border-amber-200 bg-amber-50 text-amber-700",
        risk:
          "border-rose-200 bg-rose-50 text-rose-700",
        accent:
          "border-sky-200 bg-sky-50 text-sky-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
