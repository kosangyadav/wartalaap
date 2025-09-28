import { useAction } from "convex/react";
import { useState } from "react";
import { useAuthStore } from "../../../stores/authStore";
import { api } from "../../../convex/_generated/api";
import { useNavigate } from "react-router";
import LoginForm from "../../ui/auth/LoginForm";
import toast from "react-hot-toast";

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  // convex action
  const checkUserAuth = useAction(api.auth.checkUser);

  // zustand states
  const { setUser } = useAuthStore();

  const handleLogin = async (data: { username: string; password: string }) => {
    const { username, password } = data;

    setLoading(true);
    setError("");

    try {
      console.log("Logging in user:", { username, password });

      if (!username || !password) {
        setError("Please enter both username and password");
        return;
      }

      const dbResponse = await checkUserAuth({ username, password });
      console.log("Auth response:", dbResponse);

      if (!dbResponse.success) {
        setError(dbResponse.message || "Login failed");
        return;
      }

      // Set user in store
      setUser({
        id: dbResponse.userId || "",
        username,
        email: dbResponse.email,
      });

      // Navigate to chat
      navigate("/chat");
      console.log("Login successful");
      toast.success(`Welcome back, ${username}! 🎉`);
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    navigate("/sign-up");
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password functionality
    console.log("Forgot password clicked");
  };

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-cream-100 via-cream-200 to-cream-300">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-5 bg-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Terminal Header */}
      <div className="text-center mb-8 relative z-10">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-terminal-black border-2 border-terminal-black rounded-neu shadow-neu flex items-center justify-center">
            <svg
              className="w-8 h-8 text-cream-100"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h1 className="font-mono font-bold text-4xl text-terminal-black text-shadow-retro">
            WARTALAAP
          </h1>
        </div>

        <p className="text-terminal-light-gray font-mono text-lg max-w-md mx-auto">
          Welcome back to the retro chat terminal
        </p>

        {/* Terminal-style cursor */}
        <div className="inline-block w-3 h-6 bg-terminal-black ml-2 animate-pulse" />
      </div>

      {/* Login Form */}
      <div className="relative z-10 w-full max-w-md">
        <LoginForm
          onSubmit={handleLogin}
          onSignUp={handleSignUp}
          onForgotPassword={handleForgotPassword}
          loading={loading}
          error={error}
          className="animate-fade-in"
        />
      </div>

      {/* Footer */}
      <div className="mt-12 text-center relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-terminal-light-gray font-mono">
          <span>&copy; 2024 Wartalaap</span>
          <div className="hidden sm:block w-1 h-1 bg-terminal-light-gray rounded-full" />
          <button className="hover:text-terminal-black transition-colors underline">
            Privacy Policy
          </button>
          <div className="hidden sm:block w-1 h-1 bg-terminal-light-gray rounded-full" />
          <button className="hover:text-terminal-black transition-colors underline">
            Terms of Service
          </button>
        </div>

        {/* Status indicators */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-accent-green border-2 border-terminal-black rounded-full" />
            <span className="text-xs font-mono text-terminal-light-gray">
              Server Online
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-accent-green border-2 border-terminal-black rounded-full animate-pulse" />
            <span className="text-xs font-mono text-terminal-light-gray">
              Real-time Ready
            </span>
          </div>
        </div>
      </div>

      {/* Floating elements for visual interest */}
      <div
        className="fixed top-10 left-10 w-4 h-4 bg-accent-yellow border-2 border-terminal-black rounded-full shadow-neu animate-bounce"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="fixed top-20 right-16 w-6 h-6 bg-accent-blue border-2 border-terminal-black rounded-full shadow-neu animate-bounce"
        style={{ animationDelay: "0.5s" }}
      />
      <div
        className="fixed bottom-16 left-20 w-5 h-5 bg-accent-orange border-2 border-terminal-black rounded-full shadow-neu animate-bounce"
        style={{ animationDelay: "1s" }}
      />

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-terminal-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-cream-100 border-2 border-terminal-black rounded-neu shadow-neu p-6 flex items-center gap-4">
            <div className="w-6 h-6 border-2 border-terminal-black border-t-transparent rounded-full animate-spin" />
            <span className="font-mono text-terminal-black">Signing in...</span>
          </div>
        </div>
      )}

      {/* Responsive adjustments */}
      <style>{`
        @media (max-width: 640px) {
          .text-4xl { font-size: 2.5rem; }
        }

        @media (max-height: 700px) {
          .min-h-screen { min-height: auto; padding-top: 2rem; padding-bottom: 2rem; }
        }
      `}</style>
    </div>
  );
};

export default SignIn;
