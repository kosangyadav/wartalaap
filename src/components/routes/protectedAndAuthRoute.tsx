import { useNavigate } from "react-router";
import { useAuthStore } from "../../../stores/authStore";
import { useEffect } from "react";

export const ProtectedRoute = ({ children }) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  return children;
};

export const AuthRoute = ({ children }) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/chat");
  }, [user, navigate]);

  return children;
};
