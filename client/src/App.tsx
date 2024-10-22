import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DashboardPage from "./pages/Dashboard";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import ChatbotPage from "./pages/Chatbot";
import ProfilePage from "./pages/Profile";
import HubPage from "./pages/Hub";
import AnonymousPage from "./pages/Anonymous";
import UserProfilePage from "./pages/UserProfile";
import ImaginePage from "./pages/Imagine";
import LandingPage from "./pages/Landing";
import NotFound from "./pages/404";
import AuthProvider from "./contexts/auth-context";
import ProtectedRoute from "./components/ProtectedRoute";
import Modals from "./contexts/modals";

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Modals />
        <Toaster />
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected routes wrapped in ProtectedRoute */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/hub" element={<HubPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/:id" element={<UserProfilePage />} />
            <Route path="/chatbot/:id" element={<ChatbotPage />} />
            <Route path="/anonymous" element={<AnonymousPage />} />
            <Route path="/imagine" element={<ImaginePage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
