import React from "react";
import {useParams, useSearchParams} from "react-router-dom";
import useInfiniteData from "../hooks/useInfiniteData";
import {getHashTagTimeLine, getSearchTimeLine} from "../util/api";
import TimeLine from "./timeline";

export default function SearchTimeLine() {
  const [searchParams] = useSearchParams();

  console.log(searchParams.get("query"));
  const query = searchParams.get("query");
  const data = useInfiniteData({
    apiCallId: query,
    apiCall: getSearchTimeLine,
    apiProps: {query},
  });
  return <TimeLine {...data}></TimeLine>;
}
