import type { Character } from '../types';

// 20体のユニークな生き物キャラクターデータ（泣き声付き）
export const CHARACTERS: Character[] = [
  {
    id: "char-001",
    name: "ぴよまる",
    image: "🐥",
    description: "ちいさなヒヨコの勇者！",
    sound: "ピヨピヨ！",
    profile: {
      hobbies: "虫探しと冒険！",
      dislikes: "大きな音",
      specialSkill: "元気いっぱいのジャンプ"
    }
  },
  {
    id: "char-002",
    name: "ぺんぺん",
    image: "🐧",
    description: "南極からやってきたペンギン！",
    sound: "ペンペン！",
    profile: {
      hobbies: "泳ぐことと魚つり",
      dislikes: "暑い場所",
      specialSkill: "スイスイ泳ぐこと"
    }
  },
  {
    id: "char-003",
    name: "かえるん",
    image: "🐸",
    description: "ケロケロ！いけのなかま。",
    sound: "ケロケロ！",
    profile: {
      hobbies: "雨の日のおさんぽ",
      dislikes: "かわいた場所",
      specialSkill: "高くジャンプする"
    }
  },
  {
    id: "char-004",
    name: "こあらっち",
    image: "🐨",
    description: "ユーカリがだいすき！",
    sound: "コアラー！",
    profile: {
      hobbies: "木登りとお昼寝",
      dislikes: "大声で騒ぐこと",
      specialSkill: "ユーカリを見分ける"
    }
  },
  {
    id: "char-005",
    name: "きつねん",
    image: "🦊",
    description: "もりのかしこいキツネ。",
    sound: "コンコン！",
    profile: {
      hobbies: "パズルとかくれんぼ",
      dislikes: "ずるをすること",
      specialSkill: "頭を使ったゲーム"
    }
  },
  {
    id: "char-006",
    name: "らいおまる",
    image: "🦁",
    description: "ジャングルの王様！ガオー！",
    sound: "ガオー！",
    profile: {
      hobbies: "かけっことリーダーシップ",
      dislikes: "弱いものいじめ",
      specialSkill: "大きな声で仲間をまとめる"
    }
  },
  {
    id: "char-007",
    name: "ぞうぞう",
    image: "🐘",
    description: "ながい鼻が自まん！",
    sound: "パオーン！",
    profile: {
      hobbies: "水あそびと泥んこ",
      dislikes: "きゅうくつな場所",
      specialSkill: "鼻で物を持ち上げる"
    }
  },
  {
    id: "char-008",
    name: "さるきち",
    image: "🐵",
    description: "バナナがだいすき！",
    sound: "ウキー！",
    profile: {
      hobbies: "バナナとおふざけ",
      dislikes: "じっとしていること",
      specialSkill: "木から木へ飛び移る"
    }
  },
  {
    id: "char-009",
    name: "ぶたまる",
    image: "🐷",
    description: "いつもにこにこ優しい子。",
    sound: "ブヒブヒ！",
    profile: {
      hobbies: "おやつタイムとゴロゴロ",
      dislikes: "早起き",
      specialSkill: "みんなをなかよくさせる"
    }
  },
  {
    id: "char-010",
    name: "たこすけ",
    image: "🐙",
    description: "8本の足をもつ海の忍者！",
    sound: "ニュルニュル！",
    profile: {
      hobbies: "絵を描くこと",
      dislikes: "せまいところ",
      specialSkill: "8本の足で同時に作業"
    }
  },
  {
    id: "char-011",
    name: "くまごろう",
    image: "🐻",
    description: "力持ちで優しい森の番人。",
    sound: "グオー！",
    profile: {
      hobbies: "はちみつ集めと力自慢",
      dislikes: "争いごと",
      specialSkill: "重い物を軽々運ぶ"
    }
  },
  {
    id: "char-012",
    name: "ぱんだろう",
    image: "🐼",
    description: "竹を食べるのが趣味。",
    sound: "モグモグ！",
    profile: {
      hobbies: "竹を食べてゴロゴロ",
      dislikes: "急かされること",
      specialSkill: "どこでもリラックスできる"
    }
  },
  {
    id: "char-013",
    name: "とらきち",
    image: "🐯",
    description: "しましま模様がかっこいい！",
    sound: "ガルルル！",
    profile: {
      hobbies: "一人で狩りの練習",
      dislikes: "騒がしいところ",
      specialSkill: "そっと忍び寄る"
    }
  },
  {
    id: "char-014",
    name: "うしまる",
    image: "🐮",
    description: "モーモー！牧場のなかま。",
    sound: "モーモー！",
    profile: {
      hobbies: "草を食べてのんびり",
      dislikes: "あわてること",
      specialSkill: "おいしい草を見つける"
    }
  },
  {
    id: "char-015",
    name: "ひつじん",
    image: "🐑",
    description: "もふもふの毛がじまん！",
    sound: "メェー！",
    profile: {
      hobbies: "お昼寝と雲を見ること",
      dislikes: "ハサミの音",
      specialSkill: "ふわふわの毛でみんなをあたためる"
    }
  },
  {
    id: "char-016",
    name: "かめきち",
    image: "🐢",
    description: "のんびり屋だけど長生き。",
    sound: "ノソノソ...",
    profile: {
      hobbies: "日光浴と昔話",
      dislikes: "急いで動くこと",
      specialSkill: "コツコツ続けて最後までやりとげる"
    }
  },
  {
    id: "char-017",
    name: "へびすけ",
    image: "🐍",
    description: "にょろにょろ動くよ！",
    sound: "シャーッ！",
    profile: {
      hobbies: "日なたぼっことストレッチ",
      dislikes: "寒いところ",
      specialSkill: "静かにどこでも入り込む"
    }
  },
  {
    id: "char-018",
    name: "いるかん",
    image: "🐬",
    description: "ジャンプが得意な海の王子！",
    sound: "キュイキュイ！",
    profile: {
      hobbies: "ジャンプと仲間と遊ぶこと",
      dislikes: "一人ぼっち",
      specialSkill: "水の中で美しく踊る"
    }
  },
  {
    id: "char-019",
    name: "くじらまる",
    image: "🐋",
    description: "海で一番大きな仲間！",
    sound: "ホエー！",
    profile: {
      hobbies: "大きな海を旅すること",
      dislikes: "せまいところ",
      specialSkill: "遠くの仲間と話す"
    }
  },
  {
    id: "char-020",
    name: "ドラゴまる",
    image: "🐲",
    description: "伝説の最強ドラゴン！",
    sound: "ドラゴーン！",
    profile: {
      hobbies: "空を飛ぶこと",
      dislikes: "退屈な時間",
      specialSkill: "伝説の炎を吐く"
    }
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
