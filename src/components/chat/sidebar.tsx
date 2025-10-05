import { useAction, useQuery } from "convex/react";
import { useAuthStore } from "../../../stores/authStore";
import { api } from "../../../convex/_generated/api";
import { useEffect, useState } from "react";
import type { Id } from "../../../convex/_generated/dataModel";

const Sidebar = ({ toggleCreateChatModal, setSelectedChat }) => {
  const { user } = useAuthStore();

  const userConversations: [
    {
      _creationTime: Float32Array;
      _id: string;
      name: string;
      pairKey: string;
      isGroup: boolean;
    },
  ] = useQuery(api.conversation.queryUserConversations, {
    userId: user?.id as Id<"users">,
  });

  const getUsernameById = useAction(api.conversation?.getUsernameById);

  const [userConversationsNames, setUserConversationsNames] = useState<
    Array<{ id: string; name: string }>
  >([]);

  useEffect(() => {
    const updateConversationsList = async () => {
      console.log(userConversations);
      const updatedConversationsNames = await Promise.all(
        userConversations?.map(async (conversation) => {
          if (conversation?.isGroup)
            return {
              id: conversation._id,
              name: conversation?.name as string,
            };
          else {
            const twoUsers = conversation?.pairKey?.split(":");
            if (twoUsers?.[0] === user?.id)
              return {
                id: conversation?._id,
                name: (await getUsernameById({
                  userId: twoUsers?.[1],
                })) as string,
              };
            else
              return {
                id: conversation?._id,
                name: (await getUsernameById({
                  userId: twoUsers?.[0],
                })) as string,
              };
          }
        }),
      );

      console.log(updatedConversationsNames);
      setUserConversationsNames(updatedConversationsNames);
    };

    updateConversationsList();
    // console.log(userConversationsNames);
  }, [userConversations, setSelectedChat]);

  return (
    <div>
      <h2>sidebar space</h2>
      <button onClick={toggleCreateChatModal}>new chat</button>
      <div>
        {userConversationsNames?.length === 0 ? (
          <h2>No conversation to show...</h2>
        ) : (
          <div className="flex flex-col gap-2">
            {userConversationsNames?.map((conversation) => (
              <div key={conversation.id} data-key={conversation.id}>
                <button
                  onClick={(e) =>
                    setSelectedChat({
                      conversationId: (e.target as HTMLElement)?.parentElement
                        ?.dataset.key,
                      conversationName: (e.target as HTMLElement)?.innerText,
                    })
                  }
                >
                  {conversation.name}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
