import type { KanjiData } from '../types';

// 1年生の全80漢字データ
const GRADE_1_RAW = [
  { char: "一", reading: "いち", sentence: "___ばんを目指す。", hint: "すうじの1" },
  { char: "右", reading: "みぎ", sentence: "___手をあげる。", hint: "ひだりの反対" },
  { char: "雨", reading: "あめ", sentence: "___がふってきた。", hint: "空からふる水" },
  { char: "円", reading: "えん", sentence: "百___玉をひろう。", hint: "お金の単位" },
  { char: "王", reading: "おう", sentence: "ライオンは百獣の___。", hint: "一番えらい人" },
  { char: "音", reading: "おと", sentence: "雨の___がきこえる。", hint: "耳できくもの" },
  { char: "下", reading: "した", sentence: "机の___にもぐる。", hint: "うえの反対" },
  { char: "火", reading: "ひ", sentence: "___がもえている。", hint: "あつくて赤い" },
  { char: "花", reading: "はな", sentence: "きれいな___がさく。", hint: "植物" },
  { char: "貝", reading: "かい", sentence: "海で___をひろう。", hint: "海にいる生き物" },
  { char: "学", reading: "がく", sentence: "小___生になる。", hint: "勉強すること" },
  { char: "気", reading: "き", sentence: "元___にあそぶ。", hint: "気持ち" },
  { char: "九", reading: "きゅう", sentence: "___時におきる。", hint: "すうじの9" },
  { char: "休", reading: "やす", sentence: "学校を___む。", hint: "リラックス" },
  { char: "玉", reading: "たま", sentence: "お年___をもらう。", hint: "まるいもの" },
  { char: "金", reading: "きん", sentence: "___メダルをとる。", hint: "ピカピカの金属" },
  { char: "空", reading: "そら", sentence: "青い___を見上げる。", hint: "上にあるもの" },
  { char: "月", reading: "つき", sentence: "___がきれいな夜。", hint: "夜空にひかる" },
  { char: "犬", reading: "いぬ", sentence: "___と散歩する。", hint: "ワンワン" },
  { char: "見", reading: "み", sentence: "テレビを___る。", hint: "目ですること" },
  { char: "五", reading: "ご", sentence: "___回まわる。", hint: "すうじの5" },
  { char: "口", reading: "くち", sentence: "大きな___をあける。", hint: "食べるところ" },
  { char: "校", reading: "こう", sentence: "学___へいく。", hint: "勉強する場所" },
  { char: "左", reading: "ひだり", sentence: "___手で書く。", hint: "みぎの反対" },
  { char: "三", reading: "さん", sentence: "___時のおやつ。", hint: "すうじの3" },
  { char: "山", reading: "やま", sentence: "高い___にのぼる。", hint: "自然にある高い場所" },
  { char: "子", reading: "こ", sentence: "女の___とあそぶ。", hint: "小さい人" },
  { char: "四", reading: "よん", sentence: "___つのお菓子。", hint: "すうじの4" },
  { char: "糸", reading: "いと", sentence: "赤い___を結ぶ。", hint: "細くて長い" },
  { char: "字", reading: "じ", sentence: "きれいに___を書く。", hint: "ノートに書くもの" },
  { char: "耳", reading: "みみ", sentence: "ウサギの___は長い。", hint: "聞くところ" },
  { char: "七", reading: "なな", sentence: "___つの願い。", hint: "すうじの7" },
  { char: "車", reading: "くるま", sentence: "赤い___に乗る。", hint: "道路を走る" },
  { char: "手", reading: "て", sentence: "___をあらう。", hint: "持つところ" },
  { char: "十", reading: "じゅう", sentence: "___回数える。", hint: "すうじの10" },
  { char: "出", reading: "で", sentence: "外へ___かける。", hint: "入るの反対" },
  { char: "女", reading: "おんな", sentence: "___の人。", hint: "女性" },
  { char: "小", reading: "ちい", sentence: "___さい虫。", hint: "大きいの反対" },
  { char: "上", reading: "うえ", sentence: "机の___に置く。", hint: "したの反対" },
  { char: "森", reading: "もり", sentence: "___の中を探検する。", hint: "木がたくさん" },
  { char: "人", reading: "ひと", sentence: "___がたくさんいる。", hint: "人間" },
  { char: "水", reading: "みず", sentence: "冷たい___をのむ。", hint: "飲むもの" },
  { char: "正", reading: "ただ", sentence: "___しい答え。", hint: "間違っていない" },
  { char: "生", reading: "い", sentence: "魚が___きている。", hint: "命がある" },
  { char: "青", reading: "あお", sentence: "___い空。", hint: "色のなまえ" },
  { char: "夕", reading: "ゆう", sentence: "___焼けがきれい。", hint: "日が沈むころ" },
  { char: "石", reading: "いし", sentence: "重い___を持つ。", hint: "道にある固いもの" },
  { char: "赤", reading: "あか", sentence: "___いリンゴ。", hint: "色のなまえ" },
  { char: "千", reading: "せん", sentence: "___円札。", hint: "すうじの1000" },
  { char: "川", reading: "かわ", sentence: "___で泳ぐ。", hint: "水が流れる場所" },
  { char: "先", reading: "さき", sentence: "___に行く。", hint: "あとの反対" },
  { char: "早", reading: "はや", sentence: "___く起きる。", hint: "遅いの反対" },
  { char: "草", reading: "くさ", sentence: "___むしりをする。", hint: "緑の植物" },
  { char: "足", reading: "あし", sentence: "___が速い。", hint: "歩くところ" },
  { char: "村", reading: "むら", sentence: "小さな___。", hint: "人が住む場所" },
  { char: "大", reading: "おお", sentence: "___きい家。", hint: "小さいの反対" },
  { char: "男", reading: "おとこ", sentence: "___の子。", hint: "男性" },
  { char: "竹", reading: "たけ", sentence: "___やぶに入る。", hint: "パンダが食べる" },
  { char: "中", reading: "なか", sentence: "家の___に入る。", hint: "外の反対" },
  { char: "虫", reading: "むし", sentence: "カブト___。", hint: "小さい生き物" },
  { char: "町", reading: "まち", sentence: "___へ買い物に行く。", hint: "人が多い場所" },
  { char: "天", reading: "てん", sentence: "___気がいい。", hint: "空のうえ" },
  { char: "田", reading: "た", sentence: "___んぼを見る。", hint: "お米を作るところ" },
  { char: "土", reading: "つち", sentence: "___をほる。", hint: "地面" },
  { char: "二", reading: "に", sentence: "___回ジャンプする。", hint: "すうじの2" },
  { char: "日", reading: "ひ", sentence: "お___様があたる。", hint: "太陽" },
  { char: "入", reading: "はい", sentence: "お風呂に___る。", hint: "出るの反対" },
  { char: "年", reading: "とし", sentence: "お___玉。", hint: "1年" },
  { char: "白", reading: "しろ", sentence: "___い雪。", hint: "色のなまえ" },
  { char: "八", reading: "はち", sentence: "___百屋。", hint: "すうじの8" },
  { char: "百", reading: "ひゃく", sentence: "___点満点。", hint: "すうじの100" },
  { char: "文", reading: "ぶん", sentence: "作___を書く。", hint: "言葉のあつまり" },
  { char: "木", reading: "き", sentence: "大きな___。", hint: "森にあるもの" },
  { char: "本", reading: "ほん", sentence: "___を読む。", hint: "図書室にある" },
  { char: "名", reading: "な", sentence: "___前を書く。", hint: "ネーム" },
  { char: "目", reading: "め", sentence: "___がかゆい。", hint: "見るもの" },
  { char: "立", reading: "た", sentence: "席を___つ。", hint: "座るの反対" },
  { char: "力", reading: "ちから", sentence: "___持ち。", hint: "パワー" },
  { char: "林", reading: "はやし", sentence: "___の中。", hint: "木があつまった所" },
  { char: "六", reading: "ろく", sentence: "___年生。", hint: "すうじの6" },
];

// ダミーの選択肢リスト
const DUMMY_READINGS = [
  "あし", "め", "て", "いぬ", "ねこ", "そら", "うみ", "かわ", "やま", "き",
  "はな", "みみ", "くち", "ひと", "おと", "あめ", "ほし", "つき", "ひ", "みず",
  "いし", "くさ", "むし", "とり", "さかな", "うし", "うま", "ぶた", "ひつじ", "さる"
];

// 選択肢を生成する関数
function generateOptions(correct: string): string[] {
  const filtered = DUMMY_READINGS.filter(d => d !== correct);
  const shuffled = filtered.sort(() => 0.5 - Math.random());
  const selectedDummies = shuffled.slice(0, 2);
  return [correct, ...selectedDummies].sort(() => 0.5 - Math.random());
}

// 1年生の漢字データ（マスターデータ）
export const GRADE_1_KANJI: KanjiData[] = GRADE_1_RAW.map(k => ({
  char: k.char,
  grade: 1,
  reading: k.reading,
  options: generateOptions(k.reading),
  sentence: k.sentence,
  hint: k.hint,
}));

// 全学年の漢字データ（現時点では1年生のみ）
export const ALL_KANJI: KanjiData[] = [
  ...GRADE_1_KANJI,
];

// 学年別に漢字を取得
export function getKanjiByGrade(grade: number): KanjiData[] {
  return ALL_KANJI.filter(k => k.grade === grade);
}

// 指定された漢字からランダムに10問選出
export function selectRandomKanji(kanjiChars: string[], count: number = 10): KanjiData[] {
  const available = ALL_KANJI.filter(k => kanjiChars.includes(k.char));

  if (available.length === 0) {
    return [];
  }

  // シャッフルして選出
  const shuffled = [...available].sort(() => Math.random() - 0.5);

  if (shuffled.length >= count) {
    return shuffled.slice(0, count);
  }

  // 足りない場合は繰り返す
  const result: KanjiData[] = [];
  while (result.length < count) {
    result.push(...shuffled);
  }
  return result.slice(0, count);
}
