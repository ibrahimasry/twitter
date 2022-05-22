import React, {useState} from "react";
import {useMutation, useQuery} from "react-query";
import useSocketEvent from "../useSocketEvent";
import useSocket from "../socket";
import {getSuggestionRequest, useFollowMutation} from "../util/api";
import {useNavigate} from "react-router-dom";

export default function Suggest() {
  const {data, refetch} = useQuery("getSuggestion", getSuggestionRequest);
  const navigate = useNavigate();
  useSocketEvent("follow", refetch);
  const users = data?.data;
  console.log(users);
  const onClickHandler = (username) => navigate("/" + username);
  return (
    <div className="flex flex-col space-y-2  text-sm text-slate-400">
      {users?.length ? (
        <span>follow suggestions</span>
      ) : (
        <span>no follow suggestions</span>
      )}

      {users &&
        users.map(({name, username, avatar, _id}) => {
          return (
            <div key={username} className="flex space-x-1 items-start  ">
              <div
                onClick={() => onClickHandler(username)}
                className="flex flex-col space-y-1 cursor-pointer"
                key={_id}
              >
                <div className="flex space-x-2">
                  <div className="border-2  border-solid border-black rounded-full w-10 h-10">
                    <img
                      className="w-full h-full rounded-full "
                      src={avatar}
                    ></img>
                  </div>
                  <Button user={{username, _id}}></Button>
                </div>
                <div>
                  <div className="space-x-2  p-2">
                    <span>@{username}</span>
                    <span>{name}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}

function Button({user}) {
  const {_id, username} = user;
  const {mutate} = useFollowMutation({_id, username});

  return (
    <button
      className="border border-secondary hover:bg-slate-700 p-1 rounded-lg"
      onClick={(e) => {
        e.stopPropagation();
        mutate({_id, username});
      }}
    >
      follow
    </button>
  );
}
