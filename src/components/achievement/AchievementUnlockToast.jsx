import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { HiOutlineTrophy, HiOutlineX, HiOutlineStar } from "react-icons/hi";

const AchievementUnlockToast = ({ achievement, onClaim, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Trigger confetti on mount
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    // Auto close after 10 seconds if not claimed
    const autoCloseTimer = setTimeout(() => {
      handleClose();
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(autoCloseTimer);
    };
  }, []);

  const handleClaim = () => {
    if (onClaim) {
      onClaim(achievement);
    }
    handleClose();
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[9998] max-w-md w-full mx-4"
        >
          <div className="relative bg-gradient-to-br from-yellow-500/20 via-orange-500/20 to-purple-500/20 backdrop-blur-xl border-2 border-yellow-500/50 rounded-2xl p-6 shadow-2xl overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-orange-400/10 to-purple-400/10 animate-pulse" />

            {/* Sparkle effects */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                  initial={{
                    x: Math.random() * 100 + "%",
                    y: Math.random() * 100 + "%",
                    opacity: 0,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-ds-bg/50 hover:bg-ds-bg/80 flex items-center justify-center transition-colors z-10"
            >
              <HiOutlineX className="w-5 h-5 text-ds-text" />
            </button>

            {/* Content */}
            <div className="relative z-10">
              {/* Trophy icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 0.8 }}
                className="flex justify-center mb-4"
              >
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                    <HiOutlineTrophy className="w-10 h-10 text-white" />
                  </div>
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-full bg-yellow-400 blur-xl opacity-50 animate-pulse" />
                </div>
              </motion.div>

              {/* Achievement unlocked text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center mb-4"
              >
                <p className="text-yellow-400 text-sm font-semibold mb-1">🎉 Achievement Unlocked! 🎉</p>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-4xl">{achievement.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-ds-text mb-1">{achievement.name}</h3>
                <p className="text-ds-muted text-sm">{achievement.description}</p>
              </motion.div>

              {/* Reward display */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-ds-bg/50 rounded-xl p-4 mb-4"
              >
                <div className="flex items-center justify-center gap-2">
                  <HiOutlineStar className="w-5 h-5 text-yellow-400" />
                  <span className="text-ds-muted text-sm">Reward:</span>
                  <span className="text-2xl font-bold text-yellow-400">+{achievement.reward} XP</span>
                </div>
              </motion.div>

              {/* Claim button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                onClick={handleClaim}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold text-lg hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-105 active:scale-95 shadow-lg"
              >
                Claim Reward
              </motion.button>
            </div>

            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer pointer-events-none" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AchievementUnlockToast;
