import React from "react";
import Post from "./post";
export default function Replies({data: replies}) {
  return (
    <div className="space-y-2 text-sm p-2 md:p-6 border border-solid border-secondary">
      {replies &&
        replies.map(({reply}, i) => <Post key={i} tweet={reply}></Post>)}
    </div>
  );
}
