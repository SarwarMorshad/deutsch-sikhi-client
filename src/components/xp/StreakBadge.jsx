import { motion } from "framer-motion";
import { HiOutlineFire, HiOutlineLightningBolt } from "react-icons/hi";

/**
 * Compact XP & Streak Badge for Navbar
 */
const StreakBadge = ({ xpStatus, onClick }) => {
  if (!xpStatus) return null;

  const { xp, streak, dailyGoal } = xpStatus;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-ds-surface/50 border border-ds-border/30 hover:bg-ds-surface transition-colors cursor-pointer"
    >
      {/* Streak */}
      <div className="flex items-center gap-1">
        <HiOutlineFire className={`w-4 h-4 ${streak.isActive ? "text-orange-400" : "text-ds-muted"}`} />
        <span className={`text-sm font-medium ${streak.isActive ? "text-orange-400" : "text-ds-muted"}`}>
          {streak.current}
        </span>
      </div>

      {/* Divider */}
      <div className="w-px h-4 bg-ds-border/50" />

      {/* XP */}
      <div className="flex items-center gap-1">
        <HiOutlineLightningBolt className="w-4 h-4 text-purple-400" />
        <span className="text-sm font-medium text-purple-400">
          {xp.total >= 1000 ? `${(xp.total / 1000).toFixed(1)}k` : xp.total}
        </span>
      </div>

      {/* Daily goal indicator */}
      {!dailyGoal.completed && <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />}
      {dailyGoal.completed && <span className="text-xs">✓</span>}
    </motion.button>
  );
};

export default StreakBadge;
