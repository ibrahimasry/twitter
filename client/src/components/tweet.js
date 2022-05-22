import React, {useRef, useState} from "react";
import {ReactTinyLink} from "react-tiny-link";
import Popover, {positionDefault} from "@reach/popover";

import {Link, useNavigate, useParams} from "react-router-dom";
import {getContent} from "../util/helper";
import TweetReaction from "./tweetReaction";
import Model from "./model";
import ProfilePreview from "./ProfilePreview";
import {getDate} from "../util/helper";
import ShowMedia from "./ShowMedia";
import useVideo from "../hooks/useVideo";

export default function TweetContent({data, isQuote}) {
  const [showDialog, setShowDialog] = React.useState(false);
  const navigate = useNavigate();
  const {tweetID} = useParams();
  const {videoRef, isMuted, toggleMute} = useVideo();

  const open = (e) => {
    setShowDialog(true);
    setUsername();
  };

  const close = () => setShowDialog(false);
  const [username, setUsername] = useState(undefined);
  const ref = React.useRef(null);
  data = {...data.owner, ...data};
  let [last, text] = getContent(data?.text);
  text = data.image && last ? data.text : text;
  const onNavigateHandler = (e, url) => {
    e.stopPropagation();

    if ("tweets/" + tweetID === url) return;
    navigate("/" + url);
  };
  return (
    data && (
      <>
        <div
          className="flex flex-row flex-wrap flex-grow shrink-0 space-x-1"
          onClick={(e) => onNavigateHandler(e, "tweets/" + data._id)}
        >
          <div onMouseOut={close} onMouseOver={(e) => open(e, data.username)}>
            <span
              onClick={(e) => onNavigateHandler(e, data.username)}
              ref={ref}
              className="w-12 h-12  cursor-pointer rounded-full"
            >
              <img
                src={data.avatar}
                className="w-12 h-12  block object-cover rounded-full "
              ></img>
            </span>

            {showDialog && (
              <Popover
                className="relative z-50"
                targetRef={ref}
                position={positionDefault}
              >
                <ProfilePreview username={data.username}></ProfilePreview>{" "}
              </Popover>
            )}
          </div>

          <div className="space-y-1 flex-grow shrink-0 basis-3/4 break-all">
            <div className="flex  space-x-2 items-baseline">
              <span
                onClick={(e) => onNavigateHandler(e, data.username)}
                className="space-x-2 cursor-pointer"
              >
                <span className="  text-sm font-semibold  ">
                  @{data.name.slice(0, 9)}
                  {data.name.length > 8 && "..."}
                </span>
                <span className=" text-sm text-extra-light-grey ">
                  {data.username.slice(0, 9)}
                  {data.username.length > 8 && "..."}
                </span>
              </span>
              <time
                dateTime={data.createdAt}
                title={new Date(data.createdAt).toLocaleDateString()}
                className="mt-1.5 text-xs   relative "
              >
                {getDate(data.createdAt)}
              </time>
            </div>
            {data.replyTo && (
              <>
                <span className="text-[10px] ">replying to</span>
                <Link to={"/" + data.replyTo.owner.username}>
                  <span className="text-xs ml-1">
                    @{data.replyTo?.owner.username}
                  </span>
                </Link>
              </>
            )}

            <p className="pb-1" dangerouslySetInnerHTML={{__html: text}}></p>
            {data.image && ShowMedia({url: data.image})}
            {last && !data.image && (
              <div className=" p-4">
                <ReactTinyLink
                  cardSize="small"
                  maxLine={2}
                  minLine={1}
                  url={last}
                ></ReactTinyLink>
              </div>
            )}
            {!!data.quoteTo &&
              (isQuote ? (
                <Link to={`tweets/${data.quoteTo._id}`}>
                  {" "}
                  {data.quoteTo.owner.username}/tweet/
                </Link>
              ) : (
                <div className=" mx-auto p-4 border-2 border-solid border-secondary rounded-lg">
                  <TweetContent
                    isQuote={true}
                    data={data.quoteTo}
                  ></TweetContent>
                </div>
              ))}
            {!isQuote && <TweetReaction tweetData={data}></TweetReaction>}
          </div>
        </div>
      </>
    )
  );
}
