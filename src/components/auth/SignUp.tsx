import { useAction, useMutation } from "convex/react";
import { useState, useEffect } from "react";
import { useAuthStore } from "../../../stores/authStore";
import { api } from "../../../convex/_generated/api";
import { useNavigate } from "react-router";
import SignUpForm from "../../ui/auth/SignUpForm";
import toast from "react-hot-toast";

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  // Convex action and mutation
  const checkUserExists = useAction(api.auth.checkUser);
  const createUser = useMutation(api.auth.createUser);

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

  const handleSignUp = async (data: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
  }) => {
    const { username, email, password } = data;

    setLoading(true);
    setError("");

    try {
      if (!username || !email || !password) {
        setError("Please fill in all required fields");
        toast.error("Please fill in all required fields");
        return;
      }

      // Check if username is already taken
      toast("Checking username availability...", { icon: "🔍" });
      const dbResponse = await checkUserExists({ username, action: "signup" });

      if (!dbResponse.success) {
        const errorMsg = dbResponse.message || "Username is already taken";
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      // Create the user
      toast("Setting up your profile...", { icon: "⚙️" });
      const userId = await createUser({ username, email, password });

      // Set user in store
      setUser({
        id: userId,
        username,
        email,
      });

      // Show success toast
      toast.success(`Welcome to Wartalaap, ${username}! 🎉`);

      // Navigate to chat
      navigate("/chat");
    } catch (err) {
      console.error("Sign up error:", err);
      const errorMsg = "An unexpected error occurred. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-cream-100 via-cream-200 to-cream-300 relative">
      {/* Main Container - Mobile First */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header Section */}
        <div className="flex-shrink-0 text-center pt-8 pb-2 px-4">
          <div className="inline-flex items-center gap-2 mb-4">
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
            Join the conversation in style
          </p>

          {/* Terminal-style cursor */}
          <div className="inline-block w-3 h-6 bg-terminal-black ml-2 animate-pulse" />
        </div>

        {/* Form Section - Flexible */}
        <div className="flex-1 flex items-start md:items-center justify-center px-4 pb-8">
          <div className="w-full max-w-md">
            <SignUpForm
              onSubmit={handleSignUp}
              onSignIn={handleSignIn}
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
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-terminal-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-cream-100 border-2 border-terminal-black rounded-neu shadow-neu p-6 flex items-center gap-4 mx-4">
            <div className="w-6 h-6 border-2 border-terminal-black border-t-transparent rounded-full animate-spin" />
            <span className="font-mono text-terminal-black">
              Creating account...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
