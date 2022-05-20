import React, {useEffect, useRef, useState} from "react";
import Popover, {positionDefault} from "@reach/popover";
import {postRetweetRequest} from "../util/api";
import {AiOutlineRetweet} from "react-icons/ai";
import {useMutation} from "react-query";
import {FaRetweet} from "react-icons/fa";

export default function Retweet({tweet, setShowDialog, openUsers}) {
  const [showPopOver, setShowPopOver] = useState(false);
  const ref = useRef();
  const [isRetweeted, setIsRetweeted] = useState(tweet?.alreadyRetweet);
  const [tweetCount, setTweetCount] = useState(tweet.retweets);
  const tweetId = tweet.isRetweet ? tweet.retweetData._id : tweet._id;
  const alreadyRetweet = tweet.alreadyRetweet;
  const {mutate: retweetMutate} = useMutation(
    "postRetweetRequest",
    postRetweetRequest,
    {
      onMutate: async () => {
        setIsRetweeted(!isRetweeted);
        setTweetCount((prev) => (isRetweeted ? --prev : ++prev));
      },
    }
  );

  const handleRetweetClick = (e) => {
    e.stopPropagation();
    setShowPopOver(false);

    retweetMutate({
      tweetId,
    });
  };
  const popoverRef = useClickOut(() => setShowPopOver(false));

  return (
    <span ref={popoverRef} className="flex space-y-1 items-center ">
      <span
        onClick={(e) => {
          e.stopPropagation();
          setShowPopOver(true);
        }}
        className={`${
          isRetweeted ? "text-extra-light-grey" : "text-dark-grey"
        } p-2 rounded-full`}
      >
        <FaRetweet></FaRetweet>
      </span>

      <span
        className="text-xs cursor-pointer hover:text-dark-grey font-bold"
        onClick={() => openUsers("retweets")}
      >
        {tweetCount}
      </span>

      {showPopOver && (
        <Popover targetRef={popoverRef} position={positionDefault}>
          <ul className=" relative z-50 p-1 space-y-2  text-center text-xm  child:border-b-[1px] child:border-solid child:border-b-secondary ">
            <li
              onClick={(e) => {
                e.stopPropagation();
                setShowPopOver(false);
                setShowDialog(true);
              }}
              className="cursor-pointer  "
            >
              <span>quote tweet</span>
            </li>
            <li onClick={handleRetweetClick} className="cursor-pointer">
              <span> {isRetweeted ? "un" : ""}retweet </span>
            </li>
          </ul>
        </Popover>
      )}
    </span>
  );
}

const useClickOut = (cb) => {
  const ref = useRef(null);
  useEffect(() => {
    const clickOut = (e) => {
      if (!ref.current?.contains(e.target)) {
        cb(e);
      }
    };
    window.addEventListener("click", clickOut);
    return () => {
      window.removeEventListener("click", clickOut);
    };
  }, [cb]);
  return ref;
};
