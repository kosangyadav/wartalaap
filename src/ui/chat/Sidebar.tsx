import React, { useState, useEffect } from "react";
import { useAction, useQuery } from "convex/react";
import Button, { IconButton } from "../Button";
import { SearchInput } from "../Input";
import Card, { CardHeader, CardBody, ConversationItem } from "../Card";
import { cn } from "../../utils/cn";
import { useUIStore } from "../../../stores/uiStore";
import { useAuthStore } from "../../../stores/authStore";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { useNavigate } from "react-router";

export interface SidebarProps {
  onSelectConversation: (
    conversationId: string,
    conversationName: string,
    isGroup: boolean,
  ) => void;
  onNewChat: () => void;
  activeConversationId?: string;
  className?: string;
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

export interface UserData {
  id: string;
  username: string;
  email?: string;
  status?: "online" | "away" | "busy" | "offline";
}

const Sidebar: React.FC<SidebarProps> = ({
  onSelectConversation,
  onNewChat,
  activeConversationId,
  className,
}) => {
  const { isSidebarOpen, toggleSidebar } = useUIStore();
  const { user, removeUser } = useAuthStore();
  const navigate = useNavigate();

  // Convex queries
  const userConversations = useQuery(
    api.conversation.queryUserConversations,
    user?.id ? { userId: user.id as Id<"users"> } : "skip",
  );
  const getUsernameById = useAction(api.conversation.getUsernameById);

  // Local state
  const [conversations, setConversations] = useState<ConversationData[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<
    ConversationData[]
  >([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");

  // Process conversations from Convex
  useEffect(() => {
    const processesForConversationNames = async () => {
      if (!userConversations || !user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const processedConversations = await Promise.all(
          userConversations
            .filter((conv) => conv && conv._id)
            .map(async (conv) => {
              if (!conv) return null;

              let displayName = "Unknown";

              if (conv.isGroup) {
                displayName = conv.name || "Group Chat";
              } else {
                // For direct messages, extract the other user's ID from pairKey
                const users = conv.pairKey?.split(":");
                const otherUserId =
                  users?.[0] === user.id ? users?.[1] : users?.[0];
                // displayName = otherUserId
                //   ? `User ${otherUserId.slice(-4)}`
                //   : "Private Chat";
                displayName = await getUsernameById({ userId: otherUserId });
              }

              return {
                id: conv._id,
                name: displayName,
                lastMessage: conv.isGroup
                  ? "Group conversation"
                  : "Direct message",
                timestamp: new Date(conv._creationTime).toISOString(),
                unreadCount: 0,
                isGroup: conv.isGroup || false,
                status: "online" as const,
                isTyping: false,
              };
            })
            .filter((conv): conv is NonNullable<typeof conv> => conv !== null)
            .sort(
              (a, b) =>
                new Date(b.timestamp!).getTime() -
                new Date(a.timestamp!).getTime(),
            ),
        );

        setConversations(processedConversations);
      } catch (error) {
        console.error("Failed to process conversations:", error);
      } finally {
        setLoading(false);
      }
    };
    processesForConversationNames();
  }, [userConversations, user?.id]);

  // Filter conversations based on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredConversations(conversations);
    } else {
      const filtered = conversations.filter(
        (conv) =>
          conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          conv.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredConversations(filtered);
    }
  }, [conversations, searchQuery]);

  const handleClearSearch = () => {
    onSearchChange("");
  };

  const handleSelectConversation = (
    conversationId: string,
    conversationName: string,
    isGroup: boolean,
  ) => {
    onSelectConversation(conversationId, conversationName, isGroup);
  };

  const handleLogout = async () => {
    try {
      removeUser();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/login");
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (hours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  // Responsive sidebar classes
  const sidebarClasses = cn(
    "sidebar h-full transition-all duration-300 ease-in-out",
    "lg:relative lg:translate-x-0",
    isSidebarOpen
      ? "fixed inset-y-0 left-0 z-50 w-80 translate-x-0"
      : "fixed inset-y-0 left-0 z-50 w-80 -translate-x-full",
    "lg:w-full lg:max-w-none",
    className,
  );

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-terminal-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <Card className={sidebarClasses} padding="none">
        {/* Header */}
        <CardHeader
          title="Conversations"
          action={
            <div className="flex items-center gap-2">
              <IconButton
                icon={
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
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                }
                tooltip="New Chat"
                onClick={onNewChat}
                variant="ghost"
                disabled={loading}
              />
              <IconButton
                icon={
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                }
                tooltip="Close Sidebar"
                onClick={toggleSidebar}
                variant="ghost"
                className="lg:hidden"
              />
            </div>
          }
        />

        <CardBody className="pb-0 flex flex-col h-full p-0">
          {/* Search */}
          <div className="pt-4 px-2">
            <SearchInput
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={handleClearSearch}
              disabled={loading}
            />
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="loading-skeleton h-16 rounded-neu"
                  />
                ))}
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                {searchQuery ? (
                  <div className="space-y-3">
                    <svg
                      className="w-12 h-12 mx-auto text-terminal-light-gray"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <h3 className="font-mono font-bold text-terminal-black">
                      No results found
                    </h3>
                    <p className="text-sm text-terminal-light-gray">
                      Try a different search chat name...
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearchQuery("")}
                    >
                      Clear search
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <svg
                      className="w-12 h-12 mx-auto text-terminal-light-gray"
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
                    <h3 className="font-mono font-bold text-terminal-black">
                      No conversations yet
                    </h3>
                    <p className="text-sm text-terminal-light-gray">
                      Start a new conversation to get chatting!
                    </p>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={onNewChat}
                      leftIcon={
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      }
                    >
                      New Chat
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {filteredConversations.map((conversation) => (
                  <ConversationItem
                    key={conversation.id}
                    name={conversation.name}
                    lastMessage={conversation.lastMessage}
                    timestamp={
                      conversation.timestamp
                        ? formatTimestamp(conversation.timestamp)
                        : undefined
                    }
                    // unreadCount={conversation.unreadCount}
                    isActive={conversation.id === activeConversationId}
                    // status={conversation.status}
                    // isTyping={conversation.isTyping}
                    onClick={() =>
                      handleSelectConversation(
                        conversation.id,
                        conversation.name,
                        conversation.isGroup,
                      )
                    }
                    className={cn(
                      "transition-all duration-200",
                      conversation.id === activeConversationId &&
                        "animate-glow",
                    )}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t-2 border-terminal-black bg-cream-300">
            <div className="flex items-center gap-2">
              <IconButton
                icon={
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
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                }
                tooltip="Settings"
                variant="ghost"
                className="flex-1"
              />
              <IconButton
                icon={
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
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                }
                tooltip="Logout"
                variant="ghost"
                className="flex-1"
                onClick={handleLogout}
              />
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default Sidebar;
