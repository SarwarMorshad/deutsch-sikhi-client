import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

// Public Pages
import Home from "../pages/public/Home";
import Courses from "../pages/public/Courses";
import LessonDetail from "../pages/public/LessonDetail";
import Page404 from "../pages/Page404";

// Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyEmail from "../pages/auth/VerifyEmail";
import ForgotPassword from "../pages/auth/ForgotPassword";

// User Pages
import Profile from "../pages/user/Profile";
import Dashboard from "../pages/user/Dashboard";

// Public Pages (some require auth)
import Vocabulary from "../pages/public/Vocabulary";
import Practice from "../pages/public/Practice";
import Leaderboard from "../pages/public/Leaderboard";
import Grammar from "../pages/public/Grammar";
import GrammarDetail from "../pages/public/GrammarDetail";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminLevels from "../pages/admin/AdminLevels";
import AdminLessons from "../pages/admin/AdminLessons";
import AdminVocabulary from "../pages/admin/AdminVocabulary";
import AdminExercises from "../pages/admin/AdminExercises";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminSettings from "../pages/admin/AdminSettings";
import AdminGrammarList from "../pages/admin/grammar/AdminGrammarList";
import AdminGrammarEdit from "../pages/admin/grammar/AdminGrammarEdit";

const router = createBrowserRouter([
  // Main Site Routes
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <Page404 />,
    children: [
      // ===== PUBLIC ROUTES (No Auth Required) =====
      {
        index: true,
        element: <Home />,
      },
      {
        path: "courses",
        element: <Courses />,
      },
      {
        path: "leaderboard",
        element: <Leaderboard />,
      },

      // ===== PROTECTED ROUTES (Auth Required) =====
      {
        path: "lessons/:id",
        element: (
          <PrivateRoute>
            <LessonDetail />
          </PrivateRoute>
        ),
      },
      {
        path: "vocabulary",
        element: (
          <PrivateRoute>
            <Vocabulary />
          </PrivateRoute>
        ),
      },
      {
        path: "practice",
        element: (
          <PrivateRoute>
            <Practice />
          </PrivateRoute>
        ),
      },
      {
        path: "grammar",
        element: (
          <PrivateRoute>
            <Grammar />
          </PrivateRoute>
        ),
      },
      {
        path: "grammar/:slug",
        element: (
          <PrivateRoute>
            <GrammarDetail />
          </PrivateRoute>
        ),
      },
      {
        path: "dashboard",
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "progress",
        element: (
          <PrivateRoute>
            <div className="p-8 text-ds-text">Progress Page - Coming Soon</div>
          </PrivateRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
    ],
  },

  // Auth Routes
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/verify-email",
    element: <VerifyEmail />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },

  // Admin Routes
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "levels",
        element: <AdminLevels />,
      },
      {
        path: "lessons",
        element: <AdminLessons />,
      },
      {
        path: "vocabulary",
        element: <AdminVocabulary />,
      },
      {
        path: "grammar",
        element: <AdminGrammarList />,
      },
      {
        path: "grammar/:id",
        element: <AdminGrammarEdit />,
      },
      {
        path: "exercises",
        element: <AdminExercises />,
      },
      {
        path: "users",
        element: <AdminUsers />,
      },
      {
        path: "settings",
        element: <AdminSettings />,
      },
    ],
  },
]);

export default router;
