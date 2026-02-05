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
          "bg-secondary-muted-20 text-neutral-secondary hover:bg-secondary-muted-20/150",
      },
      {
        variant: "secondary",
        type: "outline",
        className:
          "text-neutral-secondary border-secondary-muted hover:bg-secondary-muted-10",
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
        className:
          "bg-custom-yellow text-neutral-onColor hover:bg-custom-yellow/80",
      },
      {
        variant: "custom-yellow",
        type: "tonal",
        className:
          "bg-custom-yellow-muted text-custom-yellow hover:bg-custom-yellow-muted/150",
      },
      {
        variant: "custom-yellow",
        type: "outline",
        className:
          "text-custom-yellow border-custom-yellow-muted hover:bg-custom-yellow-5",
      },
      // Custom Lime variants
      {
        variant: "custom-lime",
        type: "fill",
        className:
          "bg-custom-lime text-neutral-onColor hover:bg-custom-lime/80",
      },
      {
        variant: "custom-lime",
        type: "tonal",
        className:
          "bg-custom-lime-muted text-custom-lime hover:bg-custom-lime-muted/150",
      },
      {
        variant: "custom-lime",
        type: "outline",
        className:
          "text-custom-lime border-custom-lime-muted hover:bg-custom-lime-muted",
      },
      // Custom Teal variants
      {
        variant: "custom-teal",
        type: "fill",
        className:
          "bg-custom-teal text-neutral-onColor hover:bg-custom-teal/80",
      },
      {
        variant: "custom-teal",
        type: "tonal",
        className:
          "bg-custom-teal-muted text-custom-teal hover:bg-custom-teal-muted/150",
      },
      {
        variant: "custom-teal",
        type: "outline",
        className:
          "text-custom-teal border-custom-teal-muted hover:bg-custom-teal-muted",
      },
      // Custom Indigo variants
      {
        variant: "custom-indigo",
        type: "fill",
        className:
          "bg-custom-indigo text-neutral-onColor hover:bg-custom-indigo/80",
      },
      {
        variant: "custom-indigo",
        type: "tonal",
        className:
          "bg-custom-indigo-muted text-custom-indigo hover:bg-custom-indigo-muted/150",
      },
      {
        variant: "custom-indigo",
        type: "outline",
        className:
          "text-custom-indigo border-custom-indigo-muted hover:bg-custom-indigo-5",
      },
      // Custom Pink variants
      {
        variant: "custom-pink",
        type: "fill",
        className:
          "bg-custom-pink text-neutral-onColor hover:bg-custom-pink/80",
      },
      {
        variant: "custom-pink",
        type: "tonal",
        className:
          "bg-custom-pink-muted text-custom-pink hover:bg-custom-pink-muted/150",
      },
      {
        variant: "custom-pink",
        type: "outline",
        className:
          "text-custom-pink border-custom-pink-muted hover:bg-custom-pink-muted-5",
      },
    ],
    defaultVariants: {
      variant: "primary",
      type: "fill",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
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
