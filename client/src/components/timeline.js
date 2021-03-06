import {CircularProgress, LinearProgress} from "@mui/material";
import React, {useEffect, useState, useRef} from "react";
import Post from "./post";

export default function TimeLine({tweets, hasNextPage, isFetching, emptyMsg}) {
  if (!tweets)
    return (
      <span className="flex  justify-center">
        <CircularProgress></CircularProgress>
      </span>
    );
  return (
    <div className="">
      {getListFromPagination(tweets, (tweet, j, i) => {
        tweet.page = i;
        tweet.order = j;
        return <Post key={tweet._id} tweet={tweet}></Post>;
      })}
      <div className="flex flex-col items-center">
        {isFetching && (
          <LinearProgress className="text-steal-300 w-1/2 my-4 " />
        )}
        {!hasNextPage && !isFetching && tweets?.pages[0]?.data?.length > 0 && (
          <span>no more tweets</span>
        )}
        {/* //if there is no data from first request */}
        {!hasNextPage &&
          !isFetching &&
          tweets?.pages[0]?.data?.length === 0 && <span> {emptyMsg} </span>}
      </div>
    </div>
  );
}

export function getListFromPagination(apiResult, mapCb) {
  return (
    <>
      {apiResult?.pages?.map(({data: group}, i) => {
        return (
          <React.Fragment key={i}>
            {group?.map((item, j) => mapCb(item, j, i))}
          </React.Fragment>
        );
      })}
    </>
  );
}
