import { useAction } from "convex/react";
import { useState, useEffect } from "react";
import { useAuthStore } from "../../../stores/authStore";
import { api } from "../../../convex/_generated/api";
import { useNavigate } from "react-router";
import LoginForm from "../../ui/auth/LoginForm";
import toast from "react-hot-toast";

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  // Convex action
  const checkUserAuth = useAction(api.auth.checkUser);

  // Zustand states
  const { setUser } = useAuthStore();

  // Enable scrolling on mobile, disable on desktop
  useEffect(() => {
    const updateScrollBehavior = () => {
      const isMobile = window.innerWidth <= 768;

      if (isMobile) {
        document.documentElement.style.overflow = "auto";
        document.body.style.overflow = "auto";
        const root = document.getElementById("root");
        if (root) root.style.overflow = "auto";
      } else {
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
        const root = document.getElementById("root");
        if (root) root.style.overflow = "hidden";
      }
    };

    updateScrollBehavior();
    window.addEventListener("resize", updateScrollBehavior);

    return () => {
      window.removeEventListener("resize", updateScrollBehavior);
      // Reset to original values
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      const root = document.getElementById("root");
      if (root) root.style.overflow = "hidden";
    };
  }, []);

  const handleLogin = async (data: { username: string; password: string }) => {
    const { username, password } = data;

    setLoading(true);
    setError("");

    try {
      console.log("Logging in user:", { username, password });

      if (!username || !password) {
        const errorMsg = "Please enter both username and password";
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      const dbResponse = await checkUserAuth({ username, password });
      console.log("Auth response:", dbResponse);

      if (!dbResponse.success) {
        const errorMsg = dbResponse.message || "Login failed";
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      // Set user in store
      setUser({
        id: dbResponse.userId || "",
        username,
        email: dbResponse.email,
      });

      // Show success toast
      toast.success(`Welcome back, ${username}! 🎉`);

      // Navigate to chat
      navigate("/chat");
      console.log("Login successful");
    } catch (err) {
      console.error("Login error:", err);
      const errorMsg = "An unexpected error occurred. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
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
    toast("Forgot password feature coming soon!", { icon: "🔧" });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-cream-100 via-cream-200 to-cream-300 relative">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-5 bg-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Main Container - Mobile First */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header Section */}
        <div className="flex-shrink-0 text-center pt-8 pb-6 px-4">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-terminal-black border-2 border-terminal-black rounded-neu shadow-neu flex items-center justify-center">
              <svg
                className="w-6 h-6 md:w-8 md:h-8 text-cream-100"
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
            <h1 className="font-mono font-bold text-2xl md:text-4xl text-terminal-black text-shadow-retro">
              WARTALAAP
            </h1>
          </div>

          <p className="text-terminal-light-gray font-mono text-base md:text-lg max-w-md mx-auto">
            Welcome back to the retro chat terminal
          </p>

          {/* Terminal-style cursor */}
          <div className="inline-block w-3 h-6 bg-terminal-black ml-2 animate-pulse" />
        </div>

        {/* Form Section - Flexible */}
        <div className="flex-1 flex items-start md:items-center justify-center px-4 pb-8">
          <div className="w-full max-w-md">
            <LoginForm
              onSubmit={handleLogin}
              onSignUp={handleSignUp}
              onForgotPassword={handleForgotPassword}
              loading={loading}
              error={error}
              className="animate-fade-in"
            />
          </div>
        </div>

        {/* Footer Section */}
        <div className="flex-shrink-0 text-center pb-6 px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-terminal-light-gray font-mono mb-4">
            <span>&copy; 2026 Wartalaap</span>
            <div className="hidden sm:block w-1 h-1 bg-terminal-light-gray rounded-full" />
            <button className="hover:text-terminal-black transition-colors underline">
              Privacy Policy
            </button>
            <div className="hidden sm:block w-1 h-1 bg-terminal-light-gray rounded-full" />
            <button className="hover:text-terminal-black transition-colors underline">
              Terms of Service
            </button>
          </div>
        </div>

        {/* Loading overlay */}
        {loading && (
          <div className="fixed inset-0 bg-terminal-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-cream-100 border-2 border-terminal-black rounded-neu shadow-neu p-6 flex items-center gap-4 mx-4">
              <div className="w-6 h-6 border-2 border-terminal-black border-t-transparent rounded-full animate-spin" />
              <span className="font-mono text-terminal-black">
                Signing in...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignIn;
