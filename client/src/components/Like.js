import React, {useState} from "react";
import {AiOutlineHeart} from "react-icons/ai";
import {FaHeart} from "react-icons/fa";
import {useAuth} from "../useAuth";
import {usePostLike} from "../util/api";

export default function Like({tweet, openUsers}) {
  console.log(tweet.likes);
  const [isLiked, setIsLiked] = useState(tweet.alreadyLike);
  const [count, setCount] = useState(tweet.likes);
  const [animate, setAnimate] = useState("");
  const likeMutate = usePostLike({tweet, willLike: !isLiked}, () => {
    setCount(isLiked ? count - 1 : count + 1);
    const willAnimate = !isLiked;
    setIsLiked(!isLiked);
    if (willAnimate) setAnimate("animate-heart");
  });

  const handleLikeClicked = (e) => {
    e.stopPropagation();
    const tweetId = tweet.isRetweet ? tweet.retweetData._id : tweet._id;
    likeMutate({tweetId});
  };
  return (
    <span className="flex space-x-1 items-center ">
      <span
        onClick={handleLikeClicked}
        className={`p-2 rounded-full ${isLiked ? "heart" : "unheart"}
      ${animate}`}
      ></span>

      <span
        className="text-xs cursor-pointer hover:text-dark-grey font-bold"
        onClick={() => openUsers("likes")}
      >
        {count}
      </span>
    </span>
  );
}
