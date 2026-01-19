import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

type ContainerProps = {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full';
  centerContent?: boolean;
  animate?: boolean;
};

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
};

/**
 * レスポンシブコンテナコンポーネント
 * PC画面では中央寄せ、モバイルではフル幅表示
 */
export function Container({
  children,
  className = '',
  maxWidth = '7xl',
  centerContent = true,
  animate = false,
}: ContainerProps) {
  const containerClasses = `
    ${maxWidthClasses[maxWidth]}
    ${centerContent ? 'mx-auto' : ''}
    px-4 sm:px-6 lg:px-8
    ${className}
  `.trim();

  if (animate) {
    return (
      <motion.div
        className={containerClasses}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={containerClasses}>{children}</div>;
}
