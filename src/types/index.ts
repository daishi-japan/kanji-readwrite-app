// 漢字データ型
export type KanjiData = {
  char: string;      // 漢字
  grade: number;     // 学年（1-6）
  reading: string;   // 読み方（ひらがな）
  options: string[]; // 3択の選択肢
  sentence: string;  // 例文（___で穴埋め）
  hint: string;      // ヒント
};

// キャラクターデータ型
export type Character = {
  id: string;          // 一意のID (例: "char-001")
  name: string;        // キャラクター名
  image: string;       // 画像パス
  description: string; // ひとこと説明
  sound?: string;      // 泣き声（オプション）
  profile: {
    hobbies: string;      // 好きな活動・趣味
    dislikes: string;     // 嫌いなこと
    specialSkill: string; // 特技
  };
  // ===== 進化システム用 =====
  evolutionStage: 0 | 1 | 2;  // 0: 初期, 1: 第2形態, 2: 最終形態
  baseCharacterId: string;     // 初期形態のID（例: "char-001"）
  nextEvolutionId?: string;    // 次の進化先ID（最終形態はundefined）
  prevEvolutionId?: string;    // 前の進化元ID（初期形態はundefined）
  // ===== 餌システム用 =====
  favoriteFood: string[];      // 食べられる餌のID配列 (例: ["food-001", "food-002"])
};

// ゲット済みキャラクター型
export type CollectedCharacter = {
  characterId: string; // キャラクターID
  collectedAt: string; // ゲットした日時 (ISO文字列)
  // ===== 進化システム用 =====
  evolutionLevel: 0 | 1 | 2;  // 現在の進化レベル
  trainingCount: number;       // トレーニング完了回数
};

// 学習履歴レコード型
export type HistoryRecord = {
  date: string;   // 日付 (例: "1/14")
  char: string;   // 漢字
  result: 'correct' | 'incorrect'; // 結果
};

// 画面の種類
export type ViewType =
  | 'home'
  | 'modeSelect'       // モード選択画面
  | 'characterSelect'  // キャラクター選択画面
  | 'reading'          // パート1: 読み練習
  | 'transition'       // パート1完了 → パート2への遷移画面
  | 'writing'          // パート2: 書き練習
  | 'getCharacter'     // キャラクターゲット演出
  | 'evolution'        // 進化演出画面
  | 'collection'       // ずかん
  | 'history'          // 学習履歴
  | 'settings'         // 保護者設定
  | 'feeding';         // 餌やり画面

// ご褒美プール型
export type RewardPool = {
  rewards: string[];      // 保護者が入力したご褒美リスト
  usedRewards: string[];  // 既に使用したご褒美
};

// トレーニングモード型
export type TrainingMode = 'getNew' | 'evolve' | 'reading' | 'writing';

// アプリ全体の状態
export type AppState = {
  view: ViewType;
  collectedCharacters: CollectedCharacter[];
  history: HistoryRecord[];
  activeKanjiChars: string[]; // 有効な漢字（charの配列）
};

// トレーニング状態
export type TrainingState = {
  queue: KanjiData[];        // 出題漢字リスト（10問）
  currentIndex: number;      // 現在の問題/漢字番号
  correctCount: number;      // 正解数
  phase: 'reading' | 'writing'; // フェーズ
  feedback: 'none' | 'correct' | 'incorrect'; // フィードバック状態
  selectedAnswer: string | null; // 選択した回答
};

// 書き順データ型（SVGパス情報）
export type StrokeData = {
  char: string;          // 漢字
  strokes: string[];     // 各画のSVGパスデータ
  medians: number[][][]; // 各画の中心線座標（アニメーション用）
};

// 餌アイテム型
export type FoodItem = {
  id: string;        // "food-001" ~ "food-020"
  name: string;      // "むし", "さかな", etc.
  emoji: string;     // "🐛", "🐟", etc.
};

// インベントリ型
export type Inventory = {
  [foodId: string]: number; // { "food-001": 3, "food-002": 1 }
};
