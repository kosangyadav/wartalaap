import React from "react";
import Button from "../Button";
import Card, { CardHeader, CardBody, CardFooter } from "../Card";
import { cn } from "../../utils/cn";
import { useUIStore } from "../../../stores/uiStore";

export interface ConversationData {
  id: string;
  name: string;
  isGroup: boolean;
  description?: string;
  participants?: UserData[];
}

export interface UserData {
  id: string;
  username: string;
  email?: string;
  status?: "online" | "away" | "busy" | "offline";
}

export interface ConversationInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: ConversationData;
}

const ConversationInfoModal: React.FC<ConversationInfoModalProps> = ({
  isOpen,
  onClose,
  conversation,
}) => {
  const { isMobile } = useUIStore();

  const formatParticipants = () => {
    if (!conversation.participants || conversation.participants.length === 0) {
      return "No participants";
    }

    if (conversation.participants.length === 1) {
      return "1 participant";
    }

    return `${conversation.participants.length} participants`;
  };

  const getConversationType = () => {
    return conversation.isGroup ? "Group Chat" : "Direct Message";
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "online":
        return "bg-accent-green";
      case "away":
        return "bg-accent-yellow";
      case "busy":
        return "bg-accent-orange";
      case "offline":
      default:
        return "bg-terminal-light-gray";
    }
  };

  const getStatusTextColor = (status?: string) => {
    switch (status) {
      case "online":
        return "bg-accent-green text-terminal-black";
      case "away":
        return "bg-accent-yellow text-terminal-black";
      case "busy":
        return "bg-accent-orange text-terminal-black";
      case "offline":
      default:
        return "bg-cream-300 text-terminal-black";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <Card
        className="modal-content w-full max-w-sm sm:max-w-md lg:max-w-lg mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader
          title="Conversation Info"
          subtitle={`${getConversationType()} • ${formatParticipants()}`}
          action={
            <button
              onClick={onClose}
              className="btn-ghost btn-icon h-8 w-8 touch-manipulation"
              aria-label="Close modal"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          }
        />

        <CardBody className="max-h-80 lg:max-h-96 overflow-y-auto pt-4">
          {/* Conversation Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-3 bg-cream-300 rounded-neu border-2 border-terminal-black shadow-neu flex items-center justify-center">
              {conversation.isGroup ? (
                <svg
                  className="w-8 h-8 text-terminal-black"
                  fill="none"
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
                  className="w-8 h-8 text-terminal-black"
                  fill="none"
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
            <h3 className="font-mono font-bold text-lg text-terminal-black mb-1">
              {conversation.name}
            </h3>
            <p className="text-sm text-terminal-light-gray font-mono">
              {getConversationType()}
            </p>
          </div>

          {/* Conversation Details */}
          <div className="mb-4 p-3 bg-cream-300 rounded-neu border-2 border-terminal-black">
            <h4 className="font-mono font-bold text-sm text-terminal-black mb-3">
              Details
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="font-mono text-terminal-light-gray">ID:</span>
                <span className="font-mono text-terminal-black text-xs break-all max-w-48 text-right">
                  {conversation.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono text-terminal-light-gray">
                  Type:
                </span>
                <span className="font-mono text-terminal-black">
                  {getConversationType()}
                </span>
              </div>
              {conversation.description && (
                <div>
                  <span className="font-mono text-terminal-light-gray block mb-1">
                    Description:
                  </span>
                  <p className="font-mono text-terminal-black text-xs bg-cream-100 p-2 rounded border border-terminal-black">
                    {conversation.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Participants */}
          {conversation.participants &&
            conversation.participants.length > 0 && (
              <div className="mb-4">
                <h4 className="font-mono font-bold text-sm text-terminal-black mb-3">
                  {formatParticipants()}
                </h4>
                <div className="space-y-2">
                  {conversation.participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center gap-3 p-3 rounded-neu border-2 border-terminal-black bg-cream-200 hover:bg-cream-300 transition-all duration-200"
                    >
                      <div className="relative">
                        <div className="w-10 h-10 bg-cream-300 rounded-neu border-2 border-terminal-black shadow-neu flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-terminal-black"
                            fill="none"
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
                        </div>
                        {participant.status && (
                          <div
                            className={cn(
                              "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-cream-100",
                              getStatusColor(participant.status),
                            )}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-mono font-bold text-sm text-terminal-black truncate">
                          {participant.username}
                        </h3>
                        {participant.email && (
                          <p className="text-xs text-terminal-light-gray font-mono truncate">
                            {participant.email}
                          </p>
                        )}
                      </div>
                      {participant.status && (
                        <div
                          className={cn(
                            "px-2 py-1 rounded-neu border-2 border-terminal-black text-xs font-mono font-bold capitalize",
                            getStatusTextColor(participant.status),
                          )}
                        >
                          {participant.status}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Empty State */}
          {(!conversation.participants ||
            conversation.participants.length === 0) && (
            <div className="text-center py-8">
              <svg
                className="w-12 h-12 mx-auto text-terminal-light-gray mb-4"
                fill="none"
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
              <h3 className="font-mono font-bold text-terminal-black mb-2">
                No participants
              </h3>
              <p className="text-terminal-light-gray text-sm font-mono">
                This conversation has no participants
              </p>
            </div>
          )}
        </CardBody>

        <CardFooter>
          <Button
            variant="primary"
            onClick={onClose}
            className="touch-manipulation w-full"
            size={isMobile ? "sm" : "md"}
          >
            Close
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ConversationInfoModal;

// TODO: Future enhancements
// - Add member management (add/remove participants)
// - Implement user role management (admin, member)
// - Add conversation settings (notifications, privacy)
// - Implement conversation actions (leave, delete, archive)
// - Add member search and filtering
// - Implement user profile preview on click
// - Add conversation statistics (message count, created date)
// - Implement conversation export functionality
// - Add conversation themes and customization
// - Implement member invitation links
