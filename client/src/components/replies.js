import React from "react";
import Post from "./post";
export default function Replies({ data: replies }) {
  return (
    <div className="space-y-2 p-8 border-2 border-solid border-slate-500">
      {replies &&
        replies.map(({ reply }, i) => <Post key={i} tweet={reply}></Post>)}
    </div>
  );
}
