import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 disabled:cursor-not-allowed transition-all duration-200 relative overflow-hidden",
  {
    variants: {
      variant: {
        primary: "",
        secondary: "",
        success: "",
        danger: "",
      },
      buttonType: {
        // Filled type: bg-[variant-name], text-primary
        filled: "",
        // Tonal type: bg-[variant-name]-muted-20 text-[variant-name]
        tonal: "",
        // Outline type: border-[variant-name]-muted text-[variant-name]
        outline: "border",
        // Ghost type: bg-transparent, text-[variant-name]
        ghost: "bg-transparent",
        // Transparent type
        transparent: "bg-transparent",
      },
      size: {
        sm: "h-7 px-3 text-sm rounded-lg", // 28px
        md: "h-[36px] px-4 text-sm rounded-lg", // 36px
        lg: "h-[44px] px-6 text-base", // 44px
        xl: "h-[52px] px-8 text-lg", // 52px
      },
    },
    compoundVariants: [
      // PRIMARY FILLED
      {
        variant: "primary",
        buttonType: "filled",
        className:
          "bg-primary shadow hover:after:bg-overlay-light-10 active:after:bg-overlay-dark-40 disabled:opacity-40 after:absolute after:inset-0 after:transition-colors after:duration-200",
      },
      // PRIMARY TONAL
      {
        variant: "primary",
        buttonType: "tonal",
        className:
          "bg-primary-muted-20 text-primary hover:after:bg-primary-muted-20 active:after:bg-primary-muted-20 active:before:bg-primary-muted-20 disabled:opacity-40 after:absolute after:inset-0 after:transition-colors after:duration-200 before:absolute before:inset-0 before:transition-colors before:duration-200",
      },
      // PRIMARY OUTLINE
      {
        variant: "primary",
        buttonType: "outline",
        className:
          "border-primary-muted text-primary hover:bg-primary-muted-20 active:bg-primary-muted-20 active:after:bg-primary-muted-20 disabled:opacity-40 after:absolute after:inset-0 after:transition-colors after:duration-200",
      },
      // PRIMARY GHOST
      {
        variant: "primary",
        buttonType: "ghost",
        className:
          "text-primary hover:bg-primary-muted-20 active:bg-primary-muted-20 active:after:bg-primary-muted-20 disabled:opacity-40 after:absolute after:inset-0 after:transition-colors after:duration-200",
      },
      // SECONDARY FILLED
      {
        variant: "secondary",
        buttonType: "filled",
        className:
          "bg-secondary shadow hover:after:bg-overlay-light-10 active:before:bg-overlay-light-10 active:after:bg-overlay-dark-40 disabled:opacity-40 after:absolute after:inset-0 after:transition-colors after:duration-200 before:absolute before:inset-0 before:transition-colors before:duration-200",
      },
      // SECONDARY TONAL
      {
        variant: "secondary",
        buttonType: "tonal",
        className:
          "bg-neutral-02 hover:bg-secondary-muted-20 hover:after:bg-secondary-muted-20 active:bg-secondary-muted-20 active:after:bg-secondary-muted-20 active:before:bg-secondary-muted-20 disabled:opacity-40 after:absolute after:inset-0 after:transition-colors after:duration-200 before:absolute before:inset-0 before:transition-colors before:duration-200",
      },
      // SECONDARY OUTLINE
      {
        variant: "secondary",
        buttonType: "outline",
        className:
          "border-neutral-02 hover:bg-secondary-muted-20  active:bg-secondary-muted-20 active:after:bg-secondary-muted-20 disabled:opacity-40 after:absolute after:inset-0 after:transition-colors after:duration-200",
      },
      // SECONDARY GHOST
      {
        variant: "secondary",
        buttonType: "ghost",
        className:
          "hover:bg-secondary-muted-20 active:bg-secondary-muted-20 active:after:bg-secondary-muted-20 disabled:opacity-40 after:absolute after:inset-0 after:transition-colors after:duration-200",
      },
      // SECONDARY TRANSPARENT
      {
        variant: "secondary",
        buttonType: "transparent",
        className:
          "bg-overlay hover:after:bg-overlay active:before:bg-overlay active:after:bg-overlay disabled:opacity-40 after:absolute after:inset-0 after:transition-colors after:duration-200 before:absolute before:inset-0 before:transition-colors before:duration-200",
      },

      // SUCCESS FILLED
      {
        variant: "success",
        buttonType: "filled",
        className:
          "bg-success text-neutral-primary shadow hover:after:bg-overlay-light-10 active:before:bg-overlay-light-10 active:after:bg-overlay-dark-40 disabled:opacity-40 after:absolute after:inset-0 after:transition-colors after:duration-200 before:absolute before:inset-0 before:transition-colors before:duration-200",
      },
      // SUCCESS TONAL
      {
        variant: "success",
        buttonType: "tonal",
        className:
          "bg-success-muted-20 text-success hover:after:bg-success-muted-20 active:bg-success-muted-20 active:after:bg-success-muted-20 active:before:bg-success-muted-20 disabled:opacity-40 after:absolute after:inset-0 after:transition-colors after:duration-200 before:absolute before:inset-0 before:transition-colors before:duration-200",
      },
      // SUCCESS OUTLINE
      {
        variant: "success",
        buttonType: "outline",
        className:
          "border-success-muted text-success hover:bg-success-muted-20 active:bg-success-muted-20 active:after:bg-success-muted-20 disabled:opacity-40 after:absolute after:inset-0 after:transition-colors after:duration-200",
      },
      // SUCCESS GHOST
      {
        variant: "success",
        buttonType: "ghost",
        className:
          "text-success hover:bg-success-muted-20 active:bg-success-muted-20 active:after:bg-success-muted-20 disabled:opacity-40 after:absolute after:inset-0 after:transition-colors after:duration-200",
      },

      // DANGER FILLED
      {
        variant: "danger",
        buttonType: "filled",
        className:
          "bg-danger text-neutral-primary shadow hover:after:bg-overlay-light-10 active:before:bg-overlay-light-10 active:after:bg-overlay-dark-40 disabled:opacity-40 after:absolute after:inset-0 after:transition-colors after:duration-200 before:absolute before:inset-0 before:transition-colors before:duration-200",
      },
      // DANGER TONAL
      {
        variant: "danger",
        buttonType: "tonal",
        className:
          "bg-danger-muted-20 text-danger hover:after:bg-danger-muted-20 active:bg-danger-muted-20 active:after:bg-danger-muted-20 active:before:bg-danger-muted-20 disabled:opacity-40 after:absolute after:inset-0 after:transition-colors after:duration-200 before:absolute before:inset-0 before:transition-colors before:duration-200",
      },
      // DANGER OUTLINE
      {
        variant: "danger",
        buttonType: "outline",
        className:
          "border-danger-muted text-danger hover:bg-danger-muted-20 active:bg-danger-muted-20 active:after:bg-danger-muted-20 disabled:opacity-40 after:absolute after:inset-0 after:transition-colors after:duration-200",
      },
      // DANGER GHOST
      {
        variant: "danger",
        buttonType: "ghost",
        className:
          "text-danger hover:bg-danger-muted-20 active:bg-danger-muted-20 active:after:bg-danger-muted-20 disabled:opacity-40 after:absolute after:inset-0 after:transition-colors after:duration-200",
      },
    ],
    defaultVariants: {
      variant: "primary",
      buttonType: "filled",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      buttonType,
      size,
      asChild = false,
      loading,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, buttonType, size }),
          loading && "opacity-40 cursor-wait",
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
