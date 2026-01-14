import type { Character } from '../types';

// 20体のユニークな生き物キャラクターデータ（泣き声付き）
export const CHARACTERS: Character[] = [
  {
    id: "char-001",
    name: "ぴよまる",
    image: "🐥",
    description: "ちいさなヒヨコの勇者！",
    sound: "ピヨピヨ！"
  },
  {
    id: "char-002",
    name: "ぺんぺん",
    image: "🐧",
    description: "南極からやってきたペンギン！",
    sound: "ペンペン！"
  },
  {
    id: "char-003",
    name: "かえるん",
    image: "🐸",
    description: "ケロケロ！いけのなかま。",
    sound: "ケロケロ！"
  },
  {
    id: "char-004",
    name: "こあらっち",
    image: "🐨",
    description: "ユーカリがだいすき！",
    sound: "コアラー！"
  },
  {
    id: "char-005",
    name: "きつねん",
    image: "🦊",
    description: "もりのかしこいキツネ。",
    sound: "コンコン！"
  },
  {
    id: "char-006",
    name: "らいおまる",
    image: "🦁",
    description: "ジャングルの王様！ガオー！",
    sound: "ガオー！"
  },
  {
    id: "char-007",
    name: "ぞうぞう",
    image: "🐘",
    description: "ながい鼻が自まん！",
    sound: "パオーン！"
  },
  {
    id: "char-008",
    name: "さるきち",
    image: "🐵",
    description: "バナナがだいすき！",
    sound: "ウキー！"
  },
  {
    id: "char-009",
    name: "ぶたまる",
    image: "🐷",
    description: "いつもにこにこ優しい子。",
    sound: "ブヒブヒ！"
  },
  {
    id: "char-010",
    name: "たこすけ",
    image: "🐙",
    description: "8本の足をもつ海の忍者！",
    sound: "ニュルニュル！"
  },
  {
    id: "char-011",
    name: "くまごろう",
    image: "🐻",
    description: "力持ちで優しい森の番人。",
    sound: "グオー！"
  },
  {
    id: "char-012",
    name: "ぱんだろう",
    image: "🐼",
    description: "竹を食べるのが趣味。",
    sound: "モグモグ！"
  },
  {
    id: "char-013",
    name: "とらきち",
    image: "🐯",
    description: "しましま模様がかっこいい！",
    sound: "ガルルル！"
  },
  {
    id: "char-014",
    name: "うしまる",
    image: "🐮",
    description: "モーモー！牧場のなかま。",
    sound: "モーモー！"
  },
  {
    id: "char-015",
    name: "ひつじん",
    image: "🐑",
    description: "もふもふの毛がじまん！",
    sound: "メェー！"
  },
  {
    id: "char-016",
    name: "かめきち",
    image: "🐢",
    description: "のんびり屋だけど長生き。",
    sound: "ノソノソ..."
  },
  {
    id: "char-017",
    name: "へびすけ",
    image: "🐍",
    description: "にょろにょろ動くよ！",
    sound: "シャーッ！"
  },
  {
    id: "char-018",
    name: "いるかん",
    image: "🐬",
    description: "ジャンプが得意な海の王子！",
    sound: "キュイキュイ！"
  },
  {
    id: "char-019",
    name: "くじらまる",
    image: "🐋",
    description: "海で一番大きな仲間！",
    sound: "ホエー！"
  },
  {
    id: "char-020",
    name: "ドラゴまる",
    image: "🐲",
    description: "伝説の最強ドラゴン！",
    sound: "ドラゴーン！"
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
