/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAction, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../../stores/authStore";
import type { Id } from "../../../convex/_generated/dataModel";
// import {
//   create1on1Conversation,
//   createGroupConversation,
// } from "../../../convex/chat";

const AddNewModal = ({
  className,
  toggleCreateChatModal,
  setSelectedChat,
}: any) => {
  const [searchName, setSearchName] = useState("");
  const [unselectedUsersList, setUnselectedUsersList] = useState(
    Array<{ _id?: string; username: string }>,
  );
  const [selectedUsersList, setSelectedUsersList] = useState(
    Array<{ _id?: string; username: string }>,
  );
  const [filterList, setFilterList] = useState(
    Array<{ _id?: string; username: string }>,
  );
  const [groupName, setGroupName] = useState("");

  const { user } = useAuthStore();

  const listUsersAction = useAction((api.createChat as any).getUsersByUsername);

  const create1on1Conversation = useMutation(
    (api.createChat as any).create1on1Conversation,
  );
  const createGroupConversation = useMutation(
    api.createChat.createGroupConversation,
  );

  const fetchUsers = async (e: any) => {
    e.preventDefault();
    const usernameList = await listUsersAction({ username: searchName });
    setUnselectedUsersList(
      usernameList.filter((users: any) => users.username !== user?.username),
    );

    setFilterList(filterList);
    console.log("from db call", { usersList: unselectedUsersList });
  };

  const createNewConversation = async () => {
    console.log("function called");
    let conversationId;
    console.log(user?.id);
    if (selectedUsersList.length === 1)
      conversationId = await create1on1Conversation({
        userId1: user?.id,
        userId2: selectedUsersList?.[0]?.["_id"],
      });
    else {
      if (!groupName) {
        console.log("enter the group name first...");
        return;
      }
      console.log("group chat creating...");
      const memberIds: Id<"users">[] = selectedUsersList.map(
        (user) => user?.["_id"] as Id<"users">,
      );
      memberIds.push(user?.id as Id<"users">);

      conversationId = await createGroupConversation({
        name: groupName,
        memberIds,
      });
    }
    console.log(conversationId);
    setSelectedChat({
      conversationId,
      conversationName: groupName ? groupName : selectedUsersList[0]?.["_id"],
    });
    toggleCreateChatModal();
  };

  useEffect(() => {
    setFilterList(
      unselectedUsersList.filter((user) =>
        (user?.["username"] as string)?.includes(searchName),
      ),
    );

    console.log(searchName, { filterList }, { unselectedUsersList });
  }, [searchName, setUnselectedUsersList, unselectedUsersList]);

  return (
    <div className={className}>
      <div className="flex flex-col gap-4">
        <form className="flex gap-4 w-1/2">
          <input
            type="text"
            placeholder="enter name..."
            value={searchName}
            onChange={(e) => {
              setSearchName(e.target.value);
              console.log({ usersList: unselectedUsersList });
            }}
            className="border-2 p-2 rounded-2xl w-full"
          />
          <button
            type="submit"
            className="border-2 p-2 rounded-2xl"
            onClick={fetchUsers}
          >
            search
          </button>
        </form>

        <div className="flex gap-4">
          <div className="flex gap-4 w-1/2">
            {filterList.length == 0 ? (
              <div className="flex flex-col gap-4 w-full">
                <h3>no user to add... </h3>
              </div>
            ) : (
              <div className="flex flex-col gap-4 w-full">
                <h3>Unselescted Users</h3>
                {filterList.map((user) => (
                  <div
                    key={user?.["_id"]}
                    data-key={user?.["_id"]}
                    className="flex justify-between py-2 px-4 border-2 rounded-2xl"
                  >
                    <h3>{user?.["username"]}</h3>

                    <button
                      onClick={(e) => {
                        console.log(e);
                        setSelectedUsersList(
                          (state: { _id?: string; username: string }[]) => [
                            ...state,
                            {
                              _id: (e.target as HTMLElement)?.parentElement
                                ?.dataset.key,
                              username: (
                                (e.target as HTMLElement)
                                  ?.previousElementSibling as HTMLElement
                              )?.innerText,
                            },
                          ],
                        );

                        setUnselectedUsersList((state) =>
                          state.filter(
                            (user) =>
                              user?.["_id"] !==
                              (e.target as HTMLElement)?.parentElement?.dataset
                                .key,
                          ),
                        );
                      }}
                      className="p-1 border-1 rounded-xl"
                    >
                      ADD
                    </button>
                  </div>
                ))}
              </div>
            )}

            {selectedUsersList.length == 0 ? (
              <div className="flex flex-col gap-4 w-full">
                <h3>No user added yet...</h3>
              </div>
            ) : (
              <div className="flex flex-col gap-4 w-full">
                <h3>Selescted Users</h3>
                {selectedUsersList.map((user) => (
                  <div
                    key={user?.["_id"]}
                    data-key={user?.["_id"]}
                    className="flex justify-between py-2 px-4 border-2 rounded-2xl"
                  >
                    <h3>{user?.["username"]}</h3>

                    <button
                      onClick={(e) => {
                        setUnselectedUsersList((state) => [
                          ...state,
                          {
                            _id: (e.target as HTMLElement)?.parentElement
                              ?.dataset.key,
                            username: (
                              (e.target as HTMLElement)
                                ?.previousElementSibling as HTMLElement
                            )?.innerText,
                          },
                        ]);

                        setSelectedUsersList((state) =>
                          state.filter(
                            (user) =>
                              user?.["_id"] !==
                              (e.target as HTMLElement)?.parentElement?.dataset
                                .key,
                          ),
                        );
                      }}
                      className="p-1 border-1 rounded-xl"
                    >
                      RMV
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 w-1/2">
            {selectedUsersList.length === 0 ? (
              <h2>No Action is Specified...</h2>
            ) : selectedUsersList.length === 1 ? (
              <h2>
                Action : creating a 1 on 1 chat with{" "}
                {selectedUsersList[0]?.["username"]}...
              </h2>
            ) : (
              <div>
                <h2>
                  Action : creating a group chat with {selectedUsersList.length}{" "}
                  other members...
                </h2>
                <input
                  type="text"
                  placeholder="enter group name..."
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </div>
            )}
            <button
              className={`border-2 p-2 ${selectedUsersList.length === 0 ? "bg-red-200 text-black" : "bg-red-800 text-white"}`}
              onClick={async () => {
                if (selectedUsersList.length !== 0)
                  await createNewConversation();
                else console.log("no user is selescted...");
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewModal;
