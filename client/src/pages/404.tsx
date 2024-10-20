import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Oops! Looks like the page doesn't exist anymore
      </h1>
      <Link to="/" className="text-lg text-blue-500 hover:underline">
        Click Here
      </Link>
      <p className="text-lg text-gray-600">To go to the Home Page</p>
    </div>
  );
}
