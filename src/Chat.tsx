// import { useMutation, useQuery } from "convex/react";
// import { api } from "../convex/_generated/api";
import Navbar from "./components/navbar";
import SelectedChat from "./components/chat/selectedChat";
import AddNewModal from "./components/chat/addNewModal";
import Sidebar from "./components/chat/sidebar";
import { useState } from "react";
import type { Id } from "../convex/_generated/dataModel";

const Chat = () => {
  // const usersList = useQuery(api.chat.getOtherUsers);
  // const sendData = useMutation(api.tasks.send);
  const [selectedChat, setSelectedChat] = useState<{
    conversationId: Id<"conversations">;
    conversationName: string;
  }>();
  const [openCreateChatModal, setOpenCreateChatModel] = useState(false);

  const toggleCreateChatModal = () => setOpenCreateChatModel((state) => !state);

  return (
    <>
      <Navbar />
      <div className="h-screen grid grid-cols-5">
        <Sidebar
          toggleCreateChatModal={toggleCreateChatModal}
          setSelectedChat={setSelectedChat}
        />
        {openCreateChatModal && (
          <AddNewModal
            className="absolute top-1/6 left-1/6 border-2 rounded-2xl w-9/12 h-9/12 p-4"
            toggleCreateChatModal={toggleCreateChatModal}
            setSelectedChat={setSelectedChat}
          />
        )}
        <SelectedChat selectedChat={selectedChat} />
      </div>
    </>
  );
};

export default Chat;
