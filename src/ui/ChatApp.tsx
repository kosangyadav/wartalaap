import React, { useState, useEffect } from "react";
import Sidebar from "./chat/Sidebar";
import ChatArea from "./chat/ChatArea";
import NewChatModal from "./chat/NewChatModal";
import { cn } from "../utils/cn";
import { useUIStore } from "../../stores/uiStore";
import toast from "react-hot-toast";

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

  const [availableUsers, setAvailableUsers] = useState<UserData[]>([]);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [loading, setLoading] = useState({
    conversations: false,
    users: false,
    creatingChat: false,
  });

  // UI Store
  const { isSidebarOpen } = useUIStore();

  // Get active conversation data
  const activeConversation = activeConversationId
    ? {
        id: activeConversationId,
        name: activeConversationName || "Unknown",
        isGroup: false,
        status: "online" as const,
      }
    : undefined;

  // Load initial data
  useEffect(() => {
    // loadConversations();
    loadAvailableUsers();

    // TODO: Connect to websocket for real-time updates
    // const ws = new WebSocket('ws://localhost:3000');
    // ws.onmessage = handleWebSocketMessage;
    // return () => ws.disconnect();
  }, [currentUser.id]);

  // Messages are now handled directly by ChatArea component

  // Conversations are now managed by Sidebar component

  const loadAvailableUsers = async () => {
    setLoading((prev) => ({ ...prev, users: true }));

    try {
      // TODO: Replace with actual API call
      // const response = await api.users.getAll();

      // Mock data for demonstration
      const mockUsers: UserData[] = [
        {
          id: "2",
          username: "John Doe",
          email: "john@example.com",
          status: "online",
        },
        {
          id: "3",
          username: "Alice Smith",
          email: "alice@example.com",
          status: "away",
        },
        {
          id: "4",
          username: "Bob Wilson",
          email: "bob@example.com",
          status: "offline",
        },
        {
          id: "5",
          username: "Carol Brown",
          email: "carol@example.com",
          status: "busy",
        },
        {
          id: "6",
          username: "David Johnson",
          email: "david@example.com",
          status: "online",
        },
      ];

      setAvailableUsers(mockUsers);
    } catch (error) {
      console.error("Failed to load users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading((prev) => ({ ...prev, users: false }));
    }
  };

  const handleSelectConversation = (
    conversationId: string,
    conversationName: string,
  ) => {
    setActiveConversationId(conversationId);
    setActiveConversationName(conversationName);

    // TODO: Mark conversation as read
    // await api.conversations.markAsRead(conversationId);

    // Messages are now loaded directly by ChatArea component
  };

  const handleCreateChat = async (
    userIds: string[],
    isGroup?: boolean,
    groupName?: string,
  ) => {
    setLoading((prev) => ({ ...prev, creatingChat: true }));

    try {
      // TODO: Replace with actual API call
      // const response = await api.conversations.create({
      //   userIds: [...userIds, currentUser.id],
      //   isGroup,
      //   name: groupName
      // });

      // Mock conversation creation
      const participants = availableUsers.filter((u) => userIds.includes(u.id));
      const newConversation: ConversationData = {
        id: `conv-${Date.now()}`,
        name:
          isGroup && groupName
            ? groupName
            : participants[0]?.username || "New Chat",
        lastMessage: "",
        timestamp: new Date().toISOString(),
        unreadCount: 0,
        isGroup: isGroup || false,
        participants: [...participants, currentUser],
        status: participants[0]?.status || "offline",
        isTyping: false,
      };

      setActiveConversationId(newConversation.id);
      setActiveConversationName(newConversation.name);

      toast.success(`${isGroup ? "Group" : "Chat"} created successfully! 🎉`);
    } catch (error) {
      console.error("Failed to create chat:", error);
      console.error("Failed to create chat");
      throw error; // Re-throw to let modal handle it
    } finally {
      setLoading((prev) => ({ ...prev, creatingChat: false }));
    }
  };

  // Search is now handled directly by Sidebar component

  const handleNewChat = () => {
    setIsNewChatModalOpen(true);
  };

  // TODO: WebSocket message handler
  // const handleWebSocketMessage = (data: any) => {
  //   switch (data.type) {
  //     case 'new_message':
  //       setMessages(prev => [...prev, data.message]);
  //       // Update conversation last message
  //       setConversations(prev => prev.map(conv =>
  //         conv.id === data.message.conversationId
  //           ? { ...conv, lastMessage: data.message.content, timestamp: data.message.timestamp }
  //           : conv
  //       ));
  //       break;
  //     case 'typing':
  //       if (data.conversationId === activeConversationId) {
  //         setTypingUsers(prev =>
  //           data.isTyping
  //             ? [...prev.filter(u => u.id !== data.userId), data.user]
  //             : prev.filter(u => u.id !== data.userId)
  //         );
  //       }
  //       break;
  //     case 'user_status_changed':
  //       setAvailableUsers(prev => prev.map(user =>
  //         user.id === data.userId ? { ...user, status: data.status } : user
  //       ));
  //       break;
  //     case 'conversation_updated':
  //       setConversations(prev => prev.map(conv =>
  //         conv.id === data.conversation.id ? data.conversation : conv
  //       ));
  //       break;
  //   }
  // };

  return (
    <div
      className={cn(
        "h-screen max-h-screen overflow-hidden bg-cream-100",
        className,
      )}
    >
      {/* Main Chat Layout */}
      <div className="grid-chat overflow-hidden">
        {/* Sidebar */}
        <div className="sidebar-area min-h-0">
          <Sidebar
            onSelectConversation={handleSelectConversation}
            onNewChat={handleNewChat}
            onSearchChange={() => {}} // Placeholder - Sidebar handles search internally
            searchQuery=""
            activeConversationId={activeConversationId}
          />
        </div>

        {/* Chat Area */}
        <div className="chat-main-area min-h-0">
          <ChatArea
            conversation={activeConversation}
            currentUser={currentUser}
            className="h-full"
          />
        </div>
      </div>

      {/* New Chat Modal */}
      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onCreateChat={handleCreateChat}
        users={availableUsers}
        currentUser={currentUser}
        loading={loading.creatingChat}
      />

      {/* Mobile Sidebar Toggle */}
      {!isSidebarOpen && (
        <button
          className="fixed top-4 left-4 z-40 btn-primary btn-icon lg:hidden"
          onClick={() => {
            const { toggleSidebar } = useUIStore.getState();
            toggleSidebar();
          }}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      )}
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
