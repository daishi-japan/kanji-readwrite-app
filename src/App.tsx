import React, { useState, useCallback, useEffect } from 'react';
import {
  BookOpen, Book, History, Settings, X, CheckCircle,
  ArrowRight, CheckSquare, Square, Pencil, Sparkles, TrendingUp, Apple
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ViewType, KanjiData, CollectedCharacter, HistoryRecord, Character, RewardPool, TrainingMode, FoodItem, Inventory } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { use8BitVoice } from './hooks/use8BitVoice';
import { useFeedbackSounds } from './hooks/useFeedbackSounds';
import { useIsMobile } from './hooks/useIsMobile';
import { GRADE_1_KANJI, getKanjiByGrade, selectRandomKanji } from './data/kanji';
import { CHARACTERS, getCharacterById, getRandomUnownedCharacter, TOTAL_CHARACTER_COUNT, getNextEvolution, getEvolutionChain } from './data/characters';
import { selectRandomFood, FOODS } from './data/foods';
import { StrokeOrderAnimation } from './components/StrokeOrderAnimation';
import { Confetti } from './components/Confetti';
import { Container } from './components/Container';
import { Header } from './components/Header';
import { surfaceTones, primaryColors } from './theme/colors';

function App() {
  // ========== 永続化された状態 ==========
  const [collectedCharacters, setCollectedCharacters] = useLocalStorage<CollectedCharacter[]>(
    'kanji-app-collected',
    []
  );
  const [history, setHistory] = useLocalStorage<HistoryRecord[]>(
    'kanji-app-history',
    []
  );
  const [activeKanjiChars, setActiveKanjiChars] = useLocalStorage<string[]>(
    'kanji-app-active-kanji',
    GRADE_1_KANJI.map(k => k.char)
  );
  const [rewardPool, setRewardPool] = useLocalStorage<RewardPool>(
    'kanji-app-reward-pool',
    {
      rewards: ['アイスクリーム', '映画鑑賞', 'ゲーム30分'],
      usedRewards: []
    }
  );
  const [inventory, setInventory] = useLocalStorage<Inventory>(
    'kanji-app-inventory',
    {}
  );

  // ========== LocalStorage マイグレーション ==========
  // 既存のCollectedCharacterデータにevolutionLevel, trainingCountを追加
  useState(() => {
    const needsMigration = collectedCharacters.some(
      c => !('evolutionLevel' in c) || !('trainingCount' in c)
    );

    if (needsMigration) {
      const migrated = collectedCharacters.map(c => ({
        ...c,
        evolutionLevel: ('evolutionLevel' in c) ? c.evolutionLevel : 0 as 0 | 1 | 2,
        trainingCount: ('trainingCount' in c) ? c.trainingCount : 0
      }));
      setCollectedCharacters(migrated);
    }
  });

  // ========== 音声再生 ==========
  const { play8BitSound } = use8BitVoice();
  const { playCorrectSound, playIncorrectSound } = useFeedbackSounds();

  // ========== レスポンシブ ==========
  const isMobile = useIsMobile();

  // ========== UI状態 ==========
  const [view, setView] = useState<ViewType>('home');
  const [settingTabGrade, setSettingTabGrade] = useState(1);
  const [settingsTab, setSettingsTab] = useState<'kanji' | 'rewards'>('kanji');
  const [historyViewMode, setHistoryViewMode] = useState<'calendar' | 'list'>('list');
  const [expandedDate, setExpandedDate] = useState<string | null>(null);
  const [encouragingMessage, setEncouragingMessage] = useState<string | null>(null);

  // ========== トレーニング状態 ==========
  const [trainingQueue, setTrainingQueue] = useState<KanjiData[]>([]);
  const [trainIndex, setTrainIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'incorrect'>('none');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // ========== モーダル状態 ==========
  const [showStrokeModal, setShowStrokeModal] = useState(false);
  const [selectedCharacterDetail, setSelectedCharacterDetail] = useState<Character | null>(null);

  // ========== ゲット演出状態 ==========
  const [newCharacter, setNewCharacter] = useState<Character | null>(null);

  // ========== ご褒美ポップアップ状態 ==========
  const [showRewardPopup, setShowRewardPopup] = useState(false);
  const [currentReward, setCurrentReward] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  // ========== 進化システム状態 ==========
  const [trainingMode, setTrainingMode] = useState<TrainingMode>('getNew');
  const [selectedCharacterForTraining, setSelectedCharacterForTraining] = useState<Character | null>(null);
  const [evolvingCharacter, setEvolvingCharacter] = useState<{ from: Character; to: Character } | null>(null);
  const [evolutionPhase, setEvolutionPhase] = useState<'flash' | 'transform' | 'reveal' | 'complete'>('flash');

  // ========== 餌システム状態 ==========
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [acquiredFood, setAcquiredFood] = useState<FoodItem | null>(null);

  // ========== 餌やりシステム状態 ==========
  const [selectedCharacterForFeeding, setSelectedCharacterForFeeding] = useState<string | null>(null);
  const [showFeedingResult, setShowFeedingResult] = useState(false);
  const [feedingResultMessage, setFeedingResultMessage] = useState('');
  const [feedingConfirmation, setFeedingConfirmation] = useState<{ character: Character; food: FoodItem } | null>(null);

  // ========== 練習中断確認状態 ==========
  const [showExitTrainingConfirm, setShowExitTrainingConfirm] = useState(false);

  // ========== ヘルパー関数 ==========
  const getTodayDateString = () => {
    const d = new Date();
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  // 進化家系ごとに1体のキャラクターを取得（最も進化したものを表示）
  const getUniqueCollectedCharacters = (): CollectedCharacter[] => {
    const latestMap = new Map<string, CollectedCharacter>();

    collectedCharacters.forEach(collected => {
      const char = getCharacterById(collected.characterId);
      if (!char) return;

      const baseId = char.baseCharacterId;
      const existing = latestMap.get(baseId);

      if (!existing || collected.evolutionLevel > existing.evolutionLevel) {
        latestMap.set(baseId, collected);
      }
    });

    return Array.from(latestMap.values());
  };

  // ========== 応援メッセージ ==========
  const PRAISE_MESSAGES = [
    'すごい！',
    'やったね！',
    'さすが！',
    'よくできました！',
    'かんぺき！',
    'すばらしい！'
  ];

  const ENCOURAGING_MESSAGES = [
    'がんばれ！',
    'つぎはできるよ！',
    'おしい！',
    'もういちど！',
    'あきらめないで！',
    'がんばって！'
  ];

  const getRandomMessage = (messages: string[]) => {
    return messages[Math.floor(Math.random() * messages.length)];
  };

  // 日付ごとにグループ化
  type GroupedHistory = {
    date: string;
    records: HistoryRecord[];
    correctCount: number;
    totalCount: number;
  };

  const groupHistoryByDate = (history: HistoryRecord[]): GroupedHistory[] => {
    const grouped = new Map<string, HistoryRecord[]>();

    history.forEach(record => {
      if (!grouped.has(record.date)) {
        grouped.set(record.date, []);
      }
      grouped.get(record.date)!.push(record);
    });

    return Array.from(grouped.entries()).map(([date, records]) => ({
      date,
      records,
      correctCount: records.filter(r => r.result === 'correct').length,
      totalCount: records.length
    }));
  };

  // 特定の進化形態が取得済みかチェック
  const isCharacterFormOwned = useCallback((characterId: string): boolean => {
    return collectedCharacters.some(c => c.characterId === characterId);
  }, [collectedCharacters]);

  // ランダムご褒美選択（使用済み除外）
  const selectRandomReward = useCallback((): string | null => {
    const availableRewards = rewardPool.rewards.filter(
      r => !rewardPool.usedRewards.includes(r)
    );

    if (availableRewards.length === 0) {
      return null; // 全て使い切った
    }

    const randomIndex = Math.floor(Math.random() * availableRewards.length);
    const selectedReward = availableRewards[randomIndex];

    // 使用済みに追加
    setRewardPool({
      ...rewardPool,
      usedRewards: [...rewardPool.usedRewards, selectedReward]
    });

    return selectedReward;
  }, [rewardPool, setRewardPool]);

  // 餌をインベントリに追加
  const addFoodToInventory = useCallback((foodId: string) => {
    setInventory(prev => ({
      ...prev,
      [foodId]: (prev[foodId] || 0) + 1
    }));
  }, [setInventory]);

  // キャラ獲得後に餌モーダルを表示
  useEffect(() => {
    if (isRevealed && acquiredFood && view === 'getCharacter') {
      const timer = setTimeout(() => {
        setShowFoodModal(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isRevealed, acquiredFood, view]);

  // 餌やり確認モーダルを表示
  const handleFeedCharacter = useCallback((character: Character, food: FoodItem) => {
    const count = inventory[food.id] || 0;
    if (count <= 0) return;

    // 確認モーダルを表示
    setFeedingConfirmation({ character, food });
  }, [inventory]);

  // 餌やり実行処理
  const confirmFeedCharacter = useCallback(() => {
    if (!feedingConfirmation) return;

    const { character, food } = feedingConfirmation;

    // インベントリから減算
    setInventory(prev => ({
      ...prev,
      [food.id]: Math.max(0, (prev[food.id] || 0) - 1)
    }));

    // 結果メッセージ設定
    const messages = [
      `${character.name}は ${food.name}を おいしそうに たべたよ！`,
      `${character.name}は とっても よろこんでいるよ！`,
      `${food.name}を あげたら ${character.name}が うれしそう！`,
      `${character.name}の だいすきな ${food.name}だ！`
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setFeedingResultMessage(randomMessage);
    setShowFeedingResult(true);
    setFeedingConfirmation(null);
  }, [feedingConfirmation, setInventory]);

  // ========== 進化処理 ==========
  const handleEvolution = useCallback(() => {
    if (!selectedCharacterForTraining) return;

    const collected = collectedCharacters.find(
      c => c.characterId === selectedCharacterForTraining.id
    );

    if (!collected || collected.evolutionLevel >= 2) {
      alert('このキャラクターはもう最終形態です！');
      setView('home');
      return;
    }

    const nextEvolution = getNextEvolution(selectedCharacterForTraining.id);

    if (!nextEvolution) {
      alert('進化先が見つかりません');
      setView('home');
      return;
    }

    // 進化演出データセット
    setEvolvingCharacter({
      from: selectedCharacterForTraining,
      to: nextEvolution
    });

    // コレクション更新
    const updatedCollection = collectedCharacters.map(c =>
      c.characterId === selectedCharacterForTraining.id
        ? {
            ...c,
            characterId: nextEvolution.id,
            evolutionLevel: (c.evolutionLevel + 1) as 0 | 1 | 2,
            trainingCount: c.trainingCount + 1
          }
        : c
    );

    setCollectedCharacters(updatedCollection);

    // アニメーションシーケンス開始
    setEvolutionPhase('flash');
    setView('evolution');

    setTimeout(() => setEvolutionPhase('transform'), 1000);
    setTimeout(() => setEvolutionPhase('reveal'), 3000);
    setTimeout(() => setEvolutionPhase('complete'), 4000);

  }, [selectedCharacterForTraining, collectedCharacters, setCollectedCharacters]);

  // ========== トレーニング開始 ==========
  const startTraining = useCallback(() => {
    const selected = selectRandomKanji(activeKanjiChars, 10);
    if (selected.length === 0) {
      alert('学習する漢字が選択されていません。設定で選んでください。');
      setView('settings');
      return;
    }
    setTrainingQueue(selected);
    setTrainIndex(0);
    setCorrectCount(0);
    setFeedback('none');
    setSelectedAnswer(null);

    // よみモード(getNew/evolve)の場合は読み練習から、かきモード(writing)の場合は書き練習から
    if (trainingMode === 'writing') {
      setView('writing');
    } else {
      setView('reading');
    }
  }, [activeKanjiChars, trainingMode]);

  // ========== 読み練習の回答処理 ==========
  const handleReadingAnswer = useCallback((option: string) => {
    if (feedback !== 'none') return;

    const current = trainingQueue[trainIndex];
    setSelectedAnswer(option);

    const isCorrect = option === current.reading;

    // 履歴に追加
    setHistory(prev => [{
      date: getTodayDateString(),
      char: current.char,
      result: isCorrect ? 'correct' : 'incorrect'
    }, ...prev.slice(0, 499)]); // 最大500件

    if (isCorrect) {
      // 正解時: 効果音と褒めメッセージ
      playCorrectSound();
      setEncouragingMessage(getRandomMessage(PRAISE_MESSAGES));
      setFeedback('correct');
      setCorrectCount(prev => prev + 1);
      setTimeout(() => {
        setFeedback('none');
        setSelectedAnswer(null);
        setEncouragingMessage(null);
        if (trainIndex < trainingQueue.length - 1) {
          setTrainIndex(prev => prev + 1);
        } else {
          // 読み練習完了 → 報酬へ直接移動
          if (trainingMode === 'getNew') {
            // 新キャラゲット
            const ownedIds = collectedCharacters.map(c => c.characterId);
            const newChar = getRandomUnownedCharacter(ownedIds);
            setNewCharacter(newChar);
            setIsRevealed(false);

            // 餌獲得
            const randomFood = selectRandomFood();
            addFoodToInventory(randomFood.id);
            setAcquiredFood(randomFood);

            setView('getCharacter');
          } else if (trainingMode === 'evolve' && selectedCharacterForTraining) {
            // 餌獲得
            const randomFood = selectRandomFood();
            addFoodToInventory(randomFood.id);
            setAcquiredFood(randomFood);

            // 進化処理
            handleEvolution();
          }
        }
      }, 1200);
    } else {
      // 不正解時: ブザー音と応援メッセージ
      playIncorrectSound();
      setEncouragingMessage(getRandomMessage(ENCOURAGING_MESSAGES));
      setFeedback('incorrect');
    }
  }, [feedback, trainIndex, trainingQueue, setHistory, playCorrectSound, playIncorrectSound, trainingMode, collectedCharacters, selectedCharacterForTraining, handleEvolution]);

  // 不正解後に次へ進む
  const handleNextFromIncorrect = useCallback(() => {
    setFeedback('none');
    setSelectedAnswer(null);
    setEncouragingMessage(null);
    if (trainIndex < trainingQueue.length - 1) {
      setTrainIndex(prev => prev + 1);
    } else {
      // 読み練習完了 → 報酬へ直接移動
      if (trainingMode === 'getNew') {
        // 新キャラゲット
        const ownedIds = collectedCharacters.map(c => c.characterId);
        const newChar = getRandomUnownedCharacter(ownedIds);
        setNewCharacter(newChar);
        setIsRevealed(false);

        // 餌獲得
        const randomFood = selectRandomFood();
        addFoodToInventory(randomFood.id);
        setAcquiredFood(randomFood);

        setView('getCharacter');
      } else if (trainingMode === 'evolve' && selectedCharacterForTraining) {
        // 餌獲得
        const randomFood = selectRandomFood();
        addFoodToInventory(randomFood.id);
        setAcquiredFood(randomFood);

        // 進化処理
        handleEvolution();
      }
    }
  }, [trainIndex, trainingQueue.length, trainingMode, collectedCharacters, selectedCharacterForTraining, handleEvolution, addFoodToInventory]);

  // ========== 書き練習開始 ==========
  const startWritingPhase = useCallback(() => {
    setTrainIndex(0);
    setView('writing');
  }, []);

  // ========== 書き練習の「書けた！」処理 ==========
  const handleWritingDone = useCallback(() => {
    if (trainIndex < trainingQueue.length - 1) {
      setTrainIndex(prev => prev + 1);
    } else {
      // 書き練習完了

      if (trainingMode === 'getNew') {
        // ===== 既存: 新キャラゲット =====
        const ownedIds = collectedCharacters.map(c => c.characterId);
        const newChar = getRandomUnownedCharacter(ownedIds);
        setNewCharacter(newChar);
        setIsRevealed(false);

        // 餌獲得
        const randomFood = selectRandomFood();
        addFoodToInventory(randomFood.id);
        setAcquiredFood(randomFood);

        setView('getCharacter');

      } else if (trainingMode === 'evolve' && selectedCharacterForTraining) {
        // 餌獲得
        const randomFood = selectRandomFood();
        addFoodToInventory(randomFood.id);
        setAcquiredFood(randomFood);

        // ===== 新規: 進化処理 =====
        handleEvolution();
      }
    }
  }, [trainIndex, trainingQueue.length, collectedCharacters, trainingMode, selectedCharacterForTraining, handleEvolution, addFoodToInventory]);

  // ========== キャラクターゲット演出 ==========
  const revealCharacter = useCallback(() => {
    setIsRevealed(true);
    if (newCharacter) {
      const updatedCollected: CollectedCharacter[] = [
        ...collectedCharacters,
        {
          characterId: newCharacter.id,
          collectedAt: new Date().toISOString(),
          evolutionLevel: 0,
          trainingCount: 0
        }
      ];
      setCollectedCharacters(updatedCollected);

      // 20個ごとのご褒美チェック
      const uniqueCollected = [...new Set(updatedCollected.map(c => c.characterId))].length;
      if (uniqueCollected % 20 === 0 && uniqueCollected > 0) {
        const reward = selectRandomReward();
        if (reward) {
          setCurrentReward(reward);
          // キャラクター演出が終わった後にご褒美ポップアップを表示
          setTimeout(() => {
            setShowRewardPopup(true);
          }, 2000);
        }
      }
    }
  }, [newCharacter, collectedCharacters, setCollectedCharacters, selectRandomReward]);

  // ========== 設定関連 ==========
  const isAllGradeSelected = (grade: number) => {
    const kanjis = getKanjiByGrade(grade);
    if (kanjis.length === 0) return false;
    return kanjis.every(k => activeKanjiChars.includes(k.char));
  };

  const toggleGradeAll = (grade: number) => {
    const kanjis = getKanjiByGrade(grade);
    const kanjiChars = kanjis.map(k => k.char);
    if (isAllGradeSelected(grade)) {
      setActiveKanjiChars(prev => prev.filter(c => !kanjiChars.includes(c)));
    } else {
      setActiveKanjiChars(prev => Array.from(new Set([...prev, ...kanjiChars])));
    }
  };

  const toggleKanji = (char: string) => {
    setActiveKanjiChars(prev =>
      prev.includes(char) ? prev.filter(c => c !== char) : [...prev, char]
    );
  };

  // ========== レンダリング ==========
  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: surfaceTones.background }}>
      {/* ヘッダー（Material Design 3風） */}
      <Header
        view={view}
        setView={setView}
        collectedCharacters={collectedCharacters}
        setSelectedCharacterForFeeding={setSelectedCharacterForFeeding}
      />

      {/* メインコンテンツ */}
      <AnimatePresence mode="wait">
          {/* ========== ホーム画面 ========== */}
          {view === 'home' && (
            <motion.main
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="container mx-auto px-4 py-6"
            >
              <div
                className="rounded-2xl shadow-sm p-6 md:p-8"
                style={{
                  backgroundColor: surfaceTones.surface,
                  border: `1px solid ${surfaceTones.outlineVariant}`,
                }}
              >
                <Container maxWidth="2xl" className="flex flex-col items-center">
                  {/* タイトル */}
                  <motion.div
                    className="mb-8 text-center"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                  >
                    <h2 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-black text-gray-800 mb-2`}>
                      べんきょうして キャラをゲット！
                    </h2>
                  </motion.div>

                  {/* コレクション数 */}
                  <motion.div
                    className={`mb-8 rounded-2xl ${isMobile ? 'px-6 py-3' : 'px-10 py-5'}`}
                    style={{
                      backgroundColor: surfaceTones.surfaceVariant,
                      border: `1px solid ${surfaceTones.outlineVariant}`,
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1, type: 'spring' }}
                  >
                    <p className="font-bold text-center text-gray-800">
                      <span className={isMobile ? 'text-3xl' : 'text-5xl'}>{collectedCharacters.length}</span>
                      <span className={isMobile ? 'text-lg' : 'text-2xl'}> / {TOTAL_CHARACTER_COUNT}</span>
                      <span className={`${isMobile ? 'text-sm' : 'text-lg'} ml-2`}>ゲット！</span>
                    </p>
                  </motion.div>

                  {/* キャラクターたち */}
                  <div className={`mb-8 flex gap-3 flex-wrap justify-center ${isMobile ? 'max-w-[300px]' : 'max-w-md'}`}>
                    {collectedCharacters.slice(0, isMobile ? 9 : 12).map((cc, i) => {
                      const char = getCharacterById(cc.characterId);
                      return char ? (
                        <motion.div
                          key={i}
                          className={`${isMobile ? 'w-14 h-14' : 'w-16 h-16'} rounded-2xl flex items-center justify-center ${isMobile ? 'text-2xl' : 'text-3xl'} shadow-sm`}
                          style={{
                            backgroundColor: surfaceTones.surface,
                            border: `1px solid ${surfaceTones.outlineVariant}`,
                          }}
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{
                            duration: 0.5,
                            delay: 0.2 + i * 0.05,
                            type: 'spring',
                            stiffness: 260,
                            damping: 20,
                          }}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          {char.image}
                        </motion.div>
                      ) : null;
                    })}
                    {collectedCharacters.length > (isMobile ? 9 : 12) && (
                      <motion.div
                        className={`${isMobile ? 'w-14 h-14 text-sm' : 'w-16 h-16 text-base'} rounded-2xl flex items-center justify-center font-bold shadow-sm`}
                        style={{
                          backgroundColor: surfaceTones.surfaceVariant,
                          border: `1px solid ${surfaceTones.outlineVariant}`,
                          color: surfaceTones.outline,
                        }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                      >
                        +{collectedCharacters.length - (isMobile ? 9 : 12)}
                      </motion.div>
                    )}
                  </div>

                  {/* トレーニングボタン */}
                  <div className={`w-full ${isMobile ? 'max-w-xs' : 'max-w-2xl'} flex ${isMobile ? 'flex-col' : 'flex-row'} gap-4`}>
                    {/* よみボタン */}
                    <motion.button
                      onClick={() => {
                        setTrainingMode('reading');
                        setView('modeSelect');
                      }}
                      className={`${isMobile ? 'w-full' : 'flex-1'} font-black ${isMobile ? 'text-2xl py-6' : 'text-3xl py-8'} rounded-2xl shadow-sm transition-colors flex flex-col items-center`}
                      style={{
                        backgroundColor: primaryColors.primaryBlueContainer,
                        color: primaryColors.onPrimaryBlue,
                        border: `2px solid ${primaryColors.primaryBlue}`,
                      }}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                      whileHover={{
                        backgroundColor: primaryColors.primaryBlue,
                        color: '#ffffff',
                        scale: 1.02,
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3 mb-1">
                        <BookOpen size={isMobile ? 32 : 36} />
                        <span>よみ</span>
                      </div>
                      <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-normal opacity-80`}>
                        10問 よみトレーニング
                      </span>
                    </motion.button>

                    {/* かきボタン */}
                    <motion.button
                      onClick={() => {
                        setTrainingMode('writing');
                        setView('modeSelect');
                      }}
                      className={`${isMobile ? 'w-full' : 'flex-1'} font-black ${isMobile ? 'text-2xl py-6' : 'text-3xl py-8'} rounded-2xl shadow-sm transition-colors flex flex-col items-center`}
                      style={{
                        backgroundColor: primaryColors.primaryOrangeContainer,
                        color: primaryColors.onPrimaryOrange,
                        border: `2px solid ${primaryColors.primaryOrange}`,
                      }}
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                      whileHover={{
                        backgroundColor: primaryColors.primaryOrange,
                        color: '#ffffff',
                        scale: 1.02,
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3 mb-1">
                        <Pencil size={isMobile ? 32 : 36} />
                        <span>かき</span>
                      </div>
                      <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-normal opacity-80`}>
                        10問 かきトレーニング
                      </span>
                    </motion.button>
                  </div>
                </Container>
              </div>
            </motion.main>
          )}

          {/* ========== モード選択画面 ========== */}
          {view === 'modeSelect' && (
          <div className="h-full bg-gradient-to-b from-purple-400 to-pink-500 p-6 flex flex-col">
            {/* 戻るボタン */}
            <button
              onClick={() => setView('home')}
              className="absolute top-4 left-4 z-10 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg text-gray-600 hover:text-gray-800 transition-all"
            >
              <ArrowRight size={20} className="rotate-180" />
            </button>

            <div className="flex-1 flex flex-col items-center justify-center gap-6">
              <h2 className="text-3xl font-black text-white mb-4 text-center drop-shadow-lg">
                {trainingMode === 'reading' ? 'よみトレーニング' : 'かきトレーニング'}
              </h2>

              {/* よみモードの場合: 新キャラゲットと育成の両方 */}
              {trainingMode === 'reading' && (
                <>
                  {/* 新キャラゲットモード */}
                  <button
                    onClick={() => {
                      setTrainingMode('getNew');
                      startTraining();
                    }}
                    className="w-full max-w-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-black text-xl py-8 rounded-3xl shadow-[0_8px_0_rgba(180,100,0,0.3)] active:shadow-none active:translate-y-2 transition-all hover:scale-105"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Sparkles size={40} className="animate-pulse" />
                      <span className="text-center leading-tight">
                        あたらしい<br />キャラクターをゲットする
                      </span>
                    </div>
                  </button>

                  {/* 育成モード */}
                  <button
                    onClick={() => {
                      setTrainingMode('evolve');
                      setView('characterSelect');
                    }}
                    className="w-full max-w-xs bg-gradient-to-r from-green-400 to-emerald-500 text-white font-black text-xl py-8 rounded-3xl shadow-[0_8px_0_rgba(0,100,80,0.3)] active:shadow-none active:translate-y-2 transition-all hover:scale-105"
                    disabled={collectedCharacters.length === 0}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <TrendingUp size={40} className="animate-bounce" />
                      <span className="text-center leading-tight">
                        キャラクターをえらんで<br />そだてる
                      </span>
                    </div>
                  </button>

                  {collectedCharacters.length === 0 && (
                    <p className="text-white/80 text-sm text-center mt-2">
                      ※ まずキャラクターをゲットしよう！
                    </p>
                  )}
                </>
              )}

              {/* かきモードの場合: 新キャラゲットと育成の両方 */}
              {trainingMode === 'writing' && (
                <>
                  {/* 新キャラゲットモード */}
                  <button
                    onClick={() => {
                      setTrainingMode('getNew');
                      startTraining();
                    }}
                    className="w-full max-w-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-black text-xl py-8 rounded-3xl shadow-[0_8px_0_rgba(180,100,0,0.3)] active:shadow-none active:translate-y-2 transition-all hover:scale-105"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Sparkles size={40} className="animate-pulse" />
                      <span className="text-center leading-tight">
                        あたらしい<br />キャラクターをゲットする
                      </span>
                    </div>
                  </button>

                  {/* 育成モード */}
                  <button
                    onClick={() => {
                      setTrainingMode('evolve');
                      setView('characterSelect');
                    }}
                    className="w-full max-w-xs bg-gradient-to-r from-green-400 to-emerald-500 text-white font-black text-xl py-8 rounded-3xl shadow-[0_8px_0_rgba(0,100,80,0.3)] active:shadow-none active:translate-y-2 transition-all hover:scale-105"
                    disabled={collectedCharacters.length === 0}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <TrendingUp size={40} className="animate-bounce" />
                      <span className="text-center leading-tight">
                        キャラクターをえらんで<br />そだてる
                      </span>
                    </div>
                  </button>

                  {collectedCharacters.length === 0 && (
                    <p className="text-white/80 text-sm text-center mt-2">
                      ※ キャラクターがいなくても<br />かきトレーニングで ゲットできるよ！
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* ========== キャラクター選択画面 ========== */}
        {view === 'characterSelect' && (
          <div className="h-full bg-green-50 flex flex-col">
            {/* ヘッダー */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 relative">
              <button
                onClick={() => setView('modeSelect')}
                className="absolute top-4 left-4 bg-white/20 hover:bg-white/30 p-2 rounded-full"
              >
                <ArrowRight size={20} className="rotate-180" />
              </button>
              <h2 className="text-2xl font-black text-center">
                そだてる キャラを えらぼう
              </h2>
              <p className="text-sm text-center mt-2 text-green-100">
                トレーニングで キャラクターが しんか するよ！
              </p>
            </div>

            {/* キャラクター一覧 */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-2 gap-4">
                {getUniqueCollectedCharacters().map((collected) => {
                  const char = getCharacterById(collected.characterId);
                  if (!char) return null;

                  return (
                    <button
                      key={collected.characterId}
                      onClick={() => {
                        setSelectedCharacterForTraining(char);
                        startTraining();
                      }}
                      className="bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-all hover:scale-105 active:scale-95 flex flex-col items-center gap-2 relative"
                    >
                      {/* 最終形態バッジ */}
                      {collected.evolutionLevel === 2 && (
                        <div className="absolute top-2 left-2 text-2xl animate-bounce">
                          👑
                        </div>
                      )}

                      {/* キャラクター画像 */}
                      <div className="text-6xl mb-2">
                        {char.image}
                      </div>

                      {/* キャラクター名 */}
                      <span className="text-lg font-black text-gray-800">
                        {char.name}
                      </span>

                      {/* 進化レベル表示 */}
                      <div className="flex gap-1">
                        {Array.from({ length: collected.evolutionLevel + 1 }).map((_, i) => (
                          <span key={i} className="text-yellow-500 text-xl">★</span>
                        ))}
                        {Array.from({ length: 2 - collected.evolutionLevel }).map((_, i) => (
                          <span key={i} className="text-gray-300 text-xl">★</span>
                        ))}
                      </div>

                      {/* トレーニング回数 */}
                      <span className="text-xs text-gray-500">
                        トレーニング {collected.trainingCount}回
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* キャラクターがいない場合 */}
              {getUniqueCollectedCharacters().length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <div className="text-6xl mb-4">🎯</div>
                  <p className="text-lg font-bold">まだキャラクターが いないよ</p>
                  <p className="text-sm">まずは「あたらしいキャラクターをゲットする」で<br />キャラクターを ゲットしよう！</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========== 読み練習画面（パート1） ========== */}
        {view === 'reading' && trainingQueue.length > 0 && (
          <div className="h-full bg-orange-50 p-6 flex flex-col relative">
            {/* 戻るボタン */}
            <button
              onClick={() => setShowExitTrainingConfirm(true)}
              className="absolute top-4 left-4 z-10 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg text-gray-600 hover:text-gray-800 transition-all"
            >
              <ArrowRight size={20} className="rotate-180" />
            </button>

            {/* プログレスバー */}
            <div className="mb-2 flex items-center justify-between text-sm text-orange-600 font-bold">
              <span>パート1: よみ</span>
              <span>{trainIndex + 1} / {trainingQueue.length}</span>
            </div>
            <div className="w-full bg-gray-200 h-3 rounded-full mb-6 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-500 ease-out"
                style={{ width: `${((trainIndex + 1) / trainingQueue.length) * 100}%` }}
              />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-full bg-white p-6 rounded-[32px] shadow-xl border-b-8 border-orange-100 animate-slide-in relative overflow-hidden">

                {/* 正解フィードバック */}
                {feedback === 'correct' && (
                  <div className="absolute inset-0 z-20 bg-green-500/90 flex flex-col items-center justify-center animate-pop-in rounded-[24px]">
                    <CheckCircle size={80} className="text-white mb-2" />
                    <h3 className="text-4xl font-black text-white">せいかい！</h3>
                    {encouragingMessage && (
                      <p className="text-2xl font-black text-white mt-3 animate-bounce">
                        {encouragingMessage}
                      </p>
                    )}
                  </div>
                )}

                {/* 不正解フィードバック */}
                {feedback === 'incorrect' && (
                  <div className="absolute inset-0 z-20 bg-red-500/95 flex flex-col items-center justify-center animate-pop-in rounded-[24px] p-4 text-center">
                    <X size={80} className="text-white mb-2" />
                    <h3 className="text-3xl font-black text-white mb-2">ざんねん...</h3>
                    {encouragingMessage && (
                      <p className="text-2xl font-black text-white mb-4 animate-pulse">
                        {encouragingMessage}
                      </p>
                    )}
                    <div className="bg-white rounded-xl p-4 w-full mb-6">
                      <p className="text-gray-500 font-bold text-sm">ただしい よみかた</p>
                      <p className="text-4xl font-black text-red-500">
                        {trainingQueue[trainIndex].reading}
                      </p>
                    </div>
                    <button
                      onClick={handleNextFromIncorrect}
                      className="bg-yellow-400 text-red-600 font-black text-xl py-3 px-8 rounded-full shadow-lg"
                    >
                      次へすすむ
                    </button>
                  </div>
                )}

                {/* 問題表示 */}
                <div className="text-center mb-6">
                  <span className="bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-sm font-bold">
                    だい {trainIndex + 1} もん
                  </span>
                </div>

                <h2 className="text-2xl font-black text-center mb-8 text-gray-800 leading-relaxed min-h-[4rem] flex items-center justify-center">
                  {(() => {
                    const current = trainingQueue[trainIndex];
                    const parts = current.sentence.split('___');
                    return (
                      <span>
                        {parts[0]}
                        <span className="inline-block text-red-500 border-b-4 border-red-500 px-1 mx-1 transform scale-125">
                          {current.char}
                        </span>
                        {parts[1]}
                      </span>
                    );
                  })()}
                </h2>

                {/* 選択肢 */}
                <div className="grid grid-cols-1 gap-3">
                  {trainingQueue[trainIndex].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleReadingAnswer(opt)}
                      disabled={feedback !== 'none'}
                      className={`border-2 font-bold text-xl py-5 rounded-2xl transition-all shadow-sm active:scale-95
                        ${feedback === 'none'
                          ? 'bg-white border-orange-200 hover:bg-orange-50 hover:border-orange-400 text-gray-700'
                          : opt === selectedAnswer
                            ? 'bg-gray-100 border-gray-300 text-gray-400'
                            : 'bg-white border-gray-100 text-gray-300'
                        }
                      `}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========== 遷移画面（読み→書き） ========== */}
        {view === 'transition' && (
          <div className="h-full bg-gradient-to-b from-green-400 to-emerald-500 p-6 flex flex-col items-center justify-center text-center">
            <div className="bg-white rounded-3xl p-8 shadow-2xl animate-pop-in">
              <CheckCircle size={80} className="text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-black text-gray-800 mb-2">
                よみ練習 かんりょう！
              </h2>
              <p className="text-gray-500 mb-6">
                {correctCount} / {trainingQueue.length} もん せいかい
              </p>
              <div className="bg-blue-50 p-4 rounded-xl mb-6">
                <p className="text-blue-800 font-bold">
                  つぎは かく練習だよ！
                </p>
                <p className="text-blue-600 text-sm mt-1">
                  ノートに 5回ずつ かこう
                </p>
              </div>
              <button
                onClick={startWritingPhase}
                className="w-full bg-blue-500 text-white font-black text-xl py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
              >
                <BookOpen size={24} />
                かく練習へ！
              </button>
            </div>
          </div>
        )}

        {/* ========== 書き練習画面（パート2） ========== */}
        {view === 'writing' && trainingQueue.length > 0 && (
          <div className="h-full bg-green-50 p-6 flex flex-col relative">
            {/* 戻るボタン */}
            <button
              onClick={() => setShowExitTrainingConfirm(true)}
              className="absolute top-4 left-4 z-10 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg text-gray-600 hover:text-gray-800 transition-all"
            >
              <ArrowRight size={20} className="rotate-180" />
            </button>

            {/* プログレスバー */}
            <div className="mb-2 flex items-center justify-between text-sm text-green-600 font-bold">
              <span>パート2: かく</span>
              <span>{trainIndex + 1} / {trainingQueue.length}</span>
            </div>
            <div className="w-full bg-gray-200 h-3 rounded-full mb-6 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500 ease-out"
                style={{ width: `${((trainIndex + 1) / trainingQueue.length) * 100}%` }}
              />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-full bg-white p-6 rounded-[32px] shadow-xl text-center border-b-8 border-green-100 animate-pop-in relative">
                <h2 className="text-xl font-black text-green-700 mb-4 flex items-center justify-center gap-2">
                  <BookOpen className="text-green-500" /> ノートに かこう！
                </h2>

                {/* 漢字表示 */}
                <div className="w-48 h-48 mx-auto bg-gray-50 border-4 border-dashed border-gray-300 rounded-3xl flex items-center justify-center mb-4 relative">
                  <div className="absolute w-full h-0.5 bg-gray-200" />
                  <div className="absolute h-full w-0.5 bg-gray-200" />
                  <span className="text-[120px] font-serif text-gray-800 relative z-10">
                    {trainingQueue[trainIndex].char}
                  </span>

                  {/* 書き順ボタン */}
                  <button
                    onClick={() => setShowStrokeModal(true)}
                    className="absolute -bottom-4 -right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-transform active:scale-90 flex flex-col items-center justify-center w-16 h-16 border-4 border-white z-20"
                  >
                    <Pencil size={20} />
                    <span className="text-[10px] font-bold leading-none mt-1">書き順</span>
                  </button>
                </div>

                {/* よみがな */}
                <p className="text-2xl font-black text-green-600 mb-2">
                  {trainingQueue[trainIndex].reading}
                </p>

                {/* ヒント */}
                {trainingQueue[trainIndex].hint && (
                  <p className="text-sm bg-green-50 text-green-700 py-1 px-3 rounded-full inline-block mb-4">
                    ヒント: {trainingQueue[trainIndex].hint}
                  </p>
                )}

                <p className="text-gray-500 font-bold mb-6 text-lg">
                  「<span className="text-green-600 text-2xl mx-1">{trainingQueue[trainIndex].char}</span>」を
                  <span className="text-red-500 text-3xl mx-1 font-black">1回</span> かこう！
                </p>

                <button
                  onClick={handleWritingDone}
                  className="w-full bg-green-500 hover:bg-green-400 text-white font-black text-2xl py-5 rounded-full shadow-[0_6px_0_rgba(20,100,20,0.3)] active:shadow-none active:translate-y-2 transition-all"
                >
                  書けた！
                </button>
              </div>
            </div>

            {/* 書き順モーダル */}
            {showStrokeModal && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-fade-in p-4"
                onClick={() => setShowStrokeModal(false)}
              >
                <div
                  className="bg-white rounded-3xl p-4 w-full max-w-sm"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-700">
                      「{trainingQueue[trainIndex].char}」の書き順
                    </h3>
                    <button
                      onClick={() => setShowStrokeModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  <StrokeOrderAnimation
                    char={trainingQueue[trainIndex].char}
                    size={250}
                    onClose={() => setShowStrokeModal(false)}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========== キャラクターゲット画面 ========== */}
        {/* ========== 進化演出画面 ========== */}
        {view === 'evolution' && evolvingCharacter && (
          <div className="h-full bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-600 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
            {/* フラッシュフェーズ */}
            {evolutionPhase === 'flash' && (
              <div className="absolute inset-0 bg-white animate-pulse z-50" />
            )}

            {/* 完了時の紙吹雪 */}
            {evolutionPhase === 'complete' && <Confetti />}

            {/* 変身フェーズ */}
            {evolutionPhase === 'transform' && (
              <div className="animate-pop-in">
                <p className="text-white text-2xl font-black mb-8 animate-pulse">
                  おや！ {evolvingCharacter.from.name}の ようすが...？
                </p>

                <div className="relative w-48 h-48 mx-auto">
                  {/* 光の輪エフェクト */}
                  <div className="absolute inset-0 bg-yellow-300 rounded-full opacity-50 animate-ping" />
                  <div className="absolute inset-0 bg-white rounded-full opacity-30 animate-pulse" />

                  {/* キャラクター（点滅） */}
                  <div className="absolute inset-0 flex items-center justify-center text-8xl animate-pulse">
                    {evolvingCharacter.from.image}
                  </div>
                </div>

                <p className="text-yellow-200 text-lg font-bold mt-8 animate-bounce">
                  しんか ちゅう...
                </p>
              </div>
            )}

            {/* リビール & 完了フェーズ */}
            {(evolutionPhase === 'reveal' || evolutionPhase === 'complete') && (
              <div className="animate-pop-in">
                <p className="text-yellow-300 text-3xl font-black mb-6 animate-bounce drop-shadow-lg">
                  しんか しました！
                </p>

                <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm">
                  {/* 進化後キャラクター */}
                  <div className="relative">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl flex items-center justify-center text-8xl mb-4 shadow-inner animate-float">
                      {evolvingCharacter.to.image}
                    </div>

                    {/* 最終形態の場合は王冠 */}
                    {evolvingCharacter.to.evolutionStage === 2 && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-4xl animate-bounce">
                        👑
                      </div>
                    )}
                  </div>

                  <h2 className="text-3xl font-black text-gray-800 mb-2">
                    {evolvingCharacter.to.name}
                  </h2>

                  {evolvingCharacter.to.evolutionStage === 2 && (
                    <p className="text-orange-500 font-black text-sm mb-2 animate-pulse">
                      ⭐ さいしゅう しんか！ ⭐
                    </p>
                  )}

                  {/* 進化レベル表示 */}
                  <div className="flex gap-1 justify-center mb-3">
                    {Array.from({ length: evolvingCharacter.to.evolutionStage + 1 }).map((_, i) => (
                      <span key={i} className="text-yellow-500 text-2xl">★</span>
                    ))}
                  </div>

                  <p className="text-gray-500 text-sm mb-4">
                    {evolvingCharacter.to.description}
                  </p>

                  <div className="flex items-center justify-center gap-2 text-purple-500 font-bold">
                    <Sparkles size={20} />
                    <span>パワーアップ した！</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setView('home');
                    setSelectedCharacterForTraining(null);
                    // 餌モーダルを表示
                    if (acquiredFood) {
                      setTimeout(() => setShowFoodModal(true), 300);
                    }
                  }}
                  className="mt-6 bg-white text-purple-600 font-black text-xl py-4 px-8 rounded-2xl shadow-lg flex items-center gap-2 mx-auto hover:bg-purple-50 transition-colors"
                >
                  <ArrowRight size={24} />
                  ホームへ
                </button>
              </div>
            )}
          </div>
        )}

        {view === 'getCharacter' && (
          <div className="h-full bg-gradient-to-b from-purple-500 to-pink-500 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
            {isRevealed && <Confetti />}

            {!isRevealed ? (
              // ゲット前
              <div className="animate-pop-in">
                <p className="text-white text-xl font-bold mb-4">
                  キャラクターを ゲット！
                </p>
                <button
                  onClick={revealCharacter}
                  className="w-40 h-40 bg-white/20 rounded-full flex items-center justify-center text-8xl animate-shake cursor-pointer hover:bg-white/30 transition-colors"
                >
                  ❓
                </button>
                <p className="text-white/80 mt-4 text-sm animate-pulse">
                  タップしてね！
                </p>
              </div>
            ) : newCharacter ? (
              // ゲット後（キャラクターあり）
              <div className="animate-pop-in">
                <div className="bg-white rounded-3xl p-8 shadow-2xl">
                  <p className="text-purple-500 font-bold text-sm mb-2">NEW!</p>
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl flex items-center justify-center text-7xl mb-4 shadow-inner">
                    {newCharacter.image}
                  </div>
                  <h2 className="text-2xl font-black text-gray-800 mb-1">
                    {newCharacter.name}
                  </h2>
                  <p className="text-sm text-purple-500 font-bold mb-2">
                    No.{newCharacter.id.split('-')[1]}
                  </p>
                  <p className="text-gray-500 text-sm mb-6">
                    {newCharacter.description}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-green-500 font-bold mb-4">
                    <Sparkles size={20} />
                    <span>ずかんに ついかされた！</span>
                  </div>
                </div>
                <button
                  onClick={() => setView('home')}
                  className="mt-6 bg-white text-purple-600 font-black text-xl py-4 px-8 rounded-2xl shadow-lg flex items-center gap-2 mx-auto hover:bg-purple-50 transition-colors"
                >
                  <ArrowRight size={24} />
                  ホームへ
                </button>
              </div>
            ) : (
              // 全コンプリート
              <div className="animate-pop-in">
                <div className="bg-white rounded-3xl p-8 shadow-2xl">
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="text-2xl font-black text-gray-800 mb-2">
                    おめでとう！
                  </h2>
                  <p className="text-gray-500">
                    すべてのキャラクターを<br />コンプリートしました！
                  </p>
                </div>
                <button
                  onClick={() => setView('home')}
                  className="mt-6 bg-white text-purple-600 font-black text-xl py-4 px-8 rounded-2xl shadow-lg"
                >
                  ホームへ
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========== ずかん画面 ========== */}
        {view === 'collection' && (
          <div className="h-full bg-purple-50 flex flex-col">
            {/* ヘッダー */}
            <div className="bg-purple-500 text-white p-6 pb-8 rounded-b-[30px] shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Book /> キャラずかん
                </h2>
                <button
                  onClick={() => setView('home')}
                  className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="bg-purple-600 px-4 py-2 rounded-lg inline-block">
                <span className="font-bold text-2xl">{collectedCharacters.length}</span>
                <span className="text-sm ml-1">/ {TOTAL_CHARACTER_COUNT} ゲット</span>
              </div>
            </div>

            {/* キャラクターグリッド */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-4 gap-3">
                {CHARACTERS.map((char) => {
                  // このキャラクターが過去に所持されたことがあるかチェック
                  // 進化チェーン内で現在または過去に所持されていた形態かどうか
                  const chain = getEvolutionChain(char.baseCharacterId);
                  const currentCollected = collectedCharacters.find(c =>
                    chain.some(chainChar => chainChar.id === c.characterId)
                  );

                  // 現在このキャラクターを所持しているか、または過去に通過した形態か
                  let isOwned = false;
                  if (currentCollected) {
                    const currentCharIndex = chain.findIndex(c => c.id === char.id);
                    const ownedCharIndex = chain.findIndex(c => c.id === currentCollected.characterId);
                    // 現在所持している形態、またはそれより前の形態は表示
                    isOwned = currentCharIndex <= ownedCharIndex;
                  }
                  return (
                    <button
                      key={char.id}
                      onClick={() => isOwned && setSelectedCharacterDetail(char)}
                      disabled={!isOwned}
                      className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all ${
                        isOwned
                          ? 'bg-white shadow-md hover:scale-105 active:scale-95'
                          : 'bg-gray-200'
                      }`}
                    >
                      {isOwned ? (
                        <>
                          <span className="text-3xl">{char.image}</span>
                          <span className="text-[10px] text-gray-500 mt-1 truncate w-full text-center px-1">
                            {char.name}
                          </span>
                        </>
                      ) : (
                        <div className="relative flex items-center justify-center w-full h-full">
                          <span
                            className="text-3xl"
                            style={{ filter: 'brightness(0) opacity(0.3)' }}
                          >
                            {char.image}
                          </span>
                          <span className="absolute text-xs text-gray-500 font-bold">
                            ?
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* キャラクター詳細モーダル */}
            {selectedCharacterDetail && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-fade-in p-4"
                onClick={() => setSelectedCharacterDetail(null)}
              >
                <div
                  className="bg-white rounded-3xl p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto animate-pop-in"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="flex justify-end">
                    <button
                      onClick={() => setSelectedCharacterDetail(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  <div className="text-center">
                    <button
                      onClick={() => {
                        if (selectedCharacterDetail.sound) {
                          // 泣き声を表示するアニメーション
                          const soundEl = document.getElementById('character-sound');
                          if (soundEl) {
                            soundEl.textContent = selectedCharacterDetail.sound;
                            soundEl.classList.remove('opacity-0');
                            soundEl.classList.add('animate-bounce');
                            setTimeout(() => {
                              soundEl.classList.add('opacity-0');
                              soundEl.classList.remove('animate-bounce');
                            }, 1500);
                          }

                          // 8bit音声を再生
                          play8BitSound(selectedCharacterDetail.id);
                        }
                      }}
                      className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center text-6xl mb-4 hover:scale-110 transition-transform active:scale-95 cursor-pointer"
                    >
                      {selectedCharacterDetail.image}
                    </button>
                    <p id="character-sound" className="text-orange-500 font-black text-lg mb-2 opacity-0 transition-opacity"></p>
                    <p className="text-purple-500 text-sm font-bold">
                      No.{selectedCharacterDetail.id.split('-')[1]}
                    </p>
                    <h3 className="text-2xl font-black text-gray-800 mb-2">
                      {selectedCharacterDetail.name}
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {selectedCharacterDetail.description}
                    </p>

                    {/* 進化チェーン表示 */}
                    <div className="mb-4">
                      <h3 className="text-sm font-bold text-purple-600 mb-3 border-b-2 border-purple-200 pb-1">
                        ⚡ しんかのれきし
                      </h3>

                      <div className="flex items-center justify-center gap-2">
                        {getEvolutionChain(selectedCharacterDetail.baseCharacterId).map((char, idx) => {
                          const isOwned = isCharacterFormOwned(char.id);
                          const isCurrent = char.id === selectedCharacterDetail.id;

                          return (
                            <React.Fragment key={char.id}>
                              {/* 各進化段階のカード */}
                              <div
                                className={`
                                  flex-1 rounded-xl p-3 text-center transition-all
                                  ${isCurrent
                                    ? 'border-4 border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-lg animate-pulse-glow'
                                    : isOwned
                                      ? 'border-2 border-purple-200 bg-purple-50'
                                      : 'border-2 border-gray-200 bg-gray-100'
                                  }
                                `}
                              >
                                {/* キャラクター画像 */}
                                <div className="text-4xl mb-1">
                                  {char.image}
                                </div>

                                {/* キャラクター名 */}
                                <div className="text-xs font-bold mb-1">
                                  {char.name}
                                </div>

                                {/* 進化レベル表示 */}
                                <div className="flex justify-center gap-0.5">
                                  {Array.from({ length: char.evolutionStage + 1 }).map((_, i) => (
                                    <span key={i} className="text-yellow-500">★</span>
                                  ))}
                                </div>
                              </div>

                              {/* 矢印 */}
                              {idx < 2 && (
                                <ArrowRight size={16} className="text-purple-400 flex-shrink-0" />
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>

                    {/* プロフィールセクション */}
                    <div className="mt-4 space-y-2 text-left">
                      <h3 className="font-bold text-pink-600 text-center">📖 プロフィール</h3>
                      <div className="bg-pink-50 p-3 rounded-lg space-y-1 text-sm">
                        <p><span className="font-semibold">🎈 好きなこと:</span> {selectedCharacterDetail.profile.hobbies}</p>
                        <p><span className="font-semibold">💦 苦手なこと:</span> {selectedCharacterDetail.profile.dislikes}</p>
                        <p><span className="font-semibold">✨ 特技:</span> {selectedCharacterDetail.profile.specialSkill}</p>
                      </div>
                    </div>

                    {(() => {
                      const cc = collectedCharacters.find(c => c.characterId === selectedCharacterDetail.id);
                      if (cc) {
                        const date = new Date(cc.collectedAt);
                        return (
                          <>
                            <p className="text-xs text-gray-400 mt-4">
                              ゲット日: {date.getMonth() + 1}/{date.getDate()}
                            </p>

                            {/* ごはんをあげるボタン */}
                            <button
                              onClick={() => {
                                setSelectedCharacterForFeeding(selectedCharacterDetail.id);
                                setSelectedCharacterDetail(null);
                                setView('feeding');
                              }}
                              className="w-full mt-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold text-lg py-3 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-2"
                            >
                              <Apple size={24} />
                              ごはんを あげる
                            </button>
                          </>
                        );
                      }
                      return null;
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========== 学習履歴画面 ========== */}
        {view === 'history' && (
          <div className="h-full bg-blue-50 flex flex-col">
            {/* ヘッダー */}
            <div className="bg-blue-500 text-white p-6 pb-8 rounded-b-[30px] shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <History /> がんばり記録
                </h2>
                <button
                  onClick={() => setView('home')}
                  className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex gap-4 text-sm mb-4">
                <div className="bg-blue-600 px-3 py-1 rounded-lg">
                  <span className="block text-xs opacity-70">ぜんぶで</span>
                  <span className="font-bold text-lg">{history.length}問</span>
                </div>
                <div className="bg-blue-600 px-3 py-1 rounded-lg">
                  <span className="block text-xs opacity-70">せいかい</span>
                  <span className="font-bold text-lg">
                    {history.filter(h => h.result === 'correct').length}問
                  </span>
                </div>
              </div>

              {/* タブ切り替え */}
              <div className="flex gap-2">
                <button
                  onClick={() => setHistoryViewMode('list')}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                    historyViewMode === 'list'
                      ? 'bg-white text-blue-600'
                      : 'bg-white/20 text-white/80 hover:bg-white/30'
                  }`}
                >
                  📝 リスト
                </button>
                <button
                  onClick={() => setHistoryViewMode('calendar')}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                    historyViewMode === 'calendar'
                      ? 'bg-white text-blue-600'
                      : 'bg-white/20 text-white/80 hover:bg-white/30'
                  }`}
                >
                  📅 カレンダー
                </button>
              </div>
            </div>

            {/* 履歴表示 */}
            <div className="flex-1 overflow-y-auto p-4">
              {history.length === 0 ? (
                <div className="text-center text-gray-400 mt-20">
                  <p className="mb-2">まだ記録がありません</p>
                  <p className="text-sm">トレーニングをするとここに表示されます</p>
                </div>
              ) : (
                <>
                  {/* リストモード */}
                  {historyViewMode === 'list' && (
                    <div className="space-y-2">
                      {history.map((record, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg flex items-center justify-between ${
                            record.result === 'correct'
                              ? 'bg-green-50 border-l-4 border-green-500'
                              : 'bg-red-50 border-l-4 border-red-500'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold">{record.char}</span>
                            <span className="text-sm text-gray-600">{record.date}</span>
                          </div>
                          <span className="text-xl">
                            {record.result === 'correct' ? '✓' : '✗'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* カレンダーモード */}
                  {historyViewMode === 'calendar' && (
                    <div className="space-y-3">
                      {groupHistoryByDate(history).map((group, idx) => (
                        <div key={idx} className="bg-white rounded-lg overflow-hidden shadow-sm">
                          {/* 日付ヘッダー（クリック可能） */}
                          <button
                            onClick={() => setExpandedDate(expandedDate === group.date ? null : group.date)}
                            className="w-full flex items-center justify-between p-4 bg-blue-100 hover:bg-blue-200 transition-colors"
                          >
                            <div className="text-left">
                              <span className="font-bold text-lg text-gray-800">{group.date}</span>
                              <span className="ml-3 text-sm text-gray-600">
                                {group.correctCount}/{group.totalCount} 正解
                              </span>
                            </div>
                            <span className="text-2xl text-gray-600">
                              {expandedDate === group.date ? '▲' : '▼'}
                            </span>
                          </button>

                          {/* 展開時の漢字グリッド */}
                          {expandedDate === group.date && (
                            <div className="p-4 grid grid-cols-5 gap-2">
                              {group.records.map((record, i) => (
                                <div
                                  key={i}
                                  className={`p-3 rounded-lg text-center font-bold text-xl ${
                                    record.result === 'correct'
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-red-100 text-red-700'
                                  }`}
                                  title={`${record.char} - ${record.result === 'correct' ? '正解' : '不正解'}`}
                                >
                                  {record.char}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* ========== 餌やり画面 ========== */}
        {view === 'feeding' && (
          <div className="h-full bg-green-50 flex flex-col">
            {/* ヘッダー */}
            <div className="bg-green-500 text-white p-6 pb-8 rounded-b-[30px] shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Apple /> ごはんをあげる
                </h2>
                <button
                  onClick={() => {
                    setSelectedCharacterForFeeding(null);
                    setView('home');
                  }}
                  className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* キャラクター未選択: キャラクター一覧 */}
            {!selectedCharacterForFeeding && (
              <div className="flex-1 overflow-y-auto p-6">
                <p className="text-center text-green-700 font-bold mb-4">
                  ごはんをあげる キャラクターを えらんでね
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {getUniqueCollectedCharacters().map(cc => {
                    const char = getCharacterById(cc.characterId);
                    if (!char) return null;

                    return (
                      <button
                        key={cc.characterId}
                        onClick={() => setSelectedCharacterForFeeding(char.id)}
                        className="bg-white p-4 rounded-2xl shadow-lg hover:scale-105 transition-transform active:scale-95"
                      >
                        <div className="text-5xl mb-2">{char.image}</div>
                        <div className="text-sm font-bold text-gray-700">{char.name}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* キャラクター選択済み: 餌選択画面 */}
            {selectedCharacterForFeeding && (() => {
              const selectedChar = getCharacterById(selectedCharacterForFeeding);
              if (!selectedChar) return null;

              return (
                <div className="flex-1 overflow-y-auto p-6">
                  {/* 選択キャラクター表示 */}
                  <div className="bg-white p-4 rounded-2xl shadow-lg mb-6 text-center">
                    <div className="text-6xl mb-2">{selectedChar.image}</div>
                    <div className="font-bold text-lg text-gray-800">{selectedChar.name}</div>
                    <div className="text-sm text-gray-500 mt-1">{selectedChar.description}</div>
                  </div>

                  {/* 戻るボタン */}
                  <button
                    onClick={() => setSelectedCharacterForFeeding(null)}
                    className="w-full mb-4 bg-gray-200 text-gray-700 py-2 rounded-xl font-bold hover:bg-gray-300"
                  >
                    ← キャラクターを かえる
                  </button>

                  {/* 餌一覧 */}
                  <p className="text-center text-green-700 font-bold mb-4">
                    あげる ごはんを えらんでね
                  </p>

                  <div className="grid grid-cols-4 gap-3">
                    {FOODS.map(food => {
                      const count = inventory[food.id] || 0;
                      const canEat = selectedChar.favoriteFood.includes(food.id);
                      const canGive = count > 0 && canEat;

                      return (
                        <button
                          key={food.id}
                          onClick={() => canGive && handleFeedCharacter(selectedChar, food)}
                          disabled={!canGive}
                          className={`
                            relative p-3 rounded-xl shadow-md transition-all
                            ${canGive
                              ? 'bg-gradient-to-br from-yellow-100 to-orange-100 hover:scale-110 active:scale-95 cursor-pointer'
                              : canEat
                                ? 'bg-gray-100 opacity-50 cursor-not-allowed'
                                : 'bg-gray-200 opacity-30 cursor-not-allowed grayscale'
                            }
                          `}
                        >
                          <div className="text-3xl mb-1">{food.emoji}</div>
                          <div className="text-[10px] font-bold text-gray-700 truncate">
                            {food.name}
                          </div>
                          {count > 0 && (
                            <div className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                              {count}
                            </div>
                          )}
                          {!canEat && count > 0 && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <X size={24} className="text-red-500" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* ヘルプテキスト */}
                  <div className="mt-6 bg-green-100 p-4 rounded-xl text-sm text-green-800">
                    <p className="font-bold mb-2">💡 ヒント</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>キラキラ✨している ごはんは あげられるよ！</li>
                      <li>グレーの ごはんは このキャラは たべられないよ</li>
                      <li>すうじは もっている かずだよ</li>
                    </ul>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ========== 保護者設定画面 ========== */}
        {view === 'settings' && (
          <div className="h-full bg-slate-50 flex flex-col">
            {/* ヘッダー */}
            <div className="bg-gray-800 text-white p-6 pb-8 rounded-b-[30px] shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Settings className="text-gray-300" /> 保護者設定
                </h2>
                <button
                  onClick={() => setView('home')}
                  className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* タブ切り替え */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSettingsTab('kanji')}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                    settingsTab === 'kanji'
                      ? 'bg-white text-gray-800'
                      : 'bg-white/20 text-gray-300 hover:bg-white/30'
                  }`}
                >
                  📝 漢字設定
                </button>
                <button
                  onClick={() => setSettingsTab('rewards')}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                    settingsTab === 'rewards'
                      ? 'bg-white text-gray-800'
                      : 'bg-white/20 text-gray-300 hover:bg-white/30'
                  }`}
                >
                  🎁 ご褒美設定
                </button>
              </div>
            </div>

            {/* 漢字設定タブ */}
            {settingsTab === 'kanji' && (
              <>
                {/* 学年タブ */}
                <div className="flex overflow-x-auto px-4 pt-4 gap-2 bg-slate-50 border-b border-slate-200">
                  {[1, 2, 3, 4, 5, 6].map((grade) => (
                    <button
                      key={grade}
                      onClick={() => setSettingTabGrade(grade)}
                      className={`
                        px-4 py-2 rounded-t-xl font-bold text-sm transition-all whitespace-nowrap
                        ${settingTabGrade === grade
                          ? 'bg-white text-blue-600 border-t-4 border-blue-500 shadow-sm'
                          : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}
                      `}
                    >
                      {grade}年生
                    </button>
                  ))}
                </div>

                {/* 漢字グリッド */}
                <div className="flex-1 overflow-y-auto p-4 bg-white">
                  <div className="flex justify-between items-center mb-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <span className="font-bold text-blue-800 text-sm">
                      {settingTabGrade}年生の漢字
                      <span className="text-[10px] ml-2 bg-blue-200 px-2 py-1 rounded-full text-blue-900">
                        全{getKanjiByGrade(settingTabGrade).length}文字
                      </span>
                    </span>
                    <button
                      onClick={() => toggleGradeAll(settingTabGrade)}
                      className={`
                        flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-xs transition-colors shadow-sm
                        ${isAllGradeSelected(settingTabGrade)
                          ? 'bg-blue-500 text-white hover:bg-blue-600'
                          : 'bg-white text-blue-500 border border-blue-300 hover:bg-blue-50'}
                      `}
                    >
                      {isAllGradeSelected(settingTabGrade) ? <CheckSquare size={14} /> : <Square size={14} />}
                      {isAllGradeSelected(settingTabGrade) ? '全解除' : '全選択'}
                    </button>
                  </div>

                  {getKanjiByGrade(settingTabGrade).length > 0 ? (
                    <div className="grid grid-cols-5 gap-2">
                      {getKanjiByGrade(settingTabGrade).map((kanji) => {
                        const isActive = activeKanjiChars.includes(kanji.char);
                        return (
                          <button
                            key={kanji.char}
                            onClick={() => toggleKanji(kanji.char)}
                            className={`
                              aspect-square rounded-lg flex flex-col items-center justify-center border transition-all relative
                              ${isActive
                                ? 'bg-white border-blue-500 shadow-sm text-gray-900'
                                : 'bg-slate-50 border-slate-100 text-gray-300'}
                            `}
                          >
                            <span className="text-xl font-serif">{kanji.char}</span>
                            {isActive && (
                              <div className="absolute top-0.5 right-0.5">
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-gray-400">
                      <p className="font-bold">データ準備中...</p>
                      <p className="text-sm mt-2">2〜6年生の漢字は今後追加予定です</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ご褒美設定タブ */}
            {settingsTab === 'rewards' && (
              <div className="flex-1 overflow-y-auto p-6 bg-white">
                <h3 className="font-bold text-lg mb-4 text-gray-800">🎁 ご褒美プール設定</h3>
                <p className="text-sm text-gray-600 mb-6">
                  20個キャラクターを集めるたびに、ランダムで1つのご褒美が表示されます。<br />
                  （一度表示されたご褒美は次回以降表示されません）
                </p>

                {/* 新規ご褒美追加 */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ➕ 新しいご褒美を追加
                  </label>
                  <input
                    type="text"
                    placeholder="例: アイスクリーム、公園で遊ぶ..."
                    className="border-2 border-gray-300 p-3 rounded-lg w-full focus:border-pink-500 focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        setRewardPool({
                          ...rewardPool,
                          rewards: [...rewardPool.rewards, e.currentTarget.value.trim()]
                        });
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1">Enterキーで追加</p>
                </div>

                {/* ご褒美リスト */}
                <div className="space-y-2 mb-6">
                  <h4 className="font-semibold text-gray-700 mb-3">登録済みご褒美</h4>
                  {rewardPool.rewards.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">まだご褒美が登録されていません</p>
                  ) : (
                    rewardPool.rewards.map((reward, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <span className={`flex-1 ${rewardPool.usedRewards.includes(reward) ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                          {reward}
                        </span>
                        <div className="flex items-center gap-2">
                          {rewardPool.usedRewards.includes(reward) && (
                            <span className="text-xs text-green-600 font-semibold bg-green-100 px-2 py-1 rounded">
                              ✓ 使用済み
                            </span>
                          )}
                          <button
                            onClick={() => {
                              setRewardPool({
                                ...rewardPool,
                                rewards: rewardPool.rewards.filter((_, i) => i !== idx),
                                usedRewards: rewardPool.usedRewards.filter(r => r !== reward)
                              });
                            }}
                            className="text-red-500 hover:text-red-700 font-semibold px-3 py-1 rounded hover:bg-red-50 transition-colors text-sm"
                          >
                            削除
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* リセットボタン */}
                {rewardPool.usedRewards.length > 0 && (
                  <button
                    onClick={() => {
                      if (window.confirm('使用履歴をリセットしますか？全てのご褒美が再び表示されるようになります。')) {
                        setRewardPool({ ...rewardPool, usedRewards: [] });
                      }
                    }}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-3 rounded-lg transition-colors"
                  >
                    🔄 使用履歴をリセット
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* ========== ご褒美ポップアップ ========== */}
        {showRewardPopup && currentReward && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in">
            <div className="bg-gradient-to-b from-yellow-300 to-yellow-400 p-8 rounded-3xl shadow-2xl max-w-md mx-4 text-center animate-pop-in">
              <div className="text-6xl mb-4 animate-bounce">🎉</div>
              <h2 className="text-3xl font-black text-yellow-900 mb-2">
                すごい！
              </h2>
              <p className="text-yellow-800 font-bold text-lg mb-4">
                20個達成おめでとう！
              </p>
              <div className="bg-white p-6 rounded-2xl my-4 shadow-inner">
                <p className="text-4xl mb-3">🎁</p>
                <p className="text-2xl font-bold text-gray-800 mb-1">{currentReward}</p>
                <p className="text-sm text-gray-500">をゲット！</p>
              </div>
              <p className="text-yellow-800 text-sm mb-4">
                がんばったごほうびだよ！
              </p>
              <button
                onClick={() => setShowRewardPopup(false)}
                className="bg-pink-500 hover:bg-pink-600 text-white font-bold text-lg py-3 px-8 rounded-full transition-colors shadow-lg"
              >
                やったー！
              </button>
            </div>
          </div>
        )}

        {/* ========== 餌獲得モーダル ========== */}
        {showFoodModal && acquiredFood && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in">
            <div className="bg-gradient-to-b from-green-300 to-green-400 p-8 rounded-3xl shadow-2xl max-w-md mx-4 text-center animate-pop-in">
              <div className="text-6xl mb-4 animate-bounce">{acquiredFood.emoji}</div>
              <h2 className="text-3xl font-black text-green-900 mb-2">
                たべものを ゲット！
              </h2>
              <p className="text-green-800 font-bold text-2xl mb-4">
                {acquiredFood.name}
              </p>
              <div className="bg-white p-4 rounded-2xl my-4 shadow-inner">
                <p className="text-gray-600 text-sm">
                  キャラクターに<br />あげられるよ！
                </p>
              </div>
              <button
                onClick={() => {
                  setShowFoodModal(false);
                  setAcquiredFood(null);
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-lg py-3 px-8 rounded-full transition-colors shadow-lg"
              >
                わかった！
              </button>
            </div>
          </div>
        )}

        {/* ========== 餌やり確認モーダル ========== */}
        {feedingConfirmation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in">
            <div className="bg-gradient-to-b from-blue-300 to-cyan-400 p-8 rounded-3xl shadow-2xl max-w-md mx-4 text-center animate-pop-in">
              <h2 className="text-2xl font-black text-blue-900 mb-4">
                ごはんを あげますか？
              </h2>
              <div className="bg-white p-4 rounded-2xl mb-4">
                <div className="text-5xl mb-2">{feedingConfirmation.character.image}</div>
                <div className="font-bold text-lg text-gray-800 mb-2">
                  {feedingConfirmation.character.name}
                </div>
                <div className="text-3xl my-3">↓</div>
                <div className="text-4xl mb-2">{feedingConfirmation.food.emoji}</div>
                <div className="font-bold text-gray-700">
                  {feedingConfirmation.food.name}
                </div>
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setFeedingConfirmation(null)}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-bold text-lg py-3 px-6 rounded-full transition-colors shadow-lg"
                >
                  やめる
                </button>
                <button
                  onClick={confirmFeedCharacter}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold text-lg py-3 px-6 rounded-full transition-colors shadow-lg"
                >
                  あげる！
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========== 餌やり結果モーダル ========== */}
        {showFeedingResult && selectedCharacterForFeeding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in">
            <div className="bg-gradient-to-b from-orange-300 to-yellow-400 p-8 rounded-3xl shadow-2xl max-w-md mx-4 text-center animate-pop-in">
              {(() => {
                const char = getCharacterById(selectedCharacterForFeeding);
                if (!char) return null;
                return (
                  <>
                    <div className="text-7xl mb-4 animate-bounce">{char.image}</div>
                    <h2 className="text-2xl font-black text-orange-900 mb-4">
                      {feedingResultMessage}
                    </h2>
                    {char.sound && (
                      <div className="bg-white/80 p-3 rounded-xl mb-4">
                        <p className="text-lg font-bold text-gray-700">{char.sound}</p>
                      </div>
                    )}
                    <button
                      onClick={() => {
                        setShowFeedingResult(false);
                        setFeedingResultMessage('');
                      }}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg py-3 px-8 rounded-full transition-colors shadow-lg"
                    >
                      もっと あげる！
                    </button>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* ========== 練習中断確認モーダル ========== */}
        {showExitTrainingConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in">
            <div className="bg-gradient-to-b from-red-300 to-pink-400 p-8 rounded-3xl shadow-2xl max-w-md mx-4 text-center animate-pop-in">
              <h2 className="text-2xl font-black text-red-900 mb-4">
                れんしゅうを やめますか？
              </h2>
              <p className="text-red-800 mb-6">
                ホームに もどると<br />
                いままでの きろくが<br />
                のこらないよ
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowExitTrainingConfirm(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-bold text-lg py-3 px-6 rounded-full transition-colors shadow-lg"
                >
                  やめる
                </button>
                <button
                  onClick={() => {
                    setShowExitTrainingConfirm(false);
                    setView('home');
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold text-lg py-3 px-6 rounded-full transition-colors shadow-lg"
                >
                  ホームに もどる
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
