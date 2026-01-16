import { useRef } from 'react';

interface UseFeedbackSoundsReturn {
  playCorrectSound: () => void;
  playIncorrectSound: () => void;
  isSupported: boolean;
}

/**
 * クイズフィードバック用の8bit効果音を生成するカスタムフック
 * 正解時: 上昇音、不正解時: ブザー音
 */
export function useFeedbackSounds(): UseFeedbackSoundsReturn {
  const audioContextRef = useRef<AudioContext | null>(null);
  const isSupported = typeof window !== 'undefined' && 'AudioContext' in window;

  // 正解時の上昇音（明るいメロディ）
  const playCorrectSound = () => {
    if (!isSupported) {
      console.warn('Web Audio APIがサポートされていません');
      return;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const audioContext = audioContextRef.current;
    // C5 → E5 → G5 (明るい上昇音)
    const frequencies = [523.25, 659.25, 783.99];

    frequencies.forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = 'square'; // 8bit風矩形波
      oscillator.frequency.value = frequency;

      const startTime = audioContext.currentTime + index * 0.1;
      const duration = 0.12;

      // エンベロープ
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.25, startTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    });
  };

  // 不正解時のブザー音（ブッブー）
  const playIncorrectSound = () => {
    if (!isSupported) {
      console.warn('Web Audio APIがサポートされていません');
      return;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const audioContext = audioContextRef.current;
    // 低音のブザー音（2回）
    const frequencies = [196.00, 174.61]; // G3 → F3 (下降ブザー)

    frequencies.forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = 'sawtooth'; // ブザー風
      oscillator.frequency.value = frequency;

      const startTime = audioContext.currentTime + index * 0.25;
      const duration = 0.2;

      // ブザー風エンベロープ
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0.25, startTime + duration - 0.02);
      gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    });
  };

  return {
    playCorrectSound,
    playIncorrectSound,
    isSupported,
  };
}
