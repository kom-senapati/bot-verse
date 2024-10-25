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
import ImaginePage from "./pages/Imagine";
import LandingPage from "./pages/Landing";
import NotFound from "./pages/404";
import AuthProvider from "./contexts/auth-context";
import ProtectedRoute from "./components/ProtectedRoute";
import Modals from "./contexts/modals";
import "@copilotkit/react-ui/styles.css";
import { CopilotKit } from "@copilotkit/react-core";
import { SettingsProvider } from "./contexts/settings-context";
import ScrollToTop from "react-scroll-to-top";
import { ArrowBigUpDash } from "lucide-react";

const queryClient = new QueryClient();
function App() {
  return (
    <SettingsProvider>
      <QueryClientProvider client={queryClient}>
        <CopilotKit publicApiKey={import.meta.env.VITE_COPILOT_PUBLIC_KEY}>
          <AuthProvider>
            <ScrollToTop
              smooth
              className="left-5 flex items-center justify-center !bg-primary"
              component={<ArrowBigUpDash />}
            />
            <Modals />
            <Toaster />
            <Routes>
              <Route path="*" element={<NotFound />} />
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/anonymous" element={<AnonymousPage />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/chatbot/:id" element={<ChatbotPage />} />
                <Route path="/imagine" element={<ImaginePage />} />

                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/hub" element={<HubPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/profile/:username" element={<ProfilePage />} />
              </Route>
            </Routes>
          </AuthProvider>
        </CopilotKit>
      </QueryClientProvider>
    </SettingsProvider>
  );
}

export default App;
