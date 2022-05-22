import {format} from "date-fns";
import React, {useEffect, useRef, useState} from "react";
import {useMutation, useQuery} from "react-query";
import {Link} from "react-router-dom";
import {GoBack} from "../icons";
import useSocket from "../socket";
import {useAuth} from "../useAuth";
import {getChat, postMessage} from "../util/api";
import {getDate} from "../util/helper";

export default function Chat({chatId, messages, setToggle}) {
  const [value, setValue] = useState("");
  const user = useAuth();
  const userId = user._id;
  const socket = useSocket();
  const {mutate} = useMutation("postMessage", postMessage, {
    onSuccess: () => socket.emit("message", {chatId, userId}),
  });
  const ref = useRef();
  useEffect(() => {
    ref?.current?.scrollIntoView({behavior: "smooth"});
  });

  return (
    <div className="p-2 flex flex-col items-stretch h-[70vh]">
      <div className="space-x-2 flex">
        <span className="lg:hidden" onClick={() => setToggle(true)}>
          <GoBack></GoBack>
        </span>

        <Link to={"/" + user.username}>
          <div
            // onClick={() => onClickHandler(username)}
            className="flex  space-x-1 cursor-pointer"
            //key={_id}
          >
            <div className="border-2  border-solid border-black rounded-full w-10 h-10">
              <img
                className="w-full h-full rounded-full "
                src={user.avatar}
              ></img>
            </div>
            <div>
              <div className="flex flex-col">
                <span>@{user.username}</span>
                <span>{user.name}</span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      <div className="flex h-96 flex-1 space-y-3  flex-col   overflow-y-auto  p-x-8  grow">
        {messages &&
          messages.map((message, i) => {
            let hide =
              i === 0 ||
              message.sender._id.toString() !==
                messages[i - 1].sender._id.toString();

            const owner = message.sender._id.toString() === user._id.toString();
            return (
              <div
                className={`flex  mr-1  p-2 ${owner ? "flex-row-reverse" : ""}`}
                key={i}
              >
                {hide && (
                  <span className="p-1">
                    <img
                      className={`
                         h-6 w-6 rounded-full `}
                      src={message?.sender?.avatar}
                    />
                  </span>
                )}
                <div className="flex flex-col space-y-1 text-sm w-2/3">
                  <div
                    className={`flex ${
                      owner ? "flex-row-reverse" : ""
                    } space-x-2 child:p-1`}
                  >
                    {hide && (
                      <>
                        <Link to={"/" + message.username}>
                          <span>@{message.sender.username}</span>
                        </Link>
                      </>
                    )}
                  </div>

                  <span
                    key={message._id}
                    className={`relative bg-background p-3 shadow-sm shadow-dark-grey rounded-md break-all ${
                      !hide ? (owner ? "mr-10" : "ml-10") : ""
                    } `}
                  >
                    {message.text}
                    <span className="text-[10px] self-end absolute bottom-0 right-1">
                      {" "}
                      {getDate(message.createdAt)}
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        <div ref={ref}></div>
      </div>
      <div className="mb-2 flex items-center space-x-2 fixed z-50 bottom-11 right-11">
        <textarea
          className="p-2 h-10 outline-none flex-1 border-2 border-solid border-secondary rounded-xl  transition-all hover:border-1  hover:border-solid"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        ></textarea>
        <button
          className="px-4 py-2 bg-secondary shadow-sm shadow-light-grey rounded-lg"
          onClick={() => {
            value?.length && mutate({text: value, chatId});
            setValue("");
          }}
        >
          send
        </button>
      </div>
    </div>
  );
}
