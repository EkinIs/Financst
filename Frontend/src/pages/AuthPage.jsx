import { useSearchParams } from "react-router";
import { Login } from "../components/Auth/Login";
import { SignUp } from "../components/Auth/Signup";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export const AuthPage = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  // DIRECTLY DERIVED STATE: No useState needed
  const isSignUp = searchParams.get("mode") === "signup";

  // Only use useEffect for side effects like scrolling
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [isSignUp]);

  const toggleMode = () => {
    // Simply push the new URL the component re-renders and isSignUp updates automatically
    setSearchParams({ mode: isSignUp ? "login" : "signup" });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-midnight px-4 py-8">
      <div className="relative overflow-hidden w-full max-w-250 min-h-150 bg-white dark:bg-midnight-dark rounded-2xl shadow-2xl">
        {/* Sign Up Container */}
        <div
          className={`absolute top-0 h-full transition-all duration-500 ease-in-out
            left-0 w-full lg:w-1/2
            ${
              isSignUp
                ? "opacity-100 z-20 lg:translate-x-full flex justify-center items-center"
                : "opacity-0 z-10 flex justify-center items-center"
            }
          `}
        >
          <SignUp toggleMode={toggleMode} />
        </div>

        {/* Login Container */}
        <div
          className={`absolute top-0 h-full transition-all duration-500 ease-in-out
            left-0 w-full lg:w-1/2
            ${
              isSignUp
                ? "opacity-0 z-10 lg:translate-x-full flex justify-center items-center "
                : "opacity-100 z-20 flex justify-center items-center"
            }
          `}
        >
          <Login toggleMode={toggleMode} />
        </div>

        {/* Overlay Container (Desktop Only) */}
        <div
          className={`hidden lg:block absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-500 ease-in-out z-30
            ${isSignUp ? "-translate-x-full" : ""}
          `}
        >
          <div
            // FIXED: bg-linear-to-r changed to bg-gradient-to-r
            className={`relative -left-full h-full w-[200%] bg-linear-to-r from-purple-500 to-blue-500 text-white transform transition-transform duration-500 ease-in-out
              ${isSignUp ? "translate-x-1/2" : "translate-x-0"}
            `}
          >
            {/* Left Overlay Panel (Visible when Sign Up is active) */}
            <div
              className={`absolute top-0 flex flex-col items-center justify-center h-full w-1/2 px-10 text-center transition-transform duration-500 ease-in-out
                ${isSignUp ? "translate-x-0" : "-translate-x-[20%]"}
              `}
            >
              <h1 className="text-3xl font-bold mb-4">
                {t("auth.overlay.signUp.title")}
              </h1>
              <p className="mb-8 text-lg">
                {t("auth.overlay.signUp.description")}
              </p>
              <button
                onClick={toggleMode}
                className="px-8 py-2 border border-white rounded-full font-bold uppercase tracking-wider hover:bg-white hover:text-blue-600 transition-colors cursor-pointer"
              >
                {t("auth.overlay.signUp.button")}
              </button>
            </div>

            {/* Right Overlay Panel (Visible when Sign In is active) */}
            <div
              className={`absolute top-0 right-0 flex flex-col items-center justify-center h-full w-1/2 px-10 text-center transition-transform duration-500 ease-in-out
                ${isSignUp ? "translate-x-[20%]" : "translate-x-0"}
              `}
            >
              <h1 className="text-3xl font-bold mb-4">
                {t("auth.overlay.login.title")}
              </h1>
              <p className="mb-8 text-lg">
                {t("auth.overlay.login.description")}
              </p>
              <button
                onClick={toggleMode}
                className="px-8 py-2 border border-white rounded-full font-bold uppercase tracking-wider hover:bg-white hover:text-purple-600 transition-colors cursor-pointer"
              >
                {t("auth.overlay.login.button")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
