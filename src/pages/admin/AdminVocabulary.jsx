import { useState, useEffect } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineX,
  HiOutlineCheck,
  HiOutlineVolumeUp,
  HiOutlineFilter,
  HiOutlineSearch,
  HiOutlineLink,
} from "react-icons/hi";
import toast from "react-hot-toast";

const AdminVocabulary = () => {
  const axiosSecure = useAxiosSecure();
  const [words, setWords] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingWord, setEditingWord] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedLesson, setSelectedLesson] = useState("all"); // "all" means no lesson filter
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    levelId: "",
    lessonId: "", // Optional - can be empty
    word_de: "",
    article: "",
    partOfSpeech: "noun",
    meaning_en: "",
    meaning_bn: "",
    example: { de: "", en: "", bn: "" },
    verified: true,
  });

  useEffect(() => {
    fetchLevels();
  }, []);
  useEffect(() => {
    if (selectedLevel) {
      fetchLessons();
      fetchWords();
    }
  }, [selectedLevel]);
  useEffect(() => {
    if (selectedLevel) fetchWords();
  }, [selectedLesson]);

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
    } catch (error) {
      toast.error("Failed to load lessons");
    }
  };

  const fetchWords = async () => {
    try {
      let url = `/admin/words?level=${selectedLevel}`;
      if (selectedLesson && selectedLesson !== "all") {
        url += `&lesson=${selectedLesson}`;
      }
      const res = await axiosSecure.get(url);
      setWords(res.data.data);
    } catch (error) {
      toast.error("Failed to load words");
    }
  };

  const openModal = (word = null) => {
    if (word) {
      setEditingWord(word);
      setFormData({
        levelId: word.levelId || selectedLevel,
        lessonId: word.lessonId || "",
        word_de: word.word_de || "",
        article: word.article || "",
        partOfSpeech: word.partOfSpeech || "noun",
        meaning_en: word.meaning_en || "",
        meaning_bn: word.meaning_bn || "",
        example: word.example || { de: "", en: "", bn: "" },
        verified: word.verified !== false,
      });
    } else {
      setEditingWord(null);
      setFormData({
        levelId: selectedLevel,
        lessonId: "",
        word_de: "",
        article: "",
        partOfSpeech: "noun",
        meaning_en: "",
        meaning_bn: "",
        example: { de: "", en: "", bn: "" },
        verified: true,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingWord(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      lessonId: formData.lessonId || null, // Send null if no lesson selected
    };

    try {
      if (editingWord) {
        await axiosSecure.patch(`/admin/words/${editingWord._id}`, payload);
        toast.success("Word updated");
      } else {
        await axiosSecure.post("/admin/words", payload);
        toast.success("Word created");
      }
      closeModal();
      fetchWords();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save");
    }
  };

  const handleDelete = async (word) => {
    if (!confirm(`Delete "${word.word_de}"?`)) return;
    try {
      await axiosSecure.delete(`/admin/words/${word._id}`);
      toast.success("Deleted");
      fetchWords();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const speakGerman = (text) => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "de-DE";
      u.rate = 0.8;
      speechSynthesis.speak(u);
    }
  };

  const getLessonTitle = (lessonId) => {
    const lesson = lessons.find((l) => l._id === lessonId);
    return lesson ? `${lesson.order}. ${lesson.title?.en}` : null;
  };

  const filteredWords = words.filter(
    (w) =>
      w.word_de?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.meaning_en?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const partOfSpeechOptions = [
    "noun",
    "verb",
    "adjective",
    "adverb",
    "pronoun",
    "preposition",
    "conjunction",
    "interjection",
    "phrase",
    "number",
  ];
  const articleOptions = [
    { value: "", label: "None" },
    { value: "der", label: "der (masculine)" },
    { value: "die", label: "die (feminine)" },
    { value: "das", label: "das (neuter)" },
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
          <h1 className="text-2xl font-bold text-ds-text">Vocabulary Management</h1>
          <p className="text-ds-muted">Add and manage words by level. Optionally link to lessons.</p>
        </div>
        <button
          onClick={() => openModal()}
          disabled={!selectedLevel}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-ds-text text-ds-bg font-semibold disabled:opacity-50"
        >
          <HiOutlinePlus className="w-5 h-5" />
          Add Word
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <HiOutlineFilter className="w-5 h-5 text-ds-muted" />

          {/* Level Filter */}
          <select
            value={selectedLevel}
            onChange={(e) => {
              setSelectedLevel(e.target.value);
              setSelectedLesson("all");
            }}
            className="px-4 py-2 rounded-xl bg-ds-surface border border-ds-border/30 text-ds-text"
          >
            {levels.map((l) => (
              <option key={l._id} value={l._id}>
                {l.code} - {l.title?.en}
              </option>
            ))}
          </select>

          {/* Lesson Filter (Optional) */}
          <select
            value={selectedLesson}
            onChange={(e) => setSelectedLesson(e.target.value)}
            className="px-4 py-2 rounded-xl bg-ds-surface border border-ds-border/30 text-ds-text"
          >
            <option value="all">All Lessons</option>
            {lessons.map((l) => (
              <option key={l._id} value={l._id}>
                {l.order}. {l.title?.en}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-xs relative">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ds-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search words..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-ds-surface border border-ds-border/30 text-ds-text"
          />
        </div>

        {/* Word Count */}
        <span className="text-ds-muted text-sm">
          {filteredWords.length} word{filteredWords.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Words Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredWords.map((word) => (
          <div
            key={word._id}
            className="p-4 rounded-xl bg-ds-surface/30 border border-ds-border/30 hover:border-ds-border transition-colors"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                {word.article && (
                  <span className="text-xs px-2 py-0.5 rounded-lg bg-ds-bg/50 text-ds-muted font-medium">
                    {word.article}
                  </span>
                )}
                <span className="text-xs text-ds-border capitalize">{word.partOfSpeech}</span>
              </div>
              <button
                onClick={() => speakGerman(word.word_de)}
                className="p-1 rounded hover:bg-ds-bg text-ds-muted hover:text-ds-text"
              >
                <HiOutlineVolumeUp className="w-4 h-4" />
              </button>
            </div>

            {/* Word */}
            <h3 className="text-lg font-bold text-ds-text mb-1">{word.word_de}</h3>
            <p className="text-ds-muted text-sm">{word.meaning_en}</p>
            <p className="text-ds-border text-sm font-bangla">{word.meaning_bn}</p>

            {/* Linked Lesson */}
            {word.lessonId && (
              <div className="flex items-center gap-1 mt-2 text-xs text-ds-border">
                <HiOutlineLink className="w-3 h-3" />
                <span>{getLessonTitle(word.lessonId)}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-ds-border/20">
              <button
                onClick={() => openModal(word)}
                className="flex-1 py-1.5 rounded-lg bg-ds-bg/50 text-ds-muted text-sm hover:text-ds-text transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(word)}
                className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
              >
                <HiOutlineTrash className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {filteredWords.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-ds-muted mb-4">No words found</p>
            <button
              onClick={() => openModal()}
              disabled={!selectedLevel}
              className="px-4 py-2 rounded-xl bg-ds-text text-ds-bg font-semibold disabled:opacity-50"
            >
              Add First Word
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
              <h2 className="text-xl font-bold text-ds-text">{editingWord ? "Edit Word" : "Add Word"}</h2>
              <button onClick={closeModal} className="p-2 rounded-lg hover:bg-ds-bg text-ds-muted">
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Level (Required) */}
              <div>
                <label className="block text-sm font-medium text-ds-text mb-1">Level *</label>
                <select
                  value={formData.levelId}
                  onChange={(e) => setFormData({ ...formData, levelId: e.target.value })}
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

              {/* Lesson (Optional) */}
              <div>
                <label className="block text-sm font-medium text-ds-text mb-1">
                  Link to Lesson <span className="text-ds-muted">(optional)</span>
                </label>
                <select
                  value={formData.lessonId}
                  onChange={(e) => setFormData({ ...formData, lessonId: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-ds-bg border border-ds-border/30 text-ds-text"
                >
                  <option value="">No lesson (general vocabulary)</option>
                  {lessons.map((l) => (
                    <option key={l._id} value={l._id}>
                      {l.order}. {l.title?.en}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-ds-muted mt-1">
                  Link word to a specific lesson, or leave empty for general level vocabulary
                </p>
              </div>

              {/* German Word */}
              <div>
                <label className="block text-sm font-medium text-ds-text mb-1">German Word *</label>
                <input
                  type="text"
                  value={formData.word_de}
                  onChange={(e) => setFormData({ ...formData, word_de: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-ds-bg border border-ds-border/30 text-ds-text"
                  placeholder="e.g., Haus"
                  required
                />
              </div>

              {/* Article & Part of Speech */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ds-text mb-1">Article</label>
                  <select
                    value={formData.article}
                    onChange={(e) => setFormData({ ...formData, article: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-ds-bg border border-ds-border/30 text-ds-text"
                  >
                    {articleOptions.map((a) => (
                      <option key={a.value} value={a.value}>
                        {a.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ds-text mb-1">Type</label>
                  <select
                    value={formData.partOfSpeech}
                    onChange={(e) => setFormData({ ...formData, partOfSpeech: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-ds-bg border border-ds-border/30 text-ds-text"
                  >
                    {partOfSpeechOptions.map((p) => (
                      <option key={p} value={p} className="capitalize">
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* English Translation */}
              <div>
                <label className="block text-sm font-medium text-ds-text mb-1">English Translation *</label>
                <input
                  type="text"
                  value={formData.meaning_en}
                  onChange={(e) => setFormData({ ...formData, meaning_en: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-ds-bg border border-ds-border/30 text-ds-text"
                  placeholder="e.g., house"
                  required
                />
              </div>

              {/* Bengali Translation */}
              <div>
                <label className="block text-sm font-medium text-ds-text mb-1">Bengali Translation</label>
                <input
                  type="text"
                  value={formData.meaning_bn}
                  onChange={(e) => setFormData({ ...formData, meaning_bn: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-ds-bg border border-ds-border/30 text-ds-text font-bangla"
                  placeholder="e.g., বাড়ি"
                />
              </div>

              {/* Example Sentence */}
              <div>
                <label className="block text-sm font-medium text-ds-text mb-1">Example Sentence</label>
                <input
                  type="text"
                  value={formData.example?.de || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      example: { ...formData.example, de: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-ds-bg border border-ds-border/30 text-ds-text mb-2"
                  placeholder="German sentence"
                />
                <input
                  type="text"
                  value={formData.example?.en || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      example: { ...formData.example, en: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-ds-bg border border-ds-border/30 text-ds-text"
                  placeholder="English translation"
                />
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
                  {editingWord ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVocabulary;
