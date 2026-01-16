import { motion } from "framer-motion";
import { useState, useMemo, useContext, useRef } from "react";
import { HiOutlineLockClosed, HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";
import { HiOutlineTrophy } from "react-icons/hi2";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";

const AchievementsSection = ({ userData, onAchievementClaimed }) => {
  const { user } = useContext(AuthContext);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [claimingId, setClaimingId] = useState(null);
  const scrollRef = useRef(null);

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
        color: "from-orange-600 to-orange-800",
      },
      {
        id: "silver_learner",
        name: "Silver Learner",
        icon: "🥈",
        description: "Earn 5,000 XP",
        requirement: 5000,
        reward: 100,
        color: "from-gray-400 to-gray-600",
      },
      {
        id: "gold_learner",
        name: "Gold Learner",
        icon: "🥇",
        description: "Earn 10,000 XP",
        requirement: 10000,
        reward: 200,
        color: "from-yellow-400 to-yellow-600",
      },
      {
        id: "platinum_learner",
        name: "Platinum Learner",
        icon: "💎",
        description: "Earn 25,000 XP",
        requirement: 25000,
        reward: 500,
        color: "from-cyan-400 to-cyan-600",
      },
      {
        id: "legendary_learner",
        name: "Legendary Learner",
        icon: "👑",
        description: "Earn 50,000 XP",
        requirement: 50000,
        reward: 1000,
        color: "from-purple-500 to-pink-500",
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
        color: "from-orange-500 to-red-600",
      },
      {
        id: "fortnight_fighter",
        name: "Fortnight Fighter",
        icon: "🌟",
        description: "14-day streak",
        requirement: 14,
        reward: 100,
        color: "from-yellow-500 to-orange-500",
      },
      {
        id: "monthly_master",
        name: "Monthly Master",
        icon: "⭐",
        description: "30-day streak",
        requirement: 30,
        reward: 200,
        color: "from-blue-500 to-purple-500",
      },
      {
        id: "streak_legend",
        name: "Streak Legend",
        icon: "💫",
        description: "100-day streak",
        requirement: 100,
        reward: 1000,
        color: "from-purple-500 to-pink-600",
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
        color: "from-green-500 to-emerald-600",
      },
      {
        id: "student",
        name: "Student",
        icon: "📖",
        description: "Complete 50 lessons",
        requirement: 50,
        reward: 100,
        color: "from-blue-500 to-indigo-600",
      },
      {
        id: "scholar",
        name: "Scholar",
        icon: "🎓",
        description: "Complete 100 lessons",
        requirement: 100,
        reward: 200,
        color: "from-purple-500 to-violet-600",
      },
      {
        id: "professor",
        name: "Professor",
        icon: "👨‍🏫",
        description: "Complete 250 lessons",
        requirement: 250,
        reward: 500,
        color: "from-red-500 to-rose-600",
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
        color: "from-teal-500 to-cyan-600",
      },
      {
        id: "vocabulary_builder",
        name: "Vocabulary Builder",
        icon: "📚",
        description: "Learn 500 words",
        requirement: 500,
        reward: 100,
        color: "from-blue-500 to-sky-600",
      },
      {
        id: "word_master",
        name: "Word Master",
        icon: "🗣️",
        description: "Learn 1,000 words",
        requirement: 1000,
        reward: 200,
        color: "from-indigo-500 to-blue-600",
      },
      {
        id: "polyglot",
        name: "Polyglot",
        icon: "🌍",
        description: "Learn 2,500 words",
        requirement: 2500,
        reward: 500,
        color: "from-violet-500 to-purple-600",
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
        color: "from-emerald-500 to-green-600",
      },
      {
        id: "level_10",
        name: "Level 10",
        icon: "🔟",
        description: "Reach Level 10",
        requirement: 10,
        reward: 100,
        color: "from-cyan-500 to-blue-600",
      },
      {
        id: "level_25",
        name: "Level 25",
        icon: "🌟",
        description: "Reach Level 25",
        requirement: 25,
        reward: 250,
        color: "from-purple-500 to-pink-600",
      },
      {
        id: "level_50",
        name: "Level 50",
        icon: "👑",
        description: "Reach Level 50",
        requirement: 50,
        reward: 500,
        color: "from-yellow-500 to-orange-600",
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

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
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

      {/* Category Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
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
        {/* Left Arrow Button */}
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-ds-bg/90 hover:bg-ds-surface border border-ds-border/50 items-center justify-center transition-all shadow-lg hover:scale-110"
        >
          <HiOutlineChevronLeft className="w-6 h-6 text-ds-text" />
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={() => scroll("right")}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-ds-bg/90 hover:bg-ds-surface border border-ds-border/50 items-center justify-center transition-all shadow-lg hover:scale-110"
        >
          <HiOutlineChevronRight className="w-6 h-6 text-ds-text" />
        </button>

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          className="overflow-x-auto overflow-y-hidden pb-4 px-12 md:px-14"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div className="flex gap-4" style={{ width: "max-content" }}>
            {displayAchievements.map((achievement, index) => (
              <BadgeCard
                key={achievement.id}
                achievement={achievement}
                index={index}
                onClaimReward={handleClaimReward}
                isClaiming={claimingId === achievement.id}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CSS for hiding scrollbar */}
      <style>{`
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

const BadgeCard = ({ achievement, index, onClaimReward, isClaiming }) => {
  const { id, name, icon, description, requirement, reward, unlocked, claimed, progress, color } =
    achievement;
  const progressPercent = Math.min((progress / requirement) * 100, 100);
  const canClaim = unlocked && !claimed;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="flex-shrink-0 w-56"
    >
      {/* Badge Shield */}
      <div className="relative">
        {/* Shield Background */}
        <div
          className={`relative rounded-t-3xl rounded-b-lg overflow-hidden ${
            unlocked ? `bg-gradient-to-b ${color}` : "bg-gradient-to-b from-gray-700 to-gray-800"
          } ${!unlocked && "opacity-40"}`}
        >
          {/* Top Section - Icon */}
          <div className="relative h-32 flex items-center justify-center">
            {/* Lock Icon for Locked */}
            {!unlocked && (
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                <HiOutlineLockClosed className="w-4 h-4 text-white/60" />
              </div>
            )}

            {/* Ready Badge */}
            {canClaim && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 right-3 px-2 py-1 rounded-full bg-orange-500 text-white text-xs font-bold animate-pulse"
              >
                🎁 Ready!
              </motion.div>
            )}

            {/* Achievement Icon */}
            <div className={`text-6xl ${!unlocked && "grayscale"}`}>{icon}</div>
          </div>

          {/* Bottom Dark Section */}
          <div className="bg-black/40 backdrop-blur-sm p-4">
            <h3 className="text-white font-bold text-center mb-1">{name}</h3>
            <p className="text-white/70 text-xs text-center mb-3">{description}</p>

            {/* Progress Bar (for locked) */}
            {!unlocked && (
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                  <span>Progress</span>
                  <span className="font-bold text-white">
                    {progress.toLocaleString()} / {requirement.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                  />
                </div>
                <div className="text-right mt-1">
                  <span className="text-xs text-purple-300 font-bold">{progressPercent.toFixed(0)}%</span>
                </div>
              </div>
            )}

            {/* Claim Button or Reward Display */}
            {canClaim ? (
              <button
                onClick={() => onClaimReward(achievement)}
                disabled={isClaiming}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold text-sm hover:from-yellow-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
              >
                {isClaiming ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Claiming...</span>
                  </>
                ) : (
                  <>
                    <span>Claim +{reward} XP</span>
                  </>
                )}
              </button>
            ) : (
              <div className="text-center py-2 border-t border-white/20">
                <div className="text-white/60 text-xs mb-1">Reward</div>
                <div
                  className={`font-bold ${
                    claimed ? "text-green-400" : unlocked ? "text-yellow-400" : "text-white/40"
                  }`}
                >
                  +{reward} XP
                  {claimed && " ✓"}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AchievementsSection;
