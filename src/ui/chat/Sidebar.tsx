import React, { useState, useEffect } from "react";
import { useAction, useQuery } from "convex/react";
import Button, { IconButton } from "../Button";
import { SearchInput } from "../Input";
import Card, { CardHeader, CardBody } from "../Card";
import { cn } from "../../utils/cn";
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
  isGroup?: boolean;
}

const LoadingSkeleton: React.FC = () => (
  <div className="p-4 space-y-3">
    {Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className="loading-skeleton h-16 rounded-neu" />
    ))}
  </div>
);

const EmptyState: React.FC<{
  isSearching: boolean;
  onNewChat: () => void;
  onClearSearch: () => void;
}> = ({ isSearching, onNewChat, onClearSearch }) => (
  <div className="p-8 text-center">
    {isSearching ? (
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
          Try a different username...
        </p>
        <Button variant="ghost" size="sm" onClick={onClearSearch}>
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
);

const ImprovedConversationItem: React.FC<{
  conversation: ConversationData;
  isActive: boolean;
  onClick: () => void;
  formatTimestamp: (timestamp: string) => string;
}> = ({ conversation, isActive, onClick, formatTimestamp }) => (
  <div
    className={cn(
      "px-3 py-4 mx-2 mb-1 cursor-pointer rounded-lg transition-all duration-200 touch-manipulation",
      "lg:px-4 lg:py-3",
      "active:scale-95 active:bg-cream-300",
      isActive
        ? "bg-terminal-black text-cream-100 shadow-lg border-l-4 border-accent-green"
        : "bg-transparent hover:bg-cream-200",
    )}
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="h-12 w-12 flex items-center justify-center border-2 border-terminal-black rounded-4xl overflow-hidden pt-1.5">
          {conversation.isGroup ? (
            <svg
              className={cn(
                "w-13 h-13 flex-shrink-0",
                isActive ? "text-accent-green" : "text-terminal-light-gray",
              )}
              fill="termibal-black"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          ) : (
            <svg
              className={cn(
                "w-12 h-12 flex-shrink-0",
                isActive ? "text-accent-green" : "text-terminal-light-gray",
              )}
              fill="terminal-black"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              "font-medium text-md truncate",
              isActive ? "text-cream-100" : "text-terminal-black",
            )}
          >
            {conversation.name}
          </h3>
          <p
            className={cn(
              "text-xs truncate mt-1",
              isActive ? "text-cream-200" : "text-terminal-light-gray",
            )}
          >
            {conversation.lastMessage || "No messages yet"}
          </p>
        </div>
      </div>
      {conversation.timestamp && (
        <span
          className={cn(
            "text-xs flex-shrink-0 ml-3",
            isActive ? "text-accent-green" : "text-terminal-light-gray",
          )}
        >
          {formatTimestamp(conversation.timestamp)}
        </span>
      )}
    </div>
  </div>
);

const Sidebar: React.FC<SidebarProps> = ({
  onSelectConversation,
  onNewChat,
  activeConversationId,
  className,
}) => {
  const { user, removeUser } = useAuthStore();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState<ConversationData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const userConversations = useQuery(
    api.conversation.queryUserConversations,
    user?.id ? { userId: user.id as Id<"users"> } : "skip",
  );
  // @ts-expect-error - API function exists but may not be in generated types
  const getUsernameById = useAction(api.conversation.getUsernameById);

  useEffect(() => {
    const processConversations = async () => {
      if (!userConversations || !user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const processed = await Promise.all(
          userConversations
            .filter((conv) => conv?._id)
            .map(async (conv) => {
              if (!conv) return null;

              let displayName = "Unknown";

              if (conv.isGroup) {
                displayName = conv.name || "Group Chat";
              } else {
                const users = conv.pairKey?.split(":");
                const otherUserId =
                  users?.[0] === user.id ? users?.[1] : users?.[0];
                if (otherUserId) {
                  try {
                    displayName = await getUsernameById({
                      userId: otherUserId,
                    });
                  } catch (error) {
                    console.error("Failed to get username:", error);
                    displayName = "Unknown User";
                  }
                }
              }

              return {
                id: conv._id,
                name: displayName,
                lastMessage: conv.isGroup
                  ? "Group conversation"
                  : "Direct message",
                timestamp: new Date(conv._creationTime).toISOString(),
                isGroup: conv.isGroup || false,
              };
            }),
        );

        const validConversations = processed.filter(
          (conv): conv is NonNullable<typeof conv> => conv !== null,
        );

        const sorted = validConversations.sort(
          (a, b) =>
            new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime(),
        );

        setConversations(sorted);
      } catch (error) {
        console.error("Failed to process conversations:", error);
        setConversations([]);
      } finally {
        setLoading(false);
      }
    };

    processConversations();
  }, [userConversations, user?.id, getUsernameById]);

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      conv.name.toLowerCase().includes(query) ||
      conv.lastMessage?.toLowerCase().includes(query)
    );
  });

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const handleLogout = () => {
    removeUser();
    navigate("/login");
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <Card className={cn("sidebar h-full w-full", className)} padding="none">
      <CardHeader
        title="Conversations"
        action={
          <div className="flex items-center gap-1">
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
              className="h-9 w-9"
            />
          </div>
        }
      />

      <CardBody className="pb-0 flex flex-col h-full p-0">
        <div className="pt-3 px-3 lg:pt-4 lg:px-2">
          <SearchInput
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={handleClearSearch}
            disabled={loading}
            className="h-11 text-base lg:h-auto lg:text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter" && filteredConversations.length > 0) {
                const firstConversation = filteredConversations[0];
                onSelectConversation(
                  firstConversation.id,
                  firstConversation.name,
                  firstConversation.isGroup || false,
                );
                setSearchQuery(""); // Clear search after selection
              }
            }}
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <LoadingSkeleton />
          ) : filteredConversations.length === 0 ? (
            <EmptyState
              isSearching={!!searchQuery}
              onNewChat={onNewChat}
              onClearSearch={handleClearSearch}
            />
          ) : (
            <div className="px-0 py-2">
              {filteredConversations.map((conversation) => (
                <ImprovedConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isActive={conversation.id === activeConversationId}
                  onClick={() => {
                    onSelectConversation(
                      conversation.id,
                      conversation.name,
                      conversation.isGroup || false,
                    );
                  }}
                  formatTimestamp={formatTimestamp}
                />
              ))}
            </div>
          )}
        </div>

        <div className="p-3 lg:p-4 border-t-2 border-terminal-black bg-cream-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 lg:w-8 lg:h-8 rounded-full bg-terminal-black flex items-center justify-center flex-shrink-0 user-avatar">
                <span className="text-white font-medium text-base lg:text-sm">
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-mono font-bold text-base lg:text-sm text-terminal-black truncate">
                  {user?.username || "Unknown User"}
                </p>
                <p className="text-sm lg:text-xs text-terminal-light-gray truncate">
                  {user?.email || "No email"}
                </p>
              </div>
            </div>
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
              onClick={handleLogout}
              className="h-10 w-10 lg:h-8 lg:w-8"
            />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default Sidebar;
