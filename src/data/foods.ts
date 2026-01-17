import type { FoodItem } from '../types';

export const FOODS: FoodItem[] = [
  { id: "food-001", name: "むし", emoji: "🐛" },
  { id: "food-002", name: "さかな", emoji: "🐟" },
  { id: "food-003", name: "はえ", emoji: "🪰" },
  { id: "food-004", name: "ユーカリ", emoji: "🌿" },
  { id: "food-005", name: "にく", emoji: "🍖" },
  { id: "food-006", name: "ステーキ", emoji: "🥩" },
  { id: "food-007", name: "くさ", emoji: "🌾" },
  { id: "food-008", name: "バナナ", emoji: "🍌" },
  { id: "food-009", name: "りんご", emoji: "🍎" },
  { id: "food-010", name: "エビ", emoji: "🦐" },
  { id: "food-011", name: "はちみつ", emoji: "🍯" },
  { id: "food-012", name: "たけ", emoji: "🎋" },
  { id: "food-013", name: "とり", emoji: "🐓" },
  { id: "food-014", name: "あおくさ", emoji: "🌱" },
  { id: "food-015", name: "はな", emoji: "🌸" },
  { id: "food-016", name: "こけ", emoji: "🍃" },
  { id: "food-017", name: "ミルク", emoji: "🥛" },
  { id: "food-018", name: "ほね", emoji: "🦴" },
  { id: "food-019", name: "いか", emoji: "🦑" },
  { id: "food-020", name: "ほうせき", emoji: "💎" }
];

// ヘルパー関数
export function getFoodById(id: string): FoodItem | undefined {
  return FOODS.find(f => f.id === id);
}

// ランダムに餌を1つ選択
export function selectRandomFood(): FoodItem {
  const randomIndex = Math.floor(Math.random() * FOODS.length);
  return FOODS[randomIndex];
}
