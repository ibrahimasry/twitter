import {CircularProgress, LinearProgress} from "@mui/material";
import React, {useEffect, useState, useRef} from "react";
import Post from "./post";

export default function TimeLine({tweets, hasNextPage, isFetching}) {
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
        {isFetching && <LinearProgress className="text-steal-300 w-1/2 " />}
        {!hasNextPage && <span>no more tweets</span>}
      </div>
    </div>
  );
}

export function getListFromPagination(apiResult, mapCb) {
  return (
    <>
      {apiResult?.pages?.map(({data: group}, i) => {
        console.log(group);
        return (
          <React.Fragment key={i}>
            {group?.map((item, j) => mapCb(item, j, i))}
          </React.Fragment>
        );
      })}
    </>
  );
}
