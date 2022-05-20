import React from "react";
import useInfiniteData from "../hooks/useInfiniteData";
import {getFollowers, getFollowings, getTweetsLikes} from "../util/api";
import {getListFromPagination} from "./timeline";
import UserItem from "./UserItem";

export default function Users({title, _id, apiCall, closeUsers}) {
  let {tweets: users} = useInfiniteData({
    apiCall,
    apiProps: {_id},
    apiCallId: _id,
  });
  console.log(title, _id, apiCall.name);
  let renderUser = (user, j, i) => {
    return <UserItem key={j} {...user}></UserItem>;
  };
  return (
    <div className="p-2" onClick={() => closeUsers()}>
      <span className="absolute top-0 first-letter:uppercase left-6 p-1 font-extrabold text-extra-light-grey">
        {title}
      </span>
      {getListFromPagination(users, renderUser)}
    </div>
  );
}
