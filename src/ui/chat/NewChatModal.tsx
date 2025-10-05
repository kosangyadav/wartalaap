import React, { useState, useEffect } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuthStore } from "../../../stores/authStore";
import Button from "../Button";
import { SearchInput } from "../Input";
import Card, { CardHeader, CardBody, CardFooter } from "../Card";
import { useUIStore } from "../../../stores/uiStore";

import { cn } from "../../utils/cn";
import type { Id } from "../../../convex/_generated/dataModel";

export interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  setSelectedChat: (conversationId: string, conversationName: string) => void;
}

export interface UserData {
  _id: string;
  username: string;
  email?: string;
  status?: "online" | "away" | "busy" | "offline";
}

const NewChatModal: React.FC<NewChatModalProps> = ({
  isOpen,
  onClose,
  setSelectedChat,
}) => {
  const [searchName, setSearchName] = useState("");
  const [usersList, setUsersList] = useState<UserData[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserData[]>([]);
  const [groupName, setGroupName] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const { user } = useAuthStore();
  const { isMobile } = useUIStore();

  const listUsersAction = useAction(api.createChat.getUsersByUsername);

  const create1on1Conversation = useMutation(
    api.createChat.create1on1Conversation,
  );
  const createGroupConversation = useMutation(
    api.createChat.createGroupConversation,
  );

  const fetchUsers = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchName.trim()) return;

    setIsSearching(true);
    try {
      const usernameList = await listUsersAction({ username: searchName });
      setUsersList(
        usernameList.filter((u: UserData) => u.username !== user?.username),
      );
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const createNewConversation = async () => {
    if (selectedUsers.length === 0) return;

    setIsCreating(true);
    try {
      let conversationId;

      if (selectedUsers.length === 1) {
        conversationId = await create1on1Conversation({
          userId1: user?.id as string,
          userId2: selectedUsers[0]?._id as string,
        });
      } else {
        if (!groupName.trim()) return;
        const memberIds: Id<"users">[] = selectedUsers.map(
          (u) => u._id as Id<"users">,
        );
        memberIds.push(user?.id as Id<"users">);

        conversationId = await createGroupConversation({
          name: groupName,
          memberIds,
        });
      }

      setSelectedChat(conversationId, groupName || selectedUsers[0]?.username);
      onClose();
    } catch (error) {
      console.error("Failed to create conversation:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const filteredUsers = usersList.filter((user) =>
    user.username.toLowerCase().includes(searchName.toLowerCase()),
  );

  useEffect(() => {
    if (!isOpen) {
      setSearchName("");
      setUsersList([]);
      setSelectedUsers([]);
      setGroupName("");
    }
  }, [isOpen]);

  const handleUserToggle = (user: UserData) => {
    setSelectedUsers((prev) =>
      prev.some((u) => u._id === user._id)
        ? prev.filter((u) => u._id !== user._id)
        : [...prev, user],
    );
  };

  const canCreate =
    selectedUsers.length > 0 &&
    (selectedUsers.length === 1 || groupName.trim());

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <Card
        className="modal-content w-full max-w-sm sm:max-w-md lg:max-w-lg mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader
          title="New Chat"
          subtitle={
            selectedUsers.length === 0
              ? "Search and select people to start a conversation"
              : selectedUsers.length === 1
                ? `Direct message with ${selectedUsers[0].username}`
                : `Group chat with ${selectedUsers.length} people`
          }
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
          <div>
            <form onSubmit={fetchUsers} className="flex gap-2 mb-2">
              <SearchInput
                placeholder="Search username..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                onClear={() => setSearchName("")}
                className="flex-1 text-base lg:text-sm"
              />
              <Button
                type="submit"
                variant="primary"
                disabled={!searchName.trim() || isSearching}
                loading={isSearching}
                className="px-4 touch-manipulation"
                size={isMobile ? "sm" : "md"}
              >
                Search
              </Button>
            </form>
          </div>

          {selectedUsers.length > 0 && (
            <div className="mb-4 p-3 bg-cream-300 rounded-neu border-2 border-terminal-black">
              <h4 className="font-mono font-bold text-sm text-terminal-black mb-2">
                Selected ({selectedUsers.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center gap-2 bg-cream-100 rounded-neu p-2 border-2 border-terminal-black"
                    onClick={() => handleUserToggle(user)}
                  >
                    <span className="text-sm font-mono">{user.username}</span>

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
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedUsers.length > 1 && (
            <div className="mb-4">
              <label className="form-label">Group Name</label>
              <input
                type="text"
                className="input-neu text-base lg:text-sm"
                placeholder="Enter group name..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                maxLength={50}
              />
            </div>
          )}

          <div className="space-y-2">
            {isSearching ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3 p-3">
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
                  {usersList.length === 0
                    ? "Search for users"
                    : "No users found"}
                </h3>
                <p className="text-terminal-light-gray text-sm">
                  {usersList.length === 0
                    ? "Enter a username to find people"
                    : "Try a different search term"}
                </p>
              </div>
            ) : (
              filteredUsers.map((user) => {
                const isSelected = selectedUsers.some(
                  (u) => u._id === user._id,
                );
                return (
                  <div
                    key={user._id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-neu border-2 cursor-pointer transition-all duration-200 touch-manipulation",
                      isSelected
                        ? "bg-accent-green border-terminal-black"
                        : "bg-cream-200 border-terminal-black hover:bg-cream-300",
                    )}
                    onClick={() => handleUserToggle(user)}
                  >
                    <div className="flex-1 min-w-0">
                      <h3
                        className={cn("font-mono font-bold text-sm truncate")}
                      >
                        {user.username}
                      </h3>
                      {user.email && (
                        <p
                          className={cn(
                            "text-xs truncate",
                            isSelected
                              ? "text-terminal-light-gray"
                              : "text-terminal-light-gray",
                          )}
                        >
                          {user.email}
                        </p>
                      )}
                    </div>
                    <div
                      className={cn(
                        "w-5 h-5 rounded border-2 flex items-center justify-center",
                        isSelected
                          ? "bg-cream-100 border-cream-100"
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
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isCreating}
            className="touch-manipulation"
            size={isMobile ? "sm" : "md"}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={createNewConversation}
            disabled={!canCreate || isCreating}
            loading={isCreating}
            className="touch-manipulation"
            size={isMobile ? "sm" : "md"}
          >
            {isCreating
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
// - Connect to user search API ✓
// - Implement conversation creation API ✓
// - Add user invitation system for groups
// - Implement user presence/status updates
// - Add user profile preview on hover
// - Implement recent contacts/suggestions
// - Add ability to create group from existing chat
// - Implement user filtering (online only, recent contacts)
// - Add bulk user selection
// - Implement user roles for group creation
