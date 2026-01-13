import { motion } from "framer-motion";
import { HiOutlineLightningBolt, HiOutlineFire, HiOutlineStar } from "react-icons/hi";

/**
 * Custom XP notification for react-hot-toast
 * Usage: toast.custom((t) => <XPToast t={t} xp={20} message="Lesson completed!" />)
 */
const XPToast = ({ t, xp, message, levelUp, newLevel, streakBonus }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } max-w-sm w-full bg-ds-surface rounded-2xl border border-ds-border/50 shadow-xl overflow-hidden`}
    >
      <div className="p-4">
        {/* Main XP reward */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
            <HiOutlineLightningBolt className="w-6 h-6 text-purple-400" />
          </div>
          <div className="flex-1">
            <p className="text-ds-text font-medium">{message}</p>
            <p className="text-purple-400 font-bold text-lg">+{xp} XP</p>
          </div>
        </div>

        {/* Level up notification */}
        {levelUp && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-3 pt-3 border-t border-ds-border/30"
          >
            <div className="flex items-center gap-3 bg-yellow-500/10 rounded-xl p-3">
              <HiOutlineStar className="w-6 h-6 text-yellow-400" />
              <div>
                <p className="text-yellow-400 font-bold">Level Up! 🎉</p>
                <p className="text-ds-muted text-sm">You're now Level {newLevel}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Streak bonus */}
        {streakBonus && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-3 pt-3 border-t border-ds-border/30"
          >
            <div className="flex items-center gap-3 bg-orange-500/10 rounded-xl p-3">
              <HiOutlineFire className="w-6 h-6 text-orange-400" />
              <div>
                <p className="text-orange-400 font-bold">{streakBonus.message}</p>
                <p className="text-ds-muted text-sm">+{streakBonus.xp} bonus XP</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Progress bar animation */}
      <motion.div
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: 3, ease: "linear" }}
        className="h-1 bg-purple-400"
      />
    </motion.div>
  );
};

export default XPToast;
