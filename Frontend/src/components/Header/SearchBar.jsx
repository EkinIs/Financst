import { RiSearchLine } from "react-icons/ri";

export const SearchBar = ({
  searchResults,
  handleResultClick,
  searchQuery,
  handleSearchChange,
}) => {
  return (
    <div className="relative flex flex-row items-center rounded-lg bg-white dark:bg-neutral-600 border border-gray-300 dark:border-neutral-600 w-full md:w-64 max-w-xs">
      {/* Search Icon */}
      <div className="absolute left-0 pl-3 h-full flex items-center justify-center pointer-events-none text-gray-500 dark:text-gray-400">
        <RiSearchLine />
      </div>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search…"
        value={searchQuery}
        onChange={handleSearchChange}
        className="w-full h-9 pl-10 pr-3 bg-transparent border-none outline-none text-sm"
      />

      {/* Search Results Dropdown */}
      {searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 max-h-80 overflow-y-auto">
          {searchResults.map((result) => (
            <div
              key={result.symbol}
              onClick={() => handleResultClick(result.symbol)}
              className="p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
            >
              <div className="flex flex-row items-center gap-2">
                <span className="text-sm font-semibold">{result.symbol}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {result.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
