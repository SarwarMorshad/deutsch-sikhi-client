// src/hooks/useAudioPlayer.jsx

import { useState, useRef, useCallback } from "react";

/**
 * Custom hook for playing pronunciation audio
 * Hybrid approach: Wiktionary audio (if available) OR Web Speech API (fallback)
 *
 * Usage:
 * const { playAudio, isPlaying, error } = useAudioPlayer();
 * playAudio(word);
 */
const useAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  /**
   * Play pronunciation for a word
   * @param {Object} word - Word object from database
   * @param {number} speed - Playback speed (0.5 = slow, 1 = normal, 1.5 = fast)
   */
  const playAudio = useCallback(async (word, speed = 1) => {
    if (!word) {
      setError("No word provided");
      return;
    }

    try {
      setError(null);
      setIsPlaying(true);

      // Priority 1: Check if word has Wiktionary audio URL
      if (word.audio?.url) {
        console.log(`Playing Wiktionary audio for: ${word.word_de}`);
        await playFromUrl(word.audio.url, speed);
      }
      // Priority 2: Fallback to Web Speech API
      else {
        console.log(`Using Web Speech API for: ${word.word_de}`);
        await playWithWebSpeech(word.word_de, speed);
      }
    } catch (err) {
      console.error("Audio playback error:", err);
      setError(err.message);

      // If Wiktionary audio fails, try Web Speech as backup
      if (word.audio?.url) {
        console.log("Wiktionary audio failed, trying Web Speech...");
        try {
          await playWithWebSpeech(word.word_de, speed);
        } catch (speechErr) {
          console.error("Web Speech also failed:", speechErr);
        }
      }
    } finally {
      setIsPlaying(false);
    }
  }, []);

  /**
   * Play audio from URL (Wiktionary)
   */
  const playFromUrl = (url, speed = 1) => {
    return new Promise((resolve, reject) => {
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      // Create new audio element
      audioRef.current = new Audio(url);
      audioRef.current.playbackRate = speed;

      // Event listeners
      audioRef.current.onended = () => {
        resolve();
      };

      audioRef.current.onerror = (e) => {
        reject(new Error("Failed to load audio file"));
      };

      // Play audio
      audioRef.current.play().catch(reject);
    });
  };

  /**
   * Play using Web Speech API (TTS fallback)
   */
  const playWithWebSpeech = (text, speed = 1) => {
    return new Promise((resolve, reject) => {
      // Check if browser supports Web Speech API
      if (!window.speechSynthesis) {
        reject(new Error("Web Speech API not supported in this browser"));
        return;
      }

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      // Create speech utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "de-DE"; // German language
      utterance.rate = speed; // Speed (0.1 to 10)
      utterance.pitch = 1; // Pitch (0 to 2)
      utterance.volume = 1; // Volume (0 to 1)

      // Event listeners
      utterance.onend = () => {
        resolve();
      };

      utterance.onerror = (e) => {
        reject(new Error(`Speech synthesis error: ${e.error}`));
      };

      // Speak
      window.speechSynthesis.speak(utterance);
    });
  };

  /**
   * Stop any playing audio
   */
  const stopAudio = useCallback(() => {
    // Stop HTML5 audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Stop Web Speech
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    setIsPlaying(false);
  }, []);

  return {
    playAudio,
    stopAudio,
    isPlaying,
    error,
  };
};

export default useAudioPlayer;
