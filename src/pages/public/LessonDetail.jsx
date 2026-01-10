import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import {
  HiOutlineArrowLeft,
  HiOutlineVolumeUp,
  HiOutlineBookOpen,
  HiOutlinePuzzle,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineArrowRight,
  HiOutlineLightningBolt,
  HiOutlineRefresh,
  HiOutlineStar,
  HiOutlineAcademicCap,
} from "react-icons/hi";
import toast from "react-hot-toast";

const LessonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  // States
  const [lesson, setLesson] = useState(null);
  const [words, setWords] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("words"); // words | exercises | quiz
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [flippedCards, setFlippedCards] = useState({});

  // Quiz states
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

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

  // Text-to-speech for German words
  const speakWord = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "de-DE";
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  // Toggle card flip
  const toggleCardFlip = (wordId) => {
    setFlippedCards((prev) => ({
      ...prev,
      [wordId]: !prev[wordId],
    }));
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

  const checkAnswer = async (exerciseId, answer) => {
    setSelectedAnswer(answer);
    setIsAnswerChecked(true);

    try {
      const response = await axiosSecure.post(`/exercises/${exerciseId}/check`, {
        answer,
      });

      if (response.data.correct) {
        setScore((prev) => prev + 1);
        toast.success("Correct! 🎉");
      } else {
        toast.error(`Wrong! Correct answer: ${response.data.correctAnswer}`);
      }
    } catch (error) {
      // Fallback local check
      const exercise = exercises[currentQuestionIndex];
      const isCorrect = answer === exercise.correctAnswer;
      if (isCorrect) {
        setScore((prev) => prev + 1);
        toast.success("Correct! 🎉");
      } else {
        toast.error(`Wrong! Correct answer: ${exercise.correctAnswer}`);
      }
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
    const finalScore = Math.round((score / exercises.length) * 100);

    if (user) {
      try {
        await axiosSecure.post(`/lessons/${id}/complete`, {
          score: finalScore,
        });
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

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-ds-muted hover:text-ds-text transition-colors mb-4"
          >
            <HiOutlineArrowLeft className="w-5 h-5" />
            Back to Courses
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-full bg-ds-surface text-ds-muted text-sm">
                  {lesson.levelCode || "A1"}
                </span>
                <span className="text-ds-border">•</span>
                <span className="text-ds-muted text-sm">Lesson {lesson.order || 1}</span>
              </div>
              <h1 className="text-3xl font-bold text-ds-text mb-1">{lesson.title?.en}</h1>
              <p className="text-ds-muted font-bangla">{lesson.title?.bn}</p>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="text-center px-4 py-2 bg-ds-surface/50 rounded-xl">
                <div className="text-2xl font-bold text-ds-text">{words.length}</div>
                <div className="text-ds-muted">Words</div>
              </div>
              <div className="text-center px-4 py-2 bg-ds-surface/50 rounded-xl">
                <div className="text-2xl font-bold text-ds-text">{exercises.length}</div>
                <div className="text-ds-muted">Exercises</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 p-1 bg-ds-surface/30 rounded-xl">
          {[
            { id: "words", label: "Words", icon: HiOutlineBookOpen },
            { id: "exercises", label: "Quiz", icon: HiOutlinePuzzle },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === "exercises") setQuizStarted(false);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === tab.id ? "bg-ds-text text-ds-bg" : "text-ds-muted hover:text-ds-text"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Words Tab */}
        {activeTab === "words" && (
          <div className="space-y-6">
            {/* Word Navigation */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-ds-muted">Click cards to flip • Click 🔊 to hear pronunciation</p>
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className="text-sm text-ds-muted hover:text-ds-text transition-colors"
              >
                {showTranslation ? "Hide" : "Show"} all translations
              </button>
            </div>

            {/* Words Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {words.map((word, index) => {
                const isFlipped = flippedCards[word._id] || showTranslation;

                return (
                  <div
                    key={word._id}
                    onClick={() => toggleCardFlip(word._id)}
                    className="group relative h-48 cursor-pointer perspective-1000"
                  >
                    <div
                      className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
                        isFlipped ? "rotate-y-180" : ""
                      }`}
                    >
                      {/* Front - German */}
                      <div className="absolute inset-0 backface-hidden">
                        <div className="h-full p-6 rounded-2xl bg-gradient-to-br from-ds-surface to-ds-surface/50 border border-ds-border/30 flex flex-col justify-between">
                          <div>
                            <span className="text-xs text-ds-border uppercase tracking-wider">
                              {word.partOfSpeech || "Wort"}
                            </span>
                            <h3 className="text-2xl font-bold text-ds-text mt-2">{word.german}</h3>
                            {word.article && <span className="text-ds-muted text-sm">({word.article})</span>}
                          </div>
                          <div className="flex items-center justify-between">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                speakWord(word.german);
                              }}
                              className="p-2 rounded-lg bg-ds-bg/50 text-ds-muted hover:text-ds-text hover:bg-ds-bg transition-colors"
                            >
                              <HiOutlineVolumeUp className="w-5 h-5" />
                            </button>
                            <span className="text-xs text-ds-border">Click to flip</span>
                          </div>
                        </div>
                      </div>

                      {/* Back - Translations */}
                      <div className="absolute inset-0 backface-hidden rotate-y-180">
                        <div className="h-full p-6 rounded-2xl bg-gradient-to-br from-ds-muted/20 to-ds-border/20 border border-ds-border/30 flex flex-col justify-between">
                          <div>
                            <div className="mb-3">
                              <span className="text-xs text-ds-border">English</span>
                              <p className="text-lg text-ds-text font-medium">{word.english}</p>
                            </div>
                            <div>
                              <span className="text-xs text-ds-border">বাংলা</span>
                              <p className="text-lg text-ds-text font-bangla">{word.bengali}</p>
                            </div>
                          </div>
                          {word.example && (
                            <div className="pt-3 border-t border-ds-border/30">
                              <p className="text-sm text-ds-muted italic">"{word.example.de}"</p>
                            </div>
                          )}
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
                <p className="text-ds-muted">No words in this lesson yet</p>
              </div>
            )}

            {/* Start Quiz CTA */}
            {words.length > 0 && exercises.length > 0 && (
              <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-ds-surface to-ds-surface/50 border border-ds-border/30 text-center">
                <HiOutlineLightningBolt className="w-10 h-10 text-ds-muted mx-auto mb-3" />
                <h3 className="text-xl font-bold text-ds-text mb-2">Ready to test your knowledge?</h3>
                <p className="text-ds-muted mb-4">Take the quiz to unlock the next lesson</p>
                <button
                  onClick={() => {
                    setActiveTab("exercises");
                    startQuiz();
                  }}
                  className="px-6 py-3 rounded-xl bg-ds-text text-ds-bg font-semibold hover:shadow-lg transition-all"
                >
                  Start Quiz →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Quiz Tab */}
        {activeTab === "exercises" && (
          <div>
            {!quizStarted && !quizCompleted && (
              <div className="text-center py-16 bg-ds-surface/30 rounded-2xl">
                <HiOutlinePuzzle className="w-16 h-16 text-ds-muted mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-ds-text mb-2">Lesson Quiz</h2>
                <p className="text-ds-muted mb-2">{exercises.length} questions • Test what you learned</p>
                <p className="text-ds-border text-sm mb-6">Score 70% or higher to unlock the next lesson</p>
                <button
                  onClick={startQuiz}
                  disabled={exercises.length === 0}
                  className="px-8 py-4 rounded-xl bg-ds-text text-ds-bg font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  Start Quiz
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
                      style={{
                        width: `${((currentQuestionIndex + 1) / exercises.length) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Question Card */}
                <div className="bg-ds-surface/30 rounded-2xl p-8 mb-6">
                  <span className="text-xs text-ds-border uppercase tracking-wider">
                    {exercises[currentQuestionIndex]?.type || "Multiple Choice"}
                  </span>
                  <h3 className="text-2xl font-bold text-ds-text mt-3 mb-6">
                    {exercises[currentQuestionIndex]?.question?.en}
                  </h3>

                  {/* Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {exercises[currentQuestionIndex]?.options?.map((option, index) => {
                      const isSelected = selectedAnswer === option;
                      const isCorrect = option === exercises[currentQuestionIndex]?.correctAnswer;
                      const showResult = isAnswerChecked;

                      return (
                        <button
                          key={index}
                          onClick={() =>
                            !isAnswerChecked && checkAnswer(exercises[currentQuestionIndex]._id, option)
                          }
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

                {/* Next Button */}
                {isAnswerChecked && (
                  <button
                    onClick={nextQuestion}
                    className="w-full py-4 rounded-xl bg-ds-text text-ds-bg font-bold text-lg flex items-center justify-center gap-2 hover:shadow-xl transition-all"
                  >
                    {currentQuestionIndex < exercises.length - 1 ? (
                      <>
                        Next Question
                        <HiOutlineArrowRight className="w-5 h-5" />
                      </>
                    ) : (
                      <>
                        See Results
                        <HiOutlineStar className="w-5 h-5" />
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Quiz Results */}
            {quizCompleted && (
              <div className="text-center py-12 bg-ds-surface/30 rounded-2xl">
                <div
                  className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
                    score / exercises.length >= 0.7 ? "bg-green-500/20" : "bg-red-500/20"
                  }`}
                >
                  {score / exercises.length >= 0.7 ? (
                    <HiOutlineAcademicCap className="w-12 h-12 text-green-400" />
                  ) : (
                    <HiOutlineRefresh className="w-12 h-12 text-red-400" />
                  )}
                </div>

                <h2 className="text-3xl font-bold text-ds-text mb-2">
                  {score / exercises.length >= 0.7 ? "Congratulations! 🎉" : "Keep Practicing!"}
                </h2>

                <div className="text-5xl font-black text-ds-text my-6">
                  {Math.round((score / exercises.length) * 100)}%
                </div>

                <p className="text-ds-muted mb-2">
                  You got {score} out of {exercises.length} correct
                </p>

                {score / exercises.length >= 0.7 ? (
                  <p className="text-green-400 mb-8">✓ Next lesson unlocked!</p>
                ) : (
                  <p className="text-ds-border mb-8">You need 70% to unlock the next lesson</p>
                )}

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => {
                      setQuizCompleted(false);
                      setQuizStarted(false);
                      setActiveTab("words");
                    }}
                    className="px-6 py-3 rounded-xl border-2 border-ds-border/30 text-ds-text font-semibold hover:bg-ds-surface transition-all"
                  >
                    Review Words
                  </button>
                  <button
                    onClick={startQuiz}
                    className="px-6 py-3 rounded-xl bg-ds-text text-ds-bg font-semibold hover:shadow-lg transition-all"
                  >
                    <HiOutlineRefresh className="w-5 h-5 inline mr-2" />
                    Try Again
                  </button>
                  {score / exercises.length >= 0.7 && (
                    <Link
                      to="/courses"
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-ds-muted to-ds-border text-ds-bg font-semibold hover:shadow-lg transition-all"
                    >
                      Next Lesson →
                    </Link>
                  )}
                </div>
              </div>
            )}

            {exercises.length === 0 && (
              <div className="text-center py-12 bg-ds-surface/30 rounded-2xl">
                <HiOutlinePuzzle className="w-12 h-12 text-ds-border mx-auto mb-3" />
                <p className="text-ds-muted">No exercises in this lesson yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonDetail;
