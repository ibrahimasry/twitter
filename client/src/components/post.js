import React, {useState} from "react";
import TweetContent from "./TweetContent/TweetContent";
import {useLocation, useNavigate, Navigate, Link} from "react-router-dom";
export default function Post({tweet, isQuote}) {
  let tweetData = tweet.isRetweet ? tweet.retweetData : tweet;
  if (!tweetData.text && !tweetData.image) return null;

  return (
    <div className="p-2  text-lg cursor-pointer mx-auto border-b-2 border-solid border-b-secondary space-y-2">
      <>
        {tweet.isRetweet && (
          <Link to={"/" + tweet.owner.username}>
            <span className="text-xs text-dark-grey font-semibold italic">
              retweet by {tweet.owner.username}
            </span>
          </Link>
        )}
      </>
      <TweetContent data={tweetData || {}}></TweetContent>
    </div>
  );
}
