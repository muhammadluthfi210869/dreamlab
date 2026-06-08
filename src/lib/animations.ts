import { Variants } from "framer-motion";

/**
 * World-class easing curves
 */
export const EASE_EXPO = [0.16, 1, 0.3, 1] as [number, number, number, number]; // Fast start, extremely smooth decelleration (premium feel)
export const EASE_BACK = [0.34, 1.56, 0.64, 1] as [number, number, number, number]; // Subtle elastic/spring pop-out (playful yet professional)

/**
 * Standard Viewport Configurations
 */
export const VIEWPORT_ONCE = {
  once: true,
  amount: 0.15, // Trigger when 15% of the element is visible
};

export const VIEWPORT_HERO = {
  once: true,
  amount: 0.05, // Trigger hero animations early for instantaneous load response
};

/**
 * Animation Variants
 */

// 1. Simple Fade In
export const fadeIn = (duration = 0.6, delay = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration,
      delay,
      ease: EASE_EXPO,
    },
  },
});

// 2. Fade In Up (with small elegant offset)
export const fadeInUp = (duration = 0.7, delay = 0, yOffset = 30): Variants => ({
  hidden: { opacity: 0, y: yOffset },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration,
      delay,
      ease: EASE_EXPO,
    },
  },
});

// 3. Fade In Down
export const fadeInDown = (duration = 0.7, delay = 0, yOffset = -30): Variants => ({
  hidden: { opacity: 0, y: yOffset },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration,
      delay,
      ease: EASE_EXPO,
    },
  },
});

// 4. Fade In Left (from left to right)
export const fadeInLeft = (duration = 0.8, delay = 0, xOffset = -40): Variants => ({
  hidden: { opacity: 0, x: xOffset },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration,
      delay,
      ease: EASE_EXPO,
    },
  },
});

// 5. Fade In Right (from right to left)
export const fadeInRight = (duration = 0.8, delay = 0, xOffset = 40): Variants => ({
  hidden: { opacity: 0, x: xOffset },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration,
      delay,
      ease: EASE_EXPO,
    },
  },
});

// 6. Scale Up (subtle elastic bounce)
export const scaleUp = (duration = 0.6, delay = 0, startScale = 0.93): Variants => ({
  hidden: { opacity: 0, scale: startScale },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration,
      delay,
      ease: EASE_EXPO,
    },
  },
});

// 7. Stagger Parent Container
export const staggerContainer = (staggerChildren = 0.1, delayChildren = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

// 8. Stagger Child Item (Fade In Up combination)
export const staggerItemUp = (yOffset = 25): Variants => ({
  hidden: { opacity: 0, y: yOffset },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: EASE_EXPO,
    },
  },
});

// 9. Stagger Child Item (Scale Up combination)
export const staggerItemScale = (startScale = 0.93): Variants => ({
  hidden: { opacity: 0, scale: startScale },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: EASE_EXPO,
    },
  },
});
