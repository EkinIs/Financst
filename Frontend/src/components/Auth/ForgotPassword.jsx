import { useState } from "react";
import { createPortal } from "react-dom";
import { forgotPasswordApi } from "../../api/authService"; // Import the new API
import { useTranslation } from "react-i18next"; // Assuming you use this based on Login.jsx

export default function ForgotPassword({ open, handleClose }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { t } = useTranslation();

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const response = await forgotPasswordApi(email);

    if (response.error) {
      setError(response.error);
    } else {
      setMessage("Check your email for the reset link.");
      // Optional: Close modal after a delay
      // setTimeout(handleClose, 3000); 
    }
    setLoading(false);
  };

  // Reset state when closing manually
  const onClose = () => {
    setError("");
    setMessage("");
    setLoading(false);
    setEmail("");
    handleClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

      {/* Dialog */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6 z-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold dark:text-white">{t('auth.login.forgotPasswordModal.title')}</h2>

          <p className="text-gray-600 dark:text-gray-300">
            {t('auth.login.forgotPasswordModal.description')}
          </p>

          <input
            autoFocus
            required
            id="forgot-email"
            name="email"
            placeholder={t('auth.login.forgotPasswordModal.emailPlaceholder')}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full h-10 px-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-colors dark:text-white"
          />

          {/* Feedback Messages */}
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg">
              {error}
            </div>
          )}
          {message && (
            <div className="p-3 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 rounded-lg">
              {t('auth.login.forgotPasswordModal.success')}
            </div>
          )}

          <div className="flex gap-3 justify-end mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors dark:text-gray-300"
            >
              {t('auth.login.forgotPasswordModal.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('auth.login.forgotPasswordModal.sending') : t('auth.login.forgotPasswordModal.continue')}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}