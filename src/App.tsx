import { useState, useCallback } from 'react';
import {
  Sword, BookOpen, Book, History, Settings, X, CheckCircle,
  ArrowRight, CheckSquare, Square, Fingerprint, Sparkles
} from 'lucide-react';
import type { ViewType, KanjiData, CollectedCharacter, HistoryRecord, Character } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { GRADE_1_KANJI, getKanjiByGrade, selectRandomKanji } from './data/kanji';
import { CHARACTERS, getCharacterById, getRandomUnownedCharacter, TOTAL_CHARACTER_COUNT } from './data/characters';
import { StrokeOrderAnimation } from './components/StrokeOrderAnimation';
import { Confetti } from './components/Confetti';

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

  // ========== UI状態 ==========
  const [view, setView] = useState<ViewType>('home');
  const [settingTabGrade, setSettingTabGrade] = useState(1);

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
  const [isRevealed, setIsRevealed] = useState(false);

  // ========== ヘルパー関数 ==========
  const getTodayDateString = () => {
    const d = new Date();
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

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
    setView('reading');
  }, [activeKanjiChars]);

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
      setFeedback('correct');
      setCorrectCount(prev => prev + 1);
      setTimeout(() => {
        setFeedback('none');
        setSelectedAnswer(null);
        if (trainIndex < trainingQueue.length - 1) {
          setTrainIndex(prev => prev + 1);
        } else {
          // 読み練習完了 → 遷移画面へ
          setView('transition');
        }
      }, 1200);
    } else {
      setFeedback('incorrect');
    }
  }, [feedback, trainIndex, trainingQueue, setHistory]);

  // 不正解後に次へ進む
  const handleNextFromIncorrect = useCallback(() => {
    setFeedback('none');
    setSelectedAnswer(null);
    if (trainIndex < trainingQueue.length - 1) {
      setTrainIndex(prev => prev + 1);
    } else {
      setView('transition');
    }
  }, [trainIndex, trainingQueue.length]);

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
      // 書き練習完了 → キャラクターゲット
      const ownedIds = collectedCharacters.map(c => c.characterId);
      const newChar = getRandomUnownedCharacter(ownedIds);
      setNewCharacter(newChar);
      setIsRevealed(false);
      setView('getCharacter');
    }
  }, [trainIndex, trainingQueue.length, collectedCharacters]);

  // ========== キャラクターゲット演出 ==========
  const revealCharacter = useCallback(() => {
    setIsRevealed(true);
    if (newCharacter) {
      setCollectedCharacters(prev => [
        ...prev,
        { characterId: newCharacter.id, collectedAt: new Date().toISOString() }
      ]);
    }
  }, [newCharacter, setCollectedCharacters]);

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
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden h-[850px] flex flex-col border-8 border-gray-800 relative">

        {/* ========== ホーム画面 ========== */}
        {view === 'home' && (
          <div className="h-full bg-gradient-to-b from-emerald-400 to-cyan-500 p-6 flex flex-col relative overflow-hidden">
            {/* 上部ボタン */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 items-end">
              <button
                onClick={() => setView('collection')}
                className="bg-white/90 p-3 rounded-full shadow-lg text-purple-500 font-bold flex items-center gap-2 px-4 hover:scale-105 transition-transform"
              >
                <Book size={20} />
                <span className="text-xs">ずかん</span>
              </button>
              <button
                onClick={() => setView('history')}
                className="bg-white/90 p-3 rounded-full shadow-lg text-blue-500 font-bold flex items-center gap-2 px-4 hover:scale-105 transition-transform"
              >
                <History size={20} />
                <span className="text-xs">きろく</span>
              </button>
              <button
                onClick={() => setView('settings')}
                className="bg-gray-800/80 p-2 rounded-full shadow-lg text-white font-bold flex items-center gap-2 px-4 hover:bg-gray-800 transition-transform mt-2"
              >
                <Settings size={16} />
                <span className="text-xs">保護者設定</span>
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
              {/* タイトル */}
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-black text-white drop-shadow-lg mb-2">
                  かんじマスター
                </h1>
                <p className="text-white/80 text-sm font-bold">
                  べんきょうして キャラをゲット！
                </p>
              </div>

              {/* コレクション数 */}
              <div className="mb-8 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-2xl">
                <p className="text-white font-bold text-center">
                  <span className="text-3xl">{collectedCharacters.length}</span>
                  <span className="text-lg"> / {TOTAL_CHARACTER_COUNT}</span>
                  <span className="text-sm ml-2">ゲット！</span>
                </p>
              </div>

              {/* キャラクターたち */}
              <div className="mb-8 flex gap-2 flex-wrap justify-center max-w-[280px]">
                {collectedCharacters.slice(0, 6).map((cc, i) => {
                  const char = getCharacterById(cc.characterId);
                  return char ? (
                    <div
                      key={i}
                      className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-lg animate-float"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    >
                      {char.image}
                    </div>
                  ) : null;
                })}
                {collectedCharacters.length > 6 && (
                  <div className="w-12 h-12 bg-white/50 rounded-xl flex items-center justify-center text-sm font-bold text-white">
                    +{collectedCharacters.length - 6}
                  </div>
                )}
              </div>

              {/* スタートボタン */}
              <button
                onClick={startTraining}
                className="w-full max-w-xs bg-gradient-to-r from-orange-400 to-red-500 text-white font-black text-2xl py-8 rounded-3xl shadow-[0_8px_0_rgba(180,50,50,0.3)] active:shadow-none active:translate-y-2 transition-all flex flex-col items-center group"
              >
                <div className="flex items-center gap-3 mb-1 group-hover:scale-110 transition-transform">
                  <Sword size={32} className="animate-pulse" />
                  <span>今日の特訓！</span>
                </div>
                <span className="text-sm font-bold bg-black/10 px-3 py-1 rounded-full">
                  10問 よみ＆かき
                </span>
              </button>
            </div>
          </div>
        )}

        {/* ========== 読み練習画面（パート1） ========== */}
        {view === 'reading' && trainingQueue.length > 0 && (
          <div className="h-full bg-orange-50 p-6 flex flex-col relative">
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
                  </div>
                )}

                {/* 不正解フィードバック */}
                {feedback === 'incorrect' && (
                  <div className="absolute inset-0 z-20 bg-red-500/95 flex flex-col items-center justify-center animate-pop-in rounded-[24px] p-4 text-center">
                    <X size={80} className="text-white mb-2" />
                    <h3 className="text-3xl font-black text-white mb-4">ざんねん...</h3>
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
                    <Fingerprint size={20} />
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
                  <span className="text-red-500 text-3xl mx-1 font-black">5回</span> かこう！
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
                  const collected = collectedCharacters.find(c => c.characterId === char.id);
                  const isOwned = !!collected;
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
                        <span className="text-2xl text-gray-400">？</span>
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
                  className="bg-white rounded-3xl p-6 w-full max-w-sm animate-pop-in"
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
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center text-6xl mb-4">
                      {selectedCharacterDetail.image}
                    </div>
                    <p className="text-purple-500 text-sm font-bold">
                      No.{selectedCharacterDetail.id.split('-')[1]}
                    </p>
                    <h3 className="text-2xl font-black text-gray-800 mb-2">
                      {selectedCharacterDetail.name}
                    </h3>
                    <p className="text-gray-500">
                      {selectedCharacterDetail.description}
                    </p>
                    {(() => {
                      const cc = collectedCharacters.find(c => c.characterId === selectedCharacterDetail.id);
                      if (cc) {
                        const date = new Date(cc.collectedAt);
                        return (
                          <p className="text-xs text-gray-400 mt-4">
                            ゲット日: {date.getMonth() + 1}/{date.getDate()}
                          </p>
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
              <div className="flex gap-4 text-sm">
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
            </div>

            {/* 履歴リスト */}
            <div className="flex-1 overflow-y-auto p-4">
              {history.length === 0 ? (
                <div className="text-center text-gray-400 mt-20">
                  <p className="mb-2">まだ記録がありません</p>
                  <p className="text-sm">トレーニングをするとここに表示されます</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {history.map((record, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-3 rounded-xl flex items-center justify-between shadow-sm border border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">
                          {record.date}
                        </div>
                        <div className="text-2xl font-serif text-gray-800">
                          {record.char}
                        </div>
                      </div>
                      {record.result === 'correct' ? (
                        <span className="text-green-500 font-bold flex items-center gap-1 text-sm">
                          <CheckCircle size={16} /> 正解
                        </span>
                      ) : (
                        <span className="text-red-400 font-bold flex items-center gap-1 text-sm">
                          <X size={16} /> 復習
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========== 保護者設定画面 ========== */}
        {view === 'settings' && (
          <div className="h-full bg-slate-50 flex flex-col">
            {/* ヘッダー */}
            <div className="bg-gray-800 text-white p-6 pb-8 rounded-b-[30px] shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Settings className="text-gray-300" /> 漢字設定
                </h2>
                <button
                  onClick={() => setView('home')}
                  className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-gray-300 text-xs">
                出題する漢字を選んでください。<br />
                ※現在は1年生の80字に対応しています。
              </p>
            </div>

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
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
