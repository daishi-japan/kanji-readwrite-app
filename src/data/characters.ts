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
    },
    favoriteFood: ["food-001", "food-003", "food-007", "food-014"],
    evolutionStage: 0,
    baseCharacterId: "char-001",
    nextEvolutionId: "char-001-2"
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
    },
    favoriteFood: ["food-002", "food-010", "food-019"],
    evolutionStage: 0,
    baseCharacterId: "char-002",
    nextEvolutionId: "char-002-2"
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
    },
    favoriteFood: ["food-001", "food-003"],
    evolutionStage: 0,
    baseCharacterId: "char-003",
    nextEvolutionId: "char-003-2"
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
    },
    favoriteFood: ["food-004", "food-007", "food-015"],
    evolutionStage: 0,
    baseCharacterId: "char-004",
    nextEvolutionId: "char-004-2"
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
    },
    favoriteFood: ["food-005", "food-013", "food-002"],
    evolutionStage: 0,
    baseCharacterId: "char-005",
    nextEvolutionId: "char-005-2"
  },
  {
    id: "char-006",
    name: "ライオンくん",
    image: "🦁",
    description: "ジャングルの王様！ガオー！",
    sound: "ガオー！",
    profile: {
      hobbies: "かけっことリーダーシップ",
      dislikes: "弱いものいじめ",
      specialSkill: "大きな声で仲間をまとめる"
    },
    favoriteFood: ["food-005", "food-006", "food-013"],
    evolutionStage: 0,
    baseCharacterId: "char-006",
    nextEvolutionId: "char-006-2"
  },
  {
    id: "char-007",
    name: "ぞうたろう",
    image: "🐘",
    description: "ながい鼻が自まん！",
    sound: "パオーン！",
    profile: {
      hobbies: "水あそびと泥んこ",
      dislikes: "きゅうくつな場所",
      specialSkill: "鼻で物を持ち上げる"
    },
    favoriteFood: ["food-007", "food-008", "food-009", "food-015"],
    evolutionStage: 0,
    baseCharacterId: "char-007",
    nextEvolutionId: "char-007-2"
  },
  {
    id: "char-008",
    name: "さるお",
    image: "🐵",
    description: "バナナがだいすき！",
    sound: "ウキー！",
    profile: {
      hobbies: "バナナとおふざけ",
      dislikes: "じっとしていること",
      specialSkill: "木から木へ飛び移る"
    },
    favoriteFood: ["food-008", "food-009", "food-001"],
    evolutionStage: 0,
    baseCharacterId: "char-008",
    nextEvolutionId: "char-008-2"
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
    },
    favoriteFood: ["food-007", "food-008", "food-009", "food-017"],
    evolutionStage: 0,
    baseCharacterId: "char-009",
    nextEvolutionId: "char-009-2"
  },
  {
    id: "char-010",
    name: "たこちゃん",
    image: "🐙",
    description: "8本の足をもつ海の忍者！",
    sound: "ニュルニュル！",
    profile: {
      hobbies: "絵を描くこと",
      dislikes: "せまいところ",
      specialSkill: "8本の足で同時に作業"
    },
    favoriteFood: ["food-002", "food-010", "food-019"],
    evolutionStage: 0,
    baseCharacterId: "char-010",
    nextEvolutionId: "char-010-2"
  },
  {
    id: "char-011",
    name: "くまたん",
    image: "🐻",
    description: "力持ちで優しい森の番人。",
    sound: "グオー！",
    profile: {
      hobbies: "はちみつ集めと力自慢",
      dislikes: "争いごと",
      specialSkill: "重い物を軽々運ぶ"
    },
    favoriteFood: ["food-005", "food-002", "food-011", "food-009"],
    evolutionStage: 0,
    baseCharacterId: "char-011",
    nextEvolutionId: "char-011-2"
  },
  {
    id: "char-012",
    name: "パンダくん",
    image: "🐼",
    description: "竹を食べるのが趣味。",
    sound: "モグモグ！",
    profile: {
      hobbies: "竹を食べてゴロゴロ",
      dislikes: "急かされること",
      specialSkill: "どこでもリラックスできる"
    },
    favoriteFood: ["food-012", "food-007", "food-008"],
    evolutionStage: 0,
    baseCharacterId: "char-012",
    nextEvolutionId: "char-012-2"
  },
  {
    id: "char-013",
    name: "とらのすけ",
    image: "🐯",
    description: "しましま模様がかっこいい！",
    sound: "ガルルル！",
    profile: {
      hobbies: "一人で狩りの練習",
      dislikes: "騒がしいところ",
      specialSkill: "そっと忍び寄る"
    },
    favoriteFood: ["food-005", "food-006", "food-013"],
    evolutionStage: 0,
    baseCharacterId: "char-013",
    nextEvolutionId: "char-013-2"
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
    },
    favoriteFood: ["food-007", "food-014", "food-017"],
    evolutionStage: 0,
    baseCharacterId: "char-014",
    nextEvolutionId: "char-014-2"
  },
  {
    id: "char-015",
    name: "ひつじちゃん",
    image: "🐑",
    description: "もふもふの毛がじまん！",
    sound: "メェー！",
    profile: {
      hobbies: "お昼寝と雲を見ること",
      dislikes: "ハサミの音",
      specialSkill: "ふわふわの毛でみんなをあたためる"
    },
    favoriteFood: ["food-007", "food-014", "food-015"],
    evolutionStage: 0,
    baseCharacterId: "char-015",
    nextEvolutionId: "char-015-2"
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
    },
    favoriteFood: ["food-007", "food-001", "food-002"],
    evolutionStage: 0,
    baseCharacterId: "char-016",
    nextEvolutionId: "char-016-2"
  },
  {
    id: "char-017",
    name: "ねこまる",
    image: "🐱",
    description: "にゃーにゃー鳴く可愛い子！",
    sound: "ニャー！",
    profile: {
      hobbies: "日なたぼっことおさんぽ",
      dislikes: "水",
      specialSkill: "静かに歩ける"
    },
    favoriteFood: ["food-002", "food-005", "food-017"],
    evolutionStage: 0,
    baseCharacterId: "char-017",
    nextEvolutionId: "char-017-2"
  },
  {
    id: "char-018",
    name: "いぬぽち",
    image: "🐶",
    description: "元気いっぱいの犬の子！",
    sound: "ワンワン！",
    profile: {
      hobbies: "走ることとお散歩",
      dislikes: "お留守番",
      specialSkill: "仲間を守る"
    },
    favoriteFood: ["food-005", "food-018", "food-017"],
    evolutionStage: 0,
    baseCharacterId: "char-018",
    nextEvolutionId: "char-018-2"
  },
  {
    id: "char-019",
    name: "ぺんぎんた",
    image: "🐧",
    description: "南極からやってきた2号！",
    sound: "ペンタペン！",
    profile: {
      hobbies: "氷の上で滑ること",
      dislikes: "暑いところ",
      specialSkill: "泳ぐこと"
    },
    favoriteFood: ["food-002", "food-010", "food-019"],
    evolutionStage: 0,
    baseCharacterId: "char-019",
    nextEvolutionId: "char-019-2"
  },
  {
    id: "char-020",
    name: "りゅうすけ",
    image: "🐉",
    description: "伝説の最強ドラゴン！",
    sound: "ドラゴーン！",
    profile: {
      hobbies: "空を飛ぶこと",
      dislikes: "退屈な時間",
      specialSkill: "伝説の炎を吐く"
    },
    favoriteFood: ["food-020", "food-006", "food-018"],
    evolutionStage: 0,
    baseCharacterId: "char-020",
    nextEvolutionId: "char-020-2"
  },

  // ========== 第2形態（進化後） ==========
  {
    id: "char-001-2",
    name: "ピヨット",
    image: "🐤",
    description: "成長したヒヨコの戦士！",
    sound: "ピヨピヨー！",
    profile: {
      hobbies: "空を飛ぶ練習と冒険！",
      dislikes: "大きな音（まだ）",
      specialSkill: "短い距離を飛べるようになった"
    },
    favoriteFood: ["food-001", "food-003", "food-007", "food-014"],
    evolutionStage: 1,
    baseCharacterId: "char-001",
    nextEvolutionId: "char-001-3",
    prevEvolutionId: "char-001"
  },
  {
    id: "char-002-2",
    name: "ペンペラ",
    image: "🐧",
    description: "氷の海を泳ぐペンギン戦士！",
    sound: "ペンペペーン！",
    profile: {
      hobbies: "高速で泳ぐこと",
      dislikes: "暑い場所",
      specialSkill: "氷の上を滑って移動"
    },
    favoriteFood: ["food-002", "food-010", "food-019"],
    evolutionStage: 1,
    baseCharacterId: "char-002",
    nextEvolutionId: "char-002-3",
    prevEvolutionId: "char-002"
  },
  {
    id: "char-003-2",
    name: "ケロッタ",
    image: "🐸",
    description: "パワフルなカエル忍者！",
    sound: "ケロケロケロ！",
    profile: {
      hobbies: "雨の日の修行",
      dislikes: "かわいた場所",
      specialSkill: "超高速ジャンプ"
    },
    favoriteFood: ["food-001", "food-003"],
    evolutionStage: 1,
    baseCharacterId: "char-003",
    nextEvolutionId: "char-003-3",
    prevEvolutionId: "char-003"
  },
  {
    id: "char-004-2",
    name: "コアベア",
    image: "🐨",
    description: "森の守護者コアラ！",
    sound: "コアラーオ！",
    profile: {
      hobbies: "木登りと森のパトロール",
      dislikes: "騒音",
      specialSkill: "どんな木でも登れる"
    },
    favoriteFood: ["food-004", "food-007", "food-015"],
    evolutionStage: 1,
    baseCharacterId: "char-004",
    nextEvolutionId: "char-004-3",
    prevEvolutionId: "char-004"
  },
  {
    id: "char-005-2",
    name: "フォクシー",
    image: "🦊",
    description: "知恵の賢者キツネ！",
    sound: "コンコーン！",
    profile: {
      hobbies: "高度なパズルと戦略ゲーム",
      dislikes: "ずるをすること",
      specialSkill: "複雑な問題を解く"
    },
    favoriteFood: ["food-005", "food-013", "food-002"],
    evolutionStage: 1,
    baseCharacterId: "char-005",
    nextEvolutionId: "char-005-3",
    prevEvolutionId: "char-005"
  },
  {
    id: "char-006-2",
    name: "レオレオ",
    image: "🦁",
    description: "百獣の王ライオン！",
    sound: "ガオォー！",
    profile: {
      hobbies: "リーダーシップと仲間を守ること",
      dislikes: "弱いものいじめ",
      specialSkill: "勇気の雄叫び"
    },
    favoriteFood: ["food-005", "food-006", "food-013"],
    evolutionStage: 1,
    baseCharacterId: "char-006",
    nextEvolutionId: "char-006-3",
    prevEvolutionId: "char-006"
  },
  {
    id: "char-007-2",
    name: "エレファ",
    image: "🐘",
    description: "力強い巨象の戦士！",
    sound: "パオォーン！",
    profile: {
      hobbies: "水浴びと力比べ",
      dislikes: "狭い場所",
      specialSkill: "鼻で大きな岩も持ち上げる"
    },
    favoriteFood: ["food-007", "food-008", "food-009", "food-015"],
    evolutionStage: 1,
    baseCharacterId: "char-007",
    nextEvolutionId: "char-007-3",
    prevEvolutionId: "char-007"
  },
  {
    id: "char-008-2",
    name: "モンキッキ",
    image: "🐒",
    description: "敏捷なモンキー戦士！",
    sound: "ウッキー！",
    profile: {
      hobbies: "アクロバットとバナナ",
      dislikes: "じっとしていること",
      specialSkill: "素早い動きで敵を翻弄"
    },
    favoriteFood: ["food-008", "food-009", "food-001"],
    evolutionStage: 1,
    baseCharacterId: "char-008",
    nextEvolutionId: "char-008-3",
    prevEvolutionId: "char-008"
  },
  {
    id: "char-009-2",
    name: "ポーキー",
    image: "🐖",
    description: "優しさあふれる癒し系戦士！",
    sound: "ブヒブヒー！",
    profile: {
      hobbies: "仲間と過ごす時間",
      dislikes: "ケンカ",
      specialSkill: "みんなの心を癒す"
    },
    favoriteFood: ["food-007", "food-008", "food-009", "food-017"],
    evolutionStage: 1,
    baseCharacterId: "char-009",
    nextEvolutionId: "char-009-3",
    prevEvolutionId: "char-009"
  },
  {
    id: "char-010-2",
    name: "オクトパス",
    image: "🐙",
    description: "海の芸術家タコ！",
    sound: "ニュルニュルー！",
    profile: {
      hobbies: "複雑な絵を描くこと",
      dislikes: "狭いところ",
      specialSkill: "8本の腕で同時多作業"
    },
    favoriteFood: ["food-002", "food-010", "food-019"],
    evolutionStage: 1,
    baseCharacterId: "char-010",
    nextEvolutionId: "char-010-3",
    prevEvolutionId: "char-010"
  },
  {
    id: "char-011-2",
    name: "ベアベア",
    image: "🐻",
    description: "森の守護神グリズリー！",
    sound: "グオォー！",
    profile: {
      hobbies: "森を守ることと力仕事",
      dislikes: "争いごと",
      specialSkill: "巨大な力で森を守る"
    },
    favoriteFood: ["food-005", "food-002", "food-011", "food-009"],
    evolutionStage: 1,
    baseCharacterId: "char-011",
    nextEvolutionId: "char-011-3",
    prevEvolutionId: "char-011"
  },
  {
    id: "char-012-2",
    name: "パンダマン",
    image: "🐼",
    description: "竹林の賢者パンダ！",
    sound: "モグモグー！",
    profile: {
      hobbies: "瞑想と竹を食べること",
      dislikes: "急かされること",
      specialSkill: "どんな状況でも落ち着いている"
    },
    favoriteFood: ["food-012", "food-007", "food-008"],
    evolutionStage: 1,
    baseCharacterId: "char-012",
    nextEvolutionId: "char-012-3",
    prevEvolutionId: "char-012"
  },
  {
    id: "char-013-2",
    name: "タイガッチ",
    image: "🐅",
    description: "密林の忍者タイガー！",
    sound: "ガルルルー！",
    profile: {
      hobbies: "静かな狩りの修行",
      dislikes: "騒がしいところ",
      specialSkill: "音もなく標的に近づく"
    },
    favoriteFood: ["food-005", "food-006", "food-013"],
    evolutionStage: 1,
    baseCharacterId: "char-013",
    nextEvolutionId: "char-013-3",
    prevEvolutionId: "char-013"
  },
  {
    id: "char-014-2",
    name: "モーモーラ",
    image: "🐮",
    description: "大地の力持ちウシ！",
    sound: "モォーモォー！",
    profile: {
      hobbies: "草原を走ること",
      dislikes: "あわてること",
      specialSkill: "重い荷物を運ぶ"
    },
    favoriteFood: ["food-007", "food-014", "food-017"],
    evolutionStage: 1,
    baseCharacterId: "char-014",
    nextEvolutionId: "char-014-3",
    prevEvolutionId: "char-014"
  },
  {
    id: "char-015-2",
    name: "メェメェラ",
    image: "🐏",
    description: "ふわふわの癒し戦士！",
    sound: "メェーメェー！",
    profile: {
      hobbies: "雲のように優しく包むこと",
      dislikes: "ハサミの音",
      specialSkill: "みんなをあたためる"
    },
    favoriteFood: ["food-007", "food-014", "food-015"],
    evolutionStage: 1,
    baseCharacterId: "char-015",
    nextEvolutionId: "char-015-3",
    prevEvolutionId: "char-015"
  },
  {
    id: "char-016-2",
    name: "かめーら",
    image: "🐢",
    description: "長寿の賢者カメ！",
    sound: "ノソノソー...",
    profile: {
      hobbies: "昔の知恵を伝えること",
      dislikes: "急いで動くこと",
      specialSkill: "忍耐力で最後まで完遂"
    },
    favoriteFood: ["food-007", "food-001", "food-002"],
    evolutionStage: 1,
    baseCharacterId: "char-016",
    nextEvolutionId: "char-016-3",
    prevEvolutionId: "char-016"
  },
  {
    id: "char-017-2",
    name: "キャッティー",
    image: "🐈",
    description: "かしこいネコの戦士！",
    sound: "ニャァーオ！",
    profile: {
      hobbies: "高いところに登ること",
      dislikes: "水",
      specialSkill: "素早く動ける"
    },
    favoriteFood: ["food-002", "food-005", "food-017"],
    evolutionStage: 1,
    baseCharacterId: "char-017",
    nextEvolutionId: "char-017-3",
    prevEvolutionId: "char-017"
  },
  {
    id: "char-018-2",
    name: "ワンワンダ",
    image: "🐕",
    description: "強くて頼れる犬の戦士！",
    sound: "ワォーン！",
    profile: {
      hobbies: "仲間を守ること",
      dislikes: "お留守番",
      specialSkill: "勇気と忠誠心"
    },
    favoriteFood: ["food-005", "food-018", "food-017"],
    evolutionStage: 1,
    baseCharacterId: "char-018",
    nextEvolutionId: "char-018-3",
    prevEvolutionId: "char-018"
  },
  {
    id: "char-019-2",
    name: "ペンタロウ",
    image: "🐧",
    description: "成長したペンギン戦士！",
    sound: "ペンペペーン！",
    profile: {
      hobbies: "氷の海を泳ぐこと",
      dislikes: "暑いところ",
      specialSkill: "氷上を素早く移動"
    },
    favoriteFood: ["food-002", "food-010", "food-019"],
    evolutionStage: 1,
    baseCharacterId: "char-019",
    nextEvolutionId: "char-019-3",
    prevEvolutionId: "char-019"
  },
  {
    id: "char-020-2",
    name: "ドラゴラ",
    image: "🐲",
    description: "伝説の翼竜ドラゴン！",
    sound: "ドラゴォーン！",
    profile: {
      hobbies: "大空を翔けること",
      dislikes: "退屈な時間",
      specialSkill: "強力な炎のブレス"
    },
    favoriteFood: ["food-020", "food-006", "food-018"],
    evolutionStage: 1,
    baseCharacterId: "char-020",
    nextEvolutionId: "char-020-3",
    prevEvolutionId: "char-020"
  },

  // ========== 最終形態 ==========
  {
    id: "char-001-3",
    name: "コケロード",
    image: "🐓",
    description: "伝説のニワトリ勇者！",
    sound: "コケコッコー！！",
    profile: {
      hobbies: "大空を翔けること",
      dislikes: "何もない（克服した）",
      specialSkill: "朝を告げる勇気の声"
    },
    favoriteFood: ["food-001", "food-003", "food-007", "food-014"],
    evolutionStage: 2,
    baseCharacterId: "char-001",
    prevEvolutionId: "char-001-2"
  },
  {
    id: "char-002-3",
    name: "イーグロン",
    image: "🦅",
    description: "氷の王者ペンギン皇帝！",
    sound: "ペェーーン！",
    profile: {
      hobbies: "極寒の海を支配すること",
      dislikes: "暑さ",
      specialSkill: "氷の嵐を呼ぶ"
    },
    favoriteFood: ["food-002", "food-010", "food-019"],
    evolutionStage: 2,
    baseCharacterId: "char-002",
    prevEvolutionId: "char-002-2"
  },
  {
    id: "char-003-3",
    name: "ガマキング",
    image: "🐸",
    description: "伝説のカエル忍者マスター！",
    sound: "ケロォォー！",
    profile: {
      hobbies: "究極の修行",
      dislikes: "何もない（克服した）",
      specialSkill: "水の術で天候を操る"
    },
    favoriteFood: ["food-001", "food-003"],
    evolutionStage: 2,
    baseCharacterId: "char-003",
    prevEvolutionId: "char-003-2"
  },
  {
    id: "char-004-3",
    name: "ベアゴッド",
    image: "🐻",
    description: "森の至高神コアラ皇！",
    sound: "コアラァァオ！",
    profile: {
      hobbies: "森全体を守護すること",
      dislikes: "自然破壊",
      specialSkill: "森の精霊を呼ぶ"
    },
    favoriteFood: ["food-004", "food-007", "food-015"],
    evolutionStage: 2,
    baseCharacterId: "char-004",
    prevEvolutionId: "char-004-2"
  },
  {
    id: "char-005-3",
    name: "キュウビ",
    image: "🦊",
    description: "九尾の賢者キツネ！",
    sound: "コォォーン！",
    profile: {
      hobbies: "全ての知識を極めること",
      dislikes: "無知",
      specialSkill: "未来を予見する知恵"
    },
    favoriteFood: ["food-005", "food-013", "food-002"],
    evolutionStage: 2,
    baseCharacterId: "char-005",
    prevEvolutionId: "char-005-2"
  },
  {
    id: "char-006-3",
    name: "レオキング",
    image: "🦁",
    description: "絶対王者ライオンキング！",
    sound: "ガオォォォー！",
    profile: {
      hobbies: "全ての生き物を守護すること",
      dislikes: "不正",
      specialSkill: "王者の威厳で敵を制す"
    },
    favoriteFood: ["food-005", "food-006", "food-013"],
    evolutionStage: 2,
    baseCharacterId: "char-006",
    prevEvolutionId: "char-006-2"
  },
  {
    id: "char-007-3",
    name: "マンモスキング",
    image: "🦣",
    description: "古代の巨神象！",
    sound: "パオォォーン！",
    profile: {
      hobbies: "大地を守護すること",
      dislikes: "争い",
      specialSkill: "大地を揺るがす力"
    },
    favoriteFood: ["food-007", "food-008", "food-009", "food-015"],
    evolutionStage: 2,
    baseCharacterId: "char-007",
    prevEvolutionId: "char-007-2"
  },
  {
    id: "char-008-3",
    name: "ゴリラキング",
    image: "🦍",
    description: "最強のゴリラ戦士！",
    sound: "ウホォォー！",
    profile: {
      hobbies: "究極のアクロバット",
      dislikes: "制限",
      specialSkill: "自由自在に空を飛ぶ"
    },
    favoriteFood: ["food-008", "food-009", "food-001"],
    evolutionStage: 2,
    baseCharacterId: "char-008",
    prevEvolutionId: "char-008-2"
  },
  {
    id: "char-009-3",
    name: "ボアロード",
    image: "🐗",
    description: "優しき勇者イノシシ！",
    sound: "ブヒィィー！",
    profile: {
      hobbies: "平和を守ること",
      dislikes: "悲しみ",
      specialSkill: "愛の力で全てを癒す"
    },
    favoriteFood: ["food-007", "food-008", "food-009", "food-017"],
    evolutionStage: 2,
    baseCharacterId: "char-009",
    prevEvolutionId: "char-009-2"
  },
  {
    id: "char-010-3",
    name: "オクトロード",
    image: "🐙",
    description: "深海の芸術神タコ！",
    sound: "ニュルルルー！",
    profile: {
      hobbies: "宇宙の真理を描くこと",
      dislikes: "単調",
      specialSkill: "幻影の芸術で空間を操る"
    },
    favoriteFood: ["food-002", "food-010", "food-019"],
    evolutionStage: 2,
    baseCharacterId: "char-010",
    prevEvolutionId: "char-010-2"
  },
  {
    id: "char-011-3",
    name: "ポーラード",
    image: "🐻‍❄️",
    description: "伝説の森神ベアー！",
    sound: "グォォォー！",
    profile: {
      hobbies: "自然全体を守護すること",
      dislikes: "破壊",
      specialSkill: "森羅万象を操る力"
    },
    favoriteFood: ["food-005", "food-002", "food-011", "food-009"],
    evolutionStage: 2,
    baseCharacterId: "char-011",
    prevEvolutionId: "char-011-2"
  },
  {
    id: "char-012-3",
    name: "パンダゴッド",
    image: "🐼",
    description: "悟りを開いたパンダ仙人！",
    sound: "モグゥゥー！",
    profile: {
      hobbies: "宇宙の真理を探求すること",
      dislikes: "煩悩",
      specialSkill: "究極の平穏をもたらす"
    },
    favoriteFood: ["food-012", "food-007", "food-008"],
    evolutionStage: 2,
    baseCharacterId: "char-012",
    prevEvolutionId: "char-012-2"
  },
  {
    id: "char-013-3",
    name: "タイガロード",
    image: "🐅",
    description: "伝説の白虎神！",
    sound: "ガルルルルー！",
    profile: {
      hobbies: "完璧な狩りの技を極めること",
      dislikes: "油断",
      specialSkill: "一瞬で敵を仕留める神速"
    },
    favoriteFood: ["food-005", "food-006", "food-013"],
    evolutionStage: 2,
    baseCharacterId: "char-013",
    prevEvolutionId: "char-013-2"
  },
  {
    id: "char-014-3",
    name: "ブルゴッド",
    image: "🐂",
    description: "大地の守護神ブル！",
    sound: "モォォォー！",
    profile: {
      hobbies: "大地を耕し豊かにすること",
      dislikes: "焦り",
      specialSkill: "大地の力で全てを支える"
    },
    favoriteFood: ["food-007", "food-014", "food-017"],
    evolutionStage: 2,
    baseCharacterId: "char-014",
    prevEvolutionId: "char-014-2"
  },
  {
    id: "char-015-3",
    name: "ラムゴッド",
    image: "🐏",
    description: "天空の雲神ラム！",
    sound: "メェェェー！",
    profile: {
      hobbies: "雲の上で全てを見守ること",
      dislikes: "争い",
      specialSkill: "天空の毛で全てを包む"
    },
    favoriteFood: ["food-007", "food-014", "food-015"],
    evolutionStage: 2,
    baseCharacterId: "char-015",
    prevEvolutionId: "char-015-2"
  },
  {
    id: "char-016-3",
    name: "カメガミ",
    image: "🐢",
    description: "万年を生きる亀仙人！",
    sound: "ノソォォー...",
    profile: {
      hobbies: "永遠の知恵を伝えること",
      dislikes: "愚かさ",
      specialSkill: "時を超える忍耐力"
    },
    favoriteFood: ["food-007", "food-001", "food-002"],
    evolutionStage: 2,
    baseCharacterId: "char-016",
    prevEvolutionId: "char-016-2"
  },
  {
    id: "char-017-3",
    name: "ライオネル",
    image: "🦁",
    description: "百獣の王ライオン！",
    sound: "ガオォォォー！",
    profile: {
      hobbies: "仲間を守ること",
      dislikes: "不正",
      specialSkill: "王者の威厳"
    },
    favoriteFood: ["food-002", "food-005", "food-017"],
    evolutionStage: 2,
    baseCharacterId: "char-017",
    prevEvolutionId: "char-017-2"
  },
  {
    id: "char-018-3",
    name: "ウルフキング",
    image: "🐺",
    description: "伝説の狼王！",
    sound: "アオォォーン！",
    profile: {
      hobbies: "群れを率いること",
      dislikes: "裏切り",
      specialSkill: "月の力を宿す遠吠え"
    },
    favoriteFood: ["food-005", "food-018", "food-017"],
    evolutionStage: 2,
    baseCharacterId: "char-018",
    prevEvolutionId: "char-018-2"
  },
  {
    id: "char-019-3",
    name: "エンペラー",
    image: "🐧",
    description: "氷の皇帝ペンギン！",
    sound: "ペンペェェー！",
    profile: {
      hobbies: "極寒の地を守ること",
      dislikes: "暑さ",
      specialSkill: "氷の嵐を呼ぶ"
    },
    favoriteFood: ["food-002", "food-010", "food-019"],
    evolutionStage: 2,
    baseCharacterId: "char-019",
    prevEvolutionId: "char-019-2"
  },
  {
    id: "char-020-3",
    name: "ドラゴンキング",
    image: "🐉",
    description: "究極神龍ドラゴン！",
    sound: "ドラゴォォーン！",
    profile: {
      hobbies: "全宇宙を見守ること",
      dislikes: "邪悪",
      specialSkill: "究極の龍炎で全てを浄化"
    },
    favoriteFood: ["food-020", "food-006", "food-018"],
    evolutionStage: 2,
    baseCharacterId: "char-020",
    prevEvolutionId: "char-020-2"
  }
];

// キャラクターをIDで取得
export function getCharacterById(id: string): Character | undefined {
  return CHARACTERS.find(c => c.id === id);
}

// まだゲットしていないキャラクターからランダムに1体選ぶ（初期形態のみ）
export function getRandomUnownedCharacter(ownedIds: string[]): Character | null {
  const initialStageCharacters = CHARACTERS.filter(c => c.evolutionStage === 0);
  const unowned = initialStageCharacters.filter(c => !ownedIds.includes(c.id));
  if (unowned.length === 0) {
    return null; // 全コンプリート
  }
  const randomIndex = Math.floor(Math.random() * unowned.length);
  return unowned[randomIndex];
}

// 進化チェーンを取得（初期→第2→最終）
export function getEvolutionChain(baseCharacterId: string): Character[] {
  return CHARACTERS.filter(c => c.baseCharacterId === baseCharacterId)
                   .sort((a, b) => a.evolutionStage - b.evolutionStage);
}

// 次の進化先を取得
export function getNextEvolution(characterId: string): Character | undefined {
  const current = getCharacterById(characterId);
  if (!current || !current.nextEvolutionId) return undefined;
  return getCharacterById(current.nextEvolutionId);
}

// 進化可能かチェック
export function canEvolve(character: Character | null | undefined): boolean {
  if (!character) return false;
  return character.nextEvolutionId !== undefined;
}

// 全キャラクター数（初期形態のみカウント）
export const TOTAL_CHARACTER_COUNT = CHARACTERS.filter(c => c.evolutionStage === 0).length;
