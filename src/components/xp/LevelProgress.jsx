import { motion } from "framer-motion";
import { HiOutlineStar } from "react-icons/hi";

/**
 * Level Progress Bar Component
 * Shows current level with animated progress to next level
 */
const LevelProgress = ({ level, currentXP, nextLevelXP, progress }) => {
  return (
    <div className="flex items-center gap-3">
      {/* Current Level Badge */}
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-lg">{level}</span>
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-ds-surface rounded-full flex items-center justify-center border-2 border-yellow-400"
        >
          <HiOutlineStar className="w-3 h-3 text-yellow-400" />
        </motion.div>
      </div>

      {/* Progress Bar */}
      <div className="flex-1">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-ds-muted">Level {level}</span>
          <span className="text-ds-muted">Level {level + 1}</span>
        </div>
        <div className="h-3 bg-ds-bg/50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full relative"
          >
            {/* Shine effect */}
            <motion.div
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />
          </motion.div>
        </div>
        <p className="text-xs text-ds-muted mt-1 text-center">
          {currentXP} / {nextLevelXP} XP
        </p>
      </div>

      {/* Next Level Badge (faded) */}
      <div className="w-12 h-12 rounded-full bg-ds-border/30 flex items-center justify-center opacity-50">
        <span className="text-ds-muted font-bold text-lg">{level + 1}</span>
      </div>
    </div>
  );
};

export default LevelProgress;
