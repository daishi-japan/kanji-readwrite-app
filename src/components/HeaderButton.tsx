import { type LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { primaryColors } from '../theme/colors';

type HeaderButtonColor = 'purple' | 'cyan' | 'green' | 'gray';

type HeaderButtonProps = {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  color: HeaderButtonColor;
  disabled?: boolean;
};

/**
 * ヘッダーメニューボタン
 * Material Design 3のパステル調カラーを使用
 */
export function HeaderButton({ icon: Icon, label, onClick, color, disabled = false }: HeaderButtonProps) {
  // カラーマッピング（Material Design 3のパステル調）
  const colorClasses: Record<HeaderButtonColor, string> = {
    purple: `bg-[${primaryColors.primaryPurpleContainer}] text-[${primaryColors.onPrimaryPurple}] hover:bg-[${primaryColors.primaryPurple}] hover:text-white`,
    cyan: `bg-[${primaryColors.primaryCyanContainer}] text-[${primaryColors.onPrimaryCyan}] hover:bg-[${primaryColors.primaryCyan}] hover:text-white`,
    green: `bg-[${primaryColors.primaryGreenContainer}] text-[${primaryColors.onPrimaryGreen}] hover:bg-[${primaryColors.primaryGreen}] hover:text-white`,
    gray: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`${colorClasses[color]} px-4 py-2 rounded-full flex items-center gap-2 font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
      whileHover={disabled ? undefined : { scale: 1.05 }}
      whileTap={disabled ? undefined : { scale: 0.95 }}
    >
      <Icon size={18} />
      <span>{label}</span>
    </motion.button>
  );
}
