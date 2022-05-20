import React, {useEffect} from "react";
import {Link, useParams} from "react-router-dom";
import Replies from "../components/replies";
import TweetContent from "../components/tweet";
import TweetReaction from "../components/tweetReaction";
import {useQuery, useQueryClient, refetch} from "react-query";
import {getTweetRequest} from "../util/api";
import TweetInput from "../components/tweetInput";
import Header from "../components/Header";

export default function FullTweet() {
  const {tweetID} = useParams();
  const {data, refetch} = useQuery(["getTweet", tweetID], () =>
    getTweetRequest(tweetID)
  );
  if (!data) return;
  return (
    <>
      <Header title="Tweet" goBack={true}></Header>
      {data.replyTo && (
        <Link to={"/tweets/" + data.replyTo._id}>
          {" "}
          <span className="text-xs text-dark-grey ml-4 w-1/3">
            replyTo @{data.replyTo.owner.username}' tweet .
          </span>{" "}
        </Link>
      )}
      <TweetContent data={data || {}}></TweetContent>
      <TweetInput tweet={data} isReply={true}></TweetInput>
      <Replies data={data?.replies || []}></Replies>
    </>
  );
}
