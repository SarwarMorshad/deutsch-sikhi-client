import { useState, useCallback, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

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
   * Show achievement unlock notification
   * @param {Object} achievement - The unlocked achievement
   */
  const showAchievementNotification = useCallback((achievement) => {
    setNotifications((prev) => [...prev, achievement]);
  }, []);

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
