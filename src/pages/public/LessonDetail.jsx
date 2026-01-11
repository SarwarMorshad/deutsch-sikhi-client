import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLanguage from "../../hooks/useLanguage";
import { AuthContext } from "../../context/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";

// Import lesson components
import {
  LessonHeader,
  SectionNav,
  WarmupSection,
  VocabularySection,
  GrammarSection,
  PracticeSection,
  ConversationSection,
  QuizSection,
} from "../../components/lesson";

const LessonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isBengali } = useLanguage();
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  // Data states
  const [lesson, setLesson] = useState(null);
  const [words, setWords] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextLesson, setNextLesson] = useState(null);

  // UI states
  const [activeSection, setActiveSection] = useState("warmup");

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

        // Fetch next lesson in the same level
        if (lessonRes.data.data?.levelId) {
          try {
            const levelLessonsRes = await axiosSecure.get(`/levels/${lessonRes.data.data.levelId}/lessons`);
            const levelLessons = levelLessonsRes.data.data || [];
            const currentIndex = levelLessons.findIndex((l) => l._id === id);
            if (currentIndex !== -1 && currentIndex < levelLessons.length - 1) {
              setNextLesson(levelLessons[currentIndex + 1]);
            }
          } catch (err) {
            console.error("Error fetching next lesson:", err);
          }
        }
      } catch (error) {
        console.error("Error fetching lesson:", error);
        toast.error(t("toast.errorOccurred"));
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

  // Section navigation
  const goToSection = (sectionId) => {
    setActiveSection(sectionId);
    // Scroll to top when changing sections
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Quiz completion handler - Save progress to database
  const handleQuizComplete = async (score) => {
    if (!user) {
      toast.error(t("toast.pleaseLogin"));
      return;
    }

    try {
      // Save progress using the progress endpoint
      await axiosSecure.post("/progress", {
        lessonId: id,
        score: score,
      });

      if (score >= 70) {
        toast.success(
          isBengali ? "🎉 পাঠ সম্পন্ন! অগ্রগতি সংরক্ষিত হয়েছে।" : "🎉 Lesson completed! Progress saved."
        );
      } else {
        toast.success(
          isBengali
            ? "অগ্রগতি সংরক্ষিত হয়েছে। আবার চেষ্টা করুন!"
            : "Progress saved. Try again for a better score!"
        );
      }
    } catch (error) {
      console.error("Error saving progress:", error);
      toast.error(t("toast.errorOccurred"));
    }
  };

  // Navigate to next lesson
  const goToNextLesson = () => {
    if (nextLesson) {
      navigate(`/lessons/${nextLesson._id}`);
    } else {
      navigate("/courses");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-ds-muted border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={`text-ds-muted ${isBengali ? "font-bangla" : ""}`}>{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className={`text-ds-muted mb-4 ${isBengali ? "font-bangla" : ""}`}>
            {isBengali ? "পাঠ পাওয়া যায়নি" : "Lesson not found"}
          </p>
          <Link to="/courses" className={`text-ds-text hover:underline ${isBengali ? "font-bangla" : ""}`}>
            ← {t("lesson.backToCourses")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <LessonHeader lesson={lesson} wordsCount={words.length} exercisesCount={exercises.length} />

        {/* Section Navigation */}
        <SectionNav activeSection={activeSection} onSectionChange={goToSection} />

        {/* Section Content */}
        {activeSection === "warmup" && (
          <WarmupSection lesson={lesson} speakGerman={speakGerman} onNext={() => goToSection("vocabulary")} />
        )}

        {activeSection === "vocabulary" && (
          <VocabularySection words={words} speakGerman={speakGerman} onNext={() => goToSection("grammar")} />
        )}

        {activeSection === "grammar" && (
          <GrammarSection lesson={lesson} speakGerman={speakGerman} onNext={() => goToSection("practice")} />
        )}

        {activeSection === "practice" && (
          <PracticeSection
            words={words}
            speakGerman={speakGerman}
            onNext={() => goToSection("conversation")}
          />
        )}

        {activeSection === "conversation" && (
          <ConversationSection lesson={lesson} speakGerman={speakGerman} onNext={() => goToSection("quiz")} />
        )}

        {activeSection === "quiz" && (
          <QuizSection
            exercises={exercises}
            onComplete={handleQuizComplete}
            onReviewLesson={() => goToSection("vocabulary")}
            onNextLesson={goToNextLesson}
            nextLesson={nextLesson}
          />
        )}
      </div>
    </div>
  );
};

export default LessonDetail;
