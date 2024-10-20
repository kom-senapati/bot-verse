import { Route, Routes } from "react-router-dom";

import "./App.css";

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

/*
  other pages can be shown as dialog box
  for create/update chatbot, profile and more
*/

function App() {
  return (
    <Routes>
      <Route path="*" element={<NotFound />} />
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/hub" element={<HubPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/profile/:id" element={<UserProfilePage />} />
      <Route path="/chatbot/:id" element={<ChatbotPage />} />
      <Route path="/anonymous" element={<AnonymousPage />} />
      <Route path="/imagine" element={<ImaginePage />} />
    </Routes>
  );
}

export default App;
