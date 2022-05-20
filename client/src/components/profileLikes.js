import React from "react";
import {useBottomScrollListener} from "react-bottom-scroll-listener";
import {useInfiniteQuery, useQuery} from "react-query";
import useInfiniteData from "../hooks/useInfiniteData";
import {getProfileLikes} from "../util/api";
import TimeLine from "./timeline";

export default function ProfileLikes({username}) {
  const {tweets, hasNextPage, isFetching} = useInfiniteData({
    apiCall: getProfileLikes,
    apiCallId: username,
    apiProps: {username},
  });
  return (
    <TimeLine
      tweets={tweets}
      hasNextPage={hasNextPage}
      isFetching={isFetching}
    ></TimeLine>
  );
}
