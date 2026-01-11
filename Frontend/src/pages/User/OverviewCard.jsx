import { MdArrowForwardIos, MdArrowBackIos } from "react-icons/md";
import { useRef } from "react";
import { GoArrowUpRight, GoArrowDownRight } from "react-icons/go";
import { useNavigate } from "react-router";

const CardItem = ({ data, onClick }) => {
  // Data check and formatting
  const price = parseFloat(data.price || 0).toFixed(2);
  const change = parseFloat(data.change_percent || 0);
  const isPositive = change >= 0;
  
  // If name is missing or empty, make it safe
  const stockName = data.name || ""; 

  return (
    <div 
      onClick={() => onClick(data.symbol)}
      className="group relative shrink-0 w-48 h-40 m-1 bg-white dark:bg-midnight-light border border-gray-200 dark:border-neutral-800 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer select-none"
    >
      <div className="p-4 flex flex-col justify-between h-full">
        {/* Top Section: Symbol, Percentage, and Name */}
        <div>
           <div className="flex justify-between items-center mb-2">
              <h6 className="text-lg font-bold text-gray-800 dark:text-white leading-none">
                {data.symbol}
              </h6>
              <span className={`text-xs font-bold px-2 py-1 rounded-md ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {isPositive ? '+' : ''}{change.toFixed(2)}%
              </span>
           </div>
           
           {/* Name Area - Fixed Height (Prevents layout shift even if name is missing) */}
           <div className="min-h-5">
             <p className="text-xs text-gray-500 dark:text-gray-400 truncate" title={stockName}>
               {stockName}
             </p>
           </div>
        </div>

        {/* Bottom Section: Price and Trend Icon */}
        <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            ${price}
            </p>

            <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
                {isPositive ? <GoArrowUpRight size={16} /> : <GoArrowDownRight size={16} />}
                <span>{isPositive ? "Uptrend" : "Downtrend"}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export const OverviewCard = ({ CardType, CardsData = [] }) => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  // Navigation Function
  const handleCardClick = (symbol) => {
    navigate(`/stocks/${symbol}`);
  };
  
  // Scrolling Function
  const scroll = (offset) => {
    if(scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  if(!CardsData.length) return null;

  return (
    <div className="w-full">
      <h5 className="text-xl font-bold mb-3 text-gray-800 dark:text-white pl-1">{CardType}</h5>
      
      <div className="relative group/container">
        {/* Left Arrow */}
        <button 
            onClick={() => scroll(-220)} // Scroll by card width
            className="absolute -left-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-white dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700 rounded-full shadow-lg text-gray-600 dark:text-gray-300 opacity-0 group-hover/container:opacity-100 transition-opacity hover:bg-gray-50 dark:hover:bg-neutral-700"
        >
            <MdArrowBackIos size={20} />
        </button>

        {/* Cards Area - Scrollbar Hidden */}
        <div
          ref={scrollRef}
          className="flex flex-row items-center gap-4 overflow-x-auto pb-4 pt-2 px-1 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {CardsData.map((data, index) => (
            <CardItem 
                key={index} 
                data={data} 
                onClick={handleCardClick}
            />
          ))}
        </div>

        {/* Right Arrow */}
         <button 
            onClick={() => scroll(220)}
            className="absolute -right-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-white dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700 rounded-full shadow-lg text-gray-600 dark:text-gray-300 opacity-0 group-hover/container:opacity-100 transition-opacity hover:bg-gray-50 dark:hover:bg-neutral-700"
        >
            <MdArrowForwardIos size={20} />
        </button>
      </div>
    </div>
  );
};