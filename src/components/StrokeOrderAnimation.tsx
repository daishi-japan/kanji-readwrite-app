import { useState, useEffect, useCallback } from 'react';
import { getStrokeData } from '../data/strokes';
import { Play, RotateCcw } from 'lucide-react';

type StrokeOrderAnimationProps = {
  char: string;
  size?: number;
  onClose?: () => void;
};

export function StrokeOrderAnimation({ char, size = 200, onClose }: StrokeOrderAnimationProps) {
  const [currentStroke, setCurrentStroke] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [strokeProgress, setStrokeProgress] = useState(0);

  const strokeData = getStrokeData(char);

  const totalStrokes = strokeData?.strokes.length ?? 0;

  // アニメーションをリセット
  const resetAnimation = useCallback(() => {
    setCurrentStroke(0);
    setStrokeProgress(0);
    setIsPlaying(false);
  }, []);

  // アニメーション開始
  const startAnimation = useCallback(() => {
    resetAnimation();
    setIsPlaying(true);
  }, [resetAnimation]);

  // アニメーションループ
  useEffect(() => {
    if (!isPlaying || !strokeData) return;

    const strokeDuration = 600; // 1画あたりの時間（ms）
    const pauseDuration = 200;  // 画と画の間の休止時間

    // 1画を描くアニメーション
    const progressInterval = setInterval(() => {
      setStrokeProgress(prev => {
        if (prev >= 1) {
          return prev;
        }
        return prev + 0.05;
      });
    }, strokeDuration / 20);

    // 次の画へ
    const strokeTimeout = setTimeout(() => {
      setStrokeProgress(0);
      if (currentStroke < totalStrokes - 1) {
        setCurrentStroke(prev => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, strokeDuration + pauseDuration);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(strokeTimeout);
    };
  }, [isPlaying, currentStroke, strokeData, totalStrokes]);

  // 書き順データがない場合
  if (!strokeData) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <div
          className="relative bg-gray-50 border-4 border-dashed border-gray-300 rounded-2xl flex items-center justify-center"
          style={{ width: size, height: size }}
        >
          <div className="absolute w-full h-0.5 bg-gray-200" />
          <div className="absolute h-full w-0.5 bg-gray-200" />
          <span className="text-[120px] font-serif text-gray-800">{char}</span>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          この漢字の書き順データは準備中です
        </p>
        {onClose && (
          <button
            onClick={onClose}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg font-bold"
          >
            とじる
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4">
      {/* SVG表示エリア */}
      <div
        className="relative bg-white border-4 border-gray-200 rounded-2xl overflow-hidden"
        style={{ width: size, height: size }}
      >
        {/* グリッド線 */}
        <div className="absolute w-full h-0.5 bg-gray-100 top-1/2" />
        <div className="absolute h-full w-0.5 bg-gray-100 left-1/2" />

        {/* 薄いガイド漢字 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-serif text-gray-200"
            style={{ fontSize: size * 0.7 }}
          >
            {char}
          </span>
        </div>

        {/* SVGアニメーション */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full"
          style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
        >
          {/* すでに描いた画（黒） */}
          {strokeData.strokes.slice(0, currentStroke).map((d, i) => (
            <path
              key={`done-${i}`}
              d={d}
              fill="none"
              stroke="#333"
              strokeWidth="6"
            />
          ))}

          {/* 現在描いている画（赤でアニメーション） */}
          {currentStroke < totalStrokes && (
            <path
              d={strokeData.strokes[currentStroke]}
              fill="none"
              stroke="#e53e3e"
              strokeWidth="7"
              strokeDasharray="200"
              strokeDashoffset={200 * (1 - strokeProgress)}
              style={{ transition: 'stroke-dashoffset 30ms linear' }}
            />
          )}

          {/* アニメーション完了後の表示 */}
          {!isPlaying && currentStroke >= totalStrokes - 1 && strokeProgress === 0 && currentStroke > 0 && (
            strokeData.strokes.map((d, i) => (
              <path
                key={`final-${i}`}
                d={d}
                fill="none"
                stroke="#333"
                strokeWidth="6"
              />
            ))
          )}
        </svg>
      </div>

      {/* 画数表示 */}
      <div className="mt-3 flex items-center gap-2">
        <span className="text-sm font-bold text-gray-600">
          {totalStrokes}画
        </span>
        {isPlaying && (
          <span className="text-sm text-red-500 font-bold animate-pulse">
            {currentStroke + 1}画目
          </span>
        )}
      </div>

      {/* コントロールボタン */}
      <div className="mt-4 flex gap-3">
        <button
          onClick={startAnimation}
          disabled={isPlaying}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all
            ${isPlaying
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-green-500 text-white hover:bg-green-600 active:scale-95'
            }
          `}
        >
          <Play size={20} />
          {isPlaying ? 'さいせいちゅう...' : 'さいせい'}
        </button>

        <button
          onClick={resetAnimation}
          className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg font-bold hover:bg-gray-600 active:scale-95 transition-all"
        >
          <RotateCcw size={20} />
          リセット
        </button>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 active:scale-95 transition-all"
        >
          とじる
        </button>
      )}
    </div>
  );
}
