import { useEffect, useRef } from 'react';

interface VoiceOptions {
  pitch?: number;      // 0-2, デフォルト 1.5
  rate?: number;       // 0.1-10, デフォルト 1.2
  volume?: number;     // 0-1, デフォルト 1
  lang?: string;       // デフォルト 'ja-JP'
}

interface UseCharacterVoiceReturn {
  speak: (text: string, options?: VoiceOptions) => void;
  isSupported: boolean;
  cancel: () => void;
}

/**
 * キャラクターの泣き声を音声で再生するカスタムフック
 * Web Speech API (Text-to-Speech) を使用
 */
export function useCharacterVoice(): UseCharacterVoiceReturn {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // コンポーネントのアンマウント時にクリーンアップ
  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  const speak = (text: string, options?: VoiceOptions) => {
    if (!isSupported) {
      console.warn('Speech Synthesis APIがサポートされていません');
      return;
    }

    // 前の音声を停止
    window.speechSynthesis.cancel();

    // 新しい音声を作成
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options?.lang || 'ja-JP';
    utterance.pitch = options?.pitch !== undefined ? options.pitch : 1.5;
    utterance.rate = options?.rate !== undefined ? options.rate : 1.2;
    utterance.volume = options?.volume !== undefined ? options.volume : 1.0;

    // 日本語音声を優先的に選択
    const voices = window.speechSynthesis.getVoices();
    const japaneseVoice = voices.find(voice => voice.lang === 'ja-JP' || voice.lang.startsWith('ja'));
    if (japaneseVoice) {
      utterance.voice = japaneseVoice;
    }

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const cancel = () => {
    if (isSupported) {
      window.speechSynthesis.cancel();
    }
  };

  return {
    speak,
    isSupported,
    cancel,
  };
}
