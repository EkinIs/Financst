import { FaCheck } from "react-icons/fa6";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

const FeatureItem = ({ text }) => (
  <div className="py-2 flex gap-2 items-center">
    <FaCheck className="w-5 h-5 text-blue-600 shrink-0" />
    <span className="text-base">{text}</span>
  </div>
);

export const Pricing = ({ id }) => {
  const { t } = useTranslation();

  const plans = [
    {
      key: "free",
      width: "w-72",
      containerClass: "border-gray-200 dark:border-midnight-light",
      ctaMode: "outline",
      ctaLink: "/auth?mode=signup",
    },
    {
      key: "advanced",
      width: "w-80",
      containerClass: "border-gray-200 dark:border-blue-600 transform md:scale-105",
      isRecommended: true,
      ctaMode: "solid",
      ctaLink: "/auth?mode=signup",
    },
    {
      key: "investor",
      width: "w-72",
      containerClass: "border-gray-200 dark:border-midnight-dark",
      ctaMode: "outline",
      ctaLink: "/contact",
    },
  ];

  const featuresList = {
    free: ["stockLimit", "helpCenter", "emailSupport"],
    advanced: ["stockLimit", "helpCenter", "prioritySupport", "dedicatedTeam"],
    investor: ["unlimitedStocks", "phoneSupport", "personalizedSetup"],
  };

  return (
    <div id={id} className="pt-4 pb-16 flex flex-col items-center gap-8 w-full">
      <div className="w-full max-w-2xl text-center px-4">
        <h2 className="text-4xl font-bold mb-4">{t("pricing.title")}</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 pb-8">
          {t("pricing.description")}
        </p>
      </div>

      <div className="w-full max-w-6xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center items-center">
          {plans.map((plan) => (
            <div key={plan.key} className="flex flex-col h-full">
              <div
                className={`p-6 rounded-2xl flex flex-col h-full bg-white dark:bg-midnight-lighter border shadow-xl ${plan.width} ${plan.containerClass}`}
              >
                <div className="grow">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className={`text-xl font-bold ${plan.isRecommended ? "" : "mb-4"}`}>
                      {t(`pricing.${plan.key}.title`)}
                    </h5>
                    {plan.isRecommended && (
                      <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-sm">
                        {t(`pricing.${plan.key}.recommended`)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-baseline mb-6">
                    <h3 className="text-4xl font-bold">
                      {t(`pricing.${plan.key}.price`)}
                    </h3>
                    <h6 className="text-gray-600 dark:text-gray-400 ml-2">
                      {t(`pricing.${plan.key}.unit`)}
                    </h6>
                  </div>

                  {featuresList[plan.key].map((feature) => (
                    <FeatureItem
                      key={feature}
                      text={t(`pricing.${plan.key}.features.${feature}`)}
                    />
                  ))}
                </div>

                <div className="mt-6">
                  <Link
                    to={plan.ctaLink}
                    className={`block w-full text-center px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                      plan.ctaMode === "solid"
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-midnight-light"
                    }`}
                  >
                    {t(`pricing.${plan.key}.cta`)}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
