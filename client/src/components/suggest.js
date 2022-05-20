import React, {useState} from "react";
import {useMutation, useQuery} from "react-query";
import useSocketEvent from "../useSocketEvent";
import useSocket from "../socket";
import {getSuggestionRequest, useFollowMutation} from "../util/api";
import {useNavigate} from "react-router-dom";

export default function Suggest() {
  const {data, refetch} = useQuery("getSuggestion", getSuggestionRequest);
  //const [follow, setFollow] = useState(false);
  const navigate = useNavigate();
  useSocketEvent("follow", refetch);
  const users = data?.data;
  const onClickHandler = (username) => navigate("/" + username);
  return (
    <div className="flex flex-col space-y-2  text-sm text-slate-400">
      <span>follow suggestions</span>
      {users &&
        users.map(({name, username, avatar, _id}) => {
          return (
            <div
              key={username}
              className="flex space-x-1 items-start justify-between"
            >
              <div
                onClick={() => onClickHandler(username)}
                className="flex flex-col space-y-1 cursor-pointer"
                key={_id}
              >
                <div className="border-2  border-solid border-black rounded-full w-10 h-10">
                  <img
                    className="w-full h-full rounded-full "
                    src={avatar}
                  ></img>
                </div>
                <div>
                  <div className="flex flex-col p-2">
                    <span>@{username}</span>
                    <span>{name}</span>
                  </div>
                </div>
              </div>
              <Button user={{username, _id}}></Button>
            </div>
          );
        })}
    </div>
  );
}

function Button({user}) {
  const {_id, username} = user;
  const {mutate} = useFollowMutation({_id, username});

  return <button onClick={() => mutate({_id, username})}>follow</button>;
}
