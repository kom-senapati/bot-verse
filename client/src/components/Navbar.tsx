import { useAuth } from "@/contexts/auth-context";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { user, loading } = useAuth();
  return (
    <nav className="flex justify-between items-center px-6 py-4 rounded-md border-b-2 dark:border-darker border-lighter">
      <Link to="/dashboard" className="text-5xl brand font-extrabold">
        Bot Verse
      </Link>
      {loading ? (
        <></>
      ) : (
        <>
          <div className="flex space-x-6">
            <ul className="flex space-x-6 items-center">
              <li>
                <Link to="/leaderboard" className="py-2">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link to="/hub" className="py-2">
                  Hub
                </Link>
              </li>

              {user == null ? (
                <>
                  <li className="w-full">
                    <Link to="/signup" className="py-2">
                      SignUp
                    </Link>
                  </li>
                  <li className="w-full ">
                    <Link to="/login" className="py-2">
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
