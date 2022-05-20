import React from "react";
import {useParams} from "react-router-dom";
import useInfiniteData from "../hooks/useInfiniteData";
import {getHashTagTimeLine} from "../util/api";
import TimeLine from "./timeline";

export default function HashTagsTimeLine() {
  const {hashtag} = useParams();

  const data = useInfiniteData({
    apiCallId: hashtag,
    apiCall: getHashTagTimeLine,
    apiProps: {hashtag},
  });
  return <TimeLine {...data}></TimeLine>;
}
