import { useAuth } from "@/contexts/auth-context";
import { Navigate, Outlet } from "react-router-dom";

import { CopilotPopup } from "@copilotkit/react-ui";
import { CommandModal } from "./modals/command-modal";
const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (!loading && !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <CopilotPopup
        className="bottom-16"
        instructions={
          "You are assisting the user as best as you can. Answer in the best way possible given the data you have."
        }
        labels={{
          title: "Popup Assistant",
          initial: "Need any help?",
        }}
      />
      <Outlet />
      <CommandModal />
    </>
  );
};

export default ProtectedRoute;
