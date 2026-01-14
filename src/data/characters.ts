import type { Character } from '../types';

// 20体のキャラクターデータ
// 実際のアプリでは、AI生成画像を使用する
// 現時点では絵文字をプレースホルダーとして使用
export const CHARACTERS: Character[] = [
  {
    id: "char-001",
    name: "ひよっこ",
    image: "🐣",
    description: "はじめてのなかま！いつもげんき！"
  },
  {
    id: "char-002",
    name: "もくもくん",
    image: "☁️",
    description: "くものようせい。ふわふわしてる。"
  },
  {
    id: "char-003",
    name: "ひだまりん",
    image: "🌻",
    description: "おひさまだいすき！あったかい。"
  },
  {
    id: "char-004",
    name: "ほしまる",
    image: "⭐",
    description: "よぞらからきたキラキラ。"
  },
  {
    id: "char-005",
    name: "にじいろん",
    image: "🌈",
    description: "あめのあとにあらわれる。"
  },
  {
    id: "char-006",
    name: "もりのこ",
    image: "🌲",
    description: "しずかなもりにすんでいる。"
  },
  {
    id: "char-007",
    name: "おさかなん",
    image: "🐟",
    description: "うみがだいすき！すいすい。"
  },
  {
    id: "char-008",
    name: "ねこまる",
    image: "🐱",
    description: "ひなたぼっこがとくい。"
  },
  {
    id: "char-009",
    name: "わんぽ",
    image: "🐶",
    description: "さんぽがだいすき！"
  },
  {
    id: "char-010",
    name: "うさぴょん",
    image: "🐰",
    description: "ぴょんぴょんはねる。"
  },
  {
    id: "char-011",
    name: "くまっち",
    image: "🐻",
    description: "ちからもち！やさしいよ。"
  },
  {
    id: "char-012",
    name: "ぱんだまる",
    image: "🐼",
    description: "たけがすき。のんびりや。"
  },
  {
    id: "char-013",
    name: "おはなちゃん",
    image: "🌸",
    description: "はるになるとさく。"
  },
  {
    id: "char-014",
    name: "ゆきだるん",
    image: "⛄",
    description: "ふゆがだいすき！つめたい。"
  },
  {
    id: "char-015",
    name: "かみなりくん",
    image: "⚡",
    description: "ゴロゴロ！びりびり！"
  },
  {
    id: "char-016",
    name: "つきうさぎ",
    image: "🌙",
    description: "よるになるとあらわれる。"
  },
  {
    id: "char-017",
    name: "りんごん",
    image: "🍎",
    description: "まっかでおいしそう。"
  },
  {
    id: "char-018",
    name: "ロケットん",
    image: "🚀",
    description: "うちゅうをめざす！"
  },
  {
    id: "char-019",
    name: "おんぷちゃん",
    image: "🎵",
    description: "うたがだいすき！"
  },
  {
    id: "char-020",
    name: "にじドラゴン",
    image: "🐉",
    description: "でんせつのキャラクター！"
  }
];

// キャラクターをIDで取得
export function getCharacterById(id: string): Character | undefined {
  return CHARACTERS.find(c => c.id === id);
}

// まだゲットしていないキャラクターからランダムに1体選ぶ
export function getRandomUnownedCharacter(ownedIds: string[]): Character | null {
  const unowned = CHARACTERS.filter(c => !ownedIds.includes(c.id));
  if (unowned.length === 0) {
    return null; // 全コンプリート
  }
  const randomIndex = Math.floor(Math.random() * unowned.length);
  return unowned[randomIndex];
}

// 全キャラクター数
export const TOTAL_CHARACTER_COUNT = CHARACTERS.length;
