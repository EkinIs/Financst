import { useState } from "react";
import { sendContactMessage } from "../api/contactService";
import { useTranslation } from "react-i18next";

export const Contact = () => {
  const { t } = useTranslation();
  // State
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [nameError, setNameError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState("");
  const [surnameError, setSurnameError] = useState(false);
  const [surnameErrorMessage, setSurnameErrorMessage] = useState("");
  const [messageError, setMessageError] = useState(false);
  const [messageErrorMessage, setMessageErrorMessage] = useState("");

  // API State
  const [apiErrorMessage, setApiErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validateInputs = (email, name, surname, message) => {
    let isValid = true;

    // Email Validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage(t("contact.errors.email"));
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    // Name Validation
    if (!name || name.length < 2) {
      setNameError(true);
      setNameErrorMessage(t("contact.errors.name"));
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage("");
    }

    // Surname Validation
    if (!surname || surname.length < 2) {
      setSurnameError(true);
      setSurnameErrorMessage(t("contact.errors.surname"));
      isValid = false;
    } else {
      setSurnameError(false);
      setSurnameErrorMessage("");
    }

    if (!message || message.length < 5) {
      setMessageError(true);
      setMessageErrorMessage(t("contact.errors.message"));
      isValid = false;
    } else {
      setMessageError(false);
      setMessageErrorMessage("");
    }

    return isValid;
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const name = data.get("name");
    const surname = data.get("surname");
    const email = data.get("email");
    const message = data.get("message");
    const isValid = validateInputs(email, name, surname, message);

    if (!isValid) return;

    setLoading(true);

    try {
      const response = await sendContactMessage({
        name,
        surname,
        email,
        message,
      });

      if (response.error) {
        setApiErrorMessage(response.error);
      } else {
        setSuccessMessage(t("contact.success"));
      }
    } catch (error) {
      console.error("Contact message error:", error);
      setApiErrorMessage(t("contact.errors.unexpected"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4">
      <div className="flex flex-col w-full max-w-md p-6 sm:p-8 gap-4 bg-white dark:bg-midnight-dark border border-gray-300 dark:border-midnight-light rounded-2xl shadow-lg">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          {t("contact.title")}
        </h1>

        <form
          onSubmit={handleEmailSubmit}
          noValidate
          className="flex flex-col w-full gap-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="text-sm font-semibold">
                {t("contact.name")}
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder={t("contact.placeholders.name")}
                autoComplete="name"
                autoFocus
                required
                className={`w-full h-10 px-3 rounded-lg bg-gray-50 dark:bg-midnight-light border ${
                  nameError
                    ? "border-red-500 focus:border-red-600"
                    : "border-gray-300 dark:border-midnight-light focus:border-blue-600"
                } focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-colors`}
              />
              {nameError && (
                <span className="text-sm text-red-600">{nameErrorMessage}</span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="surname" className="text-sm font-semibold">
                {t("contact.surname")}
              </label>
              <input
                id="surname"
                type="text"
                name="surname"
                placeholder={t("contact.placeholders.surname")}
                autoComplete="family-name"
                required
                className={`w-full h-10 px-3 rounded-lg bg-gray-50 dark:bg-midnight-light border ${
                  surnameError
                    ? "border-red-500 focus:border-red-600"
                    : "border-gray-300 dark:border-midnight-light focus:border-blue-600"
                } focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-colors`}
              />
              {surnameError && (
                <span className="text-sm text-red-600">
                  {surnameErrorMessage}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-semibold">
              {t("contact.email")}
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder={t("contact.placeholders.email")}
              autoComplete="email"
              required
              className={`w-full h-10 px-3 rounded-lg bg-gray-50 dark:bg-midnight-light border ${
                emailError
                  ? "border-red-500 focus:border-red-600"
                  : "border-gray-300 dark:border-midnight-light focus:border-blue-600"
              } focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-colors`}
            />
            {emailError && (
              <span className="text-sm text-red-600">{emailErrorMessage}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="message" className="text-sm font-semibold">
              {t("contact.message")}
            </label>
            <textarea
              id="message"
              name="message"
              placeholder={t("contact.placeholders.message")}
              rows={4}
              required
              className={`w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-midnight-light border ${
                messageError
                  ? "border-red-500 focus:border-red-600"
                  : "border-gray-300 dark:border-midnight-light focus:border-blue-600"
              } focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-colors resize-none`}
            />
            {messageError && (
              <span className="text-sm text-red-600">
                {messageErrorMessage}
              </span>
            )}
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full h-10 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors mt-2"
          >
            {loading ? t("contact.submitting") : t("contact.submit")}
          </button>

          {apiErrorMessage && (
            <div className="px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
              {apiErrorMessage}
            </div>
          )}

          {successMessage && (
            <div className="px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 text-sm">
              {successMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
