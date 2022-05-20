import React from "react";
import HashTagsTimeLine from "../components/HashTagsTimeLine";
import Header from "../components/Header";

export default function HashTagTweets() {
  return (
    <>
      <Header title={"result for hashtag"} goBack={true}></Header>
      <HashTagsTimeLine></HashTagsTimeLine>
    </>
  );
}
