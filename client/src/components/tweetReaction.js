import React, {useEffect, useState} from "react";
import {AiOutlineComment} from "react-icons/ai";
import Retweet from "./Retweet";
import Model from "./model";
import {useNavigate} from "react-router-dom";
import TweetInput from "./tweetInput";
import {getTweetLikes, getTweetRetweets} from "../util/api";
import {BsShare} from "react-icons/bs";
import {useRef} from "react";
import Users from "./Users";
import Like from "./Like";
export default function TweetReaction({tweetData: tweet, isFull}) {
  const [showDialog, setShowDialog] = React.useState(false);
  const [currModel, setCurrModel] = React.useState(undefined);

  const [showReactionInfo, setShowReactionInfo] = React.useState(false);

  const open = (e) => {
    setShowDialog(true);
  };
  const close = () => setShowDialog(false);

  const openUsers = (reaction) => {
    setShowReactionInfo(true);
    setCurrModel(reaction);
  };
  const closeUsers = () => {
    setShowReactionInfo(false);
    setCurrModel(undefined);
  };
  const navigate = useNavigate();

  return (
    <>
      <div className="flex space-x-[15%]  child:transition-all ease-in child:p-3">
        <span className="flex  items-center">
          <span className="p-2 rounded-full">
            <AiOutlineComment></AiOutlineComment>
          </span>
        </span>
        <Like tweet={tweet} openUsers={openUsers}></Like>
        <Retweet
          tweet={tweet}
          openUsers={openUsers}
          setShowDialog={setShowDialog}
        ></Retweet>
      </div>
      <Model close={close} showDialog={showDialog} label={"quote"}>
        <TweetInput tweet={tweet} isQuote={true} close={close}></TweetInput>
      </Model>

      <Model
        close={closeUsers}
        label="reaction data"
        showDialog={showReactionInfo}
      >
        <Users
          title={currModel}
          _id={tweet._id}
          closeUsers={closeUsers}
          apiCall={currModel == "likes" ? getTweetLikes : getTweetRetweets}
        ></Users>
      </Model>
    </>
  );
}
