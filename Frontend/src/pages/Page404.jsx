import { Link } from "react-router";

export const Page404 = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="flex flex-col gap-4 max-w-md text-center items-center">
        <h1 className="text-4xl font-bold">Sorry, page not found!</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Sorry, we couldn't find the page you're looking for. Perhaps you've
          mistyped the URL?
        </p>
        <object
          type="image/svg+xml"
          data="/Cat404.svg"
          className="w-full max-w-md h-48"
        ></object>
        <Link
          to="/"
          className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-8 py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-semibold"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};
