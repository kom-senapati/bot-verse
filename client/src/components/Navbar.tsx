import { useAuth } from "@/contexts/auth-context";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { user, loading } = useAuth();
  return (
    <nav className="flex justify-between items-center px-6 py-4 rounded-md border-b-2 dark:border-darker border-lighter">
      <Link
        to="/dashboard"
        className="text-5xl brand font-extrabold text-gray-500 hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
      >
        Bot Verse
      </Link>
      {loading ? (
        <></>
      ) : (
        <>
          <div className="flex space-x-6">
            <ul className="flex space-x-6 items-center">
              <li>
                <Link to="/hub" className="block px-4 py-2 text-gray-800">
                  Hub
                </Link>
              </li>
              {user == null ? (
                <>
                  <li className="w-full hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                    <Link
                      to="/signup"
                      className="block px-4 py-2 text-gray-800"
                    >
                      SignUp
                    </Link>
                  </li>
                  <li className="w-full hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                    <Link to="/login" className="block px-4 py-2 text-gray-800">
                      LogIn
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to={`/profile/${user.username}`}>
                      <img
                        src={user.avatar}
                        alt="User Avatar"
                        className="w-6 h-6 rounded-full"
                      />
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </>
      )}
    </nav>
  );
}
