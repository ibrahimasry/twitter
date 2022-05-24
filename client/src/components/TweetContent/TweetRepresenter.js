import React, {useRef, useState} from "react";
import {ReactTinyLink} from "react-tiny-link";
import Popover, {positionDefault} from "@reach/popover";

import {Link, useNavigate, useParams} from "react-router-dom";
import TweetReaction from "../tweetReaction";
import ProfilePreview from "../ProfilePreview";
import {getDate} from "../../util/helper";
import ShowMedia from "../ShowMedia";
import TweetContent from "./TweetContent";
import DeleteTweet from "../DeleteTweet.js/DeleteTweet";

export default function TweetRepresenter(props) {
  const ref = React.useRef(null);
  const {
    isOwner,
    onNavigateHandler,
    tweet,
    username,
    setUsername,
    close,
    open,
    text,
    showDialog,
    last,
    isQuote,
  } = props;

  return (
    tweet && (
      <>
        <div
          className="flex flex-row flex-wrap flex-grow shrink-0 space-x-1"
          onClick={(e) => onNavigateHandler(e, "tweets/" + tweet._id)}
        >
          <div onMouseOut={close} onMouseOver={(e) => open(e, tweet.username)}>
            <span
              onClick={(e) => onNavigateHandler(e, tweet.username)}
              ref={ref}
              className="w-12 h-12  cursor-pointer rounded-full"
            >
              <img
                src={tweet.avatar}
                className="w-12 h-12  block object-cover rounded-full "
              ></img>
            </span>

            {showDialog && (
              <Popover
                className="relative z-50"
                targetRef={ref}
                position={positionDefault}
              >
                <ProfilePreview username={tweet.username}></ProfilePreview>{" "}
              </Popover>
            )}
          </div>

          <div className="space-y-1 flex-grow shrink-0 basis-3/4 break-all">
            <div className="flex  space-x-2 items-baseline">
              <span
                onClick={(e) => onNavigateHandler(e, tweet.username)}
                className="space-x-2 cursor-pointer"
              >
                <span className="  text-sm font-semibold  ">
                  @{tweet.name?.slice(0, 9)}
                  {tweet.name?.length > 8 && "..."}
                </span>
                <span className=" text-sm text-extra-light-grey ">
                  {tweet.username.slice(0, 9)}
                  {tweet.username.length > 8 && "..."}
                </span>
              </span>
              <time
                dateTime={tweet.createdAt}
                title={new Date(tweet.createdAt).toLocaleDateString()}
                className="mt-1.5 text-xs   relative "
              >
                {getDate(tweet.createdAt)}
              </time>
              {isOwner && <DeleteTweet _id={tweet._id.toString()} />}
            </div>
            {tweet.replyTo && (
              <>
                <span className="text-[10px] ">replying to</span>
                <Link to={"/" + tweet.replyTo.owner.username}>
                  <span className="text-xs ml-1">
                    @{tweet.replyTo?.owner.username}
                  </span>
                </Link>
              </>
            )}

            <p className="pb-1" dangerouslySetInnerHTML={{__html: text}}></p>
            {tweet.image && ShowMedia({url: tweet.image})}
            {last && !tweet.image && (
              <div className=" p-4">
                <ReactTinyLink
                  cardSize="small"
                  maxLine={2}
                  minLine={1}
                  url={last}
                ></ReactTinyLink>
              </div>
            )}
            {!!tweet.quoteTo &&
              (isQuote ? (
                <Link to={`tweets/${tweet.quoteTo._id}`}>
                  {" "}
                  {tweet.quoteTo.owner.username}/tweet/
                </Link>
              ) : (
                <div className="p-4 border-2 border-solid border-secondary rounded-lg">
                  <TweetContent
                    isQuote={true}
                    data={tweet.quoteTo}
                  ></TweetContent>
                </div>
              ))}
            {!isQuote && <TweetReaction tweetData={tweet}></TweetReaction>}
          </div>
        </div>
      </>
    )
  );
}
