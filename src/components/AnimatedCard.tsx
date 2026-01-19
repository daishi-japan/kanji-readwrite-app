import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

type AnimatedCardProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  hoverScale?: number;
  tapScale?: number;
  delay?: number;
};

/**
 * アニメーション付きカードコンポーネント
 * ホバー・タップ時のスケール変化、登場アニメーションを提供
 */
export function AnimatedCard({
  children,
  className = '',
  onClick,
  disabled = false,
  hoverScale = 1.05,
  tapScale = 0.95,
  delay = 0,
}: AnimatedCardProps) {
  return (
    <motion.div
      className={className}
      onClick={disabled ? undefined : onClick}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.3,
        delay,
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
      whileHover={
        disabled
          ? undefined
          : {
              scale: hoverScale,
              transition: { duration: 0.2 },
            }
      }
      whileTap={
        disabled
          ? undefined
          : {
              scale: tapScale,
            }
      }
      style={{
        cursor: disabled ? 'not-allowed' : onClick ? 'pointer' : 'default',
      }}
    >
      {children}
    </motion.div>
  );
}
