import React, { useState } from "react";
import Card, { CardBody } from "../Card";
import { cn } from "../../utils/cn";

export interface AuthLayoutProps {
  onLogin: (data: { email: string; password: string }) => Promise<void>;
  onSignUp: (data: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
  }) => Promise<void>;
  loading?: boolean;
  error?: string;
  className?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  onLogin,
  onSignUp,
  loading = false,
  error,
  className,
}) => {
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleModeSwitch = (newMode: "login" | "signup") => {
    if (newMode === authMode || loading) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setAuthMode(newMode);
      setIsTransitioning(false);
    }, 150);
  };

  return (
    <div
      className={cn(
        "min-h-screen bg-cream-100 flex flex-col items-center justify-center p-4",
        "bg-gradient-to-br from-cream-100 via-cream-200 to-cream-300",
        className,
      )}
    >
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
          {authMode === "login"
            ? "Welcome back to the retro chat terminal"
            : "Join the conversation in style"}
        </p>

        {/* Terminal-style cursor */}
        <div className="inline-block w-3 h-6 bg-terminal-black ml-2 animate-pulse" />
      </div>

      {/* Mode Toggle Pills */}
      <div className="mb-8 relative z-10">
        <div className="bg-cream-200 border-2 border-terminal-black rounded-neu p-1 flex">
          <button
            onClick={() => handleModeSwitch("login")}
            disabled={loading || isTransitioning}
            className={cn(
              "px-6 py-2 text-sm font-mono font-bold rounded-neu-sm transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-accent-green focus:ring-offset-2",
              authMode === "login"
                ? "bg-accent-green text-white shadow-retro-sm"
                : "text-terminal-black hover:bg-cream-300",
            )}
          >
            LOGIN
          </button>
          <button
            onClick={() => handleModeSwitch("signup")}
            disabled={loading || isTransitioning}
            className={cn(
              "px-6 py-2 text-sm font-mono font-bold rounded-neu-sm transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-accent-green focus:ring-offset-2",
              authMode === "signup"
                ? "bg-accent-green text-white shadow-retro-sm"
                : "text-terminal-black hover:bg-cream-300",
            )}
          >
            SIGN UP
          </button>
        </div>
      </div>

      {/* Auth Forms Container */}
      <div
        className={cn(
          "relative w-full max-w-md transition-opacity duration-150",
          isTransitioning && "opacity-50",
        )}
      >
        {authMode === "login" ? (
          <LoginForm
            onSubmit={onLogin}
            onSignUp={() => handleModeSwitch("signup")}
            loading={loading}
            error={error}
            className="animate-fade-in"
          />
        ) : (
          <SignUpForm
            onSubmit={onSignUp}
            onSignIn={() => handleModeSwitch("login")}
            loading={loading}
            error={error}
            className="animate-fade-in"
          />
        )}
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
            <div className="status-online" />
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
          <Card className="p-6 flex items-center gap-4">
            <div className="spinner" />
            <span className="font-mono text-terminal-black">
              {authMode === "login" ? "Signing in..." : "Creating account..."}
            </span>
          </Card>
        </div>
      )}

      {/* Responsive adjustments */}
      <style jsx>{`
        @media (max-width: 640px) {
          .text-4xl {
            font-size: 2.5rem;
          }
        }

        @media (max-height: 700px) {
          .min-h-screen {
            min-height: auto;
            padding-top: 2rem;
            padding-bottom: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;

// TODO: Integration points
// - Connect to authentication API endpoints
// - Add social login options (Google, GitHub, etc.)
// - Implement password reset functionality
// - Add email verification flow
// - Implement remember me functionality
// - Add CAPTCHA for bot protection
// - Connect to analytics for tracking auth events
// - Add progressive enhancement for slow networks
// - Implement keyboard navigation improvements
// - Add internationalization support
// - Connect to error reporting service
// - Add A/B testing for conversion optimization
