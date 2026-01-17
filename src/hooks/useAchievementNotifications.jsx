import { useState, useCallback, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";

/**
 * Hook for managing achievement notifications
 * Usage:
 * const { showAchievementNotification, claimAchievement } = useAchievementNotifications();
 *
 * // When backend returns newAchievements:
 * if (response.data.newAchievements?.length > 0) {
 *   response.data.newAchievements.forEach(achievement => {
 *     showAchievementNotification(achievement);
 *   });
 * }
 */
const useAchievementNotifications = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);

  /**
   * Trigger confetti animation
   */
  const triggerConfetti = useCallback(() => {
    const duration = 2500;
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
  }, []);

  /**
   * Show achievement unlock notification
   * @param {Object} achievement - The unlocked achievement
   */
  const showAchievementNotification = useCallback(
    (achievement) => {
      // Add to notifications state
      setNotifications((prev) => [...prev, achievement]);

      // Trigger confetti
      triggerConfetti();

      // Show toast notification
      toast.success(
        <div className="flex items-center gap-3">
          <span className="text-4xl">{achievement.icon}</span>
          <div>
            <p className="font-bold text-ds-text">Achievement Unlocked!</p>
            <p className="text-sm text-ds-muted">{achievement.name}</p>
            <p className="text-xs text-orange-400">+{achievement.reward} XP reward available!</p>
          </div>
        </div>,
        {
          duration: 5000,
          position: "top-center",
          style: {
            background: "linear-gradient(135deg, rgba(234, 179, 8, 0.15) 0%, rgba(249, 115, 22, 0.15) 100%)",
            border: "2px solid rgba(234, 179, 8, 0.4)",
            padding: "16px",
            borderRadius: "12px",
            minWidth: "320px",
          },
        }
      );
    },
    [triggerConfetti]
  );

  /**
   * Remove notification
   * @param {string} achievementId - The achievement ID to remove
   */
  const removeNotification = useCallback((achievementId) => {
    setNotifications((prev) => prev.filter((a) => a.id !== achievementId));
  }, []);

  /**
   * Claim achievement reward
   * @param {Object} achievement - The achievement to claim
   */
  const claimAchievement = useCallback(
    async (achievement) => {
      try {
        const token = await user.getIdToken();
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/achievements/claim/${achievement.id}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          toast.success(
            `🎉 Claimed ${achievement.reward} XP! You're now at ${response.data.data.xp.total} XP`,
            {
              duration: 4000,
              position: "top-center",
            }
          );

          // Remove notification
          removeNotification(achievement.id);

          // Return updated XP data
          return response.data.data;
        }
      } catch (error) {
        console.error("Error claiming achievement:", error);
        toast.error(error.response?.data?.message || "Failed to claim reward");
      }
    },
    [user, removeNotification]
  );

  /**
   * Check for new achievements (manual trigger)
   */
  const checkAchievements = useCallback(async () => {
    try {
      const token = await user.getIdToken();
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/achievements/check`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success && response.data.data.newlyUnlocked.length > 0) {
        response.data.data.newlyUnlocked.forEach((achievement) => {
          showAchievementNotification(achievement);
        });
      }
    } catch (error) {
      console.error("Error checking achievements:", error);
    }
  }, [user, showAchievementNotification]);

  return {
    notifications,
    showAchievementNotification,
    removeNotification,
    claimAchievement,
    checkAchievements,
  };
};

export default useAchievementNotifications;
