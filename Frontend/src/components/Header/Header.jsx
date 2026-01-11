import { useRef, useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";

// Icons
import { MdOutlineWbSunny, MdNightlightRound } from "react-icons/md";
import { CiMenuBurger } from "react-icons/ci";

// Store & Auth
import { useThemeStore } from "../../ThemeController";
import { logoutUser, useAuthStore } from "../../controller/Auth";
import { getStocksListApi } from "../../api/stockService";

import { SearchBar } from "./SearchBar";
import LanguageSwitcher from "../LanguageSwitcher";

const ThemeButton = ({ currentThemeMode, themeToggleMode }) => {
  return (
    <button
      onClick={themeToggleMode}
      className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-midnight-light transition-colors relative flex items-center justify-center overflow-hidden w-10 h-10"
      aria-label="Toggle Theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentThemeMode}
          initial={{ x: -20, opacity: 0, rotate: -45 }}
          animate={{ x: 0, opacity: 1, rotate: 0 }}
          exit={{ x: 20, opacity: 0, rotate: 45 }}
          transition={{ duration: 0.2 }}
        >
          {currentThemeMode === "light" ? (
            <MdOutlineWbSunny size="1.5rem" className="text-orange-500" />
          ) : (
            <MdNightlightRound size="1.5rem" className="text-blue-200" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
};

export const Header = () => {
  const { t } = useTranslation();
  const themeToggleMode = useThemeStore((state) => state.toggleMode);
  const currentThemeMode = useThemeStore((state) => state.mode);

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  // Close profile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuOpen &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuOpen]);

  const [stocksList, setstocksList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchstocks = async () => {
      const data = await getStocksListApi();
      if (Array.isArray(data)) {
        setstocksList(data);
      }
    };
    fetchstocks();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const searchResults = useMemo(() => {
    if (!debouncedQuery || debouncedQuery.length < 1) return [];

    const lowerQuery = debouncedQuery.toLowerCase();

    const filtered = stocksList.filter((stock) => {
      if (!stock || !stock.symbol || !stock.name) return false;
      const symbol = stock.symbol.toLowerCase();
      const name = stock.name.toLowerCase();
      return symbol.includes(lowerQuery) || name.includes(lowerQuery);
    });

    return filtered
      .sort((a, b) => {
        const aSymbol = a.symbol.toLowerCase();
        const bSymbol = b.symbol.toLowerCase();
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();

        if (aSymbol === lowerQuery && bSymbol !== lowerQuery) return -1;
        if (bSymbol === lowerQuery && aSymbol !== lowerQuery) return 1;

        if (aSymbol.startsWith(lowerQuery) && !bSymbol.startsWith(lowerQuery))
          return -1;
        if (!aSymbol.startsWith(lowerQuery) && bSymbol.startsWith(lowerQuery))
          return 1;

        if (aName.startsWith(lowerQuery) && !bName.startsWith(lowerQuery))
          return -1;
        if (!aName.startsWith(lowerQuery) && bName.startsWith(lowerQuery))
          return 1;

        return 0;
      })
      .slice(0, 10);
  }, [debouncedQuery, stocksList]);

  const handleMenuClose = () => {
    setMenuOpen(false);
    setProfileMenuOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setShowResults(true);
  };

  const handleResultClick = (symbol) => {
    setSearchQuery("");
    setDebouncedQuery("");
    setShowResults(false);
    navigate(`/stocks/${symbol}`);
  };

  const getInitials = (name) => {
    if (!name) return "X";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="fixed w-full z-50 px-4 h-14">
      <nav className="h-full">
        <div className="flex items-center justify-between w-full bg-white dark:bg-midnight-dark rounded-2xl border-b-2 border-gray-300 dark:border-midnight-dark shadow-md px-4 h-12 mt-2">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-xl font-bold text-blue-600 hover:text-blue-700 ml-4"
            >
              Financst
            </Link>
            <div
              className="block"
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
            >
              <SearchBar
                handleSearchChange={handleSearchChange}
                searchResults={showResults ? searchResults : []}
                handleResultClick={handleResultClick}
                searchQuery={searchQuery}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mr-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/user/home"
                  className="hidden lg:block px-4 py-2 rounded-lg bg-neutral-200 dark:bg-midnight-light hover:bg-gray-300 dark:hover:bg-midnight font-bold text-sm transition-colors"
                >
                  {t("header.home")}
                </Link>
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="w-10 h-10 rounded-full bg-neutral-600 text-white flex items-center justify-center font-semibold hover:bg-blue-700 transition-colors"
                  >
                    {getInitials(user?.name)}
                  </button>
                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden z-50">
                      <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                        {user?.email}
                      </div>
                      <button
                        onClick={() => {
                          handleMenuClose();
                          navigate("/user/home");
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-midnight-light transition-colors"
                      >
                        {t("header.home")}
                      </button>

                      <button
                        onClick={() => {
                          handleMenuClose();
                          navigate("/user/settings");
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-midnight-light transition-colors"
                      >
                        {t("header.settings")}
                      </button>
                      <button
                        onClick={() => {
                          logoutUser();
                          handleMenuClose();
                          navigate("/");
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-midnight-light transition-colors"
                      >
                        {t("header.logout")}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                    <div className="hidden lg:flex items-center gap-2">
                  <Link
                    to="/aboutus"
                    className="px-4 py-2 rounded-lg bg-neutral-200 dark:bg-midnight-light hover:bg-gray-300 dark:hover:bg-midnight font-bold text-sm transition-colors"
                  >
                    {t("header.aboutUs")}
                  </Link>
                  <Link
                    to="/contact"
                    className="px-4 py-2 rounded-lg bg-neutral-200 dark:bg-midnight-light hover:bg-gray-300 dark:hover:bg-midnight font-bold text-sm transition-colors"
                  >
                    {t("header.contact")}
                  </Link>
                  <Link
                    to="/auth?mode=login"
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-bold text-sm transition-colors"
                  >
                    {t("header.login")}
                  </Link>
                  <Link
                    to="/auth?mode=signup"
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-bold text-sm transition-colors"
                  >
                    {t("header.signup")}
                  </Link>
                </div>
                <div className="lg:hidden">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="p-2"
                  >
                    <CiMenuBurger className="text-2xl" />
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 top-14 mt-2 mr-4 w-48 bg-white dark:bg-midnight border border-gray-300 dark:border-midnight-dark rounded-lg shadow-lg overflow-hidden z-50">
                      <Link
                        to="/auth?mode=login"
                        onClick={handleMenuClose}
                        className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-midnight-light transition-colors"
                      >
                        {t("header.login")}
                      </Link>
                      <Link
                        to="/auth?mode=signup"
                        onClick={handleMenuClose}
                        className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-midnight-light transition-colors"
                      >
                        {t("header.signup")}
                      </Link>
                      <Link
                        to="/aboutus"
                        onClick={handleMenuClose}
                        className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-midnight-light transition-colors"
                      >
                        {t("header.aboutUs")}
                      </Link>
                      <Link
                        to="/contact"
                        onClick={handleMenuClose}
                        className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-midnight-light transition-colors"
                      >
                        {t("header.contact")}
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}
            <ThemeButton currentThemeMode={currentThemeMode} themeToggleMode={themeToggleMode} />
            <LanguageSwitcher />
          </div>
        </div>
      </nav>
    </header>
  );
};
