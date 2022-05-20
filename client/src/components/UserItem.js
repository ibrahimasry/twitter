import React from "react";
import {Link} from "react-router-dom";
import {Button} from "./ProfilePreview";

export default function UserItem({
  avatar: src,
  username,
  name,
  bio,
  followingState,
  _id,
}) {
  return (
    <Link to={"/" + username}>
      <div
        className={`flex items-start space-x-3 text-xs text-extra-light-grey p-2
       shadow-sm shadow-dark-grey`}
      >
        <span className="w-6 h-6 rounded-full overflow-hidden">
          <img className="w-full h-full object-cover" src={src}></img>
        </span>
        <div className="flex flex-col space-x-2">
          <span>{username}</span>
          <span>{name}</span>
          <span>{bio}</span>
        </div>
        {/* <Button
          username={username}
          _id={_id}
          followingState={followingState}
          className="!ml-auto"
        ></Button> */}
      </div>
    </Link>
  );
}
