import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router";
import ForgotPassword from "./ForgotPassword.jsx";
import { loginUser } from "../../controller/Auth.js";
import { GoogleLoginButton } from "./GoogleLoginButton.jsx";
import { useTranslation } from "react-i18next";

export const Login = ({ toggleMode }) => {
  const { t } = useTranslation();
  // State
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  // API State
  const [apiErrorMessage, setApiErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Modal State
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const validateInputs = (email, password) => {
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      setEmailError(true);
      setEmailErrorMessage(t("auth.login.errors.email"));
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage(t("auth.login.errors.password"));
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

const handleLoginSubmit = async (e) => {
    e.preventDefault();

    // Clear previous API errors
    setApiErrorMessage("");

    const data = new FormData(e.currentTarget);
    // .trim() to remove leading/trailing spaces
    const email = data.get("email").toString().trim(); 
    const password = data.get("password");

    const isValid = validateInputs(email, password);

    if (!isValid) return;
    setLoading(true);

    try {
      const response = await loginUser({ email, password, rememberMe });

      if (response.error) {
        setApiErrorMessage(response.error);
      } else {
        navigate("/"); // it should be acutal this but for temmporealy use  / rether than this user/home
      }
    } catch (error) {
      console.error("Login error:", error);
      setApiErrorMessage(t("auth.login.errors.network"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-md p-6 sm:p-8 gap-4 bg-white dark:bg-midnight-dark rounded-2xl">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">
        {t("auth.login.title")}
      </h1>
      <form
        onSubmit={handleLoginSubmit}
        noValidate
        className="flex flex-col w-full gap-4"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-semibold">
            {t("auth.login.emailLabel")}
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder={t("auth.login.placeholders.email")}
            autoComplete="email"
            autoFocus
            required
            className={`w-full h-10 px-3 rounded-lg bg-gray-50 dark:bg-midnight-light border ${
              emailError
                ? "border-red-500 focus:border-red-600"
                : "border-gray-300 dark:border-midnight-dark focus:border-blue-600"
            } focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-colors`}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-semibold">
            {t("auth.login.passwordLabel")}
          </label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder={t("auth.login.placeholders.password")}
            autoComplete="current-password"
            required
            className={`w-full h-10 px-3 rounded-lg bg-gray-50 dark:bg-midnight-light border ${
              passwordError
                ? "border-red-500 focus:border-red-600"
                : "border-gray-300 dark:border-midnight-dark focus:border-blue-600"
            } focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-colors`}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="remember"
            name="remember"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <label htmlFor="remember" className="text-sm">
            {t("auth.login.rememberMe")}
          </label>
        </div>

        <ForgotPassword open={open} handleClose={handleClose} />

        {apiErrorMessage && (
          <div className="px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
            {apiErrorMessage}
          </div>
        )}

        <button
          disabled={loading}
          type="submit"
          className="w-full h-10 rounded-lg border border-gray-300 dark:border-midnight-dark bg-gray-50 dark:bg-midnight-light hover:bg-gray-100 dark:hover:bg-midnight transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {loading ? t("auth.login.submitting") : t("auth.login.submit")}
        </button>
        {emailErrorMessage ? (
          <span className="text-sm text-red-600">{emailErrorMessage}</span>
        ) : passwordErrorMessage ? (
          <span className="text-sm text-red-600">{passwordErrorMessage}</span>
        ) : null}

        <button
          type="button"
          onClick={handleClickOpen}
          className="text-sm text-center hover:underline"
        >
          {t("auth.login.forgotPassword")}
        </button>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-midnight-light"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-midnight-dark text-gray-500">
            {t("auth.login.or")}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <GoogleLoginButton />

        <p className="text-center text-sm">
          {t("auth.login.noAccount")}{" "}
          <button
            onClick={toggleMode}
            className="font-bold text-blue-600 hover:underline"
          >
            {t("auth.login.signUpLink")}
          </button>
        </p>
      </div>
    </div>
  );
};
