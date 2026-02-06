# Landing Page Animations

This directory contains reusable animation components and utilities for the ClawFriend landing page.

## Components

### ScrollReveal
Animates elements when they enter the viewport using Intersection Observer.

```tsx
import { ScrollReveal } from "@/components/animations";

<ScrollReveal variant="fadeInUp" duration={800} delay={200}>
  <div>Your content here</div>
</ScrollReveal>
```

**Props:**
- `variant`: Animation type - "fadeInUp" | "fadeInDown" | "fadeInLeft" | "fadeInRight" | "scaleIn"
- `duration`: Animation duration in milliseconds (default: 600)
- `delay`: Delay before animation starts in milliseconds (default: 0)

### ParallaxElement
Creates parallax scrolling effect for background elements.

```tsx
import { ParallaxElement } from "@/components/animations";

<ParallaxElement speed={0.5} direction="vertical">
  <div>Your content here</div>
</ParallaxElement>
```

**Props:**
- `speed`: Parallax speed multiplier (default: 0.5)
- `direction`: "vertical" | "horizontal" (default: "vertical")

### HoverScale
Adds smooth scale effect on hover.

```tsx
import { HoverScale } from "@/components/animations";

<HoverScale scale={1.05} duration={300}>
  <button>Hover me</button>
</HoverScale>
```

**Props:**
- `scale`: Scale multiplier on hover (default: 1.05)
- `duration`: Animation duration in milliseconds (default: 300)

### StaggeredList
Animates list items with staggered delays.

```tsx
import { StaggeredList } from "@/components/animations";

<StaggeredList staggerDelay={100}>
  {items.map(item => <div key={item.id}>{item.name}</div>)}
</StaggeredList>
```

**Props:**
- `staggerDelay`: Delay between each item in milliseconds (default: 100)

### ScrollProgress
Shows a progress bar at the top indicating scroll position.

```tsx
import { ScrollProgress } from "@/components/animations";

<ScrollProgress />
```

### ScrollDownIndicator
Animated indicator prompting users to scroll down.

```tsx
import { ScrollDownIndicator } from "@/components/animations";

<ScrollDownIndicator />
```

## Utilities

### useInView
Hook to detect when an element enters the viewport.

```tsx
import { useInView } from "@/utils/animations";

const { ref, isInView } = useInView();

<div ref={ref}>
  {isInView && "I'm visible!"}
</div>
```

### useParallax
Hook for parallax scrolling effect.

```tsx
import { useParallax } from "@/utils/animations";

const { ref, offset } = useParallax(0.5);

<div ref={ref} style={{ transform: `translateY(${offset}px)` }}>
  Parallax content
</div>
```

### useScrollProgress
Hook to get current scroll progress (0-100).

```tsx
import { useScrollProgress } from "@/utils/animations";

const progress = useScrollProgress();
```

### useStaggeredInView
Hook for staggered list animations.

```tsx
import { useStaggeredInView } from "@/utils/animations";

const { ref, visibleItems } = useStaggeredInView(items.length, 100);
```

## Tailwind Animations

Custom animations added to `tailwind.config.js`:

- `fadeInUp` - Fade in with upward slide
- `fadeInDown` - Fade in with downward slide
- `fadeInLeft` - Fade in from left
- `fadeInRight` - Fade in from right
- `scaleIn` - Fade in with scale
- `shimmer` - Shimmer effect for text
- `glow-pulse` - Pulsing glow effect
- `gradient-x` - Horizontal gradient animation
- `gradient-y` - Vertical gradient animation
- `tilt` - Subtle tilt animation
- `bounce-subtle` - Subtle bounce effect
- `ripple` - Ripple effect

## Accessibility

All animations respect the `prefers-reduced-motion` media query. When users have reduced motion enabled in their system preferences, animations are disabled or simplified.

## Performance

- Uses CSS transforms and opacity for GPU-accelerated animations
- Intersection Observer for efficient scroll detection
- RequestAnimationFrame for smooth parallax scrolling
- Minimal JavaScript for better performance

## Best Practices

1. **Use ScrollReveal for sections** - Wrap major sections with ScrollReveal for fade-in effects
2. **Stagger list items** - Use StaggeredList or inline delays for lists
3. **Enhance hover states** - Add subtle scale and glow effects on interactive elements
4. **Keep it subtle** - Animations should enhance, not distract
5. **Test on mobile** - Ensure animations work well on all devices
