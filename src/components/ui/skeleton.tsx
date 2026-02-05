import { cn } from "@/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const skeletonVariants = cva("rounded-sm skeleton-shimmer", {
    variants: {
        variant: {
            text: "h-4",
            circle: "rounded-full",
            rectangle: "rounded-sm",
        },
        size: {
            xs: "h-2",
            sm: "h-3",
            md: "h-4",
            lg: "h-5",
            xl: "h-6",
            "2xl": "h-8",
        },
        width: {
            full: "w-full",
            "3/4": "w-3/4",
            "1/2": "w-1/2",
            "1/4": "w-1/4",
            auto: "w-auto",
        },
    },
    defaultVariants: {
        variant: "text",
        size: "md",
        width: "full",
    },
});

export interface SkeletonProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
    customWidth?: string;
    customHeight?: string;
}

const SkeletonComponent = React.forwardRef<HTMLDivElement, SkeletonProps>(
    (
        { className, variant, size, width, customWidth, customHeight, ...props },
        ref
    ) => {
        const style = React.useMemo<React.CSSProperties>(
            () => ({
                ...(customWidth && { width: customWidth }),
                ...(customHeight && { height: customHeight }),
            }),
            [customWidth, customHeight]
        );

        const computedClassName = React.useMemo(
            () => cn(skeletonVariants({ variant, size, width }), className),
            [variant, size, width, className]
        );

        return (
            <div ref={ref} className={computedClassName} style={style} {...props} />
        );
    }
);
SkeletonComponent.displayName = "Skeleton";

// Custom comparison function to prevent unnecessary re-renders
const arePropsEqual = (
    prevProps: SkeletonProps,
    nextProps: SkeletonProps
): boolean => {
    // Compare all relevant props
    return (
        prevProps.variant === nextProps.variant &&
        prevProps.size === nextProps.size &&
        prevProps.width === nextProps.width &&
        prevProps.customWidth === nextProps.customWidth &&
        prevProps.customHeight === nextProps.customHeight &&
        prevProps.className === nextProps.className &&
        // Compare other HTML attributes that might change
        prevProps.children === nextProps.children
    );
};

const Skeleton = React.memo(SkeletonComponent, arePropsEqual);
Skeleton.displayName = "Skeleton";

export { Skeleton, skeletonVariants };
