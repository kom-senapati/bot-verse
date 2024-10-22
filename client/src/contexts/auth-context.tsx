import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  FC,
  useContext,
} from "react";
import axios from "axios";
import { SERVER_URL } from "@/lib/utils";
import { useNavigate } from "react-router-dom"; // Import useNavigate

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

// Create the AuthContext with a default value of `undefined`
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

// needs authentication token
const fetchUserInfo = async (token: string): Promise<User | null> => {
  try {
    const response = await axios.get(`${SERVER_URL}/api/user_info`, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass token in headers for authentication
      },
    });

    if (!response.data.success) throw new Error(response.data.message);

    const user: User = response.data.user;
    return user;
  } catch (error) {
    console.log("[USER_INFO_RETRIEVING_ERROR]", error);
    return null;
  }
};

// AuthProvider component
const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post(`${SERVER_URL}/api/login`, {
        username,
        password,
      });
      const { access_token } = response.data;
      localStorage.setItem("token", access_token);

      // Fetch user info after login and set user state
      const fetchedUser = await fetchUserInfo(access_token);
      if (fetchedUser) {
        setUser(fetchedUser);
        navigate("/dashboard"); // Redirect to dashboard after successful login
      }
    } catch (error) {
      console.log("[LOGIN_ERROR]", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login"); // Use navigate to redirect to login after logout
  };

  // Check if the user is logged in when the app loads
  useEffect(() => {
    const token = localStorage.getItem("token");

    // If a token exists, attempt to fetch user info
    if (token) {
      const getUserInfo = async () => {
        const fetchedUser = await fetchUserInfo(token);
        if (fetchedUser) {
          setUser(fetchedUser);
        } else {
          logout(); // If unable to fetch user info, log out the user
        }
        setLoading(false);
      };

      getUserInfo();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
