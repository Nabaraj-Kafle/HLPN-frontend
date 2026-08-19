import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/app/context/authcontext";

export function LogoutPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      await logout();
      navigate("/", { replace: true });
    };

    performLogout();
  }, [logout, navigate]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      <span className="ml-2">Logging out...</span>
    </div>
  );
}
