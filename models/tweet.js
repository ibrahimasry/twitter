import mongoose from "mongoose";
import validator from "validator";
import mongodbErrorHandler from "mongoose-mongodb-errors";
import User from "./user.js";
const {Schema} = mongoose;
const TweetSchema = new Schema(
  {
    text: {
      type: String,
    },
    replies: [{reply: {type: mongoose.Types.ObjectId, ref: "Tweet"}}],
    replyTo: {type: mongoose.Types.ObjectId, ref: "Tweet"},
    quoteTo: {type: mongoose.Types.ObjectId, ref: "Tweet"},
    media: String,
    retweets: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],

    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    isRetweet: {
      type: Boolean,
      default: false,
    },

    retweetData: {type: mongoose.Types.ObjectId, ref: "Tweet"},
  },
  {timestamps: true}
);

const autoPopulateLead = function (next) {
  this.populate("quoteTo");
  this.populate("replyTo");
  this.populate("retweetData");
  this.populate("owner", "username name avatar");
  next();
};
TweetSchema.pre("findOne", autoPopulateLead)
  .pre("find", autoPopulateLead)
  .pre("findById", autoPopulateLead);

TweetSchema.index({text: "text"});

const Tweet = mongoose.model("Tweet", TweetSchema);
export default Tweet;
