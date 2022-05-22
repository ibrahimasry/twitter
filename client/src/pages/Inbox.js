import React, {useEffect, useState} from "react";
import {BsPlusCircle} from "react-icons/bs";
import {useMutation, useQuery} from "react-query";
import {useSearchParams} from "react-router-dom";
import {queryClient} from "../AppProvider";
import Chat from "../components/Chat";
import Chats from "../components/Chats";
import CreateChat from "../components/CreateChat";
import Header from "../components/Header";
import useSocketEvent from "../useSocketEvent";
import {createChat, getChat, getChats} from "../util/api";

export default function Inbox() {
  const {data: chats = [], isLoading} = useQuery("getChats", getChats);
  const [chatId, setChatId] = useState(undefined);
  const {data, refetch} = useQuery(["getChat", chatId], () => getChat(chatId));
  const [newChat, setNewChat] = useState(false);
  const [toggle, setToggle] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("chatId")) setChatId(searchParams.get("chatId"));
  }, []);
  return (
    <>
      <Header title="chat" goBack={true}></Header>

      <div className="grid gap-4 grid-cols-12  h-[90vh] relative">
        <div
          className={`p-2 ${
            toggle ? "block" : "hidden"
          } col-span-12 lg:block lg:col-span-4 border-solid border-secondary border-r-2`}
        >
          <span
            onClick={() => {
              setChatId(undefined);
              setNewChat(true);
              setToggle(false);
            }}
          >
            <BsPlusCircle></BsPlusCircle>
          </span>
          <Chats
            isLoading={isLoading}
            chats={chats}
            setChatId={setChatId}
            onClick={() => {
              setToggle(!toggle);
              setNewChat(false);
            }}
          ></Chats>
        </div>
        <div
          className={`p-2 ${
            toggle ? "hidden" : "block"
          }  col-span-12 lg:block  lg:col-span-7 `}
        >
          {chatId && (
            <Chat
              setToggle={setToggle}
              messages={data?.messages || []}
              chatId={chatId}
            ></Chat>
          )}
          {newChat && (
            <CreateChat
              setNewChat={setNewChat}
              setChatId={setChatId}
            ></CreateChat>
          )}

          {!chatId && !newChat && (
            <div className="flex justify-center items-center h-full">
              <button
                onClick={() => setNewChat(true)}
                className="p-4 text-lg font-bold bg-dark-grey rounded-full"
              >
                <span>new message</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
