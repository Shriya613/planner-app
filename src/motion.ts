import type { Transition, Variants } from 'framer-motion'

export const pageVariants: Variants = {
  initial: { opacity: 0, x: 16 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -16 },
}

export const pageTransition: Transition = {
  duration: 0.25,
  ease: 'easeInOut',
}

export const listItemVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

export const listItemTransition: Transition = {
  duration: 0.2,
  ease: 'easeOut',
}
