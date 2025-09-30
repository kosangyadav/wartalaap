import React from "react";
import { cn } from "../utils/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "interactive" | "elevated";
  padding?: "none" | "sm" | "md" | "lg";
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { className, variant = "default", padding = "md", children, ...props },
    ref,
  ) => {
    const baseClasses = "card-neu";

    const variantClasses = {
      default: "",
      interactive: "card-neu-interactive",
      elevated: "shadow-neu-lg hover:shadow-neu-xl",
    };

    const paddingClasses = {
      none: "p-0",
      sm: "p-3",
      md: "p-6",
      lg: "p-8",
    };

    const classes = cn(
      baseClasses,
      variantClasses[variant],
      paddingClasses[padding],
      className,
    );

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

// Message Bubble Component
export interface MessageBubbleProps
  extends React.HTMLAttributes<HTMLDivElement> {
  type: "sent" | "received" | "system";
  message: string;
  timestamp?: string;

  username?: string;
  status?: "sending" | "sent" | "delivered" | "read" | "failed";
}

export const MessageBubble = React.forwardRef<
  HTMLDivElement,
  MessageBubbleProps
>(
  (
    { className, type, message, timestamp, avatar, username, status, ...props },
    ref,
  ) => {
    const bubbleClasses = {
      sent: "message-sent",
      received: "message-received",
      system: "message-system",
    };

    const statusIcons = {
      sending: (
        <svg
          className="w-4 h-4 animate-spin"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 2v4m0 12v4m8-8h-4M6 12H2m15.364-7.364l-2.828 2.828M9.464 9.464l-2.828-2.828m12.728 12.728l-2.828-2.828M9.464 14.536l-2.828 2.828"
          />
        </svg>
      ),
      sent: (
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
            d="M5 13l4 4L19 7"
          />
        </svg>
      ),
      delivered: (
        <div className="flex">
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
              d="M5 13l4 4L19 7"
            />
          </svg>
          <svg
            className="w-4 h-4 -ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      ),
      read: (
        <div className="flex text-accent-blue">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 13l4 4L19 7" />
          </svg>
          <svg
            className="w-4 h-4 -ml-2"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
      ),
      failed: (
        <svg
          className="w-4 h-4 text-accent-red"
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
      ),
    };

    if (type === "system") {
      return (
        <div
          ref={ref}
          className={cn(bubbleClasses[type], className)}
          {...props}
        >
          <p className="font-mono text-sm">{message}</p>
          {timestamp && (
            <p className="text-xs text-terminal-light-gray mt-1">{timestamp}</p>
          )}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-start gap-3 mb-4",
          type === "sent" ? "flex-row-reverse" : "flex-row",
        )}
        {...props}
      >
        {type === "received" && avatar && (
          <div className="flex-shrink-0">{avatar}</div>
        )}

        <div className={cn(bubbleClasses[type], className)}>
          {type === "received" && username && (
            <p className="font-mono font-bold text-sm text-terminal-black mb-1">
              {username}
            </p>
          )}

          <p className="text-sm leading-relaxed break-words">{message}</p>

          <div
            className={cn(
              "flex items-center justify-between mt-2 text-xs text-terminal-light-gray",
              type === "sent" ? "flex-row-reverse" : "flex-row",
            )}
          >
            <span>{timestamp}</span>
            {type === "sent" && status && (
              <span className="flex items-center gap-1">
                {statusIcons[status]}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  },
);

MessageBubble.displayName = "MessageBubble";

// Conversation Item Card
export interface ConversationItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  lastMessage?: string;
  timestamp?: string;
  unreadCount?: number;
  isActive?: boolean;
  status?: "online" | "away" | "busy" | "offline";
  isTyping?: boolean;
}

export const ConversationItem = React.forwardRef<
  HTMLDivElement,
  ConversationItemProps
>(
  (
    {
      className,
      name,
      lastMessage,
      timestamp,
      unreadCount,
      isActive = false,
      status = "offline",
      isTyping = false,
      ...props
    },
    ref,
  ) => {
    const baseClasses = isActive
      ? "conversation-item-active"
      : "conversation-item";

    const statusClasses = {
      online: "status-online",
      away: "status-away",
      busy: "status-busy",
      offline: "status-offline",
    };

    return (
      <div
        ref={ref}
        className={cn(baseClasses, "animate-fade-in", className)}
        {...props}
      >
        <div className="flex items-center gap-3">
          {/*<div className="relative">
            <div
              className={cn(
                "absolute -bottom-1 -right-1",
                statusClasses[status],
              )}
            />
          </div>*/}

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-mono font-bold text-sm text-terminal-black truncate">
                {name}
              </h3>
              {timestamp && (
                <span className="text-xs text-terminal-light-gray flex-shrink-0 ml-2">
                  {timestamp}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between mt-1">
              {isTyping ? (
                <p className="text-xs text-accent-green font-mono animate-pulse">
                  typing<span className="terminal-cursor"></span>
                </p>
              ) : (
                <p className="text-xs text-terminal-light-gray truncate">
                  {lastMessage || "No messages yet"}
                </p>
              )}

              {unreadCount && unreadCount > 0 && (
                <span className="badge text-xs px-2 py-1 flex-shrink-0 ml-2">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

ConversationItem.displayName = "ConversationItem";

// Card Header Component
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, subtitle, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between p-6 border-b-2 border-terminal-black",
          className,
        )}
        {...props}
      >
        <div>
          <h3 className="font-mono font-bold text-lg text-terminal-black">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-terminal-light-gray mt-1">{subtitle}</p>
          )}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    );
  },
);

CardHeader.displayName = "CardHeader";

// Card Body Component
export const CardBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("p-4", className)} {...props}>
      {children}
    </div>
  );
});

CardBody.displayName = "CardBody";

// Card Footer Component
export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-end gap-3 p-6 border-t-2 border-terminal-black",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});

CardFooter.displayName = "CardFooter";

export default Card;
