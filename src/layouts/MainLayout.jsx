import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-ds-bg">
      {/* Main Content */}
      <main className="flex grow">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
