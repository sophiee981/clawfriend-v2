import { cn } from "@/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border border-transparent font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        primary: "",
        secondary: "",
        success: "",
        danger: "",
        warning: "",
        info: "",
        "custom-yellow": "",
        "custom-lime": "",
        "custom-teal": "",
        "custom-indigo": "",
        "custom-pink": "",
      },
      type: {
        fill: "",
        tonal: "",
        outline: "bg-transparent",
      },
      size: {
        md: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    compoundVariants: [
      // Primary variants
      {
        variant: "primary",
        type: "fill",
        className: "bg-primary text-neutral-onColor hover:bg-primary/80",
      },
      {
        variant: "primary",
        type: "tonal",
        className:
          "bg-primary-muted-10 text-primary hover:bg-primary-muted-20/150",
      },
      {
        variant: "primary",
        type: "outline",
        className:
          "text-primary border-primary-muted hover:bg-primary-muted-10",
      },
      // Secondary variants
      {
        variant: "secondary",
        type: "fill",
        className: "bg-secondary text-neutral-tertiary hover:bg-secondary/80",
      },
      {
        variant: "secondary",
        type: "tonal",
        className:
          "bg-secondary-muted-20 text-neutral-secondary hover:bg-secondary-muted-10",
      },
      {
        variant: "secondary",
        type: "outline",
        className:
          "text-neutral-secondary border border-neutral-02 hover:bg-secondary-muted-10",
      },
      // Success variants
      {
        variant: "success",
        type: "fill",
        className: "bg-success text-neutral-onColor hover:bg-success/80",
      },
      {
        variant: "success",
        type: "tonal",
        className:
          "bg-success-muted-20 text-success hover:bg-success-muted-20/150",
      },
      {
        variant: "success",
        type: "outline",
        className:
          "text-success border-success-muted hover:bg-success-muted-10",
      },
      // Danger variants
      {
        variant: "danger",
        type: "fill",
        className: "bg-danger text-neutral-onColor hover:bg-danger/80",
      },
      {
        variant: "danger",
        type: "tonal",
        className:
          "bg-danger-muted-20 text-danger hover:bg-danger-muted-20/150",
      },
      {
        variant: "danger",
        type: "outline",
        className: "text-danger border-danger-muted hover:bg-danger-muted-10",
      },
      // Warning variants
      {
        variant: "warning",
        type: "fill",
        className: "bg-warning text-neutral-onColor hover:bg-warning/80",
      },
      {
        variant: "warning",
        type: "tonal",
        className:
          "bg-warning-muted-20 text-warning hover:bg-warning-muted-20/150",
      },
      {
        variant: "warning",
        type: "outline",
        className:
          "text-warning border-warning-muted hover:bg-warning-muted-10",
      },
      // Info variants
      {
        variant: "info",
        type: "fill",
        className: "bg-info text-neutral-onColor hover:bg-info/80",
      },
      {
        variant: "info",
        type: "tonal",
        className: "bg-info-muted-20 text-info hover:bg-info-muted-20/150",
      },
      {
        variant: "info",
        type: "outline",
        className: "text-info border-info-muted hover:bg-info-muted-10",
      },
      // Custom Yellow variants
      {
        variant: "custom-yellow",
        type: "fill",
        className: "bg-yellow text-neutral-onColor hover:bg-yellow/80",
      },
      {
        variant: "custom-yellow",
        type: "tonal",
        className: "bg-yellow-muted text-yellow hover:bg-yellow-muted/150",
      },
      {
        variant: "custom-yellow",
        type: "outline",
        className: "text-yellow border-yellow-muted hover:bg-yellow-5",
      },
      // Custom Lime variants
      {
        variant: "custom-lime",
        type: "fill",
        className: "bg-lime text-neutral-onColor hover:bg-lime/80",
      },
      {
        variant: "custom-lime",
        type: "tonal",
        className: "bg-lime-muted text-lime hover:bg-lime-muted/150",
      },
      {
        variant: "custom-lime",
        type: "outline",
        className: "text-lime border-lime-muted hover:bg-lime-muted",
      },
      // Custom Teal variants
      {
        variant: "custom-teal",
        type: "fill",
        className: "bg-teal text-neutral-onColor hover:bg-teal/80",
      },
      {
        variant: "custom-teal",
        type: "tonal",
        className: "bg-teal-muted text-teal hover:bg-teal-muted/150",
      },
      {
        variant: "custom-teal",
        type: "outline",
        className: "text-teal border-teal-muted hover:bg-teal-muted",
      },
      // Custom Indigo variants
      {
        variant: "custom-indigo",
        type: "fill",
        className: "bg-indigo text-neutral-onColor hover:bg-indigo/80",
      },
      {
        variant: "custom-indigo",
        type: "tonal",
        className: "bg-indigo-muted text-indigo hover:bg-indigo-muted/150",
      },
      {
        variant: "custom-indigo",
        type: "outline",
        className: "text-indigo border-indigo-muted hover:bg-indigo-5",
      },
      // Custom Pink variants
      {
        variant: "custom-pink",
        type: "fill",
        className: "bg-pink text-neutral-onColor hover:bg-pink/80",
      },
      {
        variant: "custom-pink",
        type: "tonal",
        className: "bg-pink-muted text-pink hover:bg-pink-muted/150",
      },
      {
        variant: "custom-pink",
        type: "outline",
        className: "text-pink border-pink-muted hover:bg-pink-muted-5",
      },
    ],
    defaultVariants: {
      variant: "primary",
      type: "fill",
      size: "md",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, type, size, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, type, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
