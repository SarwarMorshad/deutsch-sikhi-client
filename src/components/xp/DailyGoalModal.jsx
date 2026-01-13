import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { HiOutlineX, HiOutlineLightningBolt } from "react-icons/hi";

const goalOptions = [
  { value: 10, label: "Casual", description: "5 mins/day", icon: "🌱" },
  { value: 20, label: "Regular", description: "10 mins/day", icon: "📚" },
  { value: 30, label: "Serious", description: "15 mins/day", icon: "🎯" },
  { value: 50, label: "Intense", description: "20 mins/day", icon: "🔥" },
  { value: 100, label: "Insane", description: "30+ mins/day", icon: "⚡" },
];

/**
 * Daily Goal Selection Modal
 */
const DailyGoalModal = ({ isOpen, onClose, currentGoal, onSave }) => {
  const { t } = useTranslation();
  const [selectedGoal, setSelectedGoal] = useState(currentGoal || 50);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const success = await onSave(selectedGoal);
    setSaving(false);
    if (success) {
      onClose();
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-ds-surface rounded-2xl border border-ds-border/50 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-ds-border/30">
              <div className="flex items-center gap-2">
                <HiOutlineLightningBolt className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-semibold text-ds-text">
                  {t("xp.setDailyGoal", "Set Daily Goal")}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-ds-bg/50 text-ds-muted hover:text-ds-text transition-colors"
              >
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              <p className="text-ds-muted text-sm mb-4">
                {t(
                  "xp.goalDescription",
                  "Choose how much XP you want to earn each day. Higher goals help you learn faster!"
                )}
              </p>

              <div className="space-y-2">
                {goalOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedGoal(option.value)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                      selectedGoal === option.value
                        ? "border-purple-400 bg-purple-500/10"
                        : "border-ds-border/30 hover:border-ds-border/50 hover:bg-ds-bg/30"
                    }`}
                  >
                    <span className="text-2xl">{option.icon}</span>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-ds-text">{option.label}</p>
                      <p className="text-sm text-ds-muted">{option.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-purple-400">{option.value} XP</p>
                      <p className="text-xs text-ds-muted">{t("xp.perDay", "per day")}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-ds-border/30 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-ds-bg/50 text-ds-muted hover:text-ds-text hover:bg-ds-bg transition-colors"
              >
                {t("common.cancel", "Cancel")}
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-3 rounded-xl bg-purple-500 text-white font-medium hover:bg-purple-600 transition-colors disabled:opacity-50"
              >
                {saving ? t("common.saving", "Saving...") : t("common.save", "Save")}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default DailyGoalModal;
