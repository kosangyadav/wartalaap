import React, { useState, useEffect } from "react";
import Sidebar from "./chat/Sidebar";
import ChatArea from "./chat/ChatArea";
import NewChatModal from "./chat/NewChatModal";
import { cn } from "../utils/cn";
import { useUIStore } from "../../stores/uiStore";

export interface ChatAppProps {
  currentUser: UserData;
  className?: string;
}

export interface UserData {
  id: string;
  username: string;
  email?: string;
  status?: "online" | "away" | "busy" | "offline";
}

export interface ConversationData {
  id: string;
  name: string;
  lastMessage?: string;
  timestamp?: string;
  unreadCount?: number;
  isGroup?: boolean;
  participants?: UserData[];
  status?: "online" | "away" | "busy" | "offline";
  isTyping?: boolean;
}

export interface MessageData {
  id: string;
  content: string;
  senderId: string;
  timestamp: string;
  type?: "text" | "image" | "file" | "system";
  status?: "sending" | "sent" | "delivered" | "read" | "failed";
  replyTo?: string;
}

const ChatApp: React.FC<ChatAppProps> = ({ currentUser, className }) => {
  // State management
  const [activeConversationId, setActiveConversationId] = useState<string>();
  const [activeConversationName, setActiveConversationName] =
    useState<string>();
  const [activeConversationType, setActiveConversationType] =
    useState<boolean>();
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [mobileView, setMobileView] = useState<"sidebar" | "chat">("sidebar");

  // UI Store
  const { setIsMobile, isMobile } = useUIStore();

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024;
      setIsMobile(isMobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsMobile]);

  // Get active conversation data
  const activeConversation = activeConversationId
    ? {
        id: activeConversationId,
        name: activeConversationName || "Unknown",
        isGroup: activeConversationType,
        status: "online" as const,
      }
    : undefined;

  const handleSelectConversation = (
    conversationId: string,
    conversationName: string,
    isGroup: boolean,
  ) => {
    setActiveConversationId(conversationId);
    setActiveConversationName(conversationName);
    setActiveConversationType(isGroup);

    if (isMobile) {
      setMobileView("chat");
    }
  };

  const handleNewChat = () => setIsNewChatModalOpen(true);

  const handleSetSelectedChat = (
    conversationId: string,
    conversationName: string,
  ) => {
    handleSelectConversation(conversationId, conversationName, false);
  };

  const handleBackToSidebar = () => setMobileView("sidebar");

  return (
    <div
      className={cn(
        "h-screen max-h-screen overflow-hidden bg-cream-100 relative",
        className,
      )}
    >
      <div className="grid-chat overflow-hidden">
        {/* Sidebar */}
        <div
          className={cn(
            "sidebar-area min-h-0",
            "lg:block",
            !isMobile || mobileView === "sidebar" ? "block" : "hidden",
          )}
        >
          <Sidebar
            onSelectConversation={handleSelectConversation}
            onNewChat={handleNewChat}
            activeConversationId={activeConversationId}
          />
        </div>

        {/* Chat Area */}
        <div
          className={cn(
            "chat-main-area min-h-0 w-full",
            "lg:block",
            !isMobile || mobileView === "chat" ? "block" : "hidden",
          )}
        >
          <ChatArea
            conversation={activeConversation}
            currentUser={currentUser}
            className="h-full"
            onBackToSidebar={handleBackToSidebar}
            showBackButton={isMobile && mobileView === "chat"}
          />
        </div>
      </div>

      {/* New Chat Modal */}
      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        setSelectedChat={handleSetSelectedChat}
      />
    </div>
  );
};

export default ChatApp;

// TODO: Integration checklist
// 1. WebSocket Integration:
//    - Initialize websocket connection on component mount
//    - Handle real-time message updates
//    - Implement typing indicators
//    - Handle user status updates
//    - Manage connection state and reconnection logic

// 2. API Integration:
//    - Replace mock data with actual API calls
//    - Implement conversation loading and pagination
//    - Add message loading with pagination
//    - Implement user search and filtering
//    - Add conversation management (create, delete, archive)

// 3. Authentication Integration:
//    - Connect to authentication store
//    - Handle user sessions and token refresh
//    - Implement logout functionality
//    - Add user profile management

// 4. Performance Optimizations:
//    - Implement virtual scrolling for large message lists
//    - Add message caching and offline support
//    - Optimize re-renders with useMemo and useCallback
//    - Implement lazy loading for conversations

// 5. Enhanced Features:
//    - File upload and sharing
//    - Message reactions and replies
//    - Message search functionality
//    - Push notifications
//    - Message encryption
//    - Voice and video calling integration
//    - Message threading
//    - Custom emoji and stickers
//    - Message formatting (markdown support)
//    - Group management (add/remove users, roles)

// 6. Error Handling:
//    - Implement comprehensive error boundaries
//    - Add retry mechanisms for failed operations
//    - Handle network connectivity issues
//    - Add user-friendly error messages

// 7. Accessibility:
//    - Add proper ARIA labels and roles
//    - Implement keyboard navigation
//    - Ensure screen reader compatibility
//    - Add focus management

// 8. Testing:
//    - Add unit tests for components
//    - Implement integration tests
//    - Add E2E tests for critical user flows
//    - Performance testing and monitoring
