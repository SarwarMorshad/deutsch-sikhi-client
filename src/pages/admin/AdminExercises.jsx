import { useState, useEffect } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineX,
  HiOutlineCheck,
  HiOutlineFilter,
  HiOutlineBookOpen,
} from "react-icons/hi";
import toast from "react-hot-toast";

const AdminExercises = () => {
  const axiosSecure = useAxiosSecure();
  const [exercises, setExercises] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");

  // Form lessons (for modal dropdown)
  const [formLessons, setFormLessons] = useState([]);

  const [formData, setFormData] = useState({
    levelId: "",
    lessonId: "",
    type: "mcq",
    question: { en: "", bn: "" },
    options: ["", "", "", ""],
    correctAnswer: "",
  });

  useEffect(() => {
    fetchLevels();
  }, []);

  useEffect(() => {
    if (selectedLevel) fetchLessons();
  }, [selectedLevel]);

  useEffect(() => {
    if (selectedLesson) fetchExercises();
  }, [selectedLesson]);

  // Fetch lessons for form when levelId changes
  useEffect(() => {
    if (formData.levelId) fetchFormLessons(formData.levelId);
  }, [formData.levelId]);

  const fetchLevels = async () => {
    try {
      const res = await axiosSecure.get("/admin/levels");
      setLevels(res.data.data);
      if (res.data.data.length > 0) {
        setSelectedLevel(res.data.data[0]._id);
      }
    } catch (error) {
      toast.error("Failed to load levels");
    } finally {
      setLoading(false);
    }
  };

  const fetchLessons = async () => {
    try {
      const res = await axiosSecure.get(`/admin/lessons?level=${selectedLevel}`);
      setLessons(res.data.data);
      if (res.data.data.length > 0) {
        setSelectedLesson(res.data.data[0]._id);
      } else {
        setSelectedLesson("");
        setExercises([]);
      }
    } catch (error) {
      toast.error("Failed to load lessons");
    }
  };

  const fetchFormLessons = async (levelId) => {
    try {
      const res = await axiosSecure.get(`/admin/lessons?level=${levelId}`);
      setFormLessons(res.data.data);
    } catch (error) {
      console.error("Failed to load form lessons");
    }
  };

  const fetchExercises = async () => {
    try {
      const res = await axiosSecure.get(`/admin/exercises?lesson=${selectedLesson}`);
      setExercises(res.data.data);
    } catch (error) {
      toast.error("Failed to load exercises");
    }
  };

  const openModal = (exercise = null) => {
    if (exercise) {
      // Find the lesson to get its levelId
      const lesson = lessons.find((l) => l._id === exercise.lessonId);
      const levelId = lesson?.levelId || selectedLevel;

      setEditingExercise(exercise);
      setFormData({
        levelId: levelId,
        lessonId: exercise.lessonId || selectedLesson,
        type: exercise.type || "mcq",
        question: exercise.question || { en: "", bn: "" },
        options: exercise.options?.length ? exercise.options : ["", "", "", ""],
        correctAnswer: exercise.correctAnswer || "",
      });
      // Load lessons for this level
      fetchFormLessons(levelId);
    } else {
      setEditingExercise(null);
      setFormData({
        levelId: selectedLevel,
        lessonId: selectedLesson,
        type: "mcq",
        question: { en: "", bn: "" },
        options: ["", "", "", ""],
        correctAnswer: "",
      });
      setFormLessons(lessons);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingExercise(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.lessonId) {
      toast.error("Please select a lesson");
      return;
    }

    if (!formData.correctAnswer) {
      toast.error("Please set the correct answer");
      return;
    }

    const cleanedData = {
      ...formData,
      options: formData.options.filter((o) => o.trim()),
    };

    try {
      if (editingExercise) {
        await axiosSecure.patch(`/admin/exercises/${editingExercise._id}`, cleanedData);
        toast.success("Exercise updated");
      } else {
        await axiosSecure.post("/admin/exercises", cleanedData);
        toast.success("Exercise created");
      }
      closeModal();
      fetchExercises();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save");
    }
  };

  const handleDelete = async (ex) => {
    if (!confirm("Delete this exercise?")) return;
    try {
      await axiosSecure.delete(`/admin/exercises/${ex._id}`);
      toast.success("Deleted");
      fetchExercises();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const addOption = () => {
    if (formData.options.length < 6) {
      setFormData({ ...formData, options: [...formData.options, ""] });
    }
  };

  const removeOption = (index) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      // Clear correct answer if removed
      if (formData.correctAnswer === formData.options[index]) {
        setFormData({ ...formData, options: newOptions, correctAnswer: "" });
      } else {
        setFormData({ ...formData, options: newOptions });
      }
    }
  };

  const getLevelCode = (levelId) => {
    const level = levels.find((l) => l._id === levelId);
    return level?.code || "";
  };

  const getLessonTitle = (lessonId) => {
    const lesson = lessons.find((l) => l._id === lessonId);
    return lesson ? `${lesson.order}. ${lesson.title?.en}` : "";
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
          <h1 className="text-2xl font-bold text-ds-text">Exercises Management</h1>
          <p className="text-ds-muted">Create quiz questions for each lesson</p>
        </div>
        <button
          onClick={() => openModal()}
          disabled={!selectedLesson}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-ds-text text-ds-bg font-semibold disabled:opacity-50"
        >
          <HiOutlinePlus className="w-5 h-5" />
          Add Exercise
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <HiOutlineFilter className="w-5 h-5 text-ds-muted" />

          {/* Level Filter */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-4 py-2 rounded-xl bg-ds-surface border border-ds-border/30 text-ds-text"
          >
            {levels.map((l) => (
              <option key={l._id} value={l._id}>
                {l.code} - {l.title?.en}
              </option>
            ))}
          </select>

          {/* Lesson Filter */}
          <select
            value={selectedLesson}
            onChange={(e) => setSelectedLesson(e.target.value)}
            className="px-4 py-2 rounded-xl bg-ds-surface border border-ds-border/30 text-ds-text"
          >
            {lessons.length === 0 ? (
              <option value="">No lessons available</option>
            ) : (
              lessons.map((l) => (
                <option key={l._id} value={l._id}>
                  {l.order}. {l.title?.en}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Exercise Count */}
        <span className="text-ds-muted text-sm">
          {exercises.length} exercise{exercises.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Current Lesson Info */}
      {selectedLesson && lessons.length > 0 && (
        <div className="p-4 rounded-xl bg-ds-surface/30 border border-ds-border/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <HiOutlineBookOpen className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-ds-text font-medium">
                {getLevelCode(selectedLevel)} → {getLessonTitle(selectedLesson)}
              </p>
              <p className="text-ds-muted text-sm">
                {exercises.length} exercise{exercises.length !== 1 ? "s" : ""} in this lesson
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Exercises List */}
      <div className="space-y-4">
        {exercises.map((ex, index) => (
          <div key={ex._id} className="p-6 rounded-xl bg-ds-surface/30 border border-ds-border/30">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-ds-bg flex items-center justify-center text-ds-muted font-bold">
                  {index + 1}
                </span>
                <span className="px-2 py-1 rounded-lg bg-purple-500/20 text-purple-400 text-xs uppercase">
                  {ex.type}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openModal(ex)}
                  className="p-2 rounded-lg bg-ds-bg/50 text-ds-muted hover:text-ds-text transition-colors"
                >
                  <HiOutlinePencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(ex)}
                  className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <HiOutlineTrash className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Question */}
            <p className="text-ds-text font-medium mb-1">{ex.question?.en || ex.question}</p>
            {ex.question?.bn && <p className="text-ds-muted text-sm font-bangla mb-4">{ex.question.bn}</p>}

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ex.options?.map((opt, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg text-sm ${
                    opt === ex.correctAnswer
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-ds-bg/50 text-ds-muted"
                  }`}
                >
                  <span className="font-medium">{String.fromCharCode(65 + i)}.</span> {opt}
                  {opt === ex.correctAnswer && <span className="ml-2">✓</span>}
                </div>
              ))}
            </div>
          </div>
        ))}

        {exercises.length === 0 && (
          <div className="text-center py-12">
            <p className="text-ds-muted mb-4">No exercises in this lesson</p>
            <button
              onClick={() => openModal()}
              disabled={!selectedLesson}
              className="px-4 py-2 rounded-xl bg-ds-text text-ds-bg font-semibold disabled:opacity-50"
            >
              Add First Exercise
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-ds-surface rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-ds-border/30 flex items-center justify-between">
              <h2 className="text-xl font-bold text-ds-text">
                {editingExercise ? "Edit Exercise" : "Add Exercise"}
              </h2>
              <button onClick={closeModal} className="p-2 rounded-lg hover:bg-ds-bg text-ds-muted">
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Level Selection */}
              <div>
                <label className="block text-sm font-medium text-ds-text mb-1">Level *</label>
                <select
                  value={formData.levelId}
                  onChange={(e) => {
                    setFormData({ ...formData, levelId: e.target.value, lessonId: "" });
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-ds-bg border border-ds-border/30 text-ds-text"
                  required
                >
                  {levels.map((l) => (
                    <option key={l._id} value={l._id}>
                      {l.code} - {l.title?.en}
                    </option>
                  ))}
                </select>
              </div>

              {/* Lesson Selection */}
              <div>
                <label className="block text-sm font-medium text-ds-text mb-1">Lesson *</label>
                <select
                  value={formData.lessonId}
                  onChange={(e) => setFormData({ ...formData, lessonId: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-ds-bg border border-ds-border/30 text-ds-text"
                  required
                >
                  <option value="">Select a lesson</option>
                  {formLessons.map((l) => (
                    <option key={l._id} value={l._id}>
                      {l.order}. {l.title?.en}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-ds-muted mt-1">
                  Exercise will appear in this lesson's quiz section
                </p>
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-ds-text mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-ds-bg border border-ds-border/30 text-ds-text"
                >
                  <option value="mcq">Multiple Choice</option>
                  <option value="fill">Fill in Blank</option>
                  <option value="truefalse">True/False</option>
                </select>
              </div>

              {/* Question (English) */}
              <div>
                <label className="block text-sm font-medium text-ds-text mb-1">Question (English) *</label>
                <input
                  type="text"
                  value={formData.question.en}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      question: { ...formData.question, en: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-ds-bg border border-ds-border/30 text-ds-text"
                  placeholder="What is the German word for 'house'?"
                  required
                />
              </div>

              {/* Question (Bengali) */}
              <div>
                <label className="block text-sm font-medium text-ds-text mb-1">Question (Bengali)</label>
                <input
                  type="text"
                  value={formData.question.bn}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      question: { ...formData.question, bn: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-ds-bg border border-ds-border/30 text-ds-text font-bangla"
                  placeholder="'বাড়ি' এর জার্মান শব্দ কী?"
                />
              </div>

              {/* Options */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-ds-text">Options *</label>
                  {formData.options.length < 6 && (
                    <button
                      type="button"
                      onClick={addOption}
                      className="text-xs text-ds-muted hover:text-ds-text"
                    >
                      + Add Option
                    </button>
                  )}
                </div>

                {formData.options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <span className="w-8 text-ds-muted font-medium">{String.fromCharCode(65 + i)}.</span>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => updateOption(i, e.target.value)}
                      placeholder={`Option ${i + 1}`}
                      className="flex-1 px-4 py-2 rounded-xl bg-ds-bg border border-ds-border/30 text-ds-text"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, correctAnswer: opt })}
                      className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap ${
                        formData.correctAnswer === opt && opt
                          ? "bg-green-500/20 text-green-400"
                          : "bg-ds-bg text-ds-muted hover:text-ds-text"
                      }`}
                    >
                      {formData.correctAnswer === opt && opt ? "✓ Correct" : "Set Correct"}
                    </button>
                    {formData.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(i)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                      >
                        <HiOutlineX className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}

                {!formData.correctAnswer && (
                  <p className="text-xs text-yellow-400 mt-2">
                    ⚠️ Please set one option as the correct answer
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 rounded-xl border border-ds-border/30 text-ds-text hover:bg-ds-bg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-ds-text text-ds-bg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <HiOutlineCheck className="w-5 h-5" />
                  {editingExercise ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminExercises;
