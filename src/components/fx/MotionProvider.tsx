'use client';

import { MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';

/** Visitors who ask for reduced motion get fades only: framer skips transform and layout animation. */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
