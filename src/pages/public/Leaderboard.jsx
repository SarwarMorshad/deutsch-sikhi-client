// src/pages/Leaderboard.jsx

import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { HiOutlineTrophy, HiOutlineFire } from "react-icons/hi2";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

const Leaderboard = () => {
  const { user } = useContext(AuthContext);
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("all");

  useEffect(() => {
    fetchLeaderboard();
    fetchStats();
  }, [period, user]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const token = user ? await user.getIdToken() : null;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/leaderboard?period=${period}&limit=50`,
        { headers }
      );

      if (response.data.success) {
        setLeaderboard(response.data.data.leaderboard);
        setCurrentUser(response.data.data.currentUser);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      toast.error("Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/leaderboard/stats`);

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  return (
    <div className="min-h-screen bg-ds-bg p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
              <HiOutlineTrophy className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-ds-text">Leaderboard</h1>
              <p className="text-ds-muted">Top learners competing for glory!</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-ds-surface border border-ds-border rounded-xl p-4">
              <div className="text-ds-muted text-sm mb-1">Total Learners</div>
              <div className="text-2xl font-bold text-ds-text">{stats.totalUsers.toLocaleString()}</div>
            </div>
            <div className="bg-ds-surface border border-ds-border rounded-xl p-4">
              <div className="text-ds-muted text-sm mb-1">Total XP</div>
              <div className="text-2xl font-bold text-purple-400">{stats.totalXp.toLocaleString()}</div>
            </div>
            <div className="bg-ds-surface border border-ds-border rounded-xl p-4">
              <div className="text-ds-muted text-sm mb-1">Highest XP</div>
              <div className="text-2xl font-bold text-yellow-400">{stats.highestXp.toLocaleString()}</div>
            </div>
            <div className="bg-ds-surface border border-ds-border rounded-xl p-4">
              <div className="text-ds-muted text-sm mb-1">Longest Streak</div>
              <div className="text-2xl font-bold text-orange-400">{stats.highestStreak} 🔥</div>
            </div>
          </div>
        )}

        {/* Period Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { value: "all", label: "All Time", icon: "🏆" },
            { value: "monthly", label: "Monthly", icon: "📅" },
            { value: "weekly", label: "Weekly", icon: "📆" },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setPeriod(filter.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                period === filter.value
                  ? "bg-purple-500 text-white shadow-lg shadow-purple-500/30"
                  : "bg-ds-surface text-ds-muted hover:text-ds-text hover:bg-ds-surface/80 border border-ds-border"
              }`}
            >
              <span>{filter.icon}</span>
              <span>{filter.label}</span>
            </button>
          ))}
        </div>

        {/* Current User Rank (if logged in) */}
        {currentUser && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl p-4 mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-ds-surface border-2 border-purple-500">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl font-bold text-ds-text">
                      {currentUser.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-ds-muted">Your Rank</p>
                  <p className="text-xl font-bold text-ds-text">
                    {getRankIcon(currentUser.rank)} {currentUser.name}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-purple-400">{currentUser.xp.toLocaleString()} XP</p>
                <p className="text-sm text-ds-muted">Level {currentUser.level}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Leaderboard Table */}
        <div className="bg-ds-surface border border-ds-border rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-ds-muted">Loading leaderboard...</p>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="p-12 text-center">
              <HiOutlineTrophy className="w-16 h-16 text-ds-muted/30 mx-auto mb-4" />
              <p className="text-ds-muted">No users found for this period</p>
            </div>
          ) : (
            <div className="divide-y divide-ds-border">
              {leaderboard.map((userItem, index) => (
                <LeaderboardRow
                  key={userItem.firebaseUid}
                  user={userItem}
                  isCurrentUser={user && userItem.firebaseUid === user.uid}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {leaderboard.length > 0 && (
          <div className="text-center mt-6">
            <p className="text-ds-muted text-sm">Showing top {leaderboard.length} users</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Leaderboard Row Component
const LeaderboardRow = ({ user, isCurrentUser, index }) => {
  const getRankIcon = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return null;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return "from-yellow-500/20 to-orange-500/20 border-yellow-500/30";
    if (rank === 2) return "from-gray-400/20 to-gray-500/20 border-gray-400/30";
    if (rank === 3) return "from-orange-500/20 to-red-500/20 border-orange-500/30";
    return "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`p-4 hover:bg-ds-bg/50 transition-colors ${isCurrentUser ? "bg-purple-500/10" : ""} ${
        user.rank <= 3 ? `bg-gradient-to-r ${getRankColor(user.rank)}` : ""
      }`}
    >
      <div className="flex items-center justify-between">
        {/* Left: Rank + Avatar + Name */}
        <div className="flex items-center gap-4 flex-1">
          {/* Rank */}
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold ${
              user.rank <= 3 ? "text-2xl" : "text-lg text-ds-muted"
            }`}
          >
            {getRankIcon(user.rank) || `#${user.rank}`}
          </div>

          {/* Avatar */}
          <div className="w-10 h-10 rounded-full overflow-hidden bg-ds-bg border border-ds-border flex-shrink-0">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm font-bold text-ds-text">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Name + Level */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-ds-text truncate">
              {user.name}
              {isCurrentUser && (
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">
                  You
                </span>
              )}
            </p>
            <p className="text-sm text-ds-muted">Level {user.level}</p>
          </div>
        </div>

        {/* Right: XP + Streak */}
        <div className="flex items-center gap-6">
          {/* Streak */}
          {user.currentStreak > 0 && (
            <div className="hidden md:flex items-center gap-1 text-orange-400">
              <HiOutlineFire className="w-5 h-5" />
              <span className="font-bold">{user.currentStreak}</span>
            </div>
          )}

          {/* XP */}
          <div className="text-right">
            <p className="font-bold text-ds-text text-lg">{user.xp.toLocaleString()}</p>
            <p className="text-xs text-ds-muted">XP</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Leaderboard;
