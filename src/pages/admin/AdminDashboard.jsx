import { useState, useEffect } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import {
  HiOutlineUsers,
  HiOutlineAcademicCap,
  HiOutlineBookOpen,
  HiOutlineCollection,
  HiOutlinePuzzle,
  HiOutlineCheckCircle,
  HiOutlineRefresh,
  HiOutlinePlus,
} from "react-icons/hi";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const axiosSecure = useAxiosSecure();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axiosSecure.get("/admin/stats");
      setStats(res.data.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  const handleSeedDatabase = async () => {
    if (!confirm("This will add/update A1 course data. Continue?")) return;

    setSeeding(true);
    try {
      const res = await axiosSecure.post("/seed/init");
      toast.success(res.data.message);
      fetchStats();
    } catch (error) {
      toast.error("Failed to seed database");
    } finally {
      setSeeding(false);
    }
  };

  const handleResetDatabase = async () => {
    if (!confirm("⚠️ WARNING: This will delete ALL course data! Are you sure?")) return;
    if (!confirm("This action cannot be undone. Type 'DELETE' to confirm.")) return;

    setSeeding(true);
    try {
      const res = await axiosSecure.delete("/seed/reset");
      toast.success(res.data.message);
      fetchStats();
    } catch (error) {
      toast.error("Failed to reset database");
    } finally {
      setSeeding(false);
    }
  };

  const statCards = [
    {
      label: "Total Users",
      value: stats?.users || 0,
      icon: HiOutlineUsers,
      color: "from-blue-500 to-blue-600",
      link: "/admin/users",
    },
    {
      label: "Levels",
      value: stats?.levels || 0,
      icon: HiOutlineAcademicCap,
      color: "from-emerald-500 to-teal-600",
      link: "/admin/levels",
    },
    {
      label: "Lessons",
      value: stats?.lessons?.total || 0,
      subtext: `${stats?.lessons?.published || 0} published`,
      icon: HiOutlineBookOpen,
      color: "from-purple-500 to-pink-600",
      link: "/admin/lessons",
    },
    {
      label: "Vocabulary",
      value: stats?.words?.total || 0,
      subtext: `${stats?.words?.verified || 0} verified`,
      icon: HiOutlineCollection,
      color: "from-orange-500 to-red-600",
      link: "/admin/vocabulary",
    },
    {
      label: "Exercises",
      value: stats?.exercises || 0,
      icon: HiOutlinePuzzle,
      color: "from-cyan-500 to-blue-600",
      link: "/admin/exercises",
    },
    {
      label: "Completed Lessons",
      value: stats?.completedLessons || 0,
      icon: HiOutlineCheckCircle,
      color: "from-green-500 to-emerald-600",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-ds-muted border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ds-text">Dashboard</h1>
          <p className="text-ds-muted">Welcome to DeutschShikhi Admin Panel</p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-ds-surface text-ds-text hover:bg-ds-surface/80 transition-colors"
        >
          <HiOutlineRefresh className="w-5 h-5" />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            to={stat.link || "#"}
            className="group p-6 rounded-2xl bg-ds-surface/30 border border-ds-border/30 hover:border-ds-border transition-all hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-ds-muted text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-ds-text">{stat.value}</p>
                {stat.subtext && <p className="text-ds-border text-xs mt-1">{stat.subtext}</p>}
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Add */}
        <div className="p-6 rounded-2xl bg-ds-surface/30 border border-ds-border/30">
          <h2 className="text-lg font-semibold text-ds-text mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/admin/levels"
              className="flex items-center gap-2 p-3 rounded-xl bg-ds-bg/50 text-ds-text hover:bg-ds-bg transition-colors"
            >
              <HiOutlinePlus className="w-5 h-5 text-emerald-400" />
              Add Level
            </Link>
            <Link
              to="/admin/lessons"
              className="flex items-center gap-2 p-3 rounded-xl bg-ds-bg/50 text-ds-text hover:bg-ds-bg transition-colors"
            >
              <HiOutlinePlus className="w-5 h-5 text-purple-400" />
              Add Lesson
            </Link>
            <Link
              to="/admin/vocabulary"
              className="flex items-center gap-2 p-3 rounded-xl bg-ds-bg/50 text-ds-text hover:bg-ds-bg transition-colors"
            >
              <HiOutlinePlus className="w-5 h-5 text-orange-400" />
              Add Word
            </Link>
            <Link
              to="/admin/exercises"
              className="flex items-center gap-2 p-3 rounded-xl bg-ds-bg/50 text-ds-text hover:bg-ds-bg transition-colors"
            >
              <HiOutlinePlus className="w-5 h-5 text-cyan-400" />
              Add Exercise
            </Link>
          </div>
        </div>

        {/* Database Tools */}
        <div className="p-6 rounded-2xl bg-ds-surface/30 border border-ds-border/30">
          <h2 className="text-lg font-semibold text-ds-text mb-4">Database Tools</h2>
          <p className="text-ds-muted text-sm mb-4">
            Use these tools to seed sample data or reset the database.
            <span className="text-red-400"> Use with caution!</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSeedDatabase}
              disabled={seeding}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors disabled:opacity-50"
            >
              {seeding ? (
                <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <HiOutlineRefresh className="w-5 h-5" />
              )}
              Seed A1 Course
            </button>
            <button
              onClick={handleResetDatabase}
              disabled={seeding}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50"
            >
              Reset Database
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="p-6 rounded-2xl bg-ds-surface/30 border border-ds-border/30">
        <h2 className="text-lg font-semibold text-ds-text mb-4">Course Overview</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ds-border/30">
                <th className="text-left py-3 px-4 text-ds-muted font-medium">Level</th>
                <th className="text-left py-3 px-4 text-ds-muted font-medium">Lessons</th>
                <th className="text-left py-3 px-4 text-ds-muted font-medium">Words</th>
                <th className="text-left py-3 px-4 text-ds-muted font-medium">Exercises</th>
                <th className="text-left py-3 px-4 text-ds-muted font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-ds-border/20">
                <td className="py-3 px-4">
                  <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-medium">
                    A1
                  </span>
                </td>
                <td className="py-3 px-4 text-ds-text">8 modules</td>
                <td className="py-3 px-4 text-ds-text">65+ words</td>
                <td className="py-3 px-4 text-ds-text">43 questions</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 rounded-lg bg-green-500/20 text-green-400 text-xs">Active</span>
                </td>
              </tr>
              <tr className="border-b border-ds-border/20">
                <td className="py-3 px-4">
                  <span className="px-2 py-1 rounded-lg bg-blue-500/20 text-blue-400 text-sm font-medium">
                    A2
                  </span>
                </td>
                <td className="py-3 px-4 text-ds-muted">Coming soon</td>
                <td className="py-3 px-4 text-ds-muted">-</td>
                <td className="py-3 px-4 text-ds-muted">-</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 rounded-lg bg-yellow-500/20 text-yellow-400 text-xs">
                    Locked
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 rounded-lg bg-purple-500/20 text-purple-400 text-sm font-medium">
                    B1
                  </span>
                </td>
                <td className="py-3 px-4 text-ds-muted">Coming soon</td>
                <td className="py-3 px-4 text-ds-muted">-</td>
                <td className="py-3 px-4 text-ds-muted">-</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 rounded-lg bg-yellow-500/20 text-yellow-400 text-xs">
                    Locked
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
