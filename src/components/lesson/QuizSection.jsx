import { useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineClipboardCheck,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineArrowRight,
  HiOutlineArrowLeft,
  HiOutlineRefresh,
  HiOutlineStar,
  HiOutlineAcademicCap,
} from "react-icons/hi";

const QuizSection = ({ exercises, onComplete, onReviewLesson }) => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setQuizCompleted(false);
    setSelectedAnswer(null);
  };

  const selectAnswer = (answer) => {
    setSelectedAnswer(answer);
  };

  const nextQuestion = () => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = selectedAnswer;
    setUserAnswers(newAnswers);

    if (currentQuestionIndex < exercises.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(newAnswers[currentQuestionIndex + 1] || null);
    } else {
      completeQuiz(newAnswers);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      const newAnswers = [...userAnswers];
      newAnswers[currentQuestionIndex] = selectedAnswer;
      setUserAnswers(newAnswers);

      setCurrentQuestionIndex((prev) => prev - 1);
      setSelectedAnswer(newAnswers[currentQuestionIndex - 1] || null);
    }
  };

  const completeQuiz = (answers) => {
    let correctCount = 0;
    answers.forEach((answer, index) => {
      if (answer === exercises[index]?.correctAnswer) {
        correctCount++;
      }
    });

    setQuizCompleted(true);
    const finalScore = Math.round((correctCount / exercises.length) * 100);

    if (onComplete) {
      onComplete(finalScore);
    }
  };

  const calculateScore = () => {
    let correctCount = 0;
    userAnswers.forEach((answer, index) => {
      if (answer === exercises[index]?.correctAnswer) {
        correctCount++;
      }
    });
    return correctCount;
  };

  const score = calculateScore();
  const finalScorePercent = exercises.length > 0 ? Math.round((score / exercises.length) * 100) : 0;

  // Quiz Start Screen
  if (!quizStarted && !quizCompleted) {
    return (
      <div className="space-y-6 animate-fade-in">
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
      </div>
    );
  }

  // Quiz In Progress
  if (quizStarted && !quizCompleted && exercises.length > 0) {
    return (
      <div className="animate-fade-in">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-ds-muted mb-2">
            <span>
              Question {currentQuestionIndex + 1} of {exercises.length}
            </span>
            <span>{userAnswers.filter((a) => a !== null && a !== undefined).length} answered</span>
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
            {exercises[currentQuestionIndex]?.type || "MCQ"}
          </span>
          <h3 className="text-xl font-bold text-ds-text mt-3 mb-6">
            {exercises[currentQuestionIndex]?.question?.en || exercises[currentQuestionIndex]?.question}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {exercises[currentQuestionIndex]?.options?.map((option, index) => {
              const isSelected = selectedAnswer === option;

              return (
                <button
                  key={index}
                  onClick={() => selectAnswer(option)}
                  className={`p-4 rounded-xl text-left font-medium transition-all ${
                    isSelected
                      ? "bg-ds-text text-ds-bg border-2 border-ds-text"
                      : "bg-ds-surface border-2 border-ds-border/30 text-ds-text hover:border-ds-border"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                        isSelected ? "bg-ds-bg/30" : "bg-ds-bg/30"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                    {isSelected && <HiOutlineCheckCircle className="w-5 h-5 ml-auto" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {currentQuestionIndex > 0 && (
            <button
              onClick={prevQuestion}
              className="px-6 py-4 rounded-xl border-2 border-ds-border/30 text-ds-text font-semibold hover:bg-ds-surface transition-all flex items-center gap-2"
            >
              <HiOutlineArrowLeft className="w-5 h-5" />
              Previous
            </button>
          )}

          <button
            onClick={nextQuestion}
            disabled={!selectedAnswer}
            className="flex-1 py-4 rounded-xl bg-ds-text text-ds-bg font-bold text-lg flex items-center justify-center gap-2 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestionIndex < exercises.length - 1 ? (
              <>
                Next Question <HiOutlineArrowRight className="w-5 h-5" />
              </>
            ) : (
              <>
                Submit Quiz <HiOutlineStar className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Quiz Results
  if (quizCompleted) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Score Card */}
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
              onClick={onReviewLesson}
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

        {/* Answer Review */}
        <div className="bg-ds-surface/30 rounded-2xl border border-ds-border/30 p-6">
          <h3 className="text-xl font-bold text-ds-text mb-6">📋 Answer Review</h3>
          <div className="space-y-4">
            {exercises.map((exercise, index) => {
              const userAnswer = userAnswers[index];
              const isCorrect = userAnswer === exercise.correctAnswer;

              return (
                <div
                  key={index}
                  className={`p-4 rounded-xl border-2 ${
                    isCorrect ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                        isCorrect ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-ds-text font-medium mb-2">
                        {exercise.question?.en || exercise.question}
                      </p>

                      <div className="space-y-1 text-sm">
                        <p className={isCorrect ? "text-green-400" : "text-red-400"}>
                          Your answer: {userAnswer || "Not answered"}
                          {isCorrect && " ✓"}
                        </p>
                        {!isCorrect && (
                          <p className="text-green-400">Correct answer: {exercise.correctAnswer}</p>
                        )}
                      </div>
                    </div>
                    {isCorrect ? (
                      <HiOutlineCheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                    ) : (
                      <HiOutlineXCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default QuizSection;
