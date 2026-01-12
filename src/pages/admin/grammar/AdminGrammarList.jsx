import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineBookOpen,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineDocumentText,
  HiOutlineLink,
  HiOutlineEye,
  HiOutlineEyeOff,
} from "react-icons/hi";

const AdminGrammarList = () => {
  const axiosSecure = useAxiosSecure();
  const [grammar, setGrammar] = useState([]);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [deleteModal, setDeleteModal] = useState({ show: false, item: null });

  useEffect(() => {
    fetchLevels();
    fetchGrammar();
  }, [filterLevel, filterStatus]);

  const fetchLevels = async () => {
    try {
      const response = await axiosSecure.get("/levels");
      setLevels(response.data.data || []);
    } catch (error) {
      console.error("Error fetching levels:", error);
    }
  };

  const fetchGrammar = async () => {
    setLoading(true);
    try {
      let url = "/grammar?status=all";
      if (filterLevel) url += `&level=${filterLevel}`;
      if (filterStatus) url += `&status=${filterStatus}`;

      const response = await axiosSecure.get(url);
      setGrammar(response.data.data || []);
    } catch (error) {
      console.error("Error fetching grammar:", error);
      toast.error("Failed to load grammar topics");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.item) return;

    try {
      await axiosSecure.delete(`/grammar/${deleteModal.item._id}`);
      toast.success("Grammar topic deleted");
      setDeleteModal({ show: false, item: null });
      fetchGrammar();
    } catch (error) {
      console.error("Error deleting grammar:", error);
      toast.error("Failed to delete grammar topic");
    }
  };

  const toggleStatus = async (item) => {
    try {
      const newStatus = item.status === "published" ? "draft" : "published";
      await axiosSecure.put(`/grammar/${item._id}`, { status: newStatus });
      toast.success(`Grammar ${newStatus === "published" ? "published" : "unpublished"}`);
      fetchGrammar();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  // Filter by search term
  const filteredGrammar = grammar.filter((item) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      item.title?.de?.toLowerCase().includes(search) ||
      item.title?.en?.toLowerCase().includes(search) ||
      item.title?.bn?.includes(searchTerm)
    );
  });

  // Get level badge color
  const getLevelColor = (code) => {
    switch (code) {
      case "A1":
        return "bg-emerald-500/20 text-emerald-400";
      case "A2":
        return "bg-blue-500/20 text-blue-400";
      case "B1":
        return "bg-purple-500/20 text-purple-400";
      default:
        return "bg-ds-muted/20 text-ds-muted";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ds-text">Grammar Topics</h1>
          <p className="text-ds-muted">Manage grammar explanations and rules</p>
        </div>
        <Link
          to="/admin/grammar/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-ds-text text-ds-bg rounded-xl font-semibold hover:shadow-lg transition-all cursor-pointer"
        >
          <HiOutlinePlus className="w-5 h-5" />
          Add Grammar
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ds-muted" />
          <input
            type="text"
            placeholder="Search grammar topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-ds-surface/50 border border-ds-border/30 text-ds-text placeholder-ds-muted focus:outline-none focus:border-ds-border"
          />
        </div>

        {/* Level Filter */}
        <div className="relative">
          <HiOutlineFilter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ds-muted" />
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="pl-12 pr-8 py-3 rounded-xl bg-ds-surface/50 border border-ds-border/30 text-ds-text focus:outline-none focus:border-ds-border appearance-none cursor-pointer"
          >
            <option value="">All Levels</option>
            {levels.map((level) => (
              <option key={level._id} value={level._id}>
                {level.code} -{" "}
                {typeof level.title === "object" ? level.title.en || level.title.de : level.title}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 rounded-xl bg-ds-surface/50 border border-ds-border/30 text-ds-text focus:outline-none focus:border-ds-border appearance-none cursor-pointer"
        >
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Grammar List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-ds-muted/30 border-t-ds-muted rounded-full animate-spin"></div>
        </div>
      ) : filteredGrammar.length === 0 ? (
        <div className="text-center py-16 bg-ds-surface/30 rounded-2xl border border-ds-border/30">
          <HiOutlineDocumentText className="w-16 h-16 text-ds-muted mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-ds-text mb-2">No Grammar Topics</h3>
          <p className="text-ds-muted mb-6">
            {searchTerm || filterLevel || filterStatus
              ? "No topics match your filters"
              : "Start by creating your first grammar topic"}
          </p>
          <Link
            to="/admin/grammar/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-ds-text text-ds-bg rounded-xl font-semibold hover:shadow-lg transition-all cursor-pointer"
          >
            <HiOutlinePlus className="w-5 h-5" />
            Create Grammar Topic
          </Link>
        </div>
      ) : (
        <div className="bg-ds-surface/30 rounded-2xl border border-ds-border/30 overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-ds-border/30 text-ds-muted text-sm font-medium">
            <div className="col-span-4">Title</div>
            <div className="col-span-2">Level</div>
            <div className="col-span-2 text-center">Blocks</div>
            <div className="col-span-2 text-center">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-ds-border/20">
            {filteredGrammar.map((item) => (
              <div
                key={item._id}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-ds-surface/30 transition-colors"
              >
                {/* Title */}
                <div className="col-span-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-ds-border/20 flex items-center justify-center flex-shrink-0">
                      <HiOutlineBookOpen className="w-5 h-5 text-ds-muted" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-ds-text truncate">{item.title?.de || "Untitled"}</h3>
                      <p className="text-sm text-ds-muted truncate">{item.title?.en || "No English title"}</p>
                    </div>
                  </div>
                </div>

                {/* Level */}
                <div className="col-span-2">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(
                      item.level?.code
                    )}`}
                  >
                    {item.level?.code || "N/A"}
                  </span>
                </div>

                {/* Blocks Count */}
                <div className="col-span-2 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <HiOutlineDocumentText className="w-4 h-4 text-ds-muted" />
                    <span className="text-ds-text">{item.blocksCount || 0}</span>
                  </div>
                </div>

                {/* Status */}
                <div className="col-span-2 text-center">
                  <button
                    onClick={() => toggleStatus(item)}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-colors ${
                      item.status === "published"
                        ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                        : "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                    }`}
                  >
                    {item.status === "published" ? (
                      <>
                        <HiOutlineEye className="w-4 h-4" />
                        Published
                      </>
                    ) : (
                      <>
                        <HiOutlineEyeOff className="w-4 h-4" />
                        Draft
                      </>
                    )}
                  </button>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-end gap-2">
                  {/* Linked Lessons Count */}
                  {item.linkedLessons?.length > 0 && (
                    <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-ds-border/20 text-ds-muted text-sm">
                      <HiOutlineLink className="w-4 h-4" />
                      {item.linkedLessons.length}
                    </span>
                  )}

                  <Link
                    to={`/admin/grammar/${item._id}`}
                    className="p-2 rounded-lg hover:bg-ds-border/30 text-ds-muted hover:text-ds-text transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <HiOutlinePencil className="w-5 h-5" />
                  </Link>

                  <button
                    onClick={() => setDeleteModal({ show: true, item })}
                    className="p-2 rounded-lg hover:bg-red-500/20 text-ds-muted hover:text-red-400 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <HiOutlineTrash className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      {!loading && filteredGrammar.length > 0 && (
        <div className="flex items-center justify-between text-sm text-ds-muted">
          <span>
            Showing {filteredGrammar.length} of {grammar.length} topics
          </span>
          <span>
            {grammar.filter((g) => g.status === "published").length} published,{" "}
            {grammar.filter((g) => g.status === "draft").length} drafts
          </span>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDeleteModal({ show: false, item: null })}
          ></div>
          <div className="relative w-full max-w-md bg-ds-surface rounded-2xl border border-ds-border/30 p-6">
            <h3 className="text-xl font-bold text-ds-text mb-2">Delete Grammar Topic</h3>
            <p className="text-ds-muted mb-6">
              Are you sure you want to delete "{deleteModal.item?.title?.de}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ show: false, item: null })}
                className="flex-1 py-3 rounded-xl border-2 border-ds-border/30 text-ds-text font-semibold hover:bg-ds-bg/50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGrammarList;
