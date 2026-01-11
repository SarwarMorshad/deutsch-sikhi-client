import axios from "axios";
import auth from "../firebase/firebase.init";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

// Public axios instance (no auth required)
export const axiosPublic = axios.create({
  baseURL: API_URL,
});

// Get Firebase ID token
const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
};

/**
 * Auth API calls
 */
export const authAPI = {
  // Register/sync user to database
  register: async (userData) => {
    const token = await getAuthToken();
    const response = await axiosPublic.post("/auth/register", userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Get current user profile
  getMe: async () => {
    const token = await getAuthToken();
    const response = await axiosPublic.get("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};

/**
 * Public API calls (no auth required)
 */
export const publicAPI = {
  // Levels
  getLevels: async () => {
    const response = await axiosPublic.get("/levels");
    return response.data;
  },

  getLevel: async (id) => {
    const response = await axiosPublic.get(`/levels/${id}`);
    return response.data;
  },

  // Lessons
  getLessons: async () => {
    const response = await axiosPublic.get("/lessons");
    return response.data;
  },

  getLesson: async (id) => {
    const response = await axiosPublic.get(`/lessons/${id}`);
    return response.data;
  },

  getLessonWords: async (lessonId) => {
    const response = await axiosPublic.get(`/lessons/${lessonId}/words`);
    return response.data;
  },

  getLessonExercises: async (lessonId) => {
    const response = await axiosPublic.get(`/lessons/${lessonId}/exercises`);
    return response.data;
  },

  // Words
  getWords: async () => {
    const response = await axiosPublic.get("/words");
    return response.data;
  },

  getRandomWords: async (count = 10) => {
    const response = await axiosPublic.get(`/words/random/${count}`);
    return response.data;
  },

  // Settings
  getSettings: async () => {
    const response = await axiosPublic.get("/settings");
    return response.data;
  },
};

/**
 * Progress API calls (requires auth)
 */
export const progressAPI = {
  // Get user's progress summary
  getProgress: async (token) => {
    const response = await axiosPublic.get("/progress/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Get all completed lessons
  getCompletedLessons: async (token) => {
    const response = await axiosPublic.get("/progress/me/lessons", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Save lesson progress
  saveProgress: async (token, lessonId, score) => {
    const response = await axiosPublic.post(
      "/progress",
      { lessonId, score },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },
};

export default axiosPublic;
