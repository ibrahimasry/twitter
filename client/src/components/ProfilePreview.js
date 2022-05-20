import {CircularProgress} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useMutation, useQuery} from "react-query";
import {getProfile, getUser, useFollowMutation} from "../util/api";
import {formatNumbers} from "../util/helper";

export default ({username}) => {
  const {data: user, isLoading} = useQuery(["getProfile", username], () =>
    getProfile({username})
  );
  const {_id, isFollowing} = user || {};

  const [isFollowingState, setIsFollowingState] = useState(isFollowing);
  useEffect(() => setIsFollowingState(isFollowing), [isFollowing]);

  return (
    <>
      <div
        onClick={(e) => e.stopPropagation()}
        className="  w-60 space-y-1 flex flex-col p-6 text-sm rounded-lg bg-background shadow-sm shadow-dark-grey"
      >
        {isLoading ? (
          <div className="h-full flex  justify-center items-center">
            <CircularProgress></CircularProgress>
          </div>
        ) : (
          <>
            <div className="flex justify-between">
              <div className="w-12 h-12">
                <img
                  className="rounded-full w-full h-full object-cover"
                  src={user.avatar}
                ></img>
              </div>
              {user.isFollowing !== undefined && (
                <Button
                  _id={_id}
                  username={username}
                  followingState={isFollowingState}
                ></Button>
              )}
            </div>
            <span className="font-extrabold text-lg">@{username}</span>
            <span className="font-extrabold">{user.name}</span>
            <p>{user.bio?.slice(0, 100)}</p>
            <div className="space-x-2 flex justify-start">
              <span>
                <span className="text-lg font-bold">
                  {" "}
                  {formatNumbers(user.followings.length)}{" "}
                </span>{" "}
                followings{" "}
              </span>
              <span>
                <span className="text-lg font-bold">
                  {" "}
                  {formatNumbers(user.followers.length)}{" "}
                </span>{" "}
                followers{" "}
              </span>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export function Button({_id, followingState, username}) {
  const [isFollowing, setIsFollwing] = useState(followingState);
  const [text, setText] = useState("");
  const [hoverText, setHoverText] = useState("");
  const {mutate} = useFollowMutation({_id, username});

  const handleOnClick = () => {
    mutate(_id);
    setIsFollwing(!isFollowing);
    setHoverText("");
  };
  const mouseEnter = () => {
    if (text == "follow") setHoverText("following");
    else if (text == "following") setHoverText("unfollow");
  };
  const mouseLeave = () => {
    if (hoverText == "unfollow") setHoverText("following");
    else if (hoverText == "following") setHoverText("follow");
  };

  useEffect(() => {
    if (isFollowing) setText("following");
    else setText("follow");
  }, [isFollowing]);
  if (followingState === undefined) return;

  return isFollowing ? (
    <button
      onMouseLeave={() => mouseLeave()}
      onMouseEnter={() => mouseEnter()}
      onClick={handleOnClick}
      className="text-sm border-2 border-solid border-light-grey text-extra-light-grey self-center p-4 py-1   font-semibold rounded-2xl hover:text-dark-grey hover:border-dark-grey"
    >
      {hoverText || text}
    </button>
  ) : (
    <button
      onClick={handleOnClick}
      onMouseLeave={() => mouseLeave()}
      onMouseEnter={() => mouseEnter()}
      className="text-sm border-2 border-solid border-light-grey  bg-extra-light-grey self-center p-4 py-1   font-semibold rounded-2xl text-dark-grey hover:border-dark-grey"
    >
      {hoverText || text}
    </button>
  );
}
