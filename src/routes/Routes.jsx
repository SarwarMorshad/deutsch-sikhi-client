import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import PrivateRoute from "./PrivateRoute";

// Public Pages
import Home from "../pages/public/Home";
import Page404 from "../pages/Page404";

// Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyEmail from "../pages/auth/VerifyEmail";
import Courses from "../pages/public/Courses";
import LessonDetail from "../pages/public/LessonDetail";

const router = createBrowserRouter([
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
            <div className="p-8 text-ds-text">Profile Page - Coming Soon</div>
          </PrivateRoute>
        ),
      },
    ],
  },
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
]);

export default router;
