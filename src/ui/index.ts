// Core UI Components
export { default as Button, IconButton, ButtonGroup } from "./Button";
export type { ButtonProps } from "./Button";

export {
  default as Input,
  PasswordInput,
  Textarea,
  SearchInput,
} from "./Input";
export type {
  InputProps,
  PasswordInputProps,
  TextareaProps,
  SearchInputProps,
} from "./Input";

export {
  default as Card,
  CardHeader,
  CardBody,
  CardFooter,
  MessageBubble,
  ConversationItem,
} from "./Card";
export type {
  CardProps,
  MessageBubbleProps,
  ConversationItemProps,
  CardHeaderProps,
} from "./Card";

// export { default as Toast, ToastContainer, useToast } from "./Toast";
// export type { ToastProps, ToastContainerProps, ToastState } from "./Toast";

// Authentication Components
export { default as AuthLayout } from "./auth/AuthLayout";
export type { LoginFormProps, LoginFormData } from "./auth/LoginForm";
export type { SignUpFormProps, SignUpFormData } from "./auth/SignUpForm";
export type { AuthLayoutProps } from "./auth/AuthLayout";

// Chat Components
export { default as Sidebar } from "./chat/Sidebar";
export { default as ChatArea } from "./chat/ChatArea";
export { default as NewChatModal } from "./chat/NewChatModal";
export { default as ConversationInfoModal } from "./chat/ConversationInfoModal";
export { default as ChatApp } from "./ChatApp";

// UI Components
export { default as Modal } from "./Modal";
export type { ModalProps } from "./Modal";
export type {
  SidebarProps,
  ConversationData as SidebarConversationData,
  UserData as SidebarUserData,
} from "./chat/Sidebar";
export type {
  ChatAreaProps,
  ConversationData as ChatAreaConversationData,
  MessageData,
  MessageReaction,
  UserData as ChatAreaUserData,
} from "./chat/ChatArea";
export type {
  NewChatModalProps,
  UserData as NewChatModalUserData,
} from "./chat/NewChatModal";
export type { ConversationInfoModalProps } from "./chat/ConversationInfoModal";
export type {
  ChatAppProps,
  UserData as ChatAppUserData,
  ConversationData as ChatAppConversationData,
  MessageData as ChatAppMessageData,
} from "./ChatApp";

// Utilities
export { cn, createClassMerger, twMerge } from "../utils/cn";
export type { ClassValue } from "../utils/cn";

// Common Types (unified interfaces)
export interface User {
  id: string;
  username: string;
  email?: string;
  status?: "online" | "away" | "busy" | "offline";
}

export interface Conversation {
  id: string;
  name: string;
  lastMessage?: string;
  timestamp?: string;
  unreadCount?: number;
  isGroup?: boolean;
  participants?: User[];
  status?: "online" | "away" | "busy" | "offline";
  isTyping?: boolean;
  description?: string;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: string;
  type?: "text" | "image" | "file" | "system";
  status?: "sending" | "sent" | "delivered" | "read" | "failed";
  replyTo?: string;
  reactions?: Array<{
    emoji: string;
    userId: string;
    userName: string;
  }>;
}

// Theme and styling utilities
export const theme = {
  colors: {
    cream: {
      50: "#FFFBF5",
      100: "#FFF8E6",
      200: "#FFF6EA",
      300: "#FFF2D9",
      400: "#FFECC7",
      500: "#FFE6B5",
    },
    terminal: {
      black: "#000000",
      darkGray: "#1A1A1A",
      medGray: "#4A4A4A",
      lightGray: "#9EA3A6",
      white: "#FFFFFF",
    },
    accent: {
      green: "#7BC47F",
      greenHover: "#6AB36E",
      yellow: "#FFD166",
      yellowHover: "#E6BC5A",
      orange: "#FF9F1C",
      orangeHover: "#E68F19",
      blue: "#4A90E2",
      blueHover: "#357ABD",
      red: "#E74C3C",
      redHover: "#C0392B",
    },
    status: {
      online: "#2ECC71",
      away: "#F39C12",
      busy: "#E74C3C",
      offline: "#95A5A6",
    },
    message: {
      sent: "#E8F5E8",
      received: "#F8F9FA",
      system: "#FFF3CD",
    },
  },
  spacing: {
    neu: "12px",
    neuLg: "16px",
    neuXl: "20px",
    retro: "8px",
    retroLg: "12px",
  },
  shadows: {
    neu: "4px 4px 8px rgba(0, 0, 0, 0.12), -4px -4px 8px rgba(255, 255, 255, 0.9)",
    neuLg:
      "8px 8px 16px rgba(0, 0, 0, 0.15), -8px -8px 16px rgba(255, 255, 255, 0.95)",
    neuInset:
      "inset 2px 2px 4px rgba(0, 0, 0, 0.1), inset -2px -2px 4px rgba(255, 255, 255, 0.8)",
    retro: "4px 4px 0px rgba(0, 0, 0, 1)",
    retroLg: "6px 6px 0px rgba(0, 0, 0, 1)",
    soft: "0 4px 6px rgba(0, 0, 0, 0.07)",
    softLg: "0 8px 12px rgba(0, 0, 0, 0.08)",
  },
  animations: {
    fadeIn: "fadeIn 0.2s ease-in-out",
    slideInRight: "slideInRight 0.3s ease-out",
    slideInLeft: "slideInLeft 0.3s ease-out",
    slideUp: "slideUp 0.2s ease-out",
    bounceSubtle: "bounceSubtle 0.6s ease-in-out",
    pulseSoft: "pulseSoft 2s ease-in-out infinite",
  },
};

// Responsive breakpoints
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

// Component size variants
export const sizes = {
  button: {
    sm: "px-3 py-1.5 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
    icon: "p-3 min-w-0 w-12 h-12",
  },
  card: {
    sm: "p-3",
    md: "p-6",
    lg: "p-8",
  },
};

// Default component configurations
export const defaults = {
  toast: {
    duration: 5000,
    position: "top-right" as const,
  },
  modal: {
    closeOnOverlayClick: true,
    closeOnEscape: true,
  },
  input: {
    autoComplete: true,
    spellCheck: true,
  },
};
