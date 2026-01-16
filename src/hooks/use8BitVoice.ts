import { useRef } from 'react';

interface Use8BitVoiceReturn {
  play8BitSound: (characterId: string) => void;
  isSupported: boolean;
}

/**
 * ゲームボーイ風の8bit鳴き声を生成するカスタムフック
 * Web Audio APIを使用して矩形波を生成
 */
export function use8BitVoice(): Use8BitVoiceReturn {
  const audioContextRef = useRef<AudioContext | null>(null);
  const isSupported = typeof window !== 'undefined' && 'AudioContext' in window;

  // キャラクターIDに応じた音程パターン（周波数Hz）
  const CHARACTER_SOUND_PATTERNS: Record<string, number[]> = {
    'char-001': [523.25, 659.25, 783.99], // C5-E5-G5 (ぴよまる: 明るい上昇音)
    'char-002': [392.00, 349.23, 329.63], // G4-F4-E4 (ぺんぺん: 下降音)
    'char-003': [293.66, 369.99, 293.66], // D4-F#4-D4 (かえるん: ケロケロ音)
    'char-004': [220.00, 246.94, 220.00], // A3-B3-A3 (こあらっち: ゆったり)
    'char-005': [440.00, 554.37, 659.25], // A4-C#5-E5 (きつねん: 高音トリル)
    'char-006': [130.81, 146.83, 164.81], // C3-D3-E3 (らいおまる: 低音ガオー)
    'char-007': [110.00, 98.00, 87.31],   // A2-G2-F2 (ぞうぞう: 超低音パオーン)
    'char-008': [587.33, 659.25, 783.99], // D5-E5-G5 (さるきち: 活発な高音)
    'char-009': [329.63, 349.23, 392.00], // E4-F4-G4 (ぶたまる: のんびり)
    'char-010': [246.94, 293.66, 349.23, 392.00], // B3-D4-F4-G4 (たこすけ: 4音波打ち)
    'char-011': [164.81, 196.00, 220.00], // E3-G3-A3 (くまごろう: 力強い中音)
    'char-012': [261.63, 293.66, 329.63], // C4-D4-E4 (ぱんだろう: まったり)
    'char-013': [146.83, 164.81, 196.00], // D3-E3-G3 (とらきち: ガルル低音)
    'char-014': [196.00, 220.00, 196.00], // G3-A3-G3 (うしまる: モーモー音)
    'char-015': [349.23, 392.00, 440.00], // F4-G4-A4 (ひつじん: メェー高音)
    'char-016': [174.61, 185.00, 174.61], // F3-F#3-F3 (かめきち: ゆっくり)
    'char-017': [493.88, 523.25, 554.37, 587.33], // B4-C5-C#5-D5 (へびすけ: シャー連続音)
    'char-018': [659.25, 783.99, 987.77], // E5-G5-B5 (いるかん: 高音ジャンプ)
    'char-019': [82.41, 98.00, 110.00],   // E2-G2-A2 (くじらまる: 超低音ホエー)
    'char-020': [130.81, 196.00, 261.63, 392.00], // C3-G3-C4-G4 (ドラゴまる: オクターブ上昇)
  };

  const play8BitSound = (characterId: string) => {
    if (!isSupported) {
      console.warn('Web Audio APIがサポートされていません');
      return;
    }

    // AudioContextを初期化（ユーザー操作後に作成）
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const audioContext = audioContextRef.current;
    const pattern = CHARACTER_SOUND_PATTERNS[characterId] || [440, 523.25, 659.25];

    // 各音符を順に再生
    pattern.forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      // 矩形波（ゲームボーイ風）
      oscillator.type = 'square';
      oscillator.frequency.value = frequency;

      // 音量エンベロープ（ADSR簡易版）
      const startTime = audioContext.currentTime + index * 0.15;
      const duration = 0.12;

      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01); // Attack
      gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.05); // Decay
      gainNode.gain.linearRampToValueAtTime(0.1, startTime + duration); // Sustain
      gainNode.gain.linearRampToValueAtTime(0, startTime + duration + 0.05); // Release

      // 接続して再生
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration + 0.05);
    });
  };

  return {
    play8BitSound,
    isSupported,
  };
}
