import React from "react";
import {Link, useParams} from "react-router-dom";
import Replies from "../components/replies";
import TweetContent from "../components/TweetContent/TweetContent";
import {useQuery} from "react-query";
import {getTweetRequest} from "../util/api";
import TweetInput from "../components/tweetInput";
import Header from "../components/Header";
import {useAuth} from "../useAuth";

export default function FullTweet() {
  const {tweetID} = useParams();
  const authUser = useAuth();
  const {data} = useQuery(["getTweet", tweetID], () =>
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
      {authUser && <TweetInput tweet={data} isReply={true}></TweetInput>}
      <Replies data={data?.replies || []}></Replies>
    </>
  );
}
