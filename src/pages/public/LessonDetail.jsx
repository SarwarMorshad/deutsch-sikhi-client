import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import {
  HiOutlineArrowLeft,
  HiOutlineVolumeUp,
  HiOutlinePlay,
  HiOutlineBookOpen,
  HiOutlineLightBulb,
  HiOutlinePuzzle,
  HiOutlineChatAlt2,
  HiOutlineClipboardCheck,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineArrowRight,
  HiOutlineRefresh,
  HiOutlineStar,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineAcademicCap,
} from "react-icons/hi";
import toast from "react-hot-toast";

const LessonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  // Data states
  const [lesson, setLesson] = useState(null);
  const [words, setWords] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI states
  const [activeSection, setActiveSection] = useState("warmup");
  const [flippedCards, setFlippedCards] = useState({});
  const [expandedGrammar, setExpandedGrammar] = useState(true);

  // Quiz states
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Sections configuration
  const sections = [
    { id: "warmup", label: "Warm-up", icon: HiOutlinePlay },
    { id: "vocabulary", label: "Vocabulary", icon: HiOutlineBookOpen },
    { id: "grammar", label: "Grammar", icon: HiOutlineLightBulb },
    { id: "practice", label: "Practice", icon: HiOutlinePuzzle },
    { id: "conversation", label: "Conversation", icon: HiOutlineChatAlt2 },
    { id: "quiz", label: "Quiz", icon: HiOutlineClipboardCheck },
  ];

  // Fetch lesson data
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const [lessonRes, wordsRes, exercisesRes] = await Promise.all([
          axiosSecure.get(`/lessons/${id}`),
          axiosSecure.get(`/lessons/${id}/words`),
          axiosSecure.get(`/lessons/${id}/exercises`),
        ]);

        setLesson(lessonRes.data.data);
        setWords(wordsRes.data.data || []);
        setExercises(exercisesRes.data.data || []);
      } catch (error) {
        console.error("Error fetching lesson:", error);
        toast.error("Failed to load lesson");
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [id]);

  // Text-to-speech
  const speakGerman = (text) => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "de-DE";
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  // Card flip toggle
  const toggleCardFlip = (wordId) => {
    setFlippedCards((prev) => ({ ...prev, [wordId]: !prev[wordId] }));
  };

  // Quiz functions
  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizCompleted(false);
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
  };

  const checkAnswer = (answer) => {
    setSelectedAnswer(answer);
    setIsAnswerChecked(true);
    const currentExercise = exercises[currentQuestionIndex];
    if (answer === currentExercise?.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < exercises.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerChecked(false);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = async () => {
    setQuizCompleted(true);
    const finalScore = Math.round(
      ((score + (selectedAnswer === exercises[currentQuestionIndex]?.correctAnswer ? 1 : 0)) /
        exercises.length) *
        100
    );

    if (user) {
      try {
        await axiosSecure.post(`/lessons/${id}/complete`, { score: finalScore });
        toast.success("Progress saved!");
      } catch (error) {
        console.error("Error saving progress:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-ds-muted border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-ds-muted">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-ds-muted mb-4">Lesson not found</p>
          <Link to="/courses" className="text-ds-text hover:underline">
            ← Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const finalScorePercent =
    exercises.length > 0
      ? Math.round(
          ((score +
            (isAnswerChecked && selectedAnswer === exercises[currentQuestionIndex]?.correctAnswer ? 1 : 0)) /
            exercises.length) *
            100
        )
      : 0;

  return (
    <div className="min-h-screen py-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-ds-muted hover:text-ds-text transition-colors mb-4"
          >
            <HiOutlineArrowLeft className="w-5 h-5" />
            Back to Courses
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-ds-surface/50 to-ds-surface/30 border border-ds-border/30">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-medium">
                  {lesson.levelCode || "A1"}
                </span>
                <span className="text-ds-border">•</span>
                <span className="text-ds-muted text-sm">Module {lesson.order || 1}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-ds-text mb-1">{lesson.title?.en}</h1>
              <p className="text-ds-muted font-bangla">{lesson.title?.bn}</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-center px-4 py-2 bg-ds-bg/50 rounded-xl">
                <div className="text-xl font-bold text-ds-text">{words.length}</div>
                <div className="text-ds-muted text-xs">Words</div>
              </div>
              <div className="text-center px-4 py-2 bg-ds-bg/50 rounded-xl">
                <div className="text-xl font-bold text-ds-text">{exercises.length}</div>
                <div className="text-ds-muted text-xs">Questions</div>
              </div>
              <div className="text-center px-4 py-2 bg-ds-bg/50 rounded-xl">
                <div className="text-xl font-bold text-ds-text">{lesson.estimatedMinutes || 30}</div>
                <div className="text-ds-muted text-xs">Mins</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="flex gap-1 mb-6 p-1 bg-ds-surface/30 rounded-xl overflow-x-auto">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => {
                setActiveSection(section.id);
                if (section.id === "quiz") setQuizStarted(false);
              }}
              className={`flex-1 min-w-[80px] flex flex-col items-center gap-1 py-3 px-2 rounded-lg font-medium transition-all ${
                activeSection === section.id
                  ? "bg-ds-text text-ds-bg"
                  : "text-ds-muted hover:text-ds-text hover:bg-ds-surface/50"
              }`}
            >
              <section.icon className="w-5 h-5" />
              <span className="text-xs">{section.label}</span>
            </button>
          ))}
        </div>

        {/* ==================== SECTION 1: WARM-UP ==================== */}
        {activeSection === "warmup" && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-ds-text mb-2">🎯 Warm-up</h2>
              <p className="text-ds-muted">Listen and read the dialogue</p>
            </div>

            {/* Dialogue Card */}
            {lesson.warmup?.dialogue && (
              <div className="bg-ds-surface/30 rounded-2xl p-6 border border-ds-border/30">
                <div className="space-y-4">
                  {lesson.warmup.dialogue.map((line, index) => (
                    <div
                      key={index}
                      className={`flex gap-4 ${
                        line.speaker === "B" ||
                        line.speaker === "You" ||
                        line.speaker === "Customer" ||
                        line.speaker === "Patient" ||
                        line.speaker === "Tourist" ||
                        line.speaker === "Student"
                          ? "flex-row-reverse"
                          : ""
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                          line.speaker === "B" ||
                          line.speaker === "You" ||
                          line.speaker === "Customer" ||
                          line.speaker === "Patient" ||
                          line.speaker === "Tourist" ||
                          line.speaker === "Student"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {line.speaker.charAt(0)}
                      </div>
                      <div
                        className={`flex-1 max-w-md ${
                          line.speaker === "B" ||
                          line.speaker === "You" ||
                          line.speaker === "Customer" ||
                          line.speaker === "Patient" ||
                          line.speaker === "Tourist" ||
                          line.speaker === "Student"
                            ? "text-right"
                            : ""
                        }`}
                      >
                        <div
                          className={`inline-block p-4 rounded-2xl ${
                            line.speaker === "B" ||
                            line.speaker === "You" ||
                            line.speaker === "Customer" ||
                            line.speaker === "Patient" ||
                            line.speaker === "Tourist" ||
                            line.speaker === "Student"
                              ? "bg-emerald-500/20 rounded-tr-none"
                              : "bg-ds-surface rounded-tl-none"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <p className="text-ds-text font-medium">{line.text}</p>
                            <button
                              onClick={() => speakGerman(line.text)}
                              className="p-1 rounded-full hover:bg-ds-bg/50 transition-colors"
                            >
                              <HiOutlineVolumeUp className="w-4 h-4 text-ds-muted" />
                            </button>
                          </div>
                          <p className="text-ds-muted text-sm">{line.translation?.en}</p>
                          <p className="text-ds-border text-xs font-bangla mt-1">{line.translation?.bn}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Learning Objectives */}
            {lesson.objectives && (
              <div className="bg-ds-surface/20 rounded-2xl p-6 border border-ds-border/20">
                <h3 className="text-lg font-semibold text-ds-text mb-4 flex items-center gap-2">
                  <HiOutlineStar className="w-5 h-5 text-yellow-400" />
                  What you'll learn
                </h3>
                <ul className="space-y-2">
                  {lesson.objectives.map((obj, i) => (
                    <li key={i} className="flex items-center gap-3 text-ds-muted">
                      <HiOutlineCheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      {obj}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => setActiveSection("vocabulary")}
              className="w-full py-4 rounded-xl bg-ds-text text-ds-bg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
            >
              Continue to Vocabulary
              <HiOutlineArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* ==================== SECTION 2: VOCABULARY ==================== */}
        {activeSection === "vocabulary" && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-ds-text mb-2">📚 Vocabulary</h2>
              <p className="text-ds-muted">Tap cards to flip • Click 🔊 for pronunciation</p>
            </div>

            {/* Words Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {words.map((word) => {
                const isFlipped = flippedCards[word._id];
                return (
                  <div
                    key={word._id}
                    onClick={() => toggleCardFlip(word._id)}
                    className="group h-44 cursor-pointer perspective-1000"
                  >
                    <div
                      className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
                        isFlipped ? "rotate-y-180" : ""
                      }`}
                    >
                      {/* Front */}
                      <div className="absolute inset-0 backface-hidden">
                        <div className="h-full p-5 rounded-xl bg-gradient-to-br from-ds-surface to-ds-surface/50 border border-ds-border/30 flex flex-col justify-between hover:border-ds-border transition-colors">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-ds-border uppercase">{word.partOfSpeech}</span>
                              {word.article && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-ds-bg/50 text-ds-muted">
                                  {word.article}
                                </span>
                              )}
                            </div>
                            <h3 className="text-2xl font-bold text-ds-text">{word.german}</h3>
                          </div>
                          <div className="flex items-center justify-between">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                speakGerman(word.german);
                              }}
                              className="p-2 rounded-lg bg-ds-bg/50 text-ds-muted hover:text-ds-text transition-colors"
                            >
                              <HiOutlineVolumeUp className="w-5 h-5" />
                            </button>
                            <span className="text-xs text-ds-border">Tap to flip</span>
                          </div>
                        </div>
                      </div>
                      {/* Back */}
                      <div className="absolute inset-0 backface-hidden rotate-y-180">
                        <div className="h-full p-5 rounded-xl bg-gradient-to-br from-emerald-500/10 to-ds-surface/50 border border-emerald-500/30 flex flex-col justify-center">
                          <div className="space-y-3 text-center">
                            <div>
                              <span className="text-xs text-ds-border">English</span>
                              <p className="text-lg text-ds-text font-medium">{word.english}</p>
                            </div>
                            <div>
                              <span className="text-xs text-ds-border">বাংলা</span>
                              <p className="text-lg text-ds-text font-bangla">{word.bengali}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {words.length === 0 && (
              <div className="text-center py-12 bg-ds-surface/30 rounded-2xl">
                <HiOutlineBookOpen className="w-12 h-12 text-ds-border mx-auto mb-3" />
                <p className="text-ds-muted">No vocabulary for this lesson yet</p>
              </div>
            )}

            <button
              onClick={() => setActiveSection("grammar")}
              className="w-full py-4 rounded-xl bg-ds-text text-ds-bg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
            >
              Continue to Grammar
              <HiOutlineArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* ==================== SECTION 3: GRAMMAR ==================== */}
        {activeSection === "grammar" && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-ds-text mb-2">📖 Grammar</h2>
              <p className="text-ds-muted">One simple rule at a time</p>
            </div>

            {lesson.grammar && (
              <div className="bg-ds-surface/30 rounded-2xl border border-ds-border/30 overflow-hidden">
                <button
                  onClick={() => setExpandedGrammar(!expandedGrammar)}
                  className="w-full p-6 flex items-center justify-between hover:bg-ds-surface/20 transition-colors"
                >
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-ds-text">{lesson.grammar.title?.en}</h3>
                    <p className="text-ds-muted font-bangla">{lesson.grammar.title?.bn}</p>
                  </div>
                  {expandedGrammar ? (
                    <HiOutlineChevronUp className="w-6 h-6 text-ds-muted" />
                  ) : (
                    <HiOutlineChevronDown className="w-6 h-6 text-ds-muted" />
                  )}
                </button>

                {expandedGrammar && (
                  <div className="px-6 pb-6 space-y-6">
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                      <p className="text-ds-text mb-2">{lesson.grammar.explanation?.en}</p>
                      <p className="text-ds-muted text-sm font-bangla">{lesson.grammar.explanation?.bn}</p>
                    </div>

                    <div className="space-y-3">
                      {lesson.grammar.rules?.map((rule, i) => (
                        <div
                          key={i}
                          className="p-4 rounded-xl bg-ds-bg/50 border border-ds-border/20 flex flex-col md:flex-row md:items-center gap-3"
                        >
                          <div className="flex-1">
                            <p className="text-ds-text font-medium">{rule.rule}</p>
                          </div>
                          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-ds-surface">
                            <span className="text-emerald-400 font-mono">{rule.example}</span>
                            <button
                              onClick={() => speakGerman(rule.example)}
                              className="p-1 rounded hover:bg-ds-bg/50"
                            >
                              <HiOutlineVolumeUp className="w-4 h-4 text-ds-muted" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setActiveSection("practice")}
              className="w-full py-4 rounded-xl bg-ds-text text-ds-bg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
            >
              Continue to Practice
              <HiOutlineArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* ==================== SECTION 4: PRACTICE ==================== */}
        {activeSection === "practice" && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-ds-text mb-2">✍️ Practice</h2>
              <p className="text-ds-muted">Quick exercises to reinforce learning</p>
            </div>

            {exercises.length > 0 ? (
              <div className="space-y-4">
                {exercises.slice(0, 3).map((exercise, index) => (
                  <div
                    key={exercise._id || index}
                    className="bg-ds-surface/30 rounded-xl p-6 border border-ds-border/30"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg bg-ds-muted/20 flex items-center justify-center text-ds-muted font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-ds-text font-medium mb-4">
                          {exercise.question?.en || exercise.question}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {exercise.options?.map((option, optIndex) => (
                            <button
                              key={optIndex}
                              className="p-3 rounded-lg border border-ds-border/30 text-ds-text text-left hover:bg-ds-surface hover:border-ds-border transition-all"
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-ds-surface/30 rounded-2xl p-8 border border-ds-border/30 text-center">
                <HiOutlinePuzzle className="w-16 h-16 text-ds-muted mx-auto mb-4" />
                <h3 className="text-xl font-bold text-ds-text mb-2">Practice Coming Soon</h3>
                <p className="text-ds-muted">Interactive exercises will be added here</p>
              </div>
            )}

            <button
              onClick={() => setActiveSection("conversation")}
              className="w-full py-4 rounded-xl bg-ds-text text-ds-bg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
            >
              Continue to Conversation
              <HiOutlineArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* ==================== SECTION 5: CONVERSATION ==================== */}
        {activeSection === "conversation" && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-ds-text mb-2">💬 Conversation</h2>
              <p className="text-ds-muted">Real-life situation practice</p>
            </div>

            {lesson.conversation && (
              <div className="bg-ds-surface/30 rounded-2xl p-6 border border-ds-border/30">
                {/* Situation */}
                <div className="mb-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                  <p className="text-ds-text font-medium">
                    📍 Situation: {lesson.conversation.situation?.en}
                  </p>
                  <p className="text-ds-muted text-sm font-bangla">{lesson.conversation.situation?.bn}</p>
                </div>

                {/* Dialogue */}
                <div className="space-y-4">
                  {lesson.conversation.dialogue?.map((line, index) => (
                    <div
                      key={index}
                      className={`flex gap-4 ${
                        line.speaker === "B" || line.speaker === "You" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                          line.speaker === "B" || line.speaker === "You"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-purple-500/20 text-purple-400"
                        }`}
                      >
                        {line.speaker.charAt(0)}
                      </div>
                      <div
                        className={`flex-1 max-w-md ${
                          line.speaker === "B" || line.speaker === "You" ? "text-right" : ""
                        }`}
                      >
                        <div
                          className={`inline-block p-4 rounded-2xl ${
                            line.speaker === "B" || line.speaker === "You"
                              ? "bg-emerald-500/20 rounded-tr-none"
                              : "bg-purple-500/10 rounded-tl-none"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <p className="text-ds-text font-medium">{line.text}</p>
                            <button
                              onClick={() => speakGerman(line.text)}
                              className="p-1 rounded-full hover:bg-ds-bg/50 transition-colors"
                            >
                              <HiOutlineVolumeUp className="w-4 h-4 text-ds-muted" />
                            </button>
                          </div>
                          <p className="text-ds-muted text-sm">{line.translation?.en}</p>
                          <p className="text-ds-border text-xs font-bangla mt-1">{line.translation?.bn}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setActiveSection("quiz")}
              className="w-full py-4 rounded-xl bg-ds-text text-ds-bg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
            >
              Take the Quiz
              <HiOutlineArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* ==================== SECTION 6: QUIZ ==================== */}
        {activeSection === "quiz" && (
          <div className="space-y-6 animate-fade-in">
            {!quizStarted && !quizCompleted && (
              <div className="text-center py-16 bg-ds-surface/30 rounded-2xl border border-ds-border/30">
                <HiOutlineClipboardCheck className="w-16 h-16 text-ds-muted mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-ds-text mb-2">📝 Lesson Quiz</h2>
                <p className="text-ds-muted mb-2">{exercises.length} questions</p>
                <p className="text-ds-border text-sm mb-6">Score 70% or higher to complete this lesson</p>
                <button
                  onClick={startQuiz}
                  disabled={exercises.length === 0}
                  className="px-8 py-4 rounded-xl bg-ds-text text-ds-bg font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {exercises.length === 0 ? "No Quiz Available" : "Start Quiz"}
                </button>
              </div>
            )}

            {quizStarted && !quizCompleted && exercises.length > 0 && (
              <div>
                {/* Progress */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-ds-muted mb-2">
                    <span>
                      Question {currentQuestionIndex + 1} of {exercises.length}
                    </span>
                    <span>
                      Score: {score}/{currentQuestionIndex + (isAnswerChecked ? 1 : 0)}
                    </span>
                  </div>
                  <div className="h-2 bg-ds-surface rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-ds-muted to-ds-border transition-all"
                      style={{ width: `${((currentQuestionIndex + 1) / exercises.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Question */}
                <div className="bg-ds-surface/30 rounded-2xl p-8 mb-6 border border-ds-border/30">
                  <span className="text-xs text-ds-border uppercase tracking-wider">
                    {exercises[currentQuestionIndex]?.type || "Multiple Choice"}
                  </span>
                  <h3 className="text-xl font-bold text-ds-text mt-3 mb-6">
                    {exercises[currentQuestionIndex]?.question?.en ||
                      exercises[currentQuestionIndex]?.question}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {exercises[currentQuestionIndex]?.options?.map((option, index) => {
                      const isSelected = selectedAnswer === option;
                      const isCorrect = option === exercises[currentQuestionIndex]?.correctAnswer;
                      const showResult = isAnswerChecked;

                      return (
                        <button
                          key={index}
                          onClick={() => !isAnswerChecked && checkAnswer(option)}
                          disabled={isAnswerChecked}
                          className={`p-4 rounded-xl text-left font-medium transition-all ${
                            showResult
                              ? isCorrect
                                ? "bg-green-500/20 border-2 border-green-500 text-green-400"
                                : isSelected
                                ? "bg-red-500/20 border-2 border-red-500 text-red-400"
                                : "bg-ds-surface border-2 border-ds-border/30 text-ds-muted"
                              : isSelected
                              ? "bg-ds-text text-ds-bg border-2 border-ds-text"
                              : "bg-ds-surface border-2 border-ds-border/30 text-ds-text hover:border-ds-border"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-ds-bg/30 flex items-center justify-center text-sm">
                              {String.fromCharCode(65 + index)}
                            </span>
                            <span>{option}</span>
                            {showResult && isCorrect && <HiOutlineCheckCircle className="w-5 h-5 ml-auto" />}
                            {showResult && isSelected && !isCorrect && (
                              <HiOutlineXCircle className="w-5 h-5 ml-auto" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {isAnswerChecked && (
                  <button
                    onClick={nextQuestion}
                    className="w-full py-4 rounded-xl bg-ds-text text-ds-bg font-bold text-lg flex items-center justify-center gap-2 hover:shadow-xl transition-all"
                  >
                    {currentQuestionIndex < exercises.length - 1 ? (
                      <>
                        Next Question <HiOutlineArrowRight className="w-5 h-5" />
                      </>
                    ) : (
                      <>
                        See Results <HiOutlineStar className="w-5 h-5" />
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Results */}
            {quizCompleted && (
              <div className="text-center py-12 bg-ds-surface/30 rounded-2xl border border-ds-border/30">
                <div
                  className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
                    finalScorePercent >= 70 ? "bg-green-500/20" : "bg-red-500/20"
                  }`}
                >
                  {finalScorePercent >= 70 ? (
                    <HiOutlineAcademicCap className="w-12 h-12 text-green-400" />
                  ) : (
                    <HiOutlineRefresh className="w-12 h-12 text-red-400" />
                  )}
                </div>

                <h2 className="text-3xl font-bold text-ds-text mb-2">
                  {finalScorePercent >= 70 ? "Congratulations! 🎉" : "Keep Practicing!"}
                </h2>

                <div className="text-5xl font-black text-ds-text my-6">{finalScorePercent}%</div>

                <p className="text-ds-muted mb-2">
                  You got {score} out of {exercises.length} correct
                </p>

                {finalScorePercent >= 70 ? (
                  <p className="text-green-400 mb-8">✓ Lesson completed! Next lesson unlocked.</p>
                ) : (
                  <p className="text-ds-border mb-8">You need 70% to complete this lesson</p>
                )}

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => {
                      setQuizCompleted(false);
                      setQuizStarted(false);
                      setActiveSection("vocabulary");
                    }}
                    className="px-6 py-3 rounded-xl border-2 border-ds-border/30 text-ds-text font-semibold hover:bg-ds-surface transition-all"
                  >
                    Review Lesson
                  </button>
                  <button
                    onClick={startQuiz}
                    className="px-6 py-3 rounded-xl bg-ds-text text-ds-bg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <HiOutlineRefresh className="w-5 h-5" />
                    Try Again
                  </button>
                  {finalScorePercent >= 70 && (
                    <Link
                      to="/courses"
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold hover:shadow-lg transition-all"
                    >
                      Next Lesson →
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonDetail;
