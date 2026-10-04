// Studio-Quality Arabic Text-To-Speech with Gemini 3.8 TTS & Persistent Cache

const STORAGE_CACHE_PREFIX = 'gemini_tts_v1_';
const memoryAudioCache = new Map<string, string>();
let currentAudio: HTMLAudioElement | null = null;

// Load persistent audio cache from localStorage
function getCachedAudio(key: string): string | null {
  if (memoryAudioCache.has(key)) {
    return memoryAudioCache.get(key)!;
  }
  try {
    const stored = localStorage.getItem(STORAGE_CACHE_PREFIX + key);
    if (stored) {
      memoryAudioCache.set(key, stored);
      return stored;
    }
  } catch {}
  return null;
}

// Save to persistent audio cache
function setCachedAudio(key: string, base64: string): void {
  memoryAudioCache.set(key, base64);
  try {
    // Only store if length is reasonable to prevent quota errors
    if (base64.length < 500000) {
      localStorage.setItem(STORAGE_CACHE_PREFIX + key, base64);
    }
  } catch {}
}

/**
 * Pronounce Arabic words with high-fidelity Gemini Classical Arabic TTS.
 * Never plays robotic browser synthesizers.
 */
export async function speakArabic(text: string, onEnd?: () => void): Promise<boolean> {
  if (!text || typeof window === 'undefined') return false;

  // Stop any currently playing audio
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch {}
    currentAudio = null;
  }

  // Clean text of visual separators and numbering for crystal-clear natural pronunciation
  const cleanedText = text
    .replace(/[·•]/g, '،')
    .replace(/←/g, '،')
    .replace(/\d+\./g, '')
    .trim();

  // 1. Check persistent cache (works 100% offline!)
  const cachedBase64 = getCachedAudio(cleanedText);
  if (cachedBase64) {
    return playBase64Wav(cachedBase64, onEnd);
  }

  // 2. Fetch from Gemini 3.8 Studio TTS endpoint
  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: cleanedText }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.audio && typeof data.audio === 'string') {
        setCachedAudio(cleanedText, data.audio);
        return playBase64Wav(data.audio, onEnd);
      }
    }
  } catch (err) {
    console.warn('Gemini Studio TTS network error / offline:', err);
  }

  // 3. Offline notice without robotic fallback
  // Inform the UI that internet is required for this new audio
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('tts-offline-notice', {
        detail: {
          message: 'برای دریافت تلفظ جدید استودیویی Gemini به اتصال اینترنت نیاز است.',
        },
      })
    );
  }

  if (onEnd) onEnd();
  return false;
}

function playBase64Wav(base64Audio: string, onEnd?: () => void): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const audio = new Audio(`data:audio/wav;base64,${base64Audio}`);
      currentAudio = audio;

      audio.onended = () => {
        currentAudio = null;
        if (onEnd) onEnd();
        resolve(true);
      };

      audio.onerror = () => {
        currentAudio = null;
        if (onEnd) onEnd();
        resolve(false);
      };

      audio.play().then(
        () => resolve(true),
        () => {
          currentAudio = null;
          if (onEnd) onEnd();
          resolve(false);
        }
      );
    } catch {
      currentAudio = null;
      if (onEnd) onEnd();
      resolve(false);
    }
  });
}

// Remove Arabic harakat/diacritics for relaxed match comparison
export function stripArabicDiacritics(text: string): string {
  return text
    .replace(/[\u064B-\u065F\u0670]/g, '') // Harakat
    .replace(/[أإآء]/g, 'ا') // Normalize alefs
    .replace(/ة/g, 'ه') // Normalize ta marbuta
    .replace(/ي/g, 'ی') // Normalize ya
    .replace(/ك/g, 'ک') // Normalize kaf
    .trim();
}

// Relaxed string comparison for Arabic answers
export function checkArabicAnswerMatch(userAnswer: string, correctAnswer: string): boolean {
  const normUser = stripArabicDiacritics(userAnswer).replace(/\s+/g, '');
  const normCorrect = stripArabicDiacritics(correctAnswer).replace(/\s+/g, '');

  if (normUser === normCorrect) return true;

  // Check if correct answer is in the user answer
  if (normUser.includes(normCorrect) || normCorrect.includes(normUser)) {
    return true;
  }

  return false;
}
