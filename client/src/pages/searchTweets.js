import React from "react";
import Header from "../components/Header";
import SearchTimeLine from "../components/SearchTimeLine";

export default function SearchTweets() {
  return (
    <>
      <Header title={"search result"} goBack={true}></Header>
      <SearchTimeLine></SearchTimeLine>
    </>
  );
}
