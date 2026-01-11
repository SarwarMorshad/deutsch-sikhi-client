import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
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
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  // Data states
  const [lesson, setLesson] = useState(null);
  const [words, setWords] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Section navigation
  const goToSection = (sectionId) => {
    setActiveSection(sectionId);
  };

  // Quiz completion handler
  const handleQuizComplete = async (score) => {
    if (user) {
      try {
        await axiosSecure.post(`/lessons/${id}/complete`, { score });
        toast.success("Progress saved!");
      } catch (error) {
        console.error("Error saving progress:", error);
      }
    }
  };

  // Loading state
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

  // Not found state
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
          />
        )}
      </div>
    </div>
  );
};

export default LessonDetail;
