import { useAuth } from "@/contexts/auth-context";
import Navbar from "../components/Navbar";

export default function DashboardPage() {
  const { user, loading } = useAuth();

  return (
    <>
      <Navbar />

      {loading && (
        <>
          <p>Loading wait</p>
        </>
      )}
      {user && (
        <>
          <p>Logined as: {user.name}</p>
        </>
      )}
    </>
  );
}
