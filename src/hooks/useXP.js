import { useState, useEffect, useCallback, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import useAxiosSecure from "./useAxiosSecure";
import toast from "react-hot-toast";

/**
 * Custom hook for XP & Streak system
 */
const useXP = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [xpStatus, setXpStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch XP status
  const fetchXPStatus = useCallback(async () => {
    if (!user) {
      setXpStatus(null);
      setLoading(false);
      return;
    }

    try {
      const response = await axiosSecure.get("/xp/status");
      setXpStatus(response.data.data);
    } catch (error) {
      console.error("Failed to fetch XP status:", error);
    } finally {
      setLoading(false);
    }
  }, [user, axiosSecure]);

  // Award XP
  const awardXP = useCallback(
    async (activityType, options = {}) => {
      if (!user) return null;

      try {
        const response = await axiosSecure.post("/xp/award", {
          activityType,
          options,
        });

        const data = response.data.data;

        // Show rewards toast
        if (data.rewards && data.rewards.length > 0) {
          const totalXP = data.xpEarned;
          const messages = data.rewards.map((r) => r.message).join(" ");

          toast.success(`+${totalXP} XP! ${messages}`, {
            icon: "⭐",
            duration: 3000,
          });
        }

        // Show level up toast
        if (data.leveledUp) {
          toast.success(`🎉 Level Up! You're now Level ${data.newLevel}!`, {
            duration: 5000,
          });
        }

        // Show streak broken warning
        if (data.streakBroken) {
          toast("Your streak was reset. Start a new one!", {
            icon: "😢",
            duration: 4000,
          });
        }

        // Update local state
        setXpStatus(data.currentStatus);

        return data;
      } catch (error) {
        console.error("Failed to award XP:", error);
        return null;
      }
    },
    [user, axiosSecure]
  );

  // Update daily goal
  const updateDailyGoal = useCallback(
    async (target) => {
      if (!user) return false;

      try {
        await axiosSecure.patch("/xp/daily-goal", { target });
        toast.success(`Daily goal updated to ${target} XP!`);
        fetchXPStatus();
        return true;
      } catch (error) {
        toast.error("Failed to update daily goal");
        return false;
      }
    },
    [user, axiosSecure, fetchXPStatus]
  );

  // Initial fetch
  useEffect(() => {
    fetchXPStatus();
  }, [fetchXPStatus]);

  return {
    xpStatus,
    loading,
    awardXP,
    updateDailyGoal,
    refreshXPStatus: fetchXPStatus,
  };
};

export default useXP;
