import { useEffect } from "react";
import { useLocation } from "react-router";

import { FAQ } from "../components/Homepage/FAQ";
import { Pricing } from "../components/Homepage/Pricing";
import { Features } from "../components/Homepage/Features";

export const MainPage = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if we came from a redirect with a 'state' requesting a scroll
    if (location.state && location.state.targetId) {
      const element = document.getElementById(location.state.targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [location]); // Run this every time the location changes

  return (
    <div className="grid p-1 items-center justify-center ">
      <Features id="features-section" />
      {/*<hr className="my-8 w-full border-t border-neutral-300 dark:border-neutral-700" />*/}
      <Pricing id="pricing-section" />
      {/*<hr className="my-8 w-full border-t border-neutral-300 dark:border-neutral-700" />*/}
      <FAQ id="faq-section" />
    </div>
  );
};
