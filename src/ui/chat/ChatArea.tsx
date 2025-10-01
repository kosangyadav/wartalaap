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

export interface ChatAreaProps {
  conversation?: ConversationData;
  currentUser: UserData;
  className?: string;
}

export interface ConversationData {
  id: string;
  name: string;
  isGroup?: boolean;
  participants?: UserData[];
  description?: string;
  // status?: "online" | "away" | "busy" | "offline";
}

export interface MessageData {
  _id: string;
  content: string;
  senderId: string;
  _creationTime: number;
  conversationId: string;
}

export interface MessageReaction {
  emoji: string;
  userId: string;
  userName: string;
}

export interface UserData {
  id: string;
  username: string;
  email?: string;
  status?: "online" | "away" | "busy" | "offline";
}

const ChatArea: React.FC<ChatAreaProps> = ({
  conversation,
  currentUser,
  className,
}) => {
  const { user } = useAuthStore();
  const [messageInput, setMessageInput] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Convex queries and mutations
  const messages = useQuery(
    api.conversation.getMsgsInConversation,
    conversation?.id
      ? { conversationId: conversation.id as Id<"conversations"> }
      : "skip",
  );

  const sendMsgToConversation = useMutation(
    api.conversation.sendMsgToConversation,
  );

  // Scroll utility functions
  const isNearBottom = useCallback(() => {
    if (!messagesContainerRef.current) return true;
    const container = messagesContainerRef.current;
    return (
      container.scrollHeight - container.scrollTop - container.clientHeight <
      100
    );
  }, []);

  const scrollToBottomSmooth = useCallback(() => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (isNearBottom()) {
      scrollToBottomSmooth();
    }
  }, [messages, isNearBottom, scrollToBottomSmooth]);

  // Initial scroll to bottom when conversation loads
  useEffect(() => {
    if (conversation && messages?.length) {
      setTimeout(() => {
        scrollToBottomSmooth();
      }, 100); // Small delay to ensure DOM is rendered
    }
  }, [conversation, messages?.length, scrollToBottomSmooth]);

  // Handle scroll events for scroll-to-bottom button
  const handleScroll = () => {
    setShowScrollButton(!isNearBottom() && !!(messages && messages.length > 5));
  };

  // Scroll to bottom function
  const scrollToBottom = () => {
    scrollToBottomSmooth();
  };

  // Handle typing indicator
  useEffect(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (messageInput.trim()) {
      // onTyping(true); // TODO: Implement typing indicators
      typingTimeoutRef.current = setTimeout(() => {
        // onTyping(false);
      }, 3000);
    } else {
      // onTyping(false);
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [messageInput]);

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

      // Focus back to input
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
        hour12: true,
      });
    } else {
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const formatMessageDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString([], {
        weekday: "long",
        month: "short",
        day: "numeric",
      });
    }
  };

  // Group messages by date
  const groupedMessages =
    messages?.reduce((groups: Record<string, MessageData[]>, message) => {
      const dateKey = formatMessageDate(message._creationTime);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
      return groups;
    }, {}) || {};

  console.log({ conversation });
  // const commonEmojis = ["😊", "😂", "❤️", "👍", "👎", "😮", "😢", "😡"];

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
        {/* Chat Header */}
        <CardHeader
          title={conversation.name}
          // subtitle={
          //   conversation.isGroup
          //     ? "Group Chat"
          //     : conversation.status === "online"
          //       ? "Online"
          //       : "Last seen recently"
          // }
          action={
            <div className="flex items-center gap-2">
              {/*<IconButton
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
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                }
                tooltip="Voice Call"
                variant="ghost"
              />*/}
              {/*<IconButton
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
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                }
                tooltip="Video Call"
                variant="ghost"
              />*/}
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
              />
            </div>
          }
        />

        {/* Messages Area */}
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
                  ([dateKey, dateMessages]) => (
                    <div key={dateKey} className="px-4">
                      {/* Date separator */}
                      <div className="flex items-center justify-center p-2">
                        <div className="bg-cream-300 border-2 border-terminal-black rounded-full px-4 py-1 shadow-neu">
                          <span className="text-xs font-mono font-bold text-terminal-black">
                            {dateKey}
                          </span>
                        </div>
                      </div>

                      {/* Messages for this date */}
                      {dateMessages.map((message, index) => {
                        const isOwnMessage = message.senderId === user?.id;
                        const prevMessage = dateMessages[index - 1];
                        const showAvatar =
                          !isOwnMessage &&
                          (!prevMessage ||
                            prevMessage.senderId !== message.senderId);

                        return (
                          <div
                            key={message._id}
                            className={cn(
                              "flex gap-2 group",
                              isOwnMessage ? "flex-row-reverse" : "flex-row",
                              prevMessage?.senderId !== message.senderId
                                ? "mt-4"
                                : "mt-2",
                            )}
                          >
                            {/* Avatar */}
                            {!isOwnMessage && conversation.isGroup && (
                              <div
                                className={cn(
                                  "flex-shrink-0",
                                  showAvatar ? "opacity-100" : "opacity-0",
                                )}
                              >
                                <div className="w-8 h-8 rounded-full bg-accent-blue border-2 border-terminal-black shadow-neu flex items-center justify-center">
                                  <span className="text-xs font-mono font-bold">
                                    {!isOwnMessage &&
                                      currentUser.username[0]?.toUpperCase()}
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Message */}
                            <div
                              className={cn(
                                "flex-1 max-w-md",
                                isOwnMessage ? "text-right" : "text-left",
                              )}
                            >
                              <MessageBubble
                                type={isOwnMessage ? "sent" : "received"}
                                message={message.content}
                                timestamp={formatTimestamp(
                                  message._creationTime,
                                )}
                                status="delivered"
                                className={cn(
                                  "transition-all duration-200",
                                  isOwnMessage ? "ml-auto" : "mr-auto",
                                )}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ),
                )
              )}

              {/* Typing indicator */}
              {/* {typingUsers.length > 0 && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-xs font-bold">
                      {typingUsers[0].username[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div className="bg-gray-100 rounded-xl px-4 py-2 border border-gray-200">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                    </div>
                  </div>
                </div>
              )} */}

              <div ref={messagesEndRef} />

              {/* Scroll to bottom button */}
              <button
                className={`scroll-to-bottom ${showScrollButton ? "visible" : ""}`}
                onClick={scrollToBottom}
                aria-label="Scroll to bottom"
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
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </button>
            </div>

            {/* Message Input */}
            <div className="bg-cream-200 flex p-4 gap-4 justify-between items-center">
              {/*border-t-2 border-terminal-black*/}
              {/* Message input */}
              {/*<div className="flex-1">*/}
              <Textarea
                ref={inputRef}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                placeholder="Type a message..."
                className={cn(
                  "border-1 border-terminal-black rounded-4xl pl-4 h-fit max-h-30 resize-none",
                  // "min-h-[44px] max-h-32 resize-none",
                  isInputFocused && "ring-2 ring-accent-blue",
                )}
                disabled={isSending}
              />
              {/*</div>*/}
              {/* Send button */}
              <Button
                variant="primary"
                size="sm"
                onClick={handleSendMessage}
                disabled={!messageInput.trim() || isSending}
                loading={isSending}
                className="flex-shrink-0 p-2"
                // leftIcon={
                //   !isSending ? (
                //     <svg
                //       className="w-4 h-4"
                //       fill="none"
                //       stroke="currentColor"
                //       viewBox="0 0 24 24"
                //     >
                //       <path
                //         strokeLinecap="round"
                //         strokeLinejoin="round"
                //         strokeWidth={2}
                //         d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                //       />
                //     </svg>
                //   ) : undefined
                // }
              >
                {isSending ? "Sending..." : "Send"}
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ChatArea;
