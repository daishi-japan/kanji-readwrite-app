// Material Design 3 カラーパレット（パステル調 + Surface tones）

/**
 * Surface tones（背景レイヤー）
 * Material Design 3の推奨カラー
 */
export const surfaceTones = {
  background: '#F7F9FC',        // 最も薄いグレーブルー（全体背景）
  surface: '#FFFFFF',           // 白（カード背景）
  surfaceVariant: '#E8EDF5',    // 薄いグレーブルー（セカンダリ背景）
  outline: '#C5CAD1',           // ボーダー色
  outlineVariant: '#E0E3E8',    // 薄いボーダー
} as const;

/**
 * Primary colors（パステル調アクセント）
 * 各機能ごとの配色
 */
export const primaryColors = {
  // よみボタン（青系）
  primaryBlue: '#81C7F0',          // パステルブルー
  primaryBlueContainer: '#E3F2FD', // 薄いブルーコンテナ
  onPrimaryBlue: '#1565C0',        // ブルー上のテキスト

  // かきボタン（オレンジ系）
  primaryOrange: '#FFA97A',        // パステルオレンジ
  primaryOrangeContainer: '#FFE4D6', // 薄いオレンジコンテナ
  onPrimaryOrange: '#E65100',      // オレンジ上のテキスト

  // ずかん（紫系）
  primaryPurple: '#B39DDB',        // パステルパープル
  primaryPurpleContainer: '#EDE7F6', // 薄い紫コンテナ
  onPrimaryPurple: '#4A148C',      // 紫上のテキスト

  // きろく（シアン系）
  primaryCyan: '#80DEEA',          // パステルシアン
  primaryCyanContainer: '#E0F7FA',  // 薄いシアンコンテナ
  onPrimaryCyan: '#006064',        // シアン上のテキスト

  // ごはん（緑系）
  primaryGreen: '#A5D6A7',         // パステルグリーン
  primaryGreenContainer: '#E8F5E9', // 薄い緑コンテナ
  onPrimaryGreen: '#1B5E20',       // 緑上のテキスト

  // キャラクターゲット（黄色系）
  primaryYellow: '#FFE082',        // パステルイエロー
  primaryYellowContainer: '#FFF9E6', // 薄い黄色コンテナ
  onPrimaryYellow: '#F57F17',      // 黄色上のテキスト
} as const;

/**
 * Semantic colors（状態表示色）
 * 成功・エラー・警告などの表示
 */
export const semanticColors = {
  success: '#81C784',              // パステルグリーン（正解）
  successContainer: '#E8F5E9',     // 薄い緑コンテナ
  onSuccess: '#1B5E20',            // 成功色上のテキスト

  error: '#E57373',                // パステルレッド（不正解）
  errorContainer: '#FFEBEE',       // 薄い赤コンテナ
  onError: '#C62828',              // エラー色上のテキスト

  warning: '#FFB74D',              // パステルオレンジ（注意）
  warningContainer: '#FFF3E0',     // 薄いオレンジコンテナ
  onWarning: '#E65100',            // 警告色上のテキスト
} as const;

/**
 * Text colors（テキスト色）
 */
export const textColors = {
  primary: '#1F2937',              // 濃いグレー（メインテキスト）
  secondary: '#6B7280',            // グレー（セカンダリテキスト）
  tertiary: '#9CA3AF',             // 薄いグレー（補助テキスト）
  onSurface: '#1F2937',            // Surface上のテキスト
} as const;

/**
 * すべてのカラーをエクスポート
 */
export const colors = {
  ...surfaceTones,
  ...primaryColors,
  ...semanticColors,
  ...textColors,
} as const;

/**
 * カラータイプ定義
 */
export type ColorKey = keyof typeof colors;
