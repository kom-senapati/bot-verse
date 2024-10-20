import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 py-4 rounded-md border-b-2 dark:border-darker border-lighter">
      <Link
        to="/"
        className="text-5xl brand font-extrabold text-gray-500 hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
      >
        Bot Verse
      </Link>

      <div className="flex space-x-6">
        <div className="relative md:hidden">
          <button
            id="dropdown-button"
            className="flex items-center text-gray-500 hover:text-gray-700 focus:outline-none px-3 py-2"
          >
            <i className="fas fa-bars"></i>
          </button>
          <div
            id="dropdown-menu"
            className="absolute right-0 hidden bg-white shadow-lg rounded-md mt-2 w-64"
          >
            <ul className="flex flex-col p-2">
              <li className="w-full hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                <Link to="/signup" className="block px-4 py-2 text-gray-800">
                  SignUp
                </Link>
              </li>
              <li className="w-full  hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                <Link to="/login" className="block px-4 py-2 text-gray-800">
                  LogIn
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <ul className="hidden md:flex space-x-6 items-center">
          <li className="w-full hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
            <Link to="/signup" className="block px-4 py-2 text-gray-800">
              SignUp
            </Link>
          </li>
          <li className="w-full  hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
            <Link to="/login" className="block px-4 py-2 text-gray-800">
              LogIn
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
