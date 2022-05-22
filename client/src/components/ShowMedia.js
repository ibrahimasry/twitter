import {ContentBlock} from "draft-js";
import React, {useEffect} from "react";
import Video from "./Video";

export default function ShowMedia({url}) {
  const ext = url.match(/[^.]+$/)[0];
  let type = "image";
  if ("mp4" === ext) type = "video";

  return type == "image" ? (
    <img src={url} className={"w-10/12 h-8/12 rounded-lg "}></img>
  ) : type == "video" ? (
    <Video url={url}></Video>
  ) : null;
}
