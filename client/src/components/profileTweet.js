import React, {useEffect, useState} from "react";
import {useLocation, useSearchParams} from "react-router-dom";
import useInfiniteData from "../hooks/useInfiniteData";
import {getProfileTweets} from "../util/api";
import TimeLine from "./timeline";

export default function ProfileTweet({username, filterBy}) {
  const apiProps = {username};
  const [filter, setFilter] = useState(filterBy);
  useEffect(() => {
    setFilter(filterBy);
  }, [filterBy]);

  apiProps["filter"] = filter;

  const {tweets, hasNextPage, isFetching} = useInfiniteData({
    apiCall: getProfileTweets,
    apiCallId: username + (filter ? filter : ""),
    apiProps,
  });
  return (
    <TimeLine
      tweets={tweets}
      hasNextPage={hasNextPage}
      isFetching={isFetching}
    ></TimeLine>
  );
}
