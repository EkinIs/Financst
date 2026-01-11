import { AiOutlineLoading3Quarters } from "react-icons/ai";

export const Loading = () => {
  return (
    <div className="flex justify-center items-center w-full h-screen bg-gray-100 dark:bg-midnight">
      <AiOutlineLoading3Quarters size={45} className="animate-spin" />
    </div>
  );
};
