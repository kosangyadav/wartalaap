import { ChatApp } from "./ui";
// import { useUIStore } from "../stores/uiStore";
import { useAuthStore } from "../stores/authStore";
import type { User } from "./ui";

const Chat: React.FC = () => {
  const { user } = useAuthStore();
  // const { isSidebarOpen, toggleSidebar } = useUIStore();
  // const [authError, setAuthError] = useState<string>("");

  // Mock current user data - TODO: Replace with actual user data from store
  const currentUser: User = {
    id: user?.id || "current-user",
    username: user?.username || "Demo User",
    email: user?.email || "demo@wartalaap.com",
    status: "online",
  };

  return (
    // Main Chat Application
    <ChatApp currentUser={currentUser} className="h-full" />
  );
};

{
  /* Development Tools - Remove in production */
}
{
  /*{process.env.NODE_ENV === "development" && (
  <div className="fixed bottom-4 right-4 z-50 space-y-2">
    <button
      onClick={toggleSidebar}
      className="btn-secondary btn-sm font-mono lg:hidden"
      title="Toggle Sidebar"
    >
      Sidebar: {isSidebarOpen ? "Open" : "Closed"}
    </button>

    <button
      onClick={handleLogout}
      className="btn-ghost btn-sm font-mono block"
      title="Logout (Dev)"
    >
      Dev: Logout
    </button>

    <div className="card-neu p-2 text-xs font-mono space-y-1">
      <div>User: {currentUser.username}</div>
      <div>Status: {currentUser.status}</div>
      <div>Sidebar: {isSidebarOpen ? "Open" : "Closed"}</div>
    </div>
  </div>
)}*/
}

export default Chat;

// TODO: Integration checklist
// 1. Authentication Integration:
//    - Connect to actual auth store actions
//    - Implement proper session management
//    - Add token refresh logic
//    - Handle authentication errors properly
//    - Add social login options

// 2. WebSocket Integration:
//    - Initialize websocket connection after authentication
//    - Handle connection states (connecting, connected, disconnected)
//    - Implement reconnection logic
//    - Add connection status indicators

// 3. API Integration:
//    - Replace mock data with actual API calls
//    - Implement proper error handling
//    - Add loading states for all operations
//    - Implement retry mechanisms

// 4. Performance Optimizations:
//    - Add code splitting for auth/chat components
//    - Implement service worker for offline support
//    - Add proper loading skeletons
//    - Optimize bundle size

// 5. Accessibility Improvements:
//    - Add proper focus management
//    - Implement keyboard shortcuts
//    - Add screen reader optimizations
//    - Ensure color contrast compliance

// 6. Error Boundaries:
//    - Add error boundaries around major components
//    - Implement error reporting
//    - Add user-friendly error fallbacks

// 7. Security Enhancements:
//    - Add CSRF protection
//    - Implement
