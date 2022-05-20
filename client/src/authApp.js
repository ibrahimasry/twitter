import React from "react";
import {Route, Routes, BrowserRouter as Router} from "react-router-dom";
import FullTweet from "./pages/FullTweet";

import Layout from "./pages/Layout";
import Profile from "./pages/profile";
import Inbox from "./pages/Inbox";
import Notifications from "./pages/Notifications";
import ProfileEditing from "./pages/ProfileEditing";
import Home from "./pages/Home";
import useSocket from "./socket";
import HashTagTweets from "./pages/hashTweets";
import SearchTweets from "./pages/searchTweets";
import useSocketEvent from "./useSocketEvent";
import {queryClient} from "./AppProvider";
import Chats from "./components/Chats";
export let socket;
export default function AuthApp() {
  socket = useSocket();
  return (
    <Layout>
      <Routes>
        <Route path="tweets/search" element={<SearchTweets />}></Route>

        <Route
          path="tweets/hashtag/:hashtag"
          element={<HashTagTweets />}
        ></Route>

        <Route path="/:username/inbox" element={<Inbox />}></Route>
        <Route
          path="/:username/notifications/"
          element={<Notifications></Notifications>}
        ></Route>
        <Route
          path="/:username/profile/"
          element={<ProfileEditing></ProfileEditing>}
        ></Route>

        <Route path="/:username/*" element={<Profile />}></Route>

        <Route path="/home" element={<Home />}></Route>
        <Route path="tweets/:tweetID" element={<FullTweet />}></Route>

        <Route exact={true} path="/" element={<Home />}></Route>
        <Route path="*" element={<div>not found ewwwwwww</div>}></Route>
      </Routes>
    </Layout>
  );
}
