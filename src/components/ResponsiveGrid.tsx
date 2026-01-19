import { type ReactNode } from 'react';

type ResponsiveGridProps = {
  children: ReactNode;
  className?: string;
  cols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  gap?: number;
};

/**
 * レスポンシブグリッドコンポーネント
 * ブレークポイントごとに列数を変更可能
 */
export function ResponsiveGrid({
  children,
  className = '',
  cols = { xs: 2, sm: 3, md: 4, lg: 6, xl: 8 },
  gap = 4,
}: ResponsiveGridProps) {
  // グリッド列数のクラスを生成
  const gridColsClasses = [
    cols.xs && `grid-cols-${cols.xs}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
    cols['2xl'] && `2xl:grid-cols-${cols['2xl']}`,
  ]
    .filter(Boolean)
    .join(' ');

  const gridClasses = `
    grid
    ${gridColsClasses}
    gap-${gap}
    ${className}
  `.trim();

  return <div className={gridClasses}>{children}</div>;
}
