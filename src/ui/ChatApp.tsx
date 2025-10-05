import React, { useState, useEffect } from "react";
import Sidebar from "./chat/Sidebar";
import ChatArea from "./chat/ChatArea";
import NewChatModal from "./chat/NewChatModal";
import { cn } from "../utils/cn";
import { useUIStore } from "../../stores/uiStore";
import { useAuthStore } from "../../stores/authStore";

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

export interface ChatAppProps {
  className?: string;
}

const ChatApp: React.FC<ChatAppProps> = ({ className }) => {
  const { user } = useAuthStore();
  const { setIsMobile, isMobile } = useUIStore();

  const [activeConversationId, setActiveConversationId] = useState<string>();
  const [activeConversationName, setActiveConversationName] =
    useState<string>();
  const [activeConversationType, setActiveConversationType] =
    useState<boolean>();
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [mobileView, setMobileView] = useState<"sidebar" | "chat">("sidebar");

  const currentUser: UserData = {
    id: user?.id || "current-user",
    username: user?.username || "Demo User",
    email: user?.email || "demo@wartalaap.com",
    status: "online",
  };

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024;
      setIsMobile(isMobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsMobile]);

  const activeConversation = activeConversationId
    ? {
        id: activeConversationId,
        name: activeConversationName || "Unknown",
        isGroup: activeConversationType || false,
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

      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        setSelectedChat={handleSetSelectedChat}
      />
    </div>
  );
};

export default ChatApp;
