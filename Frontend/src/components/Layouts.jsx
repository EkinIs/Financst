import { Outlet } from "react-router";
import { Header } from "./Header/Header";
import { Footer } from "./Footer";

export const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-bg-white dark:bg-midnight text-gray-900 dark:text-gray-100">
      <Header />
      <main className="grow flex flex-col mt-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
