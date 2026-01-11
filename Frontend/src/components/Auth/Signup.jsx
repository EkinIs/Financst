import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router";
import { signupUser } from "../../controller/Auth.js";
import { GoogleLoginButton } from "./GoogleLoginButton.jsx";
import { useTranslation } from "react-i18next";

export const SignUp = ({ toggleMode }) => {
  const { t } = useTranslation();
  // Validation State,
  const [nameError, setNameError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState("");
  const [surnameError, setSurnameError] = useState(false);
  const [surnameErrorMessage, setSurnameErrorMessage] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] =
    useState("");

  // API State
  const [loading, setLoading] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Navigation Hook
  const navigate = useNavigate();

  const validateInputs = (name, surname, email, password, confirmPassword) => {
    let isValid = true;

    // Name Validation
    if (!name || name.length < 2) {
      setNameError(true);
      setNameErrorMessage(t("auth.signup.errors.name"));
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage("");
    }

    // Surname Validation
    if (!surname || surname.length < 2) {
      setSurnameError(true);
      setSurnameErrorMessage(t("auth.signup.errors.surname"));
      isValid = false;
    } else {
      setSurnameError(false);
      setSurnameErrorMessage("");
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      setEmailError(true);
      setEmailErrorMessage(t("auth.login.errors.email"));
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    // Password Length Validation
    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage(t("auth.login.errors.password"));
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    // Invalid Confirm Password Validation
    if (!confirmPassword || confirmPassword.length < 6) {
      setConfirmPasswordError(true);
      setConfirmPasswordErrorMessage(t("auth.login.errors.password"));
      isValid = false;
    } else {
      setConfirmPasswordError(false);
      setConfirmPasswordErrorMessage("");
    }

    // Confirm Password Validation
    if (password !== confirmPassword) {
      setConfirmPasswordError(true);
      setConfirmPasswordErrorMessage(t("auth.signup.errors.passwordMatch"));
      isValid = false;
    } else {
      setConfirmPasswordError(false);
      setConfirmPasswordErrorMessage("");
    }

    return isValid;
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setApiErrorMessage("");

    const data = new FormData(e.currentTarget);
    const name = data.get("name").toString().trim(); 
    const surname = data.get("surname").toString().trim(); 
    const email = data.get("email").toString().trim();
    const password = data.get("password");
    const confirmPassword = data.get("confirmPassword");
    const isValid = validateInputs(name, surname, email, password, confirmPassword);

    if (!acceptTerms) {
      setApiErrorMessage(t("auth.signup.errors.terms"));
      return;
    }

    if (!isValid) return;

    setLoading(true);

    try {
      const response = await signupUser({ name, surname, email, password });

      if (response.error) {
        setApiErrorMessage(response.error);
      } else {
        // Successful signup
        navigate("/"); // it should be acutal this but for temmporealy use  / rether than this user/home
      }
    } catch (error) {
      console.error("Signup error:", error);
      setApiErrorMessage(t("auth.login.errors.unexpected"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-md p-6 sm:p-8 gap-4 bg-white dark:bg-midnight-dark rounded-2xl">
      <h1 className="text-3xl font-bold mb-4">{t("auth.signup.title")}</h1>
      <form
        onSubmit={handleSignUpSubmit}
        noValidate
        className="flex flex-col w-full gap-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm font-semibold">
              {t("auth.signup.nameLabel")}
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder={t("auth.signup.placeholders.name")}
              autoComplete="name"
              autoFocus
              required
              className={`w-full h-10 px-3 rounded-lg bg-gray-50 dark:bg-midnight-light border ${
                nameError
                  ? "border-red-500 focus:border-red-600"
                  : "border-gray-300 dark:border-midnight-dark focus:border-blue-600"
              } focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-colors`}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="surname" className="text-sm font-semibold">
              {t("auth.signup.surnameLabel")}
            </label>
            <input
              id="surname"
              type="text"
              name="surname"
              placeholder={t("auth.signup.placeholders.surname")}
              autoComplete="family-name"
              required
              className={`w-full h-10 px-3 rounded-lg bg-gray-50 dark:bg-midnight-light border ${
                surnameError
                  ? "border-red-500 focus:border-red-600"
                  : "border-gray-300 dark:border-midnight-dark focus:border-blue-600"
              } focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-colors`}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-semibold">
            {t("auth.signup.emailLabel")}
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder={t("auth.login.placeholders.email")}
            autoComplete="email"
            required
            className={`w-full h-10 px-3 rounded-lg bg-gray-50 dark:bg-midnight-light border ${
              emailError
                ? "border-red-500 focus:border-red-600"
                : "border-gray-300 dark:border-midnight-dark focus:border-blue-600"
            } focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-colors`}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-semibold">
              {t("auth.signup.passwordLabel")}
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder={t("auth.login.placeholders.password")}
              autoComplete="new-password"
              required
              className={`w-full h-10 px-3 rounded-lg bg-gray-50 dark:bg-midnight-light border ${
                passwordError
                  ? "border-red-500 focus:border-red-600"
                  : "border-gray-300 dark:border-midnight-dark focus:border-blue-600"
              } focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-colors`}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="confirmPassword" className="text-sm font-semibold">
              {t("auth.signup.confirmPasswordLabel")}
            </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder={t("auth.login.placeholders.password")}
              autoComplete="new-password"
              required
              className={`w-full h-10 px-3 rounded-lg bg-gray-50 dark:bg-midnight-light border ${
                confirmPasswordError
                  ? "border-red-500 focus:border-red-600"
                  : "border-gray-300 dark:border-midnight-dark focus:border-blue-600"
              } focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-colors`}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="subscribe"
            name="subscribe"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <label htmlFor="subscribe" className="text-sm">
            {t("auth.signup.terms")}
          </label>
        </div>

        {apiErrorMessage && (
          <div className="px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
            {apiErrorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-10 rounded-lg border border-gray-300 dark:border-midnight-dark bg-gray-50 dark:bg-midnight-light hover:bg-gray-100 dark:hover:bg-midnight transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {loading ? t("auth.signup.submitting") : t("auth.signup.submit")}
        </button>
        {nameErrorMessage ? (
          <span className="text-sm text-red-600">{nameErrorMessage}</span>
        ) : surnameErrorMessage ? (
          <span className="text-sm text-red-600">{surnameErrorMessage}</span>
        ) : emailErrorMessage ? (
          <span className="text-sm text-red-600">{emailErrorMessage}</span>
        ) : passwordErrorMessage ? (
          <span className="text-sm text-red-600">{passwordErrorMessage}</span>
        ) : confirmPasswordErrorMessage ? (
          <span className="text-sm text-red-600">
            {confirmPasswordErrorMessage}
          </span>
        ) : null}
      </form>

      <div className="relative my-1">
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
          {t("auth.signup.haveAccount")}{" "}
          <button
            onClick={toggleMode}
            className="font-bold text-blue-600 hover:underline"
          >
            {t("auth.signup.loginLink")}
          </button>
        </p>
      </div>
    </div>
  );
};
