import {Router} from "express";
import {
  deleteTweet,
  getHashtag,
  getReactions,
  getTimeLine,
  getTrend,
  getTweet,
  postLike,
  postQuote,
  postReply,
  postRetweet,
  postTweet,
  searchTweets,
} from "../controller/tweetsController.js";
import {catchError} from "../helpers.js";

export let tweetsRouter = Router();

tweetsRouter.post("/", catchError(postTweet));
tweetsRouter.get("/", catchError(getTimeLine));

tweetsRouter.get("/hashtag/:hashtag", catchError(getHashtag));

tweetsRouter.get("/search", catchError(searchTweets));

tweetsRouter.get("/trend", catchError(getTrend));

tweetsRouter.get("/:tweetId/:reaction", catchError(getReactions));

tweetsRouter.post("/:tweetId/retweet", catchError(postRetweet));

tweetsRouter.post("/:tweetId", catchError(postReply));
tweetsRouter.delete("/:tweetId", catchError(deleteTweet));

tweetsRouter.post("/:tweetId/quote", catchError(postQuote));

tweetsRouter.post("/:tweetId/like", catchError(postLike));

tweetsRouter.get("/:tweetId", catchError(getTweet));
