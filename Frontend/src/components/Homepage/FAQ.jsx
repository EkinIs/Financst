import { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useTranslation } from "react-i18next";

// Mock Link component
const Link = ({ href, children, className }) => (
  <a href={href} className={`text-blue-600 hover:underline ${className}`}>
    {children}
  </a>
);

export const FAQ = ({ id }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState([]);

  const toggleAccordion = (panel) => {
    setExpanded((prevExpanded) =>
      prevExpanded.includes(panel)
        ? prevExpanded.filter((item) => item !== panel)
        : [...prevExpanded, panel],
    );
  };
  const faqItems = [
    { key: "q1", hasLink: true }, // Current question (Contact/Support)
    { key: "q2", hasLink: false }, // Are the data live? (No, T-1)
    { key: "q3", hasLink: false }, // Can I buy and sell stocks? (No, analysis only)
    { key: "q4", hasLink: false }, // How does the watchlist work?
    { key: "q5", hasLink: false }, // Is it paid?
  ];

  return (
    <div
      id={id}
      className="pt-16 sm:pt-12 pb-16 md:pt-20 md:pb-20 relative flex flex-col items-center gap-3 sm:gap-6 px-4"
    >
      <h1 className="w-full sm:w-full md:w-[90%] text-left sm:text-left md:text-center text-3xl font-semibold text-gray-900 dark:text-white">
        {t("faq.title")}
      </h1>

      <div className="w-full sm:w-full md:w-[90%] flex flex-col gap-4 mt-8">
        {faqItems.map((item) => {
          const isPanelOpen = expanded.includes(item.key);
          
          return (
            <div 
              key={item.key}
              className="border-b border-gray-200 dark:border-neutral-800 bg-white dark:bg-midnight-light rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Accordion Header */}
              <button
                onClick={() => toggleAccordion(item.key)}
                className="w-full h-auto min-h-[3rem] flex justify-between items-center p-4 text-left focus:outline-none transition-colors"
                aria-expanded={isPanelOpen}
              >
                <span className="font-medium text-gray-900 dark:text-gray-100 pr-4">
                  {t(`faq.${item.key}.question`)}
                </span>
                <MdKeyboardArrowDown
                  size={24}
                  className={`text-gray-500 transform transition-transform duration-300 flex-shrink-0 ${
                    isPanelOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Accordion Content */}
              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                  isPanelOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="p-4 pt-0 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    <p>
                      {t(`faq.${item.key}.answer.part1`)}
                      
                      {/* Link varsa göster (Örn: Support maili) */}
                      {item.hasLink && (
                        <>
                          &nbsp;
                          <Link href="mailto:support@financst.com">support@financst.com</Link>
                          &nbsp;
                          {t(`faq.${item.key}.answer.part2`)}
                        </>
                      )}
                      
                      {/* If there is no link, but the answer has 2 parts (Optional) */}
                      {!item.hasLink && t(`faq.${item.key}.answer.part2`, "")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};