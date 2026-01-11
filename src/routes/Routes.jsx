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

// User Pages
import Profile from "../pages/user/Profile";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminLevels from "../pages/admin/AdminLevels";
import AdminLessons from "../pages/admin/AdminLessons";
import AdminVocabulary from "../pages/admin/AdminVocabulary";
import AdminExercises from "../pages/admin/AdminExercises";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminSettings from "../pages/admin/AdminSettings";

const router = createBrowserRouter([
  // Main Site Routes
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <Page404 />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "courses",
        element: <Courses />,
      },
      {
        path: "lessons/:id",
        element: <LessonDetail />,
      },
      {
        path: "vocabulary",
        element: <div className="p-8 text-ds-text">Vocabulary Page - Coming Soon</div>,
      },
      {
        path: "practice",
        element: <div className="p-8 text-ds-text">Practice Page - Coming Soon</div>,
      },
      {
        path: "dashboard",
        element: (
          <PrivateRoute>
            <div className="p-8 text-ds-text">Dashboard - Coming Soon</div>
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
