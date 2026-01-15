import { motion } from "framer-motion";
import { useState, useMemo, useContext } from "react";
import { HiOutlineLockClosed, HiOutlineCheckCircle, HiOutlineGift } from "react-icons/hi";
import { HiOutlineTrophy } from "react-icons/hi2";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";

const AchievementsSection = ({ userData, onAchievementClaimed }) => {
  const { user } = useContext(AuthContext);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [claimingId, setClaimingId] = useState(null);

  // Achievement definitions
  const achievementDefinitions = {
    xpMilestones: [
      {
        id: "bronze_learner",
        name: "Bronze Learner",
        icon: "🥉",
        description: "Earn 1,000 XP",
        requirement: 1000,
        reward: 50,
      },
      {
        id: "silver_learner",
        name: "Silver Learner",
        icon: "🥈",
        description: "Earn 5,000 XP",
        requirement: 5000,
        reward: 100,
      },
      {
        id: "gold_learner",
        name: "Gold Learner",
        icon: "🥇",
        description: "Earn 10,000 XP",
        requirement: 10000,
        reward: 200,
      },
      {
        id: "platinum_learner",
        name: "Platinum Learner",
        icon: "💎",
        description: "Earn 25,000 XP",
        requirement: 25000,
        reward: 500,
      },
      {
        id: "legendary_learner",
        name: "Legendary Learner",
        icon: "👑",
        description: "Earn 50,000 XP",
        requirement: 50000,
        reward: 1000,
      },
    ],
    streakMilestones: [
      {
        id: "week_warrior",
        name: "Week Warrior",
        icon: "🔥",
        description: "7-day streak",
        requirement: 7,
        reward: 50,
      },
      {
        id: "fortnight_fighter",
        name: "Fortnight Fighter",
        icon: "🌟",
        description: "14-day streak",
        requirement: 14,
        reward: 100,
      },
      {
        id: "monthly_master",
        name: "Monthly Master",
        icon: "⭐",
        description: "30-day streak",
        requirement: 30,
        reward: 200,
      },
      {
        id: "streak_legend",
        name: "Streak Legend",
        icon: "💫",
        description: "100-day streak",
        requirement: 100,
        reward: 1000,
      },
    ],
    lessonMilestones: [
      {
        id: "beginner",
        name: "Beginner",
        icon: "📚",
        description: "Complete 10 lessons",
        requirement: 10,
        reward: 50,
      },
      {
        id: "student",
        name: "Student",
        icon: "📖",
        description: "Complete 50 lessons",
        requirement: 50,
        reward: 100,
      },
      {
        id: "scholar",
        name: "Scholar",
        icon: "🎓",
        description: "Complete 100 lessons",
        requirement: 100,
        reward: 200,
      },
      {
        id: "professor",
        name: "Professor",
        icon: "👨‍🏫",
        description: "Complete 250 lessons",
        requirement: 250,
        reward: 500,
      },
    ],
    vocabularyMilestones: [
      {
        id: "word_collector",
        name: "Word Collector",
        icon: "📝",
        description: "Learn 100 words",
        requirement: 100,
        reward: 50,
      },
      {
        id: "vocabulary_builder",
        name: "Vocabulary Builder",
        icon: "📚",
        description: "Learn 500 words",
        requirement: 500,
        reward: 100,
      },
      {
        id: "word_master",
        name: "Word Master",
        icon: "🗣️",
        description: "Learn 1,000 words",
        requirement: 1000,
        reward: 200,
      },
      {
        id: "polyglot",
        name: "Polyglot",
        icon: "🌍",
        description: "Learn 2,500 words",
        requirement: 2500,
        reward: 500,
      },
    ],
    levelMilestones: [
      {
        id: "level_5",
        name: "Level 5",
        icon: "5️⃣",
        description: "Reach Level 5",
        requirement: 5,
        reward: 50,
      },
      {
        id: "level_10",
        name: "Level 10",
        icon: "🔟",
        description: "Reach Level 10",
        requirement: 10,
        reward: 100,
      },
      {
        id: "level_25",
        name: "Level 25",
        icon: "🌟",
        description: "Reach Level 25",
        requirement: 25,
        reward: 250,
      },
      {
        id: "level_50",
        name: "Level 50",
        icon: "👑",
        description: "Reach Level 50",
        requirement: 50,
        reward: 500,
      },
    ],
  };

  // Calculate achievements from userData
  const achievements = useMemo(() => {
    if (!userData) return {};

    const progress = userData.achievements?.progress || {
      totalXp: userData.xp?.total || 0,
      longestStreak: userData.streak?.longest || 0,
      lessonsCompleted: 0,
      wordsLearned: 0,
      currentLevel: userData.xp?.level || 1,
    };

    const unlockedAchievements = userData.achievements?.unlocked || [];
    const unlockedMap = {};
    unlockedAchievements.forEach((a) => {
      unlockedMap[a.id] = a;
    });

    const calculateCategory = (category, progressKey) => {
      return achievementDefinitions[category].map((achievement) => {
        const currentProgress = progress[progressKey] || 0;
        const unlockedData = unlockedMap[achievement.id];
        const unlocked = !!unlockedData || currentProgress >= achievement.requirement;

        return {
          ...achievement,
          unlocked,
          claimed: unlockedData?.claimed || false,
          unlockedAt: unlockedData?.unlockedAt,
          progress: currentProgress,
        };
      });
    };

    return {
      xpMilestones: calculateCategory("xpMilestones", "totalXp"),
      streakMilestones: calculateCategory("streakMilestones", "longestStreak"),
      lessonMilestones: calculateCategory("lessonMilestones", "lessonsCompleted"),
      vocabularyMilestones: calculateCategory("vocabularyMilestones", "wordsLearned"),
      levelMilestones: calculateCategory("levelMilestones", "currentLevel"),
    };
  }, [userData]);

  const categories = [
    { id: "all", label: "All", icon: "🏆" },
    { id: "xpMilestones", label: "XP", icon: "⭐" },
    { id: "streakMilestones", label: "Streaks", icon: "🔥" },
    { id: "lessonMilestones", label: "Lessons", icon: "📚" },
    { id: "vocabularyMilestones", label: "Words", icon: "📝" },
    { id: "levelMilestones", label: "Levels", icon: "🎯" },
  ];

  const getAllAchievements = () => {
    if (selectedCategory === "all") {
      return Object.values(achievements).flat();
    }
    return achievements[selectedCategory] || [];
  };

  const getUnlockedCount = () => {
    return Object.values(achievements)
      .flat()
      .filter((a) => a.unlocked).length;
  };

  const getTotalCount = () => {
    return Object.values(achievements).flat().length;
  };

  const getUnclaimedCount = () => {
    return Object.values(achievements)
      .flat()
      .filter((a) => a.unlocked && !a.claimed).length;
  };

  const triggerConfetti = () => {
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
  };

  const handleClaimReward = async (achievement) => {
    if (!user || claimingId) return;

    setClaimingId(achievement.id);
    try {
      const token = await user.getIdToken();
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/achievements/claim/${achievement.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        triggerConfetti();

        toast.success(
          <div className="flex items-center gap-3">
            <span className="text-3xl">{achievement.icon}</span>
            <div>
              <p className="font-bold text-ds-text">Achievement Claimed!</p>
              <p className="text-sm text-ds-muted">+{achievement.reward} XP earned</p>
            </div>
          </div>,
          {
            duration: 4000,
            position: "top-center",
            style: {
              background: "linear-gradient(135deg, rgba(234, 179, 8, 0.1) 0%, rgba(249, 115, 22, 0.1) 100%)",
              border: "2px solid rgba(234, 179, 8, 0.3)",
              padding: "16px",
              borderRadius: "12px",
            },
          }
        );

        if (onAchievementClaimed) {
          onAchievementClaimed(response.data.data);
        }
      }
    } catch (error) {
      console.error("Error claiming reward:", error);
      toast.error(error.response?.data?.message || "Failed to claim reward");
    } finally {
      setClaimingId(null);
    }
  };

  if (!userData) {
    return null;
  }

  const displayAchievements = getAllAchievements();

  return (
    <div className="mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
            <HiOutlineTrophy className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-ds-text">Achievements</h2>
            <p className="text-ds-muted text-sm">
              {getUnlockedCount()} / {getTotalCount()} unlocked
              {getUnclaimedCount() > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-xs font-medium">
                  {getUnclaimedCount()} ready!
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Category Tabs - Compact */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? "bg-purple-500 text-white shadow-lg shadow-purple-500/30"
                : "bg-ds-surface/50 text-ds-muted hover:text-ds-text hover:bg-ds-surface"
            }`}
          >
            <span className="text-base">{cat.icon}</span>
            <span className="font-medium">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Achievements Horizontal Scroll */}
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {displayAchievements.map((achievement, index) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              index={index}
              onClaimReward={handleClaimReward}
              isClaiming={claimingId === achievement.id}
            />
          ))}
        </div>
      </div>

      {/* CSS for hiding scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

const AchievementCard = ({ achievement, index, onClaimReward, isClaiming }) => {
  const { id, name, icon, description, requirement, reward, unlocked, claimed, progress } = achievement;
  const progressPercent = Math.min((progress / requirement) * 100, 100);
  const canClaim = unlocked && !claimed;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`relative flex-shrink-0 w-72 rounded-2xl border transition-all snap-start ${
        unlocked
          ? "bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-purple-500/10 border-yellow-500/30 shadow-lg shadow-yellow-500/10"
          : "bg-ds-surface/30 border-ds-border/30"
      }`}
    >
      {/* Card Content */}
      <div className="p-5">
        {/* Icon & Badge */}
        <div className="flex items-start justify-between mb-4">
          <div className={`text-5xl transition-all ${unlocked ? "scale-110" : "grayscale opacity-40"}`}>
            {icon}
          </div>

          {unlocked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${
                claimed ? "bg-green-500/20 text-green-400" : "bg-orange-500/20 text-orange-400 animate-pulse"
              }`}
            >
              {claimed ? (
                <>
                  <HiOutlineCheckCircle className="w-4 h-4" />
                  <span className="text-xs font-bold">Claimed</span>
                </>
              ) : (
                <>
                  <HiOutlineGift className="w-4 h-4" />
                  <span className="text-xs font-bold">Ready!</span>
                </>
              )}
            </motion.div>
          )}

          {/* Locked overlay */}
          {!unlocked && (
            <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-ds-bg/80 backdrop-blur-sm flex items-center justify-center">
              <HiOutlineLockClosed className="w-5 h-5 text-ds-muted/50" />
            </div>
          )}
        </div>

        {/* Name & Description */}
        <div className="mb-4">
          <h3 className={`text-lg font-bold mb-1 ${unlocked ? "text-ds-text" : "text-ds-muted"}`}>{name}</h3>
          <p className="text-ds-muted text-sm">{description}</p>
        </div>

        {/* Progress Bar (for locked achievements) */}
        {!unlocked && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-ds-muted font-medium">Progress</span>
              <span className="text-ds-text font-bold">
                {progress.toLocaleString()} / {requirement.toLocaleString()}
              </span>
            </div>
            <div className="h-2 bg-ds-border/30 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-full relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </motion.div>
            </div>
            <div className="text-right mt-1">
              <span className="text-xs text-purple-400 font-bold">{progressPercent.toFixed(0)}%</span>
            </div>
          </div>
        )}

        {/* Reward & Action */}
        <div className={`pt-4 border-t ${unlocked ? "border-yellow-500/20" : "border-ds-border/20"}`}>
          {canClaim ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onClaimReward(achievement)}
              disabled={isClaiming}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold text-sm hover:from-yellow-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-500/30 flex items-center justify-center gap-2"
            >
              {isClaiming ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Claiming...</span>
                </>
              ) : (
                <>
                  <HiOutlineGift className="w-5 h-5" />
                  <span>Claim +{reward} XP</span>
                </>
              )}
            </motion.button>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-ds-muted text-sm font-medium">Reward</span>
              <div className="flex items-center gap-1.5">
                <span className={`text-lg font-bold ${unlocked ? "text-yellow-400" : "text-ds-muted"}`}>
                  +{reward}
                </span>
                <span className={`text-sm ${unlocked ? "text-yellow-400/70" : "text-ds-muted"}`}>XP</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Shine effect for unlocked */}
      {unlocked && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer pointer-events-none rounded-2xl" />
      )}
    </motion.div>
  );
};

export default AchievementsSection;
