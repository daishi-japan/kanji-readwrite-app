// Material Design 3 角丸（Border Radius）統一ルール

/**
 * Material Design 3 推奨値に準拠した角丸定義
 * Tailwind CSSのクラス名とピクセル値の対応
 */
export const borderRadius = {
  none: '0px',           // 角丸なし
  xs: '4px',             // rounded-sm（最小）
  sm: '8px',             // rounded-lg（小）
  md: '12px',            // rounded-xl（中）→ サブ要素
  lg: '16px',            // rounded-2xl（大）→ メイン要素【推奨・基準】
  xl: '20px',            // rounded-3xl（特大）→ 強調要素
  full: '9999px',        // rounded-full（円形）→ アイコンボタン
} as const;

/**
 * Tailwind CSSクラス名マッピング
 * コンポーネントで使用する際の参照用
 */
export const roundedClasses = {
  none: 'rounded-none',          // 角丸なし
  xs: 'rounded-sm',              // 4px
  sm: 'rounded-lg',              // 8px
  md: 'rounded-xl',              // 12px
  lg: 'rounded-2xl',             // 16px【推奨】
  xl: 'rounded-3xl',             // 20px
  full: 'rounded-full',          // 円形
} as const;

/**
 * 使用ガイドライン
 *
 * メインカード・ボタン: rounded-2xl (16px) 【基準】
 * - ホーム画面のメインカード
 * - トレーニングボタン（よみ・かき）
 * - モード選択ボタン
 *
 * ヘッダー・フッター: rounded-none (0px)
 * - 固定ヘッダー
 * - フッター
 *
 * モーダル: rounded-3xl (20px)
 * - ポップアップモーダル
 * - 確認ダイアログ
 *
 * 小さなカード: rounded-xl (12px)
 * - キャラクター表示カード
 * - 餌アイテムカード
 *
 * アイコンボタン: rounded-full
 * - ヘッダーメニューボタン
 * - 戻るボタン
 * - 設定ボタン
 */

/**
 * Border Radius型定義
 */
export type BorderRadiusKey = keyof typeof borderRadius;
export type RoundedClass = typeof roundedClasses[BorderRadiusKey];
