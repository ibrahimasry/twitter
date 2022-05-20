import React from "react";
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import Registeration from "./pages/registeration";
import FullTweet from "./pages/FullTweet";
import Profile from "./pages/profile";

export default function UnAuthApp() {
  return (
    <Routes>
      <Route path="/:username/*" element={<Profile />}></Route>
      <Route path="tweets/:tweetID" element={<FullTweet />}></Route>
      <Route path="/" element={<Registeration />}></Route>
    </Routes>
  );
}
