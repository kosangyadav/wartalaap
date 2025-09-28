import { Link } from "react-router";

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-800 to-indigo-900 text-white px-4">
      <h1 className="text-9xl font-extrabold tracking-widest animate-pulse">
        404
      </h1>
      <h2 className="text-2xl mt-4 mb-2 font-semibold">Page Not Found</h2>
      <p className="text-center max-w-md mb-6 text-gray-300">
        Sorry, the page you are looking for does not exist. It might have been
        moved or deleted.
      </p>
      <Link
        to="/chat"
        className="inline-block bg-white text-indigo-900 px-6 py-2 rounded-full text-sm font-semibold transition duration-300 hover:bg-gray-200"
      >
        ⬅ Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
