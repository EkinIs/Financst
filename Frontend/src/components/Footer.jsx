import { Link as RouterLink, useLocation, useNavigate } from "react-router";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

export const Footer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const handleScroll = (event, targetId) => {
    event.preventDefault();

    if (location.pathname === "/") {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      navigate("/", { state: { targetId: targetId } });
    }
  };

  return (
    <div className="static flex flex-col items-center text-center md:text-left gap-4 sm:gap-4 pb-4 sm:pb-4 px-4 sm:px-4 md:px-8 mt-4 w-full border-t border-gray-300 dark:border-midnight-dark">
      <div className="flex flex-col sm:flex-row w-full justify-between">
        <div className="flex flex-col gap-8 min-w-full sm:min-w-[60%]">
          <div className="w-full sm:w-3/5">
            <p className="text-base font-semibold mt-4 mb-1">
              {t("footer.newsletter.title")}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {t("footer.newsletter.desc")}
            </p>
            <label htmlFor="email-newsletter" className="text-sm font-medium">
              {t("footer.newsletter.email")}
            </label>
            <div className="flex flex-row gap-2 mt-2">
              <input
                id="email-newsletter"
                type="email"
                placeholder={t("footer.newsletter.placeholder")}
                autoComplete="off"
                aria-label="Enter your email address"
                className="w-64 h-10 px-3 rounded bg-white dark:bg-midnight border border-gray-300 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
              <button className="shrink-0 h-10 w-20 bg-gray-200 dark:bg-midnight rounded hover:bg-gray-300 dark:hover:bg-midnight-light transition-colors">
                <span className="text-sm font-medium">
                  {t("footer.newsletter.subscribe")}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Product Links */}
        <div className="pt-4 sm:pt-4 hidden sm:flex flex-col gap-2">
          <p className="text-base font-medium">{t("footer.product")}</p>
          <RouterLink
            to="/"
            onClick={(e) => handleScroll(e, "features-section")}
            className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
          >
            {t("footer.features")}
          </RouterLink>
          <RouterLink
            to="/"
            onClick={(e) => handleScroll(e, "pricing-section")}
            className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
          >
            {t("footer.pricing")}
          </RouterLink>
          <RouterLink
            to="/"
            onClick={(e) => handleScroll(e, "faq-section")}
            className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
          >
            {t("footer.faqs")}
          </RouterLink>
        </div>

        {/* Company Links */}
        <div className="pt-4 sm:pt-4 hidden sm:flex flex-col gap-2">
          <p className="text-base font-medium">{t("footer.company")}</p>
          <RouterLink
            to="/aboutus"
            className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
          >
            {t("footer.aboutUs")}
          </RouterLink>
        </div>

        {/* Legal Links */}
        <div className="pt-4 sm:pt-4 hidden sm:flex flex-col gap-2">
          <p className="text-base font-medium">{t("footer.legal")}</p>
          <RouterLink
            to="/contact"
            className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
          >
            {t("footer.contact")}
          </RouterLink>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col sm:flex-row justify-between pt-2 sm:pt-2 w-full border-t border-gray-300 dark:border-gray-700">
        {/* Privacy & Terms */}
        <div className="flex flex-row justify-center items-center gap-0">
          <RouterLink
            to="/privacy-policy"
            className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
          >
            {t("footer.privacy")}
          </RouterLink>
          <span className="inline mx-1 opacity-50">&nbsp;•&nbsp;</span>
          <RouterLink
            to="/terms-of-service"
            className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
          >
            {t("footer.terms")}
          </RouterLink>
        </div>

        {/* Copyright */}
        <div className="flex flex-col justify-center items-center text-center gap-0">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} {t("footer.copyright")}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("footer.rights")}
          </p>
        </div>

        {/* Social Icons */}
        <div className="flex flex-row gap-2 justify-center items-center">
          <a
            href="https://github.com"
            aria-label="GitHub"
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded transition-colors"
          >
            <FaGithub size={20} />
          </a>
          <a
            href="https://x.com"
            aria-label="X"
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded transition-colors"
          >
            <FaSquareXTwitter size={20} />
          </a>
          <a
            href="https://www.linkedin.com"
            aria-label="LinkedIn"
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded transition-colors"
          >
            <FaLinkedin size={20} />
          </a>
        </div>
      </div>
    </div>
  );
};
