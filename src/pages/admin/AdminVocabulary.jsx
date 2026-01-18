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
  const [selectedLesson, setSelectedLesson] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Audio management states
  const [audioStats, setAudioStats] = useState(null);
  const [fetchingAudio, setFetchingAudio] = useState(null);
  const [bulkFetching, setBulkFetching] = useState(false);

  const [formData, setFormData] = useState({
    levelId: "",
    lessonId: "",
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
      fetchAudioStats();
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

  const fetchAudioStats = async () => {
    try {
      const res = await axiosSecure.get(`/audio/stats?level=${selectedLevel}`);
      setAudioStats(res.data.data);
    } catch (error) {
      console.error("Failed to load audio stats");
    }
  };

  const handleFetchAudio = async (word) => {
    setFetchingAudio(word._id);
    try {
      const res = await axiosSecure.post(`/audio/fetch/${word._id}`);
      toast.success(res.data.message);
      fetchWords();
      fetchAudioStats();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch audio";
      toast.error(message);
    } finally {
      setFetchingAudio(null);
    }
  };

  const handleBulkFetchAudio = async () => {
    const wordsWithoutAudio = filteredWords.filter((w) => !w.audio?.url);

    if (wordsWithoutAudio.length === 0) {
      toast("All words already have audio!", { icon: "✅" });
      return;
    }

    if (!confirm(`Fetch audio for ${wordsWithoutAudio.length} words? This may take a few minutes.`)) {
      return;
    }

    setBulkFetching(true);
    try {
      const wordIds = wordsWithoutAudio.map((w) => w._id);
      const res = await axiosSecure.post("/audio/fetch-batch", { wordIds });

      toast.success(`Audio fetched! Success: ${res.data.data.success}, Failed: ${res.data.data.failed}`);

      fetchWords();
      fetchAudioStats();
    } catch (error) {
      toast.error("Bulk fetch failed");
    } finally {
      setBulkFetching(false);
    }
  };

  const handleDeleteAudio = async (word) => {
    if (!confirm(`Remove audio for "${word.word_de}"?`)) return;

    try {
      await axiosSecure.delete(`/audio/${word._id}`);
      toast.success("Audio removed");
      fetchWords();
      fetchAudioStats();
    } catch (error) {
      toast.error("Failed to delete audio");
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
      lessonId: formData.lessonId || null,
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
      fetchAudioStats();
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
      fetchAudioStats();
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

  const playWiktionaryAudio = (audioUrl) => {
    const audio = new Audio(audioUrl);
    audio.play().catch((err) => {
      console.error("Audio playback error:", err);
      toast.error("Failed to play audio");
    });
  };

  const getLessonTitle = (lessonId) => {
    const lesson = lessons.find((l) => l._id === lessonId);
    return lesson ? `${lesson.order}. ${lesson.title?.en}` : null;
  };

  const filteredWords = words.filter(
    (w) =>
      w.word_de?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.meaning_en?.toLowerCase().includes(searchQuery.toLowerCase()),
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
      <div className="flex flex-col gap-4">
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

        {/* Audio Stats Card */}
        {audioStats && (
          <div className="p-4 rounded-xl bg-ds-surface/30 border border-ds-border/30">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-ds-muted text-sm">Audio Coverage</p>
                  <p className="text-2xl font-bold text-ds-text">{audioStats.coveragePercentage}%</p>
                </div>
                <div>
                  <p className="text-ds-muted text-sm">With Audio</p>
                  <p className="text-lg font-semibold text-green-400">{audioStats.withAudio}</p>
                </div>
                <div>
                  <p className="text-ds-muted text-sm">Missing Audio</p>
                  <p className="text-lg font-semibold text-orange-400">{audioStats.withoutAudio}</p>
                </div>
              </div>
              <button
                onClick={handleBulkFetchAudio}
                disabled={bulkFetching || audioStats.withoutAudio === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500 text-white font-semibold hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {bulkFetching ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Fetching...
                  </>
                ) : (
                  <>
                    <HiOutlineVolumeUp className="w-5 h-5" />
                    Fetch All Audio ({audioStats.withoutAudio})
                  </>
                )}
              </button>
            </div>
          </div>
        )}
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

          {/* Lesson Filter */}
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
            {/* Header with Audio Indicator */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                {word.article && (
                  <span className="text-xs px-2 py-0.5 rounded-lg bg-ds-bg/50 text-ds-muted font-medium">
                    {word.article}
                  </span>
                )}
                <span className="text-xs text-ds-border capitalize">{word.partOfSpeech}</span>

                {/* Audio Indicator */}
                {word.audio?.url && (
                  <span className="text-xs px-2 py-0.5 rounded-lg bg-green-500/20 text-green-400 flex items-center gap-1">
                    <HiOutlineVolumeUp className="w-3 h-3" />
                    Audio
                  </span>
                )}
              </div>

              {/* Audio Action Buttons */}
              {word.audio?.url ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => playWiktionaryAudio(word.audio.url)}
                    className="p-1 rounded hover:bg-ds-bg text-green-400 hover:text-green-300 transition-colors"
                    title="Play Wiktionary audio"
                  >
                    <HiOutlineVolumeUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteAudio(word)}
                    className="p-1 rounded hover:bg-ds-bg text-red-400 hover:text-red-300 transition-colors"
                    title="Delete audio"
                  >
                    <HiOutlineX className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleFetchAudio(word)}
                  disabled={fetchingAudio === word._id}
                  className="p-1 rounded hover:bg-ds-bg text-ds-muted hover:text-purple-400 disabled:opacity-50 transition-colors"
                  title="Fetch audio from Wiktionary"
                >
                  {fetchingAudio === word._id ? (
                    <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <HiOutlineVolumeUp className="w-4 h-4" />
                  )}
                </button>
              )}
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
              {/* Level */}
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

              {/* Lesson */}
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
