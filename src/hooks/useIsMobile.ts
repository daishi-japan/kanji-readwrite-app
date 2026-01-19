import { useEffect, useState } from 'react';

/**
 * モバイルデバイスかどうかを判定するカスタムフック
 * @param breakpoint ブレークポイント（デフォルト: 768px = md）
 * @returns モバイルの場合 true
 */
export function useIsMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < breakpoint;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
}
