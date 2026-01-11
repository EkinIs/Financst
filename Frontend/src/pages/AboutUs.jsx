import { useTranslation } from "react-i18next";

export const AboutUs = () => {
  const { t } = useTranslation();

  return (
    <div className="mx-auto  my-4 px-4">
      <div className="p-6 md:p-8 rounded-2xl  flex flex-col gap-4">
        <header>
          <h2 className="text-3xl font-bold mb-2">{t("aboutUs.title")}</h2>
          <p className="text-gray-600 dark:text-gray-300">
            {t("aboutUs.intro")}
          </p>
        </header>

        <section>
          <h3 className="text-2xl font-semibold mb-2">
            {t("aboutUs.empowering.title")}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {t("aboutUs.empowering.desc")}
          </p>
        </section>

        <section>
          <h3 className="text-2xl font-semibold mb-2">
            {t("aboutUs.whatWeDo.title")}
          </h3>
          <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
            <li>
              <span className="font-semibold">
                {t("aboutUs.whatWeDo.personalized")}
              </span>{" "}
              {t("aboutUs.whatWeDo.personalizedDesc")}
            </li>
            <li>
              <span className="font-semibold">
                {t("aboutUs.whatWeDo.clarity")}
              </span>{" "}
              {t("aboutUs.whatWeDo.clarityDesc")}
            </li>
            <li>
              <span className="font-semibold">
                {t("aboutUs.whatWeDo.security")}
              </span>{" "}
              {t("aboutUs.whatWeDo.securityDesc")}
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-2xl font-semibold mb-2">
            {t("aboutUs.vision.title")}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {t("aboutUs.vision.desc")}
          </p>
        </section>
      </div>
    </div>
  );
};
