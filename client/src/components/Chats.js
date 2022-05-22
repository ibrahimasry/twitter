import React from "react";
import {useAuth} from "../useAuth";
import Skeleton from "./Skeleton";
export default function Chats({chats, setChatId, onClick, isLoading}) {
  const {username} = useAuth();
  const handleOnClick = (id) => {
    setChatId(() => id);
  };

  const getChatHeader = (chat) => {
    const lastUser = chat.lastMessage?.sender?.name;
    return (
      (lastUser && "@" + lastUser) ||
      chat.members
        .map((member) =>
          member.username === username ? "you" : member.username
        )
        .join(" ,")
    );
  };
  if (isLoading)
    return (
      <>
        {Array(3)
          .fill(0)
          .map((curr) => (
            <Skeleton></Skeleton>
          ))}{" "}
      </>
    );
  return (
    <div onClick={onClick} className="h-full overflow-y-auto p-2 break-all ">
      {chats.map((chat) => (
        <div
          onClick={() => handleOnClick(chat._id)}
          key={chat._id}
          className={
            `${!chat.lastMessage?.isRead &&
              "text-extra-light-grey font-extrabold"}` +
            "h-32 cursor-pointer flex  p-4 space-x-2  border-b-2 border-solid border-secondary"
          }
        >
          {" "}
          <span className="w-8   h-8 rounded-full shrink-0">
            <img
              className="p-.5 w-full h-full rounded-full"
              src={chat.lastMessage?.sender?.avatar}
            ></img>
          </span>
          <div className="space-y-1 flex flex-col overflow-hidden">
            <span>{getChatHeader(chat)}</span>
            <span className="break-all ">
              {chat.lastMessage
                ? chat.lastMessage.text?.slice(0, 7)
                : "no messages yet"}{" "}
              ..
            </span>{" "}
          </div>
        </div>
      ))}
    </div>
  );
}
