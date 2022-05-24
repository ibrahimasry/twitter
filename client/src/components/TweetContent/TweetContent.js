import React, {useRef, useState} from "react";

import {Link, useNavigate, useParams} from "react-router-dom";
import {getContent} from "../../util/helper";
import {useAuth} from "../../useAuth";
import TweetRepresenter from "./TweetRepresenter";
export default function TweetContent({data: tweet, isQuote}) {
  const navigate = useNavigate();
  const {tweetID} = useParams();
  const authUser = useAuth();

  const [username, setUsername] = useState(undefined);

  const [showDialog, setShowDialog] = React.useState(false);
  if (!tweet) return;
  const open = (e) => {
    setShowDialog(true);
    setUsername();
  };
  const close = () => setShowDialog(false);

  tweet = {...tweet.owner, ...tweet};
  //get the last link typed
  let [last, text] = getContent(tweet?.text);
  last = tweet.media && last ? tweet.media : last;
  const onNavigateHandler = (e, url) => {
    if ("tweets/" + tweetID === url) return;
    navigate("/" + url);
    e.stopPropagation();
  };

  const isOwner = authUser?.username === tweet.username;
  const props = {
    isOwner,
    onNavigateHandler,
    tweet,
    username,
    setUsername,
    close,
    open,
    text,
    showDialog,
    tweetID,
    navigate,
    last,
    isQuote,
  };
  return <TweetRepresenter {...props} />;
}
