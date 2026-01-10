import { useState, useEffect } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineX,
  HiOutlineCheck,
  HiOutlineEye,
  HiOutlineFilter,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineCloudUpload,
  HiOutlineEyeOff,
} from "react-icons/hi";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const AdminLessons = () => {
  const axiosSecure = useAxiosSecure();
  const [lessons, setLessons] = useState([]);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [expandedSection, setExpandedSection] = useState("basic");

  const initialFormData = {
    levelId: "",
    order: 1,
    title: { de: "", en: "", bn: "" },
    description: { en: "", bn: "" },
    objectives: [""],
    warmup: {
      dialogue: [{ speaker: "A", text: "", translation: { en: "", bn: "" } }],
    },
    grammar: {
      title: { en: "", bn: "" },
      explanation: { en: "", bn: "" },
      rules: [{ rule: "", example: "" }],
    },
    conversation: {
      situation: { en: "", bn: "" },
      dialogue: [{ speaker: "A", text: "", translation: { en: "", bn: "" } }],
    },
    status: "draft",
    estimatedMinutes: 30,
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedLevel) {
      fetchLessons();
    }
  }, [selectedLevel]);

  const fetchData = async () => {
    try {
      const [lessonsRes, levelsRes] = await Promise.all([
        axiosSecure.get("/admin/lessons"),
        axiosSecure.get("/admin/levels"),
      ]);
      setLessons(lessonsRes.data.data);
      setLevels(levelsRes.data.data);
      if (levelsRes.data.data.length > 0) {
        setSelectedLevel(levelsRes.data.data[0]._id);
      }
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const fetchLessons = async () => {
    try {
      const res = await axiosSecure.get(`/admin/lessons?level=${selectedLevel}`);
      setLessons(res.data.data);
    } catch (error) {
      toast.error("Failed to load lessons");
    }
  };

  const openModal = (lesson = null) => {
    if (lesson) {
      setEditingLesson(lesson);
      setFormData({
        levelId: lesson.levelId || selectedLevel,
        order: lesson.order || 1,
        title: lesson.title || { de: "", en: "", bn: "" },
        description: lesson.description || { en: "", bn: "" },
        objectives: lesson.objectives?.length ? lesson.objectives : [""],
        warmup: lesson.warmup || initialFormData.warmup,
        grammar: lesson.grammar || initialFormData.grammar,
        conversation: lesson.conversation || initialFormData.conversation,
        status: lesson.status || "draft",
        estimatedMinutes: lesson.estimatedMinutes || 30,
      });
    } else {
      setEditingLesson(null);
      setFormData({
        ...initialFormData,
        levelId: selectedLevel,
        order: lessons.length + 1,
      });
    }
    setShowModal(true);
    setExpandedSection("basic");
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingLesson(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clean up empty items
    const cleanedData = {
      ...formData,
      objectives: formData.objectives.filter((o) => o.trim()),
      warmup: {
        ...formData.warmup,
        dialogue: formData.warmup.dialogue.filter((d) => d.text.trim()),
      },
      grammar: {
        ...formData.grammar,
        rules: formData.grammar.rules.filter((r) => r.rule.trim()),
      },
      conversation: {
        ...formData.conversation,
        dialogue: formData.conversation.dialogue.filter((d) => d.text.trim()),
      },
    };

    try {
      if (editingLesson) {
        await axiosSecure.patch(`/admin/lessons/${editingLesson._id}`, cleanedData);
        toast.success("Lesson updated successfully");
      } else {
        await axiosSecure.post("/admin/lessons", cleanedData);
        toast.success("Lesson created successfully");
      }
      closeModal();
      fetchLessons();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save lesson");
    }
  };

  const handleDelete = async (lesson) => {
    if (!confirm(`Delete lesson "${lesson.title?.en}"? This will also delete all words and exercises.`))
      return;

    try {
      await axiosSecure.delete(`/admin/lessons/${lesson._id}`);
      toast.success("Lesson deleted successfully");
      fetchLessons();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete lesson");
    }
  };

  const handlePublish = async (lesson) => {
    const newStatus = lesson.status === "published" ? "draft" : "published";
    const action = newStatus === "published" ? "publish" : "unpublish";

    if (!confirm(`Are you sure you want to ${action} "${lesson.title?.en}"?`)) return;

    try {
      await axiosSecure.patch(`/admin/lessons/${lesson._id}`, { status: newStatus });
      toast.success(`Lesson ${newStatus === "published" ? "published" : "unpublished"} successfully`);
      fetchLessons();
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${action} lesson`);
    }
  };

  const addObjective = () => {
    setFormData({ ...formData, objectives: [...formData.objectives, ""] });
  };

  const updateObjective = (index, value) => {
    const newObjectives = [...formData.objectives];
    newObjectives[index] = value;
    setFormData({ ...formData, objectives: newObjectives });
  };

  const removeObjective = (index) => {
    setFormData({ ...formData, objectives: formData.objectives.filter((_, i) => i !== index) });
  };

  const addDialogueLine = (section) => {
    const newLine = { speaker: "A", text: "", translation: { en: "", bn: "" } };
    if (section === "warmup") {
      setFormData({
        ...formData,
        warmup: { ...formData.warmup, dialogue: [...formData.warmup.dialogue, newLine] },
      });
    } else {
      setFormData({
        ...formData,
        conversation: { ...formData.conversation, dialogue: [...formData.conversation.dialogue, newLine] },
      });
    }
  };

  const updateDialogueLine = (section, index, field, value) => {
    if (section === "warmup") {
      const newDialogue = [...formData.warmup.dialogue];
      if (field === "speaker" || field === "text") {
        newDialogue[index][field] = value;
      } else {
        newDialogue[index].translation[field] = value;
      }
      setFormData({ ...formData, warmup: { ...formData.warmup, dialogue: newDialogue } });
    } else {
      const newDialogue = [...formData.conversation.dialogue];
      if (field === "speaker" || field === "text") {
        newDialogue[index][field] = value;
      } else {
        newDialogue[index].translation[field] = value;
      }
      setFormData({ ...formData, conversation: { ...formData.conversation, dialogue: newDialogue } });
    }
  };

  const addGrammarRule = () => {
    setFormData({
      ...formData,
      grammar: { ...formData.grammar, rules: [...formData.grammar.rules, { rule: "", example: "" }] },
    });
  };

  const updateGrammarRule = (index, field, value) => {
    const newRules = [...formData.grammar.rules];
    newRules[index][field] = value;
    setFormData({ ...formData, grammar: { ...formData.grammar, rules: newRules } });
  };

  const filteredLessons = lessons.filter(
    (l) => !selectedLevel || l.levelId === selectedLevel || l.levelId?._id === selectedLevel
  );

  const SectionHeader = ({ id, title, children }) => (
    <div className="border border-ds-border/30 rounded-xl overflow-hidden mb-4">
      <button
        type="button"
        onClick={() => setExpandedSection(expandedSection === id ? "" : id)}
        className="w-full px-4 py-3 bg-ds-bg/50 flex items-center justify-between text-ds-text font-medium"
      >
        {title}
        {expandedSection === id ? (
          <HiOutlineChevronUp className="w-5 h-5" />
        ) : (
          <HiOutlineChevronDown className="w-5 h-5" />
        )}
      </button>
      {expandedSection === id && <div className="p-4 space-y-4">{children}</div>}
    </div>
  );

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
          <h1 className="text-2xl font-bold text-ds-text">Lessons Management</h1>
          <p className="text-ds-muted">Create and manage lessons with all content sections</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-ds-text text-ds-bg font-semibold hover:shadow-lg transition-all"
        >
          <HiOutlinePlus className="w-5 h-5" />
          Add Lesson
        </button>
      </div>

      {/* Level Filter */}
      <div className="flex items-center gap-4">
        <HiOutlineFilter className="w-5 h-5 text-ds-muted" />
        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          className="px-4 py-2 rounded-xl bg-ds-surface border border-ds-border/30 text-ds-text focus:outline-none"
        >
          {levels.map((level) => (
            <option key={level._id} value={level._id}>
              {level.code} - {level.title?.en}
            </option>
          ))}
        </select>
      </div>

      {/* Lessons Table */}
      <div className="bg-ds-surface/30 rounded-2xl border border-ds-border/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ds-border/30 bg-ds-bg/30">
                <th className="text-left py-4 px-4 text-ds-muted font-medium">#</th>
                <th className="text-left py-4 px-4 text-ds-muted font-medium">Title</th>
                <th className="text-left py-4 px-4 text-ds-muted font-medium">Status</th>
                <th className="text-left py-4 px-4 text-ds-muted font-medium">Duration</th>
                <th className="text-right py-4 px-4 text-ds-muted font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLessons.map((lesson) => (
                <tr key={lesson._id} className="border-b border-ds-border/20 hover:bg-ds-bg/20">
                  <td className="py-4 px-4 text-ds-text font-bold">{lesson.order}</td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-ds-text font-medium">{lesson.title?.en}</p>
                      <p className="text-ds-muted text-sm font-bangla">{lesson.title?.bn}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        lesson.status === "published"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {lesson.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-ds-muted">{lesson.estimatedMinutes} min</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      {/* Publish/Unpublish Button */}
                      <button
                        onClick={() => handlePublish(lesson)}
                        className={`p-2 rounded-lg transition-colors ${
                          lesson.status === "published"
                            ? "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
                            : "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                        }`}
                        title={lesson.status === "published" ? "Unpublish" : "Publish"}
                      >
                        {lesson.status === "published" ? (
                          <HiOutlineEyeOff className="w-5 h-5" />
                        ) : (
                          <HiOutlineCloudUpload className="w-5 h-5" />
                        )}
                      </button>
                      <Link
                        to={`/lessons/${lesson._id}`}
                        target="_blank"
                        className="p-2 rounded-lg bg-ds-bg/50 text-ds-muted hover:text-ds-text transition-colors"
                        title="Preview"
                      >
                        <HiOutlineEye className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => openModal(lesson)}
                        className="p-2 rounded-lg bg-ds-bg/50 text-ds-muted hover:text-ds-text transition-colors"
                        title="Edit"
                      >
                        <HiOutlinePencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(lesson)}
                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                        title="Delete"
                      >
                        <HiOutlineTrash className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLessons.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-ds-muted">
                    No lessons found for this level
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-ds-surface rounded-2xl w-full max-w-3xl my-8">
            <div className="p-6 border-b border-ds-border/30 flex items-center justify-between sticky top-0 bg-ds-surface rounded-t-2xl">
              <h2 className="text-xl font-bold text-ds-text">
                {editingLesson ? "Edit Lesson" : "Add New Lesson"}
              </h2>
              <button onClick={closeModal} className="p-2 rounded-lg hover:bg-ds-bg text-ds-muted">
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {/* Basic Info Section */}
              <SectionHeader id="basic" title="📝 Basic Information">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-ds-text mb-1">Level</label>
                    <select
                      value={formData.levelId}
                      onChange={(e) => setFormData({ ...formData, levelId: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-ds-bg border border-ds-border/30 text-ds-text"
                      required
                    >
                      {levels.map((level) => (
                        <option key={level._id} value={level._id}>
                          {level.code}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ds-text mb-1">Order</label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl bg-ds-bg border border-ds-border/30 text-ds-text"
                      min={1}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ds-text mb-1">Title (English) *</label>
                  <input
                    type="text"
                    value={formData.title.en}
                    onChange={(e) =>
                      setFormData({ ...formData, title: { ...formData.title, en: e.target.value } })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-ds-bg border border-ds-border/30 text-ds-text"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ds-text mb-1">Title (Bengali)</label>
                  <input
                    type="text"
                    value={formData.title.bn}
                    onChange={(e) =>
                      setFormData({ ...formData, title: { ...formData.title, bn: e.target.value } })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-ds-bg border border-ds-border/30 text-ds-text font-bangla"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ds-text mb-1">Description (English)</label>
                  <textarea
                    value={formData.description.en}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: { ...formData.description, en: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-ds-bg border border-ds-border/30 text-ds-text resize-none"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-ds-text mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-ds-bg border border-ds-border/30 text-ds-text"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ds-text mb-1">Duration (min)</label>
                    <input
                      type="number"
                      value={formData.estimatedMinutes}
                      onChange={(e) =>
                        setFormData({ ...formData, estimatedMinutes: parseInt(e.target.value) })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-ds-bg border border-ds-border/30 text-ds-text"
                    />
                  </div>
                </div>
              </SectionHeader>

              {/* Objectives Section */}
              <SectionHeader id="objectives" title="🎯 Learning Objectives">
                {formData.objectives.map((obj, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={obj}
                      onChange={(e) => updateObjective(index, e.target.value)}
                      placeholder={`Objective ${index + 1}`}
                      className="flex-1 px-4 py-2 rounded-xl bg-ds-bg border border-ds-border/30 text-ds-text"
                    />
                    <button
                      type="button"
                      onClick={() => removeObjective(index)}
                      className="p-2 rounded-lg bg-red-500/10 text-red-400"
                    >
                      <HiOutlineX className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addObjective}
                  className="w-full py-2 rounded-xl border-2 border-dashed border-ds-border/30 text-ds-muted hover:border-ds-border hover:text-ds-text transition-colors"
                >
                  + Add Objective
                </button>
              </SectionHeader>

              {/* Warmup Dialogue Section */}
              <SectionHeader id="warmup" title="🎧 Warm-up Dialogue">
                {formData.warmup.dialogue.map((line, index) => (
                  <div key={index} className="p-3 rounded-xl bg-ds-bg/30 space-y-2">
                    <div className="flex gap-2">
                      <select
                        value={line.speaker}
                        onChange={(e) => updateDialogueLine("warmup", index, "speaker", e.target.value)}
                        className="w-20 px-2 py-2 rounded-lg bg-ds-bg border border-ds-border/30 text-ds-text"
                      >
                        <option>A</option>
                        <option>B</option>
                        <option>You</option>
                        <option>Staff</option>
                        <option>Waiter</option>
                      </select>
                      <input
                        type="text"
                        value={line.text}
                        onChange={(e) => updateDialogueLine("warmup", index, "text", e.target.value)}
                        placeholder="German text"
                        className="flex-1 px-3 py-2 rounded-lg bg-ds-bg border border-ds-border/30 text-ds-text"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={line.translation?.en || ""}
                        onChange={(e) => updateDialogueLine("warmup", index, "en", e.target.value)}
                        placeholder="English translation"
                        className="px-3 py-2 rounded-lg bg-ds-bg border border-ds-border/30 text-ds-text text-sm"
                      />
                      <input
                        type="text"
                        value={line.translation?.bn || ""}
                        onChange={(e) => updateDialogueLine("warmup", index, "bn", e.target.value)}
                        placeholder="Bengali translation"
                        className="px-3 py-2 rounded-lg bg-ds-bg border border-ds-border/30 text-ds-text text-sm font-bangla"
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addDialogueLine("warmup")}
                  className="w-full py-2 rounded-xl border-2 border-dashed border-ds-border/30 text-ds-muted hover:border-ds-border"
                >
                  + Add Dialogue Line
                </button>
              </SectionHeader>

              {/* Grammar Section */}
              <SectionHeader id="grammar" title="📖 Grammar">
                <input
                  type="text"
                  value={formData.grammar.title.en}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      grammar: {
                        ...formData.grammar,
                        title: { ...formData.grammar.title, en: e.target.value },
                      },
                    })
                  }
                  placeholder="Grammar topic title (English)"
                  className="w-full px-4 py-2 rounded-xl bg-ds-bg border border-ds-border/30 text-ds-text"
                />
                <textarea
                  value={formData.grammar.explanation.en}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      grammar: {
                        ...formData.grammar,
                        explanation: { ...formData.grammar.explanation, en: e.target.value },
                      },
                    })
                  }
                  placeholder="Explanation (English)"
                  className="w-full px-4 py-2 rounded-xl bg-ds-bg border border-ds-border/30 text-ds-text resize-none"
                  rows={2}
                />
                <p className="text-ds-muted text-sm">Grammar Rules:</p>
                {formData.grammar.rules.map((rule, index) => (
                  <div key={index} className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={rule.rule}
                      onChange={(e) => updateGrammarRule(index, "rule", e.target.value)}
                      placeholder="Rule"
                      className="px-3 py-2 rounded-lg bg-ds-bg border border-ds-border/30 text-ds-text"
                    />
                    <input
                      type="text"
                      value={rule.example}
                      onChange={(e) => updateGrammarRule(index, "example", e.target.value)}
                      placeholder="Example"
                      className="px-3 py-2 rounded-lg bg-ds-bg border border-ds-border/30 text-ds-text"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addGrammarRule}
                  className="w-full py-2 rounded-xl border-2 border-dashed border-ds-border/30 text-ds-muted"
                >
                  + Add Rule
                </button>
              </SectionHeader>

              {/* Conversation Section */}
              <SectionHeader id="conversation" title="💬 Conversation Practice">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={formData.conversation.situation.en}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        conversation: {
                          ...formData.conversation,
                          situation: { ...formData.conversation.situation, en: e.target.value },
                        },
                      })
                    }
                    placeholder="Situation (English)"
                    className="px-4 py-2 rounded-xl bg-ds-bg border border-ds-border/30 text-ds-text"
                  />
                  <input
                    type="text"
                    value={formData.conversation.situation.bn}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        conversation: {
                          ...formData.conversation,
                          situation: { ...formData.conversation.situation, bn: e.target.value },
                        },
                      })
                    }
                    placeholder="Situation (Bengali)"
                    className="px-4 py-2 rounded-xl bg-ds-bg border border-ds-border/30 text-ds-text font-bangla"
                  />
                </div>
                {formData.conversation.dialogue.map((line, index) => (
                  <div key={index} className="p-3 rounded-xl bg-ds-bg/30 space-y-2">
                    <div className="flex gap-2">
                      <select
                        value={line.speaker}
                        onChange={(e) => updateDialogueLine("conversation", index, "speaker", e.target.value)}
                        className="w-20 px-2 py-2 rounded-lg bg-ds-bg border border-ds-border/30 text-ds-text"
                      >
                        <option>A</option>
                        <option>B</option>
                        <option>You</option>
                      </select>
                      <input
                        type="text"
                        value={line.text}
                        onChange={(e) => updateDialogueLine("conversation", index, "text", e.target.value)}
                        placeholder="German text"
                        className="flex-1 px-3 py-2 rounded-lg bg-ds-bg border border-ds-border/30 text-ds-text"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={line.translation?.en || ""}
                        onChange={(e) => updateDialogueLine("conversation", index, "en", e.target.value)}
                        placeholder="English"
                        className="px-3 py-2 rounded-lg bg-ds-bg border border-ds-border/30 text-ds-text text-sm"
                      />
                      <input
                        type="text"
                        value={line.translation?.bn || ""}
                        onChange={(e) => updateDialogueLine("conversation", index, "bn", e.target.value)}
                        placeholder="Bengali"
                        className="px-3 py-2 rounded-lg bg-ds-bg border border-ds-border/30 text-ds-text text-sm font-bangla"
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addDialogueLine("conversation")}
                  className="w-full py-2 rounded-xl border-2 border-dashed border-ds-border/30 text-ds-muted"
                >
                  + Add Dialogue Line
                </button>
              </SectionHeader>

              {/* Submit */}
              <div className="flex gap-3 pt-4 sticky bottom-0 bg-ds-surface py-4 -mx-6 px-6 border-t border-ds-border/30">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 rounded-xl border border-ds-border/30 text-ds-text font-medium hover:bg-ds-bg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-ds-text text-ds-bg font-semibold hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <HiOutlineCheck className="w-5 h-5" />
                  {editingLesson ? "Update Lesson" : "Create Lesson"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLessons;
