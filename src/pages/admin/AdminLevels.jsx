import { useState, useEffect } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineX, HiOutlineCheck } from "react-icons/hi";
import toast from "react-hot-toast";

const AdminLevels = () => {
  const axiosSecure = useAxiosSecure();
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLevel, setEditingLevel] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    title: { de: "", en: "", bn: "" },
    description: { de: "", en: "", bn: "" },
    order: 1,
    isActive: true,
  });

  useEffect(() => {
    fetchLevels();
  }, []);

  const fetchLevels = async () => {
    try {
      const res = await axiosSecure.get("/admin/levels");
      setLevels(res.data.data);
    } catch (error) {
      toast.error("Failed to load levels");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (level = null) => {
    if (level) {
      setEditingLevel(level);
      setFormData({
        code: level.code || "",
        title: level.title || { de: "", en: "", bn: "" },
        description: level.description || { de: "", en: "", bn: "" },
        order: level.order || 1,
        isActive: level.isActive !== false,
      });
    } else {
      setEditingLevel(null);
      setFormData({
        code: "",
        title: { de: "", en: "", bn: "" },
        description: { de: "", en: "", bn: "" },
        order: levels.length + 1,
        isActive: true,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingLevel(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingLevel) {
        await axiosSecure.patch(`/admin/levels/${editingLevel._id}`, formData);
        toast.success("Level updated successfully");
      } else {
        await axiosSecure.post("/admin/levels", formData);
        toast.success("Level created successfully");
      }
      closeModal();
      fetchLevels();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save level");
    }
  };

  const handleDelete = async (level) => {
    if (!confirm(`Delete level "${level.code}"? This cannot be undone.`)) return;

    try {
      await axiosSecure.delete(`/admin/levels/${level._id}`);
      toast.success("Level deleted successfully");
      fetchLevels();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete level");
    }
  };

  const toggleActive = async (level) => {
    try {
      await axiosSecure.patch(`/admin/levels/${level._id}`, {
        isActive: !level.isActive,
      });
      toast.success(`Level ${level.isActive ? "deactivated" : "activated"}`);
      fetchLevels();
    } catch (error) {
      toast.error("Failed to update level status");
    }
  };

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
          <h1 className="text-2xl font-bold text-ds-text">Levels Management</h1>
          <p className="text-ds-muted">Create and manage course levels (A1, A2, B1, etc.)</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-ds-text text-ds-bg font-semibold hover:shadow-lg transition-all"
        >
          <HiOutlinePlus className="w-5 h-5" />
          Add Level
        </button>
      </div>

      {/* Levels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {levels.map((level) => (
          <div
            key={level._id}
            className={`p-6 rounded-2xl border transition-all ${
              level.isActive
                ? "bg-ds-surface/30 border-ds-border/30"
                : "bg-ds-bg/50 border-ds-border/20 opacity-60"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-3 py-1 rounded-lg font-bold ${
                      level.code === "A1"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : level.code === "A2"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-purple-500/20 text-purple-400"
                    }`}
                  >
                    {level.code}
                  </span>
                  {level.isActive ? (
                    <span className="px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-400">Active</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-400">Inactive</span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-ds-text">{level.title?.en}</h3>
                <p className="text-sm text-ds-muted font-bangla">{level.title?.bn}</p>
              </div>
              <span className="text-ds-border text-sm">#{level.order}</span>
            </div>

            <p className="text-ds-muted text-sm mb-4 line-clamp-2">
              {level.description?.en || "No description"}
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleActive(level)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  level.isActive
                    ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                    : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                }`}
              >
                {level.isActive ? "Deactivate" : "Activate"}
              </button>
              <button
                onClick={() => openModal(level)}
                className="p-2 rounded-lg bg-ds-bg/50 text-ds-muted hover:text-ds-text hover:bg-ds-bg transition-colors"
              >
                <HiOutlinePencil className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(level)}
                className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
              >
                <HiOutlineTrash className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}

        {levels.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-ds-muted mb-4">No levels found</p>
            <button
              onClick={() => openModal()}
              className="px-4 py-2 rounded-xl bg-ds-text text-ds-bg font-semibold"
            >
              Create First Level
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-ds-surface rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-ds-border/30 flex items-center justify-between">
              <h2 className="text-xl font-bold text-ds-text">
                {editingLevel ? "Edit Level" : "Add New Level"}
              </h2>
              <button onClick={closeModal} className="p-2 rounded-lg hover:bg-ds-bg text-ds-muted">
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Code */}
              <div>
                <label className="block text-sm font-medium text-ds-text mb-1">Level Code *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g., A1, A2, B1"
                  className="w-full px-4 py-3 rounded-xl bg-ds-bg border border-ds-border/30 text-ds-text placeholder-ds-border focus:outline-none focus:border-ds-muted"
                  required
                />
              </div>

              {/* Title EN */}
              <div>
                <label className="block text-sm font-medium text-ds-text mb-1">Title (English) *</label>
                <input
                  type="text"
                  value={formData.title.en}
                  onChange={(e) =>
                    setFormData({ ...formData, title: { ...formData.title, en: e.target.value } })
                  }
                  placeholder="e.g., Beginner"
                  className="w-full px-4 py-3 rounded-xl bg-ds-bg border border-ds-border/30 text-ds-text placeholder-ds-border focus:outline-none focus:border-ds-muted"
                  required
                />
              </div>

              {/* Title BN */}
              <div>
                <label className="block text-sm font-medium text-ds-text mb-1">Title (Bengali)</label>
                <input
                  type="text"
                  value={formData.title.bn}
                  onChange={(e) =>
                    setFormData({ ...formData, title: { ...formData.title, bn: e.target.value } })
                  }
                  placeholder="e.g., শুরু"
                  className="w-full px-4 py-3 rounded-xl bg-ds-bg border border-ds-border/30 text-ds-text placeholder-ds-border focus:outline-none focus:border-ds-muted font-bangla"
                />
              </div>

              {/* Description EN */}
              <div>
                <label className="block text-sm font-medium text-ds-text mb-1">Description (English)</label>
                <textarea
                  value={formData.description.en}
                  onChange={(e) =>
                    setFormData({ ...formData, description: { ...formData.description, en: e.target.value } })
                  }
                  placeholder="Brief description of what students will learn..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-ds-bg border border-ds-border/30 text-ds-text placeholder-ds-border focus:outline-none focus:border-ds-muted resize-none"
                />
              </div>

              {/* Description BN */}
              <div>
                <label className="block text-sm font-medium text-ds-text mb-1">Description (Bengali)</label>
                <textarea
                  value={formData.description.bn}
                  onChange={(e) =>
                    setFormData({ ...formData, description: { ...formData.description, bn: e.target.value } })
                  }
                  placeholder="বাংলায় বিবরণ..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-ds-bg border border-ds-border/30 text-ds-text placeholder-ds-border focus:outline-none focus:border-ds-muted resize-none font-bangla"
                />
              </div>

              {/* Order & Active */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ds-text mb-1">Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    min={1}
                    className="w-full px-4 py-3 rounded-xl bg-ds-bg border border-ds-border/30 text-ds-text focus:outline-none focus:border-ds-muted"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ds-text mb-1">Status</label>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                    className={`w-full px-4 py-3 rounded-xl border font-medium transition-colors ${
                      formData.isActive
                        ? "bg-green-500/20 border-green-500/30 text-green-400"
                        : "bg-ds-bg border-ds-border/30 text-ds-muted"
                    }`}
                  >
                    {formData.isActive ? "Active" : "Inactive"}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 rounded-xl border border-ds-border/30 text-ds-text font-medium hover:bg-ds-bg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-ds-text text-ds-bg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <HiOutlineCheck className="w-5 h-5" />
                  {editingLevel ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLevels;
