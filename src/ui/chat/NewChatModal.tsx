import React, { useState } from "react";
import Button from "../Button";
import { SearchInput } from "../Input";
import Card, { CardHeader, CardBody, CardFooter } from "../Card";

import { cn } from "../../utils/cn";

export interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChat: (
    userIds: string[],
    isGroup?: boolean,
    groupName?: string,
  ) => Promise<void>;
  users: UserData[];
  currentUser: UserData;
  loading?: boolean;
  error?: string;
}

export interface UserData {
  id: string;
  username: string;
  email?: string;

  status?: "online" | "away" | "busy" | "offline";
}

const NewChatModal: React.FC<NewChatModalProps> = ({
  isOpen,
  onClose,
  onCreateChat,
  users = [],
  currentUser,
  loading = false,
  error,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<UserData[]>([]);
  const [isGroupMode, setIsGroupMode] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);

  React.useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users.filter((user) => user.id !== currentUser.id));
    } else {
      const filtered = users.filter(
        (user) =>
          user.id !== currentUser.id &&
          (user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase())),
      );
      setFilteredUsers(filtered);
    }
  }, [users, searchQuery, currentUser.id]);

  React.useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setSearchQuery("");
      setSelectedUsers([]);
      setIsGroupMode(false);
      setGroupName("");
    }
  }, [isOpen]);

  const handleUserToggle = (user: UserData) => {
    setSelectedUsers((prev) => {
      const isSelected = prev.some((u) => u.id === user.id);
      if (isSelected) {
        const newSelection = prev.filter((u) => u.id !== user.id);
        // Switch back to direct message if only one user left
        if (newSelection.length <= 1) {
          setIsGroupMode(false);
        }
        return newSelection;
      } else {
        const newSelection = [...prev, user];
        // Switch to group mode if more than one user selected
        if (newSelection.length > 1) {
          setIsGroupMode(true);
        }
        return newSelection;
      }
    });
  };

  const handleCreateChat = async () => {
    if (selectedUsers.length === 0) return;

    try {
      await onCreateChat(
        selectedUsers.map((u) => u.id),
        isGroupMode,
        isGroupMode ? groupName : undefined,
      );
      onClose();
    } catch (err) {
      console.error("Failed to create chat:", err);
    }
  };

  const canCreate =
    selectedUsers.length > 0 && (!isGroupMode || groupName.trim());

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <Card
        className="modal-content max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader
          title="New Chat"
          subtitle={
            selectedUsers.length === 0
              ? "Select people to start a conversation"
              : selectedUsers.length === 1
                ? "Direct message"
                : `Group chat with ${selectedUsers.length} people`
          }
          action={
            <button
              onClick={onClose}
              className="p-2 hover:bg-cream-300 rounded-full transition-colors"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          }
        />

        <CardBody className="max-h-96 overflow-y-auto">
          {error && (
            <div className="toast-error p-3 text-sm mb-4">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 flex-shrink-0"
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
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Search Input */}
          <div className="mb-4">
            <SearchInput
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery("")}
            />
          </div>

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div className="mb-4 p-3 bg-cream-300 rounded-neu border-2 border-terminal-black">
              <h4 className="font-mono font-bold text-sm text-terminal-black mb-2">
                Selected ({selectedUsers.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-2 bg-cream-100 rounded-neu px-3 py-1 border-2 border-terminal-black"
                  >
                    <span className="text-sm font-mono">{user.username}</span>
                    <button
                      onClick={() => handleUserToggle(user)}
                      className="text-terminal-light-gray hover:text-accent-red transition-colors"
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
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Group Name Input */}
          {isGroupMode && (
            <div className="mb-4">
              <label className="form-label">Group Name</label>
              <input
                type="text"
                className="input-neu"
                placeholder="Enter group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                maxLength={50}
              />
            </div>
          )}

          {/* Users List */}
          <div className="space-y-2">
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="loading-skeleton w-10 h-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="loading-skeleton h-4 w-32" />
                      <div className="loading-skeleton h-3 w-48" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredUsers.length === 0 ? (
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
                  {searchQuery ? "No users found" : "No users available"}
                </h3>
                <p className="text-terminal-light-gray text-sm">
                  {searchQuery
                    ? "Try a different search term"
                    : "There are no other users to chat with"}
                </p>
              </div>
            ) : (
              filteredUsers.map((user) => {
                const isSelected = selectedUsers.some((u) => u.id === user.id);
                return (
                  <div
                    key={user.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-neu border-2 cursor-pointer transition-all duration-200",
                      isSelected
                        ? "bg-accent-green text-white border-terminal-black shadow-retro"
                        : "bg-cream-200 border-terminal-black hover:bg-cream-300 hover:shadow-neu-lg",
                    )}
                    onClick={() => handleUserToggle(user)}
                  >
                    <div className="flex-1 min-w-0">
                      <h3
                        className={cn(
                          "font-mono font-bold text-sm truncate",
                          isSelected ? "text-white" : "text-terminal-black",
                        )}
                      >
                        {user.username}
                      </h3>
                      {user.email && (
                        <p
                          className={cn(
                            "text-xs truncate",
                            isSelected
                              ? "text-cream-100"
                              : "text-terminal-light-gray",
                          )}
                        >
                          {user.email}
                        </p>
                      )}
                      <div className="flex items-center gap-1 mt-1">
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full border",
                            isSelected
                              ? "border-white"
                              : "border-terminal-black",
                            user.status === "online"
                              ? "bg-status-online"
                              : user.status === "away"
                                ? "bg-status-away"
                                : user.status === "busy"
                                  ? "bg-status-busy"
                                  : "bg-status-offline",
                          )}
                        />
                        <span
                          className={cn(
                            "text-xs font-mono capitalize",
                            isSelected
                              ? "text-cream-100"
                              : "text-terminal-light-gray",
                          )}
                        >
                          {user.status || "offline"}
                        </span>
                      </div>
                    </div>
                    <div
                      className={cn(
                        "flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                        isSelected
                          ? "bg-white border-white"
                          : "border-terminal-black",
                      )}
                    >
                      {isSelected && (
                        <svg
                          className="w-3 h-3 text-accent-green"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardBody>

        <CardFooter>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleCreateChat}
            disabled={!canCreate || loading}
            loading={loading}
          >
            {loading
              ? "Creating..."
              : selectedUsers.length === 1
                ? "Start Chat"
                : "Create Group"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NewChatModal;

// TODO: Integrate with backend
// - Connect to user search API
// - Implement conversation creation API
// - Add user invitation system for groups
// - Implement user presence/status updates
// - Add user profile preview on hover
// - Implement recent contacts/suggestions
// - Add ability to create group from existing chat
// - Implement user filtering (online only, recent contacts)
// - Add bulk user selection
// - Implement user roles for group creation
