import { useState } from 'react';
import { Book, History, Apple, Settings, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ViewType, CollectedCharacter } from '../types';
import { useIsMobile } from '../hooks/useIsMobile';
import { Container } from './Container';
import { HeaderButton } from './HeaderButton';
import { surfaceTones } from '../theme/colors';

type HeaderProps = {
  view: ViewType;
  setView: (view: ViewType) => void;
  collectedCharacters: CollectedCharacter[];
  setSelectedCharacterForFeeding: (id: string | null) => void;
};

/**
 * 固定ヘッダー（Material Design 3風）
 * トップバー + ハンバーガーメニュー（モバイル）
 */
export function Header({ view, setView, collectedCharacters, setSelectedCharacterForFeeding }: HeaderProps) {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ヘッダーを非表示にする画面
  const hideHeader = ['reading', 'writing', 'getCharacter', 'evolution', 'transition'].includes(view);

  if (hideHeader) {
    return null;
  }

  const handleNavigate = (targetView: ViewType) => {
    if (targetView === 'feeding') {
      setSelectedCharacterForFeeding(null);
    }
    setView(targetView);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderBottom: `1px solid ${surfaceTones.outline}`,
      }}
    >
      <Container maxWidth="7xl">
        <div className="flex items-center justify-between h-16">
          {/* ロゴ */}
          <motion.button
            onClick={() => handleNavigate('home')}
            className="text-xl font-black text-gray-800 hover:text-gray-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            かんじマスター
          </motion.button>

          {/* デスクトップメニュー */}
          {!isMobile && (
            <nav className="flex items-center gap-2">
              <HeaderButton
                icon={Book}
                label="ずかん"
                onClick={() => handleNavigate('collection')}
                color="purple"
              />
              <HeaderButton
                icon={History}
                label="きろく"
                onClick={() => handleNavigate('history')}
                color="cyan"
              />
              <HeaderButton
                icon={Apple}
                label="ごはん"
                onClick={() => handleNavigate('feeding')}
                color="green"
                disabled={collectedCharacters.length === 0}
              />
              <HeaderButton
                icon={Settings}
                label="設定"
                onClick={() => handleNavigate('settings')}
                color="gray"
              />
            </nav>
          )}

          {/* モバイルハンバーガー */}
          {isMobile && (
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          )}
        </div>

        {/* モバイルメニュー（ドロワー）*/}
        <AnimatePresence>
          {isMobile && mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <nav className="pb-4 flex flex-col gap-2">
                <HeaderButton
                  icon={Book}
                  label="ずかん"
                  onClick={() => handleNavigate('collection')}
                  color="purple"
                />
                <HeaderButton
                  icon={History}
                  label="きろく"
                  onClick={() => handleNavigate('history')}
                  color="cyan"
                />
                <HeaderButton
                  icon={Apple}
                  label="ごはん"
                  onClick={() => handleNavigate('feeding')}
                  color="green"
                  disabled={collectedCharacters.length === 0}
                />
                <HeaderButton
                  icon={Settings}
                  label="設定"
                  onClick={() => handleNavigate('settings')}
                  color="gray"
                />
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </header>
  );
}
