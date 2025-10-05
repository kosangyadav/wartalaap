import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../../stores/authStore";

const RootRedirect = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Immediate redirect based on authentication status
    if (user) {
      // User is logged in, redirect to chat
      navigate("/chat", { replace: true });
    } else {
      // User is not logged in, redirect to login
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  // Return null for immediate redirect without flash
  return null;
};

export default RootRedirect;
