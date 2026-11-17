'use client';

import { Box } from 'lucide-react';
import { setThreeD, useThreeD } from '@/lib/three-pref';
import { cn } from '@/lib/utils';

/** Switch for the WebGL scenes. Other animations are unaffected. */
export default function ThreeDToggle() {
  const on = useThreeD();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => setThreeD(!on)}
      title={on ? 'Turn off 3D if the page feels slow' : 'Turn the 3D ball and globe back on'}
      className="group inline-flex items-center gap-3 rounded-full border border-flood/15 py-2 pl-4 pr-2 text-sm text-chalk transition-colors hover:border-gold hover:text-flood"
    >
      <Box className="h-4 w-4 text-gold" aria-hidden />
      3D effects
      <span
        aria-hidden
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
          on ? 'bg-gold' : 'bg-seam',
        )}
      >
        <span
          className={cn(
            'absolute left-1 h-4 w-4 rounded-full transition-transform duration-200 ease-out',
            on ? 'translate-x-5 bg-night' : 'translate-x-0 bg-chalk',
          )}
        />
      </span>
    </button>
  );
}
