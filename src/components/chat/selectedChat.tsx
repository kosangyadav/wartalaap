import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuthStore } from "../../../stores/authStore";
import { useState } from "react";
import type { Id } from "../../../convex/_generated/dataModel";

const SelectedChat = ({ selectedChat }) => {
  const [message, setMessage] = useState("");

  const { user } = useAuthStore();

  const msgHistory = useQuery(api.conversation?.getMsgsInConversation, {
    conversationId: selectedChat?.conversationId,
  });

  const sendMsgToConversation = useMutation(
    api.conversation.sendMsgToConversation,
  );

  return (
    <div className="col-span-4 h-full rounded-2xl m-1 grid grid-rows-12 border-1">
      {!selectedChat ? (
        <div className="row-span-11">No Chat is selected...</div>
      ) : (
        <div className="grid grid-rows-12 row-span-11">
          <div className="border-2 text-2xl">
            Chatting with {selectedChat.conversationName}
          </div>
          <div className="flex flex-col row-span-11 justify-end gap-4">
            {msgHistory?.map(
              (msg: {
                _id: Id<"messages">;
                senderId: Id<"users">;
                content: string;
                _creationTime: number;
              }) => (
                <div
                  key={msg?._id}
                  data-key={msg?._id}
                  className={`flex ${msg.senderId === user?.id ? "self-end" : "self-start"}`}
                >
                  <div
                    className={`max-w-xs p-2 rounded-lg ${msg.senderId === user?.id ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
                  >
                    <h2 className="text-xl">{msg.content}</h2>{" "}
                    <p className="pt-1 text-xs text-right">
                      {new Date(Number(msg._creationTime)).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      )}
      <form className="flex">
        <input
          type="text"
          className="border-2 w-full"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="border-1 p-1"
          onClick={async (e) => {
            e.preventDefault();
            await sendMsgToConversation({
              conversationId: selectedChat?.conversationId,
              senderId: user?.id as Id<"users">,
              content: message,
            });
            setMessage("");
          }}
        >
          send
        </button>
      </form>
    </div>
  );
};

export default SelectedChat;
