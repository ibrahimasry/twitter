import React, {useState} from "react";
import {useInfiniteQuery} from "react-query";
import {useBottomScrollListener} from "react-bottom-scroll-listener";
import TimeLine from "../components/timeline";
import TweetInput from "../components/tweetInput";
import {getTimeLine} from "../util/api";
import {CircularProgress} from "@mui/material";
import useSocketEvent from "../useSocketEvent";
import {useAuth} from "../useAuth";
import Header from "../components/Header";
import Trends from "../components/Trends";
import Suggest from "../components/suggest";

export default function Home() {
  const [newTweet, setNewTweet] = useState(0);
  const [isFetchingNew, setIsFetchingNew] = useState(false);
  const user = useAuth();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    refetch: reset,
  } = useInfiniteQuery("getTimeLine", getTimeLine, {
    getNextPageParam: (lastPage, again) => {
      return lastPage.nextCursor;
    },
  });
  useBottomScrollListener(fetchNextPage, {
    offset: 300,
    debounce: 100,
    debounceOptions: {leading: true},
    triggerOnNoScroll: false,
  });
  useSocketEvent("newTweet", () => setNewTweet((prev) => prev + 1));

  return (
    <>
      <Header title="Home"></Header>
      <div className="flex justify-between space-x-4">
        <div className="flex flex-col flex-grow ">
          <div className="flex space-x-1 md:p-4 p-1 ">
            <div className="w-12 h-12 flex-shrink-0">
              <img
                className="w-full h-full rounded-full"
                src={user.avatar}
              ></img>
            </div>
            <TweetInput></TweetInput>
          </div>
          {isFetchingNew && (
            <span className="text-xs text-center  self-stretch animate-pulse">
              <CircularProgress size={`1rem`}></CircularProgress>
            </span>
          )}

          {newTweet > 0 && (
            <div
              className="text-xs text-center cursor-pointer bg-blue self-stretch"
              onClick={() => {
                setIsFetchingNew(true);
                setNewTweet(0);

                reset().then(() => {
                  setIsFetchingNew(false);
                });
              }}
            >
              {`${newTweet} new tweet ${newTweet > 1 ? "s" : ""}`}
            </div>
          )}
          <TimeLine
            emptyMsg={"follow more people to see tweets"}
            tweets={data}
            isFetching={isFetching}
            hasNextPage={hasNextPage}
          ></TimeLine>
        </div>
        <div className="hidden h-[50vh]  md:flex-col md:flex mt-24 bg-slate-800 border-2 border-secondary p-4 space-y-5">
          <Trends></Trends>

          <Suggest></Suggest>
        </div>
      </div>
    </>
  );
}
