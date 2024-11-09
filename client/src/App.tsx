import { Route } from "react-router-dom";
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
import LeaderboardPage from "./pages/Leaderboard";
import ChatbotViewPage from "./pages/ChatbotView";
import MyImagesPage from "./pages/MyImages";
import MyChatbotsPage from "./pages/MyChatbots";
import { AnimatePresence } from "framer-motion";
import CustomSwitch from "./lib/custom-switch";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import AboutPage from "./pages/About";

const queryClient = new QueryClient();

function App() {
  return (
    <SettingsProvider>
      <QueryClientProvider client={queryClient}>
        <CopilotKit publicApiKey={import.meta.env.VITE_COPILOT_PUBLIC_KEY}>
          <AuthProvider>
            <ScrollToTop
              smooth
              className="left-5 flex items-center justify-center !bg-primary-foreground"
              component={<ArrowBigUpDash />}
            />
            <Modals />
            <Toaster />
            <AnimatePresence mode="wait">
              <CustomSwitch>
                <Route path="*" element={<NotFound />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/anonymous" element={<AnonymousPage />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/chatbot/:id" element={<ChatbotPage />} />
                  <Route path="/imagine" element={<ImaginePage />} />

                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/hub" element={<HubPage />} />
                  <Route path="/hub/:chatbotId" element={<ChatbotViewPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/profile/:username" element={<ProfilePage />} />
                  <Route path="/leaderboard" element={<LeaderboardPage />} />
                  <Route path="/images" element={<MyImagesPage />} />
                  <Route path="/chatbots" element={<MyChatbotsPage />} />
                </Route>
              </CustomSwitch>
            </AnimatePresence>
          </AuthProvider>
        </CopilotKit>
      </QueryClientProvider>
    </SettingsProvider>
  );
}

export default App;
