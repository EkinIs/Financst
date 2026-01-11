import { Link } from "react-router";
import { useTranslation } from "react-i18next";

export const Features = ({ id }) => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-16 md:py-32" id={id}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
        <div className="w-full p-4 md:p-16 text-left">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            {t("features.title")}
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            {t("features.description")}
          </p>
          <Link
            to="/auth?mode=signup"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
          >
            {t("common.getStarted")}
          </Link>
        </div>
        <div className="flex items-center justify-center">
          <img
            className="w-full max-w-md rounded-lg"
            src="Business vision-rafiki 1.svg"
            alt="Financial management illustration"
          />
        </div>
      </div>
    </div>
  );
};
