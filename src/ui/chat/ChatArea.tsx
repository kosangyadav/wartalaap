import React, { useState, useRef, useEffect, useCallback } from "react";
import { useMutation, useQuery } from "convex/react";
import Button, { IconButton } from "../Button";
import { Textarea } from "../Input";
import Card, { CardHeader, CardBody, MessageBubble } from "../Card";
import { cn } from "../../utils/cn";
import { useAuthStore } from "../../../stores/authStore";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import toast from "react-hot-toast";
import ConversationInfoModal from "./ConversationInfoModal";

export interface ChatAreaProps {
  conversation?: ConversationData | undefined;
  currentUser: UserData;
  className?: string;
  onBackToSidebar?: () => void;
  showBackButton?: boolean;
}

export interface ConversationData {
  id: string;
  name: string;
  isGroup: boolean;
  participants?: UserData[];
  description?: string;
}

export interface MessageData {
  _id: string;
  content: string;
  senderId: string;
  _creationTime: number;
  conversationId: string;
}

export interface UserData {
  id: string;
  username: string;
  email?: string;
  status?: "online" | "away" | "busy" | "offline";
}

const ChatArea: React.FC<ChatAreaProps> = ({
  conversation,
  className,
  onBackToSidebar,
  showBackButton = false,
}) => {
  const { user } = useAuthStore();
  const [messageInput, setMessageInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const messages = useQuery(
    api.conversation.getMsgsInConversation,
    conversation?.id
      ? { conversationId: conversation.id as Id<"conversations"> }
      : "skip",
  );

  const sendMsgToConversation = useMutation(
    api.conversation.sendMsgToConversation,
  );

  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current || !messages?.length) return;
    const container = messagesContainerRef.current;
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      100;
    setShowScrollButton(!isNearBottom && messages.length > 5);
  }, [messages]);

  useEffect(() => {
    if (messages?.length) {
      setTimeout(scrollToBottom, 100);
    }
  }, [conversation?.id, messages?.length, scrollToBottom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages?.length, scrollToBottom]);

  const handleSendMessage = async () => {
    const content = messageInput.trim();
    if (!content || isSending || !conversation?.id || !user?.id) return;

    setIsSending(true);

    try {
      await sendMsgToConversation({
        conversationId: conversation.id as Id<"conversations">,
        senderId: user.id as Id<"users">,
        content: content,
      });

      setMessageInput("");
      toast.success("Message sent! 📨");
      inputRef.current?.focus();
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatMessageDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dateStr = date.toDateString();
    if (dateStr === today.toDateString()) return "Today";
    if (dateStr === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString([], {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  const groupedMessages =
    messages?.reduce((groups: Record<string, MessageData[]>, message) => {
      const dateKey = formatMessageDate(message._creationTime);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
      return groups;
    }, {}) || {};

  if (!conversation) {
    return (
      <div
        className={cn(
          "flex flex-col h-full max-h-full overflow-hidden",
          className,
        )}
      >
        <Card className="flex-1 flex items-center justify-center" padding="lg">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 mx-auto bg-cream-300 rounded-full border-4 border-terminal-black shadow-neu flex items-center justify-center">
              <svg
                className="w-12 h-12 text-terminal-light-gray"
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
            <h3 className="font-mono font-bold text-xl text-terminal-black">
              Welcome to Wartalaap
            </h3>
            <p className="text-terminal-light-gray font-mono max-w-md">
              Select a conversation from the sidebar to start chatting, or
              create a new one to begin your conversation.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-terminal-light-gray font-mono">
              <span className="w-2 h-2 bg-accent-green rounded-full animate-pulse" />
              <span>Ready to chat</span>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col h-full max-h-full overflow-hidden p-0",
        className,
      )}
    >
      <Card className="flex-1 flex flex-col overflow-hidden" padding="none">
        <CardHeader
          title={
            <div className="flex items-center gap-3">
              {showBackButton && (
                <button
                  onClick={onBackToSidebar}
                  className="btn-ghost btn-icon h-10 w-10 touch-manipulation border-2 border-terminal-black"
                  aria-label="Back to conversations"
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
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                </button>
              )}
              <div className="h-12 w-12 flex items-center justify-center border-2 border-terminal-black rounded-4xl overflow-hidden pt-2.5">
                <svg
                  className="w-14 h-14 text-terminal-light-gray"
                  fill="terminal-black"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      conversation.isGroup
                        ? "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        : "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    }
                  />
                </svg>
              </div>
              {conversation.name}
            </div>
          }
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
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
                tooltip="Conversation Info"
                variant="ghost"
                onClick={() => setIsInfoModalOpen(true)}
              />
            </div>
          }
        />

        <CardBody className="flex-1 overflow-hidden p-0 min-h-0">
          <div className="flex flex-col h-full max-h-full">
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-1 space-y-4 messages-scroll-container min-h-0"
              onScroll={handleScroll}
            >
              {!messages?.length ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 mx-auto bg-cream-300 rounded-full border-2 border-terminal-black shadow-neu flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-terminal-light-gray"
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
                    <h3 className="font-mono font-bold text-terminal-black">
                      Start the conversation
                    </h3>
                    <p className="text-sm text-terminal-light-gray font-mono">
                      No messages yet. Send the first message!
                    </p>
                  </div>
                </div>
              ) : (
                Object.entries(groupedMessages).map(
                  ([dateKey, dateMessages]: [string, MessageData[]]) => (
                    <div key={dateKey} className="px-1 lg:px-4">
                      <div className="flex items-center justify-center p-2">
                        <div className="bg-cream-300 border-2 border-terminal-black rounded-full px-4 py-1 shadow-neu">
                          <span className="text-xs font-mono font-bold text-terminal-black">
                            {dateKey}
                          </span>
                        </div>
                      </div>

                      {dateMessages?.map((message, index) => {
                        const isOwnMessage = message.senderId === user?.id;
                        const prevMessage = dateMessages?.[index - 1];
                        const isNewSender =
                          prevMessage?.senderId !== message.senderId;

                        return (
                          <div
                            key={message._id}
                            className={cn(
                              "flex gap-1 md:gap-3 group",
                              isOwnMessage ? "flex-row-reverse" : "flex-row",
                              isNewSender ? "mt-4" : "mt-1",
                            )}
                          >
                            {!isOwnMessage && conversation.isGroup && (
                              <div
                                className={cn(
                                  "w-8 h-8 flex-shrink-0",
                                  !isNewSender && "opacity-0",
                                )}
                              >
                                {isNewSender && (
                                  <div className="w-8 h-8 rounded-full bg-accent-blue border-2 border-terminal-black shadow-neu flex items-center justify-center">
                                    <span className="text-xs font-mono font-bold text-white">
                                      U
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}

                            <div
                              className={cn(
                                "flex-1",
                                isOwnMessage
                                  ? "flex justify-end"
                                  : "flex justify-start",
                              )}
                            >
                              <MessageBubble
                                type={isOwnMessage ? "sent" : "received"}
                                message={message.content}
                                timestamp={formatTimestamp(
                                  message._creationTime,
                                )}
                                status="delivered"
                                className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ),
                )
              )}

              {showScrollButton && (
                <button
                  className="fixed bottom-24 right-6 lg:bottom-28 lg:right-8 bg-accent-blue border-2 border-terminal-black rounded-full p-3 shadow-neu hover:shadow-neu-pressed transition-all z-10 touch-manipulation"
                  onClick={scrollToBottom}
                  aria-label="Scroll to bottom"
                >
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
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </button>
              )}
            </div>

            <div className="bg-cream-100 p-3 lg:px-4 lg:pt-1 lg:pb-2">
              <div className="flex gap-2 lg:gap-3 items-end">
                <Textarea
                  ref={inputRef}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 border-2 border-terminal-black rounded-3xl px-4 py-1 lg:py-2 min-h-[40px] lg:min-h-[36px] max-h-32 resize-none shadow-neu focus:shadow-neu-pressed transition-all duration-200 bg-cream-100 text-base lg:text-sm"
                  rows={1}
                  style={{ height: "auto", minHeight: "40px" }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = "auto";
                    target.style.height =
                      Math.min(target.scrollHeight, 128) + "px";
                  }}
                  disabled={isSending}
                />
                <Button
                  variant="primary"
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || isSending}
                  loading={isSending}
                  className="h-12 w-12 lg:h-11 lg:w-11 rounded-full flex-shrink-0 shadow-neu hover:shadow-neu-pressed transition-all duration-200 touch-manipulation"
                >
                  <svg
                    className="w-5 h-5 lg:w-4 lg:h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Conversation Info Modal */}
      <ConversationInfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        conversation={conversation}
      />
    </div>
  );
};

export default ChatArea;
