import mongoose from "mongoose";
import User from "../models/user.js";
import Notification from "../models/Notificaton.js";

export const getFollowSuggestions = async function (req, res) {
  const {_id} = req.user;
  const {followings} = await User.findById(_id);
  const users = await User.find({_id: {$nin: [...followings, _id]}})
    .sort({
      "followers.length": -1,
    })
    .limit(4);
  res.json(users);
};

export const toggleFollowing = async (req, res) => {
  const user = req.user;
  // user will follow another one
  const followingId = user._id;
  // user will got a new follower
  const followerId = new mongoose.Types.ObjectId(req.body._id);
  const isFollowed = await User.findOne({
    _id: followerId,
    followers: followingId,
  });
  const op = isFollowed ? "$pull" : "$addToSet";
  let notification;
  if (!isFollowed) {
    notification = await Notification.create({
      from: followingId,
      to: followerId,
      content: `@${user.username} followed you`,
    });
  }

  await User.findByIdAndUpdate(
    followingId,
    {[op]: {followings: followerId}},
    {upsert: true, new: true}
  );
  let query = {
    [op]: {followers: followingId},
  };

  if (notification) {
    query["$addToSet"].notifications = notification._id;
  }
  await User.findByIdAndUpdate(
    followerId,

    query,
    {upsert: true, new: true}
  );

  res.json({followerId, followingId});
};

export const searchUsers = async (req, res) => {
  const search = req.query.search;
  const users = await User.find({$text: {$search: search}});

  res.json({data: users});
};
