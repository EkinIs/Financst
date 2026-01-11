import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router";
import { Suspense, lazy, useEffect } from "react";

import { MainPage } from "./pages/MainPage.jsx";
import { Loading } from "./pages/Loading.jsx";

import { useThemeStore } from "./ThemeController.js";
import { MainLayout } from "./components/Layouts.jsx";

import { useAuthStore } from "./controller/Auth.js";

// --- Lazy Imports ---
const Page404 = lazy(() =>
  import("./pages/Page404.jsx").then((module) => ({ default: module.Page404 })),
);

const AuthPage = lazy(() =>
  import("./pages/AuthPage.jsx").then((module) => ({
    default: module.AuthPage,
  })),
);
const UserHomePage = lazy(() =>
  import("./pages/User/UserHome.jsx").then((module) => ({
    default: module.UserHomePage,
  })),
);

const SettingsPage = lazy(() =>
  import("./pages/User/SettingsPage.jsx").then((module) => ({
    default: module.default,
  })),
);

const AboutUsPage = lazy(() =>
  import("./pages/AboutUs.jsx").then((module) => ({
    default: module.AboutUs,
  })),
);

const ContactPage = lazy(() =>
  import("./pages/Contact.jsx").then((module) => ({
    default: module.Contact,
  })),
);
const PrivacyPolicyPage = lazy(() =>
  import("./pages/PrivacyPolicy.jsx").then((module) => ({
    default: module.PrivacyPolicy,
  })),
);
const TermsOfServicePage = lazy(() =>
  import("./pages/TermsOfService.jsx").then((module) => ({
    default: module.TermsOfService,
  })),
);

const StockPage = lazy(() =>
  import("./pages/StockPage/StockPage.jsx").then((module) => ({
    default: module.StockPage,
  })),
);

// --- End Lazy Imports ---

// THE PROTECTED ROUTE WRAPPER
const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    // If not logged in, redirect to Login page
    return <Navigate to="/" replace />;
  }
  // If logged in, render Layout
  return children ? children : <Outlet />;
};

export default function App() {
  const checkSession = useAuthStore((state) => state.checkSession);

  useEffect(() => {
    // Check session on load
    checkSession();

    // Check session every minute
    const interval = setInterval(() => {
      checkSession();
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [checkSession]);

  const mode = useThemeStore((state) => state.mode);

  // Apply dark mode class to HTML element for Tailwind
  useEffect(() => {
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [mode]);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<MainPage />} />
          <Route
            path="auth"
            element={
              // Prevent unauthorized users from seeing login page
              isAuthenticated ? (
                <Navigate to="/user/home" replace />
              ) : (
                <Suspense fallback={<Loading />}>
                  <AuthPage />
                </Suspense>
              )
            }
          />
          <Route
            path="aboutus"
            element={
              <Suspense fallback={<Loading />}>
                <AboutUsPage />
              </Suspense>
            }
          />
          <Route
            path="contact"
            element={
              <Suspense fallback={<Loading />}>
                <ContactPage />
              </Suspense>
            }
          />
          <Route
            path="privacy-policy"
            element={
              <Suspense fallback={<Loading />}>
                <PrivacyPolicyPage />
              </Suspense>
            }
          />
          <Route
            path="terms-of-service"
            element={
              <Suspense fallback={<Loading />}>
                <TermsOfServicePage />
              </Suspense>
            }
          />
          <Route
            path="loading"
            element={
              <Suspense fallback={<Loading />}>
                <Loading />
              </Suspense>
            }
          />
          {/* Stock Page Route it load dynamicly*/}
          <Route
            path="/stocks/:symbol"
            element={
              <Suspense fallback={<Loading />}>
                <StockPage />
              </Suspense>
            }
          />
        </Route>

        {/* Protected Routes */}
        <Route
          path="/user"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <Suspense fallback={<Loading />}>
                <UserHomePage />
              </Suspense>
            }
          />
          <Route
            path="home"
            element={
              <Suspense fallback={<Loading />}>
                <UserHomePage />
              </Suspense>
            }
          />
          <Route
            path="stocks"
            element={
              <Suspense fallback={<Loading />}>
                <UserHomePage />
              </Suspense>
            }
          />
          <Route
            path="crypto"
            element={
              <Suspense fallback={<Loading />}>
                <UserHomePage />
              </Suspense>
            }
          />
          <Route
            path="wallet"
            element={
              <Suspense fallback={<Loading />}>
                <UserHomePage />
              </Suspense>
            }
          />

          <Route
            path="settings"
            element={
              <Suspense fallback={<Loading />}>
                <SettingsPage />
              </Suspense>
            }
          />
        </Route>

        {/* 404 Routes */}
        <Route path="/404" element={<Page404 />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
