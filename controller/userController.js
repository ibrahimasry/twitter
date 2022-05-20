import {ErrorResponse} from "../errorHandler.js";
import {serializeTweets} from "../helpers.js";
import Tweet from "../models/tweet.js";
import User from "../models/user.js";
import Notification from "../models/Notificaton.js";

export const getUserLikes = async (req, res) => {
  const username = req.params.username;
  const page = Number(req.query.page) || 0;
  const limit = 8;
  const skip = page * limit;
  const {_id} = await User.findOne({username});
  const query = {likes: _id};

  const data = await Tweet.find(query)
    .sort("-createdAt")
    .skip(skip)
    .limit(limit)
    .lean();
  if (!data || data.length == 0) return res.json({});
  console.log(data);
  const tweets = serializeTweets(data, req);

  return res.json({data: tweets, nextCursor: page + 1});
};

export const getUserTweets = async (req, res) => {
  const username = req.params.username;
  const search = req.query.search;
  const page = Number(req.query.page) || 0;
  const limit = 8;
  const skip = page * limit;
  const {_id} = await User.findOne({username});
  const query = {owner: _id};
  if (search) {
    query[search] = {$exists: true};
  }

  const data = await Tweet.find(query)
    .sort("-createdAt")
    .skip(skip)
    .limit(limit)
    .lean();
  if (!data || data.length == 0) return res.json({});

  const tweets = serializeTweets(data, req);

  return res.json({data: tweets, nextCursor: page + 1});
};

export const getUserInfo = async (req, res) => {
  const authUser = req.user;
  const username = req.params.username;

  const user = await User.findOne({username}).lean();
  if (authUser && authUser?.username !== username)
    user.isFollowing = !!(await User.findOne({
      username,
      followers: authUser._id,
    }));

  return res.json({user});
};

export const getCurrentUser = async (req, res, next) => {
  if (!req.user) return next(new ErrorResponse("not logged In", "", 403));
  if (req.user) {
    const _id = req.user;
    const user = await User.findOne({_id}).populate("notifications").lean();
    user.notifications = user.notifications.filter(
      (curr) => !curr.isRead
    ).length;
    if (user) res.json({user});
  } else next(new ErrorResponse("no user with these data", "", 404));
};
export const getCurrentUserNotification = async (req, res) => {
  const user = req.user;
  const _id = user._id;
  const {notifications} = await User.findById(_id)
    .populate({
      path: "notifications",
      populate: {
        path: "from",
      },
      match: {isRead: false},
    })
    .lean();

  setTimeout(
    async () => await Notification.updateMany({to: _id}, {isRead: true}),
    1000 * 5
  );
  return res.json({notifications});
};

export const getFriendshipData = async (req, res) => {
  const _id = req.params.id;
  const path = req.params.path || "following";
  const page = +req.query.page || 0;
  const limit = 5;
  const skip = limit * page;

  const user = await User.findById(_id)
    .populate({
      path,
      options: {
        skip,
        limit,
      },
      select: "username _id avatar name bios",
    })
    .select(`${path} -_id name`)
    .lean();

  const data = user[path];
  res.json({data, nextCursor: page + 1});
};

export const editCurrProfile = async (req, res) => {
  const data = req.body;
  const {_id} = req.user;

  const user = await User.findByIdAndUpdate(_id, data, {
    new: true,
    upsert: true,
  });

  res.json({user});
};

// export const getUserLikes = async (req, res) => {
//   const user = req.user;
//   const _id = user._id;
//   const page = Number(req.query.page) || 0;
//   const skip = page * 1;
//   const data = await User.findById(_id, {likes: {$slice: skip}})
//     .select("likes")
//     .populate("likes")
//     .lean();
//   let tweets = serializeTweets(data?.likes, req);
//   if (!data) return res.json({});
//   return res.json({data: tweets, nextCursor: page + 1});
// };
