import {ErrorResponse} from "./errorHandler.js";

export function getMentions(text) {
  return Array.from(
    new Set(text.match(/@\S+/gi)?.map((curr) => curr.slice(1))) || []
  );
}

export function getHashTags(text) {
  return Array.from(
    new Set(text.match(/#\S+/gi)?.map((curr) => curr.slice(1))) || []
  );
}

export function catchError(fn) {
  return function (req, res, next) {
    return fn(req, res, next).catch(next);
  };
}
export function notFound(req, res, next) {
  return res.status(404).send({message: "Not Found"});
}
export function isAuth(req, res, next) {
  if (!req.user) throw new ErrorResponse("you are not login", "user", 403);

  next();
}

export function isAutharized(id) {
  return (req, res, next) => {
    isAuth();
    if (req.user._id.toString() !== id.toString())
      throw new ErrorResponse("you are allowed to acess this", "user", 403);
  };
}
export function serializeTweets(tweets = [], req) {
  for (let tweet of tweets) {
    if (tweet.isRetweet) {
      tweet = tweet.retweetData;
    }
    if (tweet.likes.find((like) => req.user._id.toString() === like.toString()))
      tweet.alreadyLike = true;
    else tweet.alreadyLike = false;
    if (
      tweet.retweets?.find(
        (retweet) => req.user._id.toString() === retweet.toString()
      )
    )
      tweet.alreadyRetweet = true;
    else tweet.alreadyRetweet = false;
    tweet.likes = tweet.likes?.length || 0;
    tweet.retweets = tweet.retweets?.length || 0;
  }

  return tweets;
}
