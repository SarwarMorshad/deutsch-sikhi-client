import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import {
  HiOutlineSave,
  HiOutlineRefresh,
  HiOutlineCog,
  HiOutlineSparkles,
  HiOutlineBookOpen,
  HiOutlineLightningBolt,
  HiOutlineCollection,
  HiOutlineFire,
  HiOutlineTrendingUp,
  HiOutlineAcademicCap,
} from "react-icons/hi";
import toast from "react-hot-toast";

const AdminSettings = () => {
  const axiosSecure = useAxiosSecure();
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    minPassingScore: 70,
    allowRetakes: true,
    showCorrectAnswers: true,
    requireSequentialLessons: true,
  });
  const [xpSettings, setXpSettings] = useState(null);

  useEffect(() => {
    fetchSettings();
    fetchXPSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axiosSecure.get("/settings");
      if (res.data.data) setSettings(res.data.data);
    } catch (e) {
      console.log("Using defaults");
    } finally {
      setLoading(false);
    }
  };

  const fetchXPSettings = async () => {
    try {
      const res = await axiosSecure.get("/settings/xp/admin");
      if (res.data.data) setXpSettings(res.data.data);
    } catch (e) {
      setXpSettings({
        activities: {
          completeLesson: 20,
          completeGrammar: 15,
          learnWord: 5,
          reviewWordCorrect: 2,
          reviewWordWrong: 1,
          completeQuiz: { high: 30, medium: 20, low: 10 },
        },
        quizThresholds: { high: 90, medium: 70 },
        streakBonuses: {
          week: { days: 7, multiplier: 1.1 },
          twoWeeks: { days: 14, multiplier: 1.25 },
          month: { days: 30, multiplier: 1.5 },
        },
        dailyGoal: { completionBonus: 10, defaultTarget: 50 },
        levelProgression: { baseXP: 100, incrementPerLevel: 50 },
      });
    }
  };

  const handleSaveGeneral = async () => {
    setSaving(true);
    try {
      await axiosSecure.patch("/settings/admin", settings);
      toast.success("Settings saved");
    } catch (e) {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveXP = async () => {
    setSaving(true);
    try {
      await axiosSecure.patch("/settings/xp/admin", xpSettings);
      toast.success("XP settings saved");
    } catch (e) {
      toast.error("Failed to save XP settings");
    } finally {
      setSaving(false);
    }
  };

  const handleResetXP = async () => {
    if (!confirm("Reset XP settings to defaults?")) return;
    setSaving(true);
    try {
      const res = await axiosSecure.post("/settings/xp/admin/reset");
      setXpSettings(res.data.data);
      toast.success("Reset to defaults");
    } catch (e) {
      toast.error("Failed to reset");
    } finally {
      setSaving(false);
    }
  };

  const updateXPValue = (path, value) => {
    const keys = path.split(".");
    setXpSettings((prev) => {
      const n = JSON.parse(JSON.stringify(prev));
      let c = n;
      for (let i = 0; i < keys.length - 1; i++) c = c[keys[i]];
      c[keys[keys.length - 1]] = Number(value);
      return n;
    });
  };

  const Toggle = ({ enabled, onChange }) => (
    <button
      onClick={onChange}
      className={`w-11 h-6 rounded-full transition-colors cursor-pointer ${
        enabled ? "bg-green-500" : "bg-ds-border"
      }`}
    >
      <div
        className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
          enabled ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );

  // Compact Input Component
  const XPInput = ({ label, icon: Icon, iconColor, value, onChange, suffix = "XP" }) => (
    <div className="flex items-center justify-between py-2 px-3 bg-ds-bg/30 rounded-lg">
      <div className="flex items-center gap-2">
        {Icon && <Icon className={`w-4 h-4 ${iconColor}`} />}
        <span className="text-ds-text text-sm">{label}</span>
      </div>
      <div className="flex items-center gap-1">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-14 px-2 py-1 bg-ds-bg border border-ds-border/30 rounded text-ds-text text-center text-sm focus:outline-none focus:border-purple-500"
          min="0"
        />
        <span className="text-ds-muted text-xs w-6">{suffix}</span>
      </div>
    </div>
  );

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-ds-muted border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ds-text">Settings</h1>
          <p className="text-ds-muted text-sm">Configure app behavior and XP system</p>
        </div>
        <div className="flex gap-2">
          {activeTab === "xp" && (
            <>
              <button
                onClick={handleResetXP}
                disabled={saving}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-ds-border/30 text-ds-muted hover:text-ds-text text-sm transition-colors disabled:opacity-50"
              >
                <HiOutlineRefresh className="w-4 h-4" />
                Reset
              </button>
              <button
                onClick={handleSaveXP}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-purple-500 text-white text-sm hover:bg-purple-600 transition-colors disabled:opacity-50"
              >
                <HiOutlineSave className="w-4 h-4" />
                {saving ? "Saving..." : "Save"}
              </button>
            </>
          )}
          {activeTab === "general" && (
            <>
              <button
                onClick={fetchSettings}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-ds-border/30 text-ds-muted hover:text-ds-text text-sm transition-colors"
              >
                <HiOutlineRefresh className="w-4 h-4" />
                Reset
              </button>
              <button
                onClick={handleSaveGeneral}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-purple-500 text-white text-sm hover:bg-purple-600 transition-colors disabled:opacity-50"
              >
                <HiOutlineSave className="w-4 h-4" />
                {saving ? "Saving..." : "Save"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-ds-surface/30 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("general")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors cursor-pointer ${
            activeTab === "general" ? "bg-ds-surface text-ds-text" : "text-ds-muted hover:text-ds-text"
          }`}
        >
          <HiOutlineCog className="w-4 h-4" />
          General
        </button>
        <button
          onClick={() => setActiveTab("xp")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors cursor-pointer ${
            activeTab === "xp" ? "bg-ds-surface text-ds-text" : "text-ds-muted hover:text-ds-text"
          }`}
        >
          <HiOutlineSparkles className="w-4 h-4" />
          XP System
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* General Settings */}
        {activeTab === "general" && (
          <motion.div
            key="general"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-ds-surface/30 rounded-xl border border-ds-border/30 p-4 max-w-xl"
          >
            <h2 className="text-sm font-semibold text-ds-text mb-3">Quiz Settings</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-ds-text text-sm">Minimum Passing Score</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={settings.minPassingScore}
                    onChange={(e) => setSettings({ ...settings, minPassingScore: parseInt(e.target.value) })}
                    min={0}
                    max={100}
                    className="w-16 px-2 py-1 rounded bg-ds-bg border border-ds-border/30 text-ds-text text-center text-sm focus:outline-none focus:border-purple-500"
                  />
                  <span className="text-ds-muted text-xs">%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ds-text text-sm">Allow Retakes</span>
                <Toggle
                  enabled={settings.allowRetakes}
                  onChange={() => setSettings({ ...settings, allowRetakes: !settings.allowRetakes })}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ds-text text-sm">Show Correct Answers</span>
                <Toggle
                  enabled={settings.showCorrectAnswers}
                  onChange={() =>
                    setSettings({ ...settings, showCorrectAnswers: !settings.showCorrectAnswers })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ds-text text-sm">Sequential Lessons</span>
                <Toggle
                  enabled={settings.requireSequentialLessons}
                  onChange={() =>
                    setSettings({ ...settings, requireSequentialLessons: !settings.requireSequentialLessons })
                  }
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* XP Settings */}
        {activeTab === "xp" && xpSettings && (
          <motion.div
            key="xp"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Activity Rewards */}
              <div className="bg-ds-surface/30 rounded-xl border border-ds-border/30 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <HiOutlineSparkles className="w-4 h-4 text-yellow-400" />
                  <h2 className="text-sm font-semibold text-ds-text">Activity Rewards</h2>
                </div>
                <div className="space-y-2">
                  <XPInput
                    label="Complete Lesson"
                    icon={HiOutlineBookOpen}
                    iconColor="text-blue-400"
                    value={xpSettings.activities?.completeLesson || 0}
                    onChange={(v) => updateXPValue("activities.completeLesson", v)}
                  />
                  <XPInput
                    label="Complete Grammar"
                    icon={HiOutlineAcademicCap}
                    iconColor="text-green-400"
                    value={xpSettings.activities?.completeGrammar || 0}
                    onChange={(v) => updateXPValue("activities.completeGrammar", v)}
                  />
                  <XPInput
                    label="Learn New Word"
                    icon={HiOutlineCollection}
                    iconColor="text-purple-400"
                    value={xpSettings.activities?.learnWord || 0}
                    onChange={(v) => updateXPValue("activities.learnWord", v)}
                  />
                  <div className="flex items-center justify-between py-2 px-3 bg-ds-bg/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-green-400 text-sm">✓</span>
                      <span className="text-ds-text text-sm">Review (Correct)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={xpSettings.activities?.reviewWordCorrect || 0}
                        onChange={(e) => updateXPValue("activities.reviewWordCorrect", e.target.value)}
                        className="w-14 px-2 py-1 bg-ds-bg border border-ds-border/30 rounded text-ds-text text-center text-sm focus:outline-none focus:border-purple-500"
                        min="0"
                      />
                      <span className="text-ds-muted text-xs w-6">XP</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2 px-3 bg-ds-bg/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-red-400 text-sm">✗</span>
                      <span className="text-ds-text text-sm">Review (Wrong)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={xpSettings.activities?.reviewWordWrong || 0}
                        onChange={(e) => updateXPValue("activities.reviewWordWrong", e.target.value)}
                        className="w-14 px-2 py-1 bg-ds-bg border border-ds-border/30 rounded text-ds-text text-center text-sm focus:outline-none focus:border-purple-500"
                        min="0"
                      />
                      <span className="text-ds-muted text-xs w-6">XP</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quiz Rewards */}
              <div className="bg-ds-surface/30 rounded-xl border border-ds-border/30 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <HiOutlineLightningBolt className="w-4 h-4 text-orange-400" />
                  <h2 className="text-sm font-semibold text-ds-text">Quiz Rewards</h2>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2 px-3 bg-ds-bg/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-green-400 text-sm font-medium">High</span>
                      <span className="text-ds-muted text-xs">≥{xpSettings.quizThresholds?.high}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={xpSettings.activities?.completeQuiz?.high || 0}
                        onChange={(e) => updateXPValue("activities.completeQuiz.high", e.target.value)}
                        className="w-14 px-2 py-1 bg-ds-bg border border-ds-border/30 rounded text-ds-text text-center text-sm focus:outline-none focus:border-purple-500"
                        min="0"
                      />
                      <span className="text-ds-muted text-xs w-6">XP</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2 px-3 bg-ds-bg/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-400 text-sm font-medium">Medium</span>
                      <span className="text-ds-muted text-xs">≥{xpSettings.quizThresholds?.medium}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={xpSettings.activities?.completeQuiz?.medium || 0}
                        onChange={(e) => updateXPValue("activities.completeQuiz.medium", e.target.value)}
                        className="w-14 px-2 py-1 bg-ds-bg border border-ds-border/30 rounded text-ds-text text-center text-sm focus:outline-none focus:border-purple-500"
                        min="0"
                      />
                      <span className="text-ds-muted text-xs w-6">XP</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2 px-3 bg-ds-bg/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-red-400 text-sm font-medium">Low</span>
                      <span className="text-ds-muted text-xs">&lt;{xpSettings.quizThresholds?.medium}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={xpSettings.activities?.completeQuiz?.low || 0}
                        onChange={(e) => updateXPValue("activities.completeQuiz.low", e.target.value)}
                        className="w-14 px-2 py-1 bg-ds-bg border border-ds-border/30 rounded text-ds-text text-center text-sm focus:outline-none focus:border-purple-500"
                        min="0"
                      />
                      <span className="text-ds-muted text-xs w-6">XP</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <div className="flex-1 flex items-center justify-between py-2 px-3 bg-ds-bg/20 rounded-lg">
                      <span className="text-ds-muted text-xs">High ≥</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={xpSettings.quizThresholds?.high || 90}
                          onChange={(e) => updateXPValue("quizThresholds.high", e.target.value)}
                          className="w-12 px-1 py-0.5 bg-ds-bg border border-ds-border/30 rounded text-ds-text text-center text-xs focus:outline-none focus:border-purple-500"
                          min="0"
                          max="100"
                        />
                        <span className="text-ds-muted text-xs">%</span>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center justify-between py-2 px-3 bg-ds-bg/20 rounded-lg">
                      <span className="text-ds-muted text-xs">Med ≥</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={xpSettings.quizThresholds?.medium || 70}
                          onChange={(e) => updateXPValue("quizThresholds.medium", e.target.value)}
                          className="w-12 px-1 py-0.5 bg-ds-bg border border-ds-border/30 rounded text-ds-text text-center text-xs focus:outline-none focus:border-purple-500"
                          min="0"
                          max="100"
                        />
                        <span className="text-ds-muted text-xs">%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Streak Bonuses */}
              <div className="bg-ds-surface/30 rounded-xl border border-ds-border/30 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <HiOutlineFire className="w-4 h-4 text-orange-400" />
                  <h2 className="text-sm font-semibold text-ds-text">Streak Bonuses</h2>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-ds-bg/30 rounded-lg p-2 text-center">
                    <span className="text-orange-400 text-xs font-medium block mb-2">Week</span>
                    <div className="space-y-1">
                      <input
                        type="number"
                        value={xpSettings.streakBonuses?.week?.days || 7}
                        onChange={(e) => updateXPValue("streakBonuses.week.days", e.target.value)}
                        className="w-full px-1 py-1 bg-ds-bg border border-ds-border/30 rounded text-ds-text text-center text-xs focus:outline-none focus:border-purple-500"
                        min="1"
                      />
                      <span className="text-ds-muted text-[10px]">days</span>
                    </div>
                    <div className="space-y-1 mt-1">
                      <input
                        type="number"
                        step="0.05"
                        value={xpSettings.streakBonuses?.week?.multiplier || 1.1}
                        onChange={(e) => updateXPValue("streakBonuses.week.multiplier", e.target.value)}
                        className="w-full px-1 py-1 bg-ds-bg border border-ds-border/30 rounded text-ds-text text-center text-xs focus:outline-none focus:border-purple-500"
                        min="1"
                      />
                      <span className="text-ds-muted text-[10px]">multiplier</span>
                    </div>
                  </div>
                  <div className="bg-ds-bg/30 rounded-lg p-2 text-center">
                    <span className="text-orange-400 text-xs font-medium block mb-2">2 Weeks</span>
                    <div className="space-y-1">
                      <input
                        type="number"
                        value={xpSettings.streakBonuses?.twoWeeks?.days || 14}
                        onChange={(e) => updateXPValue("streakBonuses.twoWeeks.days", e.target.value)}
                        className="w-full px-1 py-1 bg-ds-bg border border-ds-border/30 rounded text-ds-text text-center text-xs focus:outline-none focus:border-purple-500"
                        min="1"
                      />
                      <span className="text-ds-muted text-[10px]">days</span>
                    </div>
                    <div className="space-y-1 mt-1">
                      <input
                        type="number"
                        step="0.05"
                        value={xpSettings.streakBonuses?.twoWeeks?.multiplier || 1.25}
                        onChange={(e) => updateXPValue("streakBonuses.twoWeeks.multiplier", e.target.value)}
                        className="w-full px-1 py-1 bg-ds-bg border border-ds-border/30 rounded text-ds-text text-center text-xs focus:outline-none focus:border-purple-500"
                        min="1"
                      />
                      <span className="text-ds-muted text-[10px]">multiplier</span>
                    </div>
                  </div>
                  <div className="bg-ds-bg/30 rounded-lg p-2 text-center">
                    <span className="text-orange-400 text-xs font-medium block mb-2">Month</span>
                    <div className="space-y-1">
                      <input
                        type="number"
                        value={xpSettings.streakBonuses?.month?.days || 30}
                        onChange={(e) => updateXPValue("streakBonuses.month.days", e.target.value)}
                        className="w-full px-1 py-1 bg-ds-bg border border-ds-border/30 rounded text-ds-text text-center text-xs focus:outline-none focus:border-purple-500"
                        min="1"
                      />
                      <span className="text-ds-muted text-[10px]">days</span>
                    </div>
                    <div className="space-y-1 mt-1">
                      <input
                        type="number"
                        step="0.05"
                        value={xpSettings.streakBonuses?.month?.multiplier || 1.5}
                        onChange={(e) => updateXPValue("streakBonuses.month.multiplier", e.target.value)}
                        className="w-full px-1 py-1 bg-ds-bg border border-ds-border/30 rounded text-ds-text text-center text-xs focus:outline-none focus:border-purple-500"
                        min="1"
                      />
                      <span className="text-ds-muted text-[10px]">multiplier</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Daily Goal & Level */}
              <div className="bg-ds-surface/30 rounded-xl border border-ds-border/30 p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <HiOutlineSparkles className="w-4 h-4 text-purple-400" />
                      <h2 className="text-sm font-semibold text-ds-text">Daily Goal</h2>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between py-2 px-3 bg-ds-bg/30 rounded-lg">
                        <span className="text-ds-muted text-xs">Bonus</span>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={xpSettings.dailyGoal?.completionBonus || 10}
                            onChange={(e) => updateXPValue("dailyGoal.completionBonus", e.target.value)}
                            className="w-12 px-1 py-1 bg-ds-bg border border-ds-border/30 rounded text-ds-text text-center text-xs focus:outline-none focus:border-purple-500"
                            min="0"
                          />
                          <span className="text-ds-muted text-xs">XP</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-2 px-3 bg-ds-bg/30 rounded-lg">
                        <span className="text-ds-muted text-xs">Target</span>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={xpSettings.dailyGoal?.defaultTarget || 50}
                            onChange={(e) => updateXPValue("dailyGoal.defaultTarget", e.target.value)}
                            className="w-12 px-1 py-1 bg-ds-bg border border-ds-border/30 rounded text-ds-text text-center text-xs focus:outline-none focus:border-purple-500"
                            min="10"
                          />
                          <span className="text-ds-muted text-xs">XP</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <HiOutlineTrendingUp className="w-4 h-4 text-green-400" />
                      <h2 className="text-sm font-semibold text-ds-text">Levels</h2>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between py-2 px-3 bg-ds-bg/30 rounded-lg">
                        <span className="text-ds-muted text-xs">Base</span>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={xpSettings.levelProgression?.baseXP || 100}
                            onChange={(e) => updateXPValue("levelProgression.baseXP", e.target.value)}
                            className="w-12 px-1 py-1 bg-ds-bg border border-ds-border/30 rounded text-ds-text text-center text-xs focus:outline-none focus:border-purple-500"
                            min="50"
                          />
                          <span className="text-ds-muted text-xs">XP</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-2 px-3 bg-ds-bg/30 rounded-lg">
                        <span className="text-ds-muted text-xs">+/Lvl</span>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={xpSettings.levelProgression?.incrementPerLevel || 50}
                            onChange={(e) =>
                              updateXPValue("levelProgression.incrementPerLevel", e.target.value)
                            }
                            className="w-12 px-1 py-1 bg-ds-bg border border-ds-border/30 rounded text-ds-text text-center text-xs focus:outline-none focus:border-purple-500"
                            min="10"
                          />
                          <span className="text-ds-muted text-xs">XP</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-purple-300">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((l) => (
                      <span key={l}>
                        L{l}→{l + 1}:{" "}
                        {(xpSettings.levelProgression?.baseXP || 100) +
                          (l - 1) * (xpSettings.levelProgression?.incrementPerLevel || 50)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminSettings;
