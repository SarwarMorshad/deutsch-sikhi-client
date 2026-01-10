import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

// Public Pages
import Home from "../pages/public/Home";
import Page404 from "../pages/Page404";

// Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

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
        element: <div className="p-8 text-ds-text">Courses Page - Coming Soon</div>,
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
        element: <div className="p-8 text-ds-text">Dashboard - Coming Soon</div>,
      },
      {
        path: "progress",
        element: <div className="p-8 text-ds-text">Progress Page - Coming Soon</div>,
      },
      {
        path: "profile",
        element: <div className="p-8 text-ds-text">Profile Page - Coming Soon</div>,
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
]);

export default router;
