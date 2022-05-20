import mongoose from "mongoose";
import {getHashTags, getMentions, serializeTweets} from "../helpers.js";
import HashTag from "../models/hashTag.js";
import Tweet from "../models/tweet.js";
import User from "../models/user.js";
import Notification from "../models/Notificaton.js";

export const getTrend = async (req, res) => {
  let data = await HashTag.aggregate([
    {
      $lookup: {
        from: "tweets",
        localField: "tweets",
        foreignField: "_id",
        as: "tweetsObj",
      },
    },
    {
      $project: {
        content: 1,
        tweetsTrend: {
          $filter: {
            input: "$tweetsObj",
            as: "tweet",
            cond: {
              $and: [
                {
                  $gte: [
                    "$$tweet.createdAt",
                    new Date(Date.now() - 360000 * 24),
                  ],
                },
              ],
            },
          },
        },
      },
    },

    {
      $project: {
        tweetsCount: {$size: "$tweetsTrend"},
        tweets: "$tweetsTrend",
        content: 1,
      },
    },
    {$match: {tweetsCount: {$gt: 0}}},
    {$sort: {tweetsCount: -1}},
    {$limit: 10},
    {
      $project: {
        tweetsCount: 1,
        content: 1,
      },
    },
  ]);

  res.json(data);
};

export const getReactions = async (req, res) => {
  const _id = req.params.tweetId;
  const path = req.params.reaction;
  const page = Number(req.query.page) || 0;
  const limit = 8;
  const skip = page * limit;

  const result = await Tweet.findById(_id)
    .populate({
      path,
      options: {
        skip,
        limit,
      },
      select: "username _id avatar name ",
    })
    .select(`${path} -_id -owner -quoteTo`)
    .lean();

  const data = result[path];
  res.json({data, nextCursor: page + 1});
};

export const getTimeLine = async (req, res) => {
  const user = req.user;
  const _id = user._id;
  let followings = [...user.followings, _id];
  const page = +req.query.page || 0;
  const limit = 8;
  const skip = page * limit;
  let tweets = await Tweet.find({
    owner: {$in: followings},
  })
    .populate("owner", "username avatar name")
    .sort({createdAt: -1})
    .skip(skip)
    .limit(limit)
    .lean();
  if (!tweets || tweets?.length === 0) return res.json({data: []});
  tweets = serializeTweets(tweets, req);
  return res.json({data: tweets, nextCursor: page + 1});
};

export const postRetweet = async (req, res) => {
  const tweet = await Tweet.findOne({
    retweetData: req.params.tweetId,
    retweetBy: req.user._id,
  });
  if (tweet) {
    let curruser = await User.findOneAndUpdate(
      {_id: req.user._id},
      {$pull: {tweets: tweet._id}}
    );
    const retweet = await Tweet.findOneAndRemove({
      retweetData: req.params.tweetId,
    });
    await Tweet.findOneAndUpdate(
      {_id: req.params.tweetId},
      {$pull: {retweets: req.user._id}}
    );
  } else {
    const retweet = await Tweet.create({
      retweetData: req.params.tweetId,
      owner: req.user._id,
      isRetweet: true,
    });
    req.user.tweets.push(retweet._id);
    await Tweet.findOneAndUpdate(
      {_id: req.params.tweetId},
      {$push: {retweets: req.user._id}}
    );
    await req.user.save();
  }

  res.json({tweet});
};

export const postReply = async (req, res) => {
  const user = req.user;
  const {text} = req.body;
  const parent = await Tweet.findById(
    mongoose.Types.ObjectId(req.params.tweetId)
  ).populate("owner", "username");
  const curr = await Tweet.create({
    text,
    owner: req.user._id,
    replyTo: req.params.tweetId,
  });

  const notification = await Notification.create({
    from: user._id,
    to: parent.owner._id,
    content: `@${user.username} reply to in a tweet `,
  });
  await User.findByIdAndUpdate(
    parent.owner._id,
    {
      $addToSet: {notifications: notification._id},
    },

    {upsert: true, new: true}
  );

  await Tweet.findByIdAndUpdate(
    parent._id,
    {
      $addToSet: {replies: {reply: curr._id}},
    },

    {upsert: true, new: true}
  );

  res.json({res: parent});
};

export const postQuote = async (req, res) => {
  const {text} = req.body;
  const user = req.user;
  const tweetId = req.params.tweetId;
  const curr = await Tweet.create({
    text: text,
    owner: user._id,
    quoteTo: tweetId,
  });

  const parent = await Tweet.findById(tweetId).populate("owner", "username");

  sendNotification(
    user._id,
    parent.owner._id,
    `@${user.username} quote a tweet`
  );
  await user.tweets.push(curr._id);
  await user.save();
  res.json({res: curr});
};

async function sendNotification(from, to, content) {
  if (to.toString() === from.toString()) return;
  const notification = await Notification.create({
    from,
    to,
    content,
  });
  await User.findByIdAndUpdate(to, {
    $addToSet: {notifications: notification._id},
  });
}
export const postLike = async (req, res) => {
  const user = req.user;
  let curr = await Tweet.findOne({
    _id: req.params.tweetId,
    likes: req.user._id,
  });
  const op = curr ? "$pull" : "$push";
  curr = await Tweet.findOneAndUpdate(
    {_id: req.params.tweetId},
    {[op]: {likes: req.user._id}},
    {upsert: true, new: true}
  );
  await User.findOneAndUpdate(
    {_id: req.user._id},
    {[op]: {likes: req.params.tweetId}},
    {upsert: true, new: true}
  );
  sendNotification(
    req.user._id,
    curr.owner._id,
    `@${req.user.username} like your tweet`,
    "/tweets/" + curr._id.toString()
  );
  res.json({res: curr});
};

export const getTweet = async (req, res) => {
  let tweet = await Tweet.findById(req.params.tweetId)
    .populate("owner")
    .populate({
      path: "replies",
      populate: {
        path: "reply",
      },
    })
    .populate({
      path: "replies.reply",
      populate: {
        path: "owner",
      },
    })
    .lean()
    .exec();

  if (tweet == null) return res.status(404).json({});
  tweet = serializeTweets([tweet], req)[0];
  res.json({tweet});
};

export const searchTweets = async (req, res) => {
  const query = req.query.query;
  const page = Number(req.query.page) || 0;
  const limit = 4;
  const skip = page * limit;
  const search = new RegExp(query, "i");
  let data = await Tweet.find({text: search}).limit(limit).skip(skip).lean();
  if (req.session?.user) data = serializeTweets(data, req);
  res.json({data, nextCursor: page + 1});
};

export const getHashtag = async (req, res) => {
  const hashTag = req.params.hashtag;
  const page = Number(req.query.page) || 0;
  const limit = 4;
  const skip = page * limit;
  let data = await HashTag.findOne({content: hashTag})
    .populate({
      path: "tweets",
      select: "text createdAt image likes retweets",
      options: {
        skip,
        limit,
        sort: "-createdAt",
      },

      populate: {
        path: "owner",
      },
    })
    .select("tweets -_id")
    .lean();
  data = data?.tweets || [];
  data = serializeTweets(data, req);

  if (data.length < limit) {
    return res.json({data});
  }

  res.json({data, nextCursor: page + 1});
};

export const postTweet = async (req, res) => {
  const user = req.user;
  const value = req.body.value;
  const tweet = await Tweet.create({...value, owner: user._id});
  const mentions = getMentions(value.text);
  const hashTags = getHashTags(value.text);

  if (hashTags.length) {
    for (let hashTag of hashTags) {
      HashTag.findOneAndUpdate(
        {
          content: hashTag,
        },
        {$addToSet: {tweets: tweet._id}, content: hashTag},

        {upsert: true, new: true}
      ).then(console.log);
    }
  }
  if (mentions.length) {
    let users = await User.find({username: {$in: mentions}}).select(
      "_id username"
    );
    users = users.map((curr) => curr._id);
    const notification = await Notification.create({
      from: user._id,
      to: users,
      content: `@${user.username} mention you in a tweet`,
    });
    for (let user of users) {
      User.findOneAndUpdate(
        {_id: user},
        {$addToSet: {notifications: notification._id}},
        {
          upsert: true,
        }
      )
        .select("notifications")
        .then(() => {});
    }
  }

  user.tweets.push(tweet._id);

  await user.save();
  res.json({tweet, user});
};
