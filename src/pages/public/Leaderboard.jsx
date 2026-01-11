import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLanguage from "../../hooks/useLanguage";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import {
  HiOutlineAcademicCap,
  HiOutlineStar,
  HiOutlineChartBar,
  HiOutlineUser,
  HiOutlineArrowUp,
  HiOutlineSparkles,
  HiOutlineLightningBolt,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { FaTrophy } from "react-icons/fa";

const Leaderboard = () => {
  const { t } = useTranslation();
  const { isBengali } = useLanguage();
  const { user } = useContext(AuthContext);

  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
    if (user) {
      fetchUserRank();
    }
  }, [user]);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/leaderboard?limit=50`);
      setLeaderboard(response.data.data || []);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      setError(isBengali ? "লিডারবোর্ড লোড করতে সমস্যা হয়েছে" : "Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRank = async () => {
    if (!user) return;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/leaderboard/me?firebaseUid=${user.uid}`
      );
      setUserRank(response.data.data);
    } catch (err) {
      console.error("Error fetching user rank:", err);
    }
  };

  // Get medal/trophy based on rank
  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-yellow-500/30">
            <FaTrophy className="w-5 h-5 text-white" />
          </div>
        );
      case 2:
        return (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center shadow-lg shadow-gray-400/30">
            <FaTrophy className="w-5 h-5 text-white" />
          </div>
        );
      case 3:
        return (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-600/30">
            <FaTrophy className="w-5 h-5 text-white" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-ds-surface flex items-center justify-center border border-ds-border/30">
            <span className="text-ds-muted font-bold">{rank}</span>
          </div>
        );
    }
  };

  // Get row styling based on rank
  const getRowStyle = (rank, isCurrentUser) => {
    let baseStyle = "flex items-center gap-4 p-4 rounded-2xl transition-all ";

    if (isCurrentUser) {
      return baseStyle + "bg-emerald-500/10 border-2 border-emerald-500/30";
    }

    switch (rank) {
      case 1:
        return baseStyle + "bg-gradient-to-r from-yellow-500/10 to-amber-500/5 border border-yellow-500/20";
      case 2:
        return baseStyle + "bg-gradient-to-r from-gray-400/10 to-gray-300/5 border border-gray-400/20";
      case 3:
        return baseStyle + "bg-gradient-to-r from-amber-600/10 to-amber-500/5 border border-amber-600/20";
      default:
        return baseStyle + "bg-ds-surface/30 border border-ds-border/20 hover:bg-ds-surface/50";
    }
  };

  // Format relative time
  const getRelativeTime = (date) => {
    if (!date) return "";
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return isBengali ? "আজ" : "Today";
    if (diffDays === 1) return isBengali ? "গতকাল" : "Yesterday";
    if (diffDays < 7) return isBengali ? `${diffDays} দিন আগে` : `${diffDays}d ago`;
    if (diffDays < 30)
      return isBengali ? `${Math.floor(diffDays / 7)} সপ্তাহ আগে` : `${Math.floor(diffDays / 7)}w ago`;
    return isBengali ? `${Math.floor(diffDays / 30)} মাস আগে` : `${Math.floor(diffDays / 30)}mo ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-ds-muted/30 border-t-ds-muted rounded-full animate-spin"></div>
          <p className={`text-ds-muted ${isBengali ? "font-bangla" : ""}`}>
            {isBengali ? "লিডারবোর্ড লোড হচ্ছে..." : "Loading leaderboard..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ds-surface/50 border border-ds-border/30 mb-4">
            <FaTrophy className="w-5 h-5 text-yellow-400" />
            <span className={`text-ds-muted text-sm ${isBengali ? "font-bangla" : ""}`}>
              {isBengali ? "শীর্ষ শিক্ষার্থী" : "Top Learners"}
            </span>
          </div>

          <h1
            className={`text-4xl md:text-5xl font-black text-ds-text mb-3 ${isBengali ? "font-bangla" : ""}`}
          >
            {isBengali ? "লিডারবোর্ড" : "Leaderboard"}
          </h1>

          <p className={`text-ds-muted max-w-md mx-auto ${isBengali ? "font-bangla" : ""}`}>
            {isBengali
              ? "দেখুন কে সবচেয়ে বেশি শিখছে। আপনিও তালিকায় উঠতে পারেন!"
              : "See who's learning the most. Complete lessons to climb the ranks!"}
          </p>
        </div>

        {/* User's Rank Card (if logged in) */}
        {user && userRank && (
          <div className="mb-8 p-6 rounded-3xl bg-gradient-to-br from-ds-surface/50 to-ds-surface/30 border border-ds-border/30">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="w-14 h-14 rounded-full border-2 border-emerald-500/50"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-ds-surface flex items-center justify-center border-2 border-emerald-500/50">
                    <HiOutlineUser className="w-7 h-7 text-ds-muted" />
                  </div>
                )}
                <div>
                  <p className={`text-ds-muted text-sm ${isBengali ? "font-bangla" : ""}`}>
                    {isBengali ? "আপনার অবস্থান" : "Your Position"}
                  </p>
                  <p className="text-2xl font-bold text-ds-text">
                    {userRank.rank ? (
                      <>
                        #{userRank.rank}
                        <span className="text-ds-muted text-sm font-normal ml-2">
                          / {userRank.totalParticipants}
                        </span>
                      </>
                    ) : (
                      <span
                        className={`text-base font-normal text-ds-muted ${isBengali ? "font-bangla" : ""}`}
                      >
                        {isBengali ? "এখনও র‍্যাংক নেই" : "Not ranked yet"}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {userRank.rank && (
                <div className="flex gap-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-emerald-400">
                      <HiOutlineAcademicCap className="w-5 h-5" />
                      <span className="text-2xl font-bold">{userRank.lessonsCompleted}</span>
                    </div>
                    <p className={`text-xs text-ds-muted ${isBengali ? "font-bangla" : ""}`}>
                      {isBengali ? "পাঠ" : "Lessons"}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-yellow-400">
                      <HiOutlineStar className="w-5 h-5" />
                      <span className="text-2xl font-bold">{userRank.averageScore}%</span>
                    </div>
                    <p className={`text-xs text-ds-muted ${isBengali ? "font-bangla" : ""}`}>
                      {isBengali ? "গড় স্কোর" : "Avg Score"}
                    </p>
                  </div>
                  {userRank.percentile && (
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-blue-400">
                        <HiOutlineArrowUp className="w-5 h-5" />
                        <span className="text-2xl font-bold">{userRank.percentile}%</span>
                      </div>
                      <p className={`text-xs text-ds-muted ${isBengali ? "font-bangla" : ""}`}>
                        {isBengali ? "শীর্ষ" : "Top"}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {!userRank.rank && (
                <Link
                  to="/courses"
                  className={`px-6 py-3 rounded-xl bg-ds-text text-ds-bg font-semibold hover:shadow-lg transition-all cursor-pointer ${
                    isBengali ? "font-bangla" : ""
                  }`}
                >
                  {isBengali ? "এখনই শুরু করুন" : "Start Learning"}
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Not logged in CTA */}
        {!user && (
          <div className="mb-8 p-6 rounded-3xl bg-gradient-to-br from-ds-surface/50 to-ds-surface/30 border border-ds-border/30 text-center">
            <HiOutlineSparkles className="w-10 h-10 text-ds-muted mx-auto mb-3" />
            <p className={`text-ds-text font-semibold mb-2 ${isBengali ? "font-bangla" : ""}`}>
              {isBengali ? "আপনার র‍্যাংক দেখতে চান?" : "Want to see your rank?"}
            </p>
            <p className={`text-ds-muted text-sm mb-4 ${isBengali ? "font-bangla" : ""}`}>
              {isBengali
                ? "লগইন করুন এবং পাঠ সম্পূর্ণ করে লিডারবোর্ডে উঠুন!"
                : "Log in and complete lessons to join the leaderboard!"}
            </p>
            <Link
              to="/login"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-ds-text text-ds-bg font-semibold hover:shadow-lg transition-all cursor-pointer ${
                isBengali ? "font-bangla" : ""
              }`}
            >
              <HiOutlineLightningBolt className="w-5 h-5" />
              {isBengali ? "লগইন করুন" : "Log In"}
            </Link>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className={`text-red-400 ${isBengali ? "font-bangla" : ""}`}>{error}</p>
            <button
              onClick={fetchLeaderboard}
              className={`mt-4 px-6 py-2 rounded-xl bg-ds-surface text-ds-text hover:bg-ds-border/30 transition-colors cursor-pointer ${
                isBengali ? "font-bangla" : ""
              }`}
            >
              {isBengali ? "আবার চেষ্টা করুন" : "Try Again"}
            </button>
          </div>
        )}

        {/* Empty State */}
        {!error && leaderboard.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-ds-surface/50 flex items-center justify-center">
              <FaTrophy className="w-10 h-10 text-ds-muted" />
            </div>
            <h3 className={`text-xl font-semibold text-ds-text mb-2 ${isBengali ? "font-bangla" : ""}`}>
              {isBengali ? "এখনও কেউ নেই!" : "No learners yet!"}
            </h3>
            <p className={`text-ds-muted mb-6 ${isBengali ? "font-bangla" : ""}`}>
              {isBengali
                ? "প্রথম হয়ে লিডারবোর্ডে নাম লেখান"
                : "Be the first to complete a lesson and top the leaderboard"}
            </p>
            <Link
              to="/courses"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-ds-text text-ds-bg font-semibold hover:shadow-lg transition-all cursor-pointer ${
                isBengali ? "font-bangla" : ""
              }`}
            >
              {isBengali ? "শেখা শুরু করুন" : "Start Learning"}
            </Link>
          </div>
        )}

        {/* Leaderboard List */}
        {!error && leaderboard.length > 0 && (
          <div className="space-y-3">
            {/* Header Row */}
            <div className="hidden sm:flex items-center gap-4 px-4 py-2 text-ds-muted text-sm">
              <div className="w-10"></div>
              <div className={`flex-1 ${isBengali ? "font-bangla" : ""}`}>
                {isBengali ? "শিক্ষার্থী" : "Learner"}
              </div>
              <div className={`w-24 text-center ${isBengali ? "font-bangla" : ""}`}>
                {isBengali ? "পাঠ" : "Lessons"}
              </div>
              <div className={`w-24 text-center ${isBengali ? "font-bangla" : ""}`}>
                {isBengali ? "স্কোর" : "Score"}
              </div>
              <div className={`w-24 text-center hidden md:block ${isBengali ? "font-bangla" : ""}`}>
                {isBengali ? "সক্রিয়তা" : "Activity"}
              </div>
            </div>

            {/* Leaderboard Entries */}
            {leaderboard.map((entry) => {
              const isCurrentUser = user && user.uid && entry.userId === user.uid;

              return (
                <div key={entry.userId} className={getRowStyle(entry.rank, isCurrentUser)}>
                  {/* Rank Badge */}
                  {getRankBadge(entry.rank)}

                  {/* User Info */}
                  <div className="flex-1 flex items-center gap-3 min-w-0">
                    {entry.photoURL ? (
                      <img
                        src={entry.photoURL}
                        alt={entry.name}
                        className="w-10 h-10 rounded-full border border-ds-border/30 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-ds-bg flex items-center justify-center border border-ds-border/30 flex-shrink-0">
                        <HiOutlineUser className="w-5 h-5 text-ds-muted" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-ds-text font-semibold truncate">
                        {entry.name}
                        {isCurrentUser && (
                          <span className={`ml-2 text-xs text-emerald-400 ${isBengali ? "font-bangla" : ""}`}>
                            ({isBengali ? "আপনি" : "You"})
                          </span>
                        )}
                      </p>
                      <p className="text-ds-muted text-xs sm:hidden">
                        {entry.lessonsCompleted} {isBengali ? "পাঠ" : "lessons"} • {entry.averageScore}%
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="hidden sm:flex items-center gap-1 w-24 justify-center">
                    <HiOutlineAcademicCap className="w-4 h-4 text-emerald-400" />
                    <span className="text-ds-text font-medium">{entry.lessonsCompleted}</span>
                  </div>

                  <div className="hidden sm:flex items-center gap-1 w-24 justify-center">
                    <HiOutlineStar className="w-4 h-4 text-yellow-400" />
                    <span className="text-ds-text font-medium">{entry.averageScore}%</span>
                  </div>

                  <div className="hidden md:block w-24 text-center">
                    <span className="text-ds-muted text-sm">{getRelativeTime(entry.lastActivity)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA */}
        {!error && leaderboard.length > 0 && (
          <div className="mt-12 text-center">
            <p className={`text-ds-muted mb-4 ${isBengali ? "font-bangla" : ""}`}>
              {isBengali
                ? "আরও উপরে উঠতে চান? পাঠ সম্পূর্ণ করুন এবং ভালো স্কোর করুন!"
                : "Want to climb higher? Complete more lessons and score well!"}
            </p>
            <Link
              to="/courses"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-ds-text text-ds-bg font-semibold hover:shadow-lg transition-all cursor-pointer ${
                isBengali ? "font-bangla" : ""
              }`}
            >
              <HiOutlineChartBar className="w-5 h-5" />
              {isBengali ? "কোর্স দেখুন" : "Browse Courses"}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
