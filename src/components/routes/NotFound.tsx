import { Link } from "react-router";
import { useAuthStore } from "../../../stores/authStore";

const NotFoundPage: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-100 via-cream-200 to-cream-300 relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-5 bg-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Terminal Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-terminal-black border-2 border-terminal-black rounded-neu shadow-neu flex items-center justify-center">
              <svg
                className="w-10 h-10 md:w-12 md:h-12 text-cream-100"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="font-mono font-bold text-3xl md:text-5xl text-terminal-black text-shadow-retro">
              WARTALAAP
            </h1>
          </div>
        </div>

        {/* 404 Display */}
        <div className="text-center mb-8">
          <div className="relative">
            {/* Glitch effect background */}
            <div className="absolute inset-0 font-mono font-black text-6xl md:text-9xl text-accent-red opacity-20 transform translate-x-1 translate-y-1 animate-pulse">
              404
            </div>
            <div className="absolute inset-0 font-mono font-black text-6xl md:text-9xl text-accent-blue opacity-20 transform -translate-x-1 -translate-y-1 animate-pulse">
              404
            </div>

            {/* Main 404 */}
            <h2 className="relative font-mono font-black text-6xl md:text-9xl text-terminal-black tracking-wider">
              404
            </h2>
          </div>
        </div>

        {/* Error Message */}
        <div className="bg-cream-100 border-2 border-terminal-black rounded-neu shadow-neu p-6 md:p-8 max-w-md mx-auto mb-8">
          <div className="text-center">
            <h3 className="font-mono font-bold text-xl md:text-2xl text-terminal-black mb-4">
              PAGE NOT FOUND
            </h3>
            <p className="font-mono text-sm md:text-base text-terminal-light-gray leading-relaxed mb-6">
              The page you're looking for has wandered off into the digital
              void. It might have been moved, deleted, or is hiding in another
              dimension.
            </p>

            {/* Terminal-style error */}
            <div className="bg-terminal-black border-2 border-terminal-black rounded p-4 mb-6 bg-black">
              <div className="font-mono text-xs md:text-sm text-white text-left">
                <div>
                  <span className="text-green-400">user@wartalaap:~$</span> find
                  /page
                </div>
                <div className="text-red-500">
                  find: '/page': No such file or directory
                </div>
                <span className="text-green-400">user@wartalaap:~$</span>
                <span className="animate-pulse text-cream-100">█</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.history.back()}
                className="btn-neu bg-accent-blue border-2 border-terminal-black px-6 py-3 font-mono font-bold text-cream-100 hover:bg-accent-blue-hover transition-colors"
              >
                ⬅️ Go Back
              </button>
            </div>
          </div>
        </div>

        {/* Fun ASCII Art */}
        <div className="text-center mb-8">
          <pre className="font-mono text-xs md:text-sm text-terminal-light-gray leading-tight">
            {`    ╭─────---────────────────╮
    │      ¯\\_(ツ)_/¯        │
    │                        │
    │     Something went     │
    │     wrong here...      │
    ╰──---───────────────────╯`}
          </pre>
        </div>

        {/* Footer */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 text-sm text-terminal-light-gray font-mono">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-accent-red border-2 border-terminal-black rounded-full animate-pulse" />
              <span className="text-xs">Error 404</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-accent-orange border-2 border-terminal-black rounded-full" />
              <span className="text-xs">System Alert</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Styling */}
      <style>{`
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }

        .glitch:hover {
          animation: glitch 0.3s ease-in-out infinite;
        }

        @media (max-width: 640px) {
          .text-6xl { font-size: 3.5rem; }
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;
