import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Registeration from "./pages/registeration";
import FullTweet from "./pages/FullTweet";
import Profile from "./pages/profile";
import Explore from "./pages/Explore";
import SearchTweets from "./pages/searchTweets";
import HashTagTweets from "./pages/hashTweets";

export default function UnAuthApp() {
  return (
    <Routes>
      <Route path="explore/*" element={<Explore></Explore>}></Route>
      <Route path="tweets/:tweetID" element={<FullTweet />}></Route>

      <Route path="tweets/search" element={<SearchTweets />}></Route>

      <Route path="tweets/hashtag/:hashtag" element={<HashTagTweets />}></Route>

      <Route path="/:username/*" element={<Profile />}></Route>
      <Route path="/" element={<Registeration />}></Route>
    </Routes>
  );
}
