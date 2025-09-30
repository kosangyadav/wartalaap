import React, { useState, useEffect } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuthStore } from "../../../stores/authStore";
import Button from "../Button";
import { SearchInput } from "../Input";
import Card, { CardHeader, CardBody, CardFooter } from "../Card";

import { cn } from "../../utils/cn";

export interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  setSelectedChat: (conversationId: string, conversationName: string) => void;
  loading?: boolean;
  error?: string;
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
  loading = false,
  error,
}) => {
  const [searchName, setSearchName] = useState("");
  const [unselectedUsersList, setUnselectedUsersList] = useState<UserData[]>(
    [],
  );
  const [selectedUsersList, setSelectedUsersList] = useState<UserData[]>([]);
  const [filterList, setFilterList] = useState<UserData[]>([]);
  const [groupName, setGroupName] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const { user } = useAuthStore();

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
      setUnselectedUsersList(
        usernameList.filter(
          (users: UserData) => users.username !== user?.username,
        ),
      );
      setFilterList(filterList);
      console.log("from db call", { usersList: usernameList });
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const createNewConversation = async () => {
    console.log("function called");
    let conversationId;
    console.log(user?.id);
    if (selectedUsersList.length === 1) {
      conversationId = await create1on1Conversation({
        userId1: user?.id as string,
        userId2: selectedUsersList[0]?._id as string,
      });
    } else {
      if (!groupName) {
        console.log("enter the group name first...");
        return;
      }
      console.log("group chat creating...");
      const memberIds = selectedUsersList.map((user) => user?._id as string);
      memberIds.push(user?.id as string);

      conversationId = await createGroupConversation({
        name: groupName,
        // @ts-expect-error - Type conversion needed for Convex ID types
        memberIds,
      });
    }
    console.log(conversationId);
    setSelectedChat({
      conversationId,
      conversationName: groupName ? groupName : selectedUsersList[0]?.username,
    });
    onClose();
  };

  useEffect(() => {
    setFilterList(
      unselectedUsersList.filter((user) =>
        user?.username?.includes(searchName),
      ),
    );

    console.log(searchName, { filterList }, { unselectedUsersList });
  }, [searchName, unselectedUsersList]);

  React.useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setSearchName("");
      setUnselectedUsersList([]);
      setSelectedUsersList([]);
      setFilterList([]);
      setGroupName("");
    }
  }, [isOpen]);

  const handleUserToggle = (user: UserData, isSelected: boolean) => {
    if (isSelected) {
      // Remove from selected, add back to unselected
      setUnselectedUsersList((state) => [...state, user]);
      setSelectedUsersList((state) => state.filter((u) => u._id !== user._id));
    } else {
      // Add to selected, remove from unselected
      setSelectedUsersList((state) => [...state, user]);
      setUnselectedUsersList((state) =>
        state.filter((u) => u._id !== user._id),
      );
    }
  };

  const canCreate =
    selectedUsersList.length > 0 &&
    (selectedUsersList.length === 1 || groupName.trim());

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
            selectedUsersList.length === 0
              ? "Search and select people to start a conversation"
              : selectedUsersList.length === 1
                ? `Direct message with ${selectedUsersList[0].username}`
                : `Group chat with ${selectedUsersList.length} people`
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
            <form onSubmit={fetchUsers} className="flex gap-2">
              <SearchInput
                placeholder="Enter username to search..."
                value={searchName}
                onChange={(e) => {
                  setSearchName(e.target.value);
                  console.log({ usersList: unselectedUsersList });
                }}
                onClear={() => setSearchName("")}
                className="flex-1"
              />
              <Button
                type="submit"
                variant="primary"
                disabled={!searchName.trim() || isSearching}
                loading={isSearching}
                className="whitespace-nowrap"
              >
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </form>
          </div>

          {/* Selected Users */}
          {selectedUsersList.length > 0 && (
            <div className="mb-4 p-3 bg-cream-300 rounded-neu border-2 border-terminal-black">
              <h4 className="font-mono font-bold text-sm text-terminal-black mb-2">
                Selected Users ({selectedUsersList.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedUsersList.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center gap-2 bg-cream-100 rounded-neu px-3 py-1 border-2 border-terminal-black"
                  >
                    <span className="text-sm font-mono">{user.username}</span>
                    <button
                      onClick={() => handleUserToggle(user, true)}
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
          {selectedUsersList.length > 1 && (
            <div className="mb-4">
              <label className="form-label">Group Name</label>
              <input
                type="text"
                className="input-neu"
                placeholder="Enter group name..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                maxLength={50}
              />
            </div>
          )}

          {/* Action Preview */}
          <div className="mb-4 p-3 bg-cream-200 rounded-neu border-2 border-terminal-black">
            <h4 className="font-mono font-bold text-sm text-terminal-black mb-1">
              Action Preview:
            </h4>
            <p className="text-sm text-terminal-light-gray">
              {selectedUsersList.length === 0
                ? "No action specified..."
                : selectedUsersList.length === 1
                  ? `Creating a 1-on-1 chat with ${selectedUsersList[0].username}...`
                  : `Creating a group chat with ${selectedUsersList.length} other members...`}
            </p>
          </div>

          {/* Users List */}
          <div className="space-y-2">
            {isSearching ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="loading-skeleton w-10 h-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="loading-skeleton h-4 w-32" />
                      <div className="loading-skeleton h-3 w-48" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filterList.length === 0 ? (
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
                  {searchName
                    ? "No more users found"
                    : "Search for users to add"}
                </h3>
                <p className="text-terminal-light-gray text-sm">
                  {searchName
                    ? "Try a different search term"
                    : "Enter a username and click search to find users"}
                </p>
              </div>
            ) : (
              <>
                <h4 className="font-mono font-bold text-sm text-terminal-black mb-3">
                  Available Users ({filterList.length})
                </h4>
                {filterList.map((user) => {
                  const isSelected = selectedUsersList.some(
                    (u) => u._id === user._id,
                  );
                  return (
                    <div
                      key={user._id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-neu border-2 cursor-pointer transition-all duration-200",
                        isSelected
                          ? "bg-accent-green text-white border-terminal-black shadow-retro"
                          : "bg-cream-200 border-terminal-black hover:bg-cream-300 hover:shadow-neu-lg",
                      )}
                      onClick={() => handleUserToggle(user, isSelected)}
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
                })}
              </>
            )}
          </div>
        </CardBody>

        <CardFooter>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={async () => {
              if (selectedUsersList.length !== 0) {
                await createNewConversation();
              } else {
                console.log("no user is selected...");
              }
            }}
            disabled={!canCreate || loading}
            loading={loading}
          >
            {loading
              ? "Creating..."
              : selectedUsersList.length === 1
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
