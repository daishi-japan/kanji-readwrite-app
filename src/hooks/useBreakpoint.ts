import { useEffect, useState } from 'react';

// Tailwind CSS ブレークポイント
const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints | 'xs';

/**
 * 現在のブレークポイントを返すカスタムフック
 * @returns 現在のブレークポイント ('xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl')
 */
export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() => {
    if (typeof window === 'undefined') return 'xs';

    const width = window.innerWidth;
    if (width >= breakpoints['2xl']) return '2xl';
    if (width >= breakpoints.xl) return 'xl';
    if (width >= breakpoints.lg) return 'lg';
    if (width >= breakpoints.md) return 'md';
    if (width >= breakpoints.sm) return 'sm';
    return 'xs';
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let newBreakpoint: Breakpoint = 'xs';

      if (width >= breakpoints['2xl']) newBreakpoint = '2xl';
      else if (width >= breakpoints.xl) newBreakpoint = 'xl';
      else if (width >= breakpoints.lg) newBreakpoint = 'lg';
      else if (width >= breakpoints.md) newBreakpoint = 'md';
      else if (width >= breakpoints.sm) newBreakpoint = 'sm';

      setBreakpoint(newBreakpoint);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
}
