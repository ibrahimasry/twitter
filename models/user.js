import mongoose from "mongoose";
import validator from "validator";
import mongodbErrorHandler from "mongoose-mongodb-errors";
import bcrypt from "bcrypt";
import {UUID} from "bson";
const {Schema} = mongoose;

const avatar =
  "https://yt3.ggpht.com/ytc/AKedOLTS1YVLStOQ3smn11EZwB0ykPGhbzB4qird1Up_Ow=s900-c-k-c0x00ffffff-no-rj";
const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Invalid Email Address"],
      required: "Please Supply an email address",
    },
    name: {
      type: String,
      required: "Please supply a name",
      trim: true,
    },
    username: {
      type: String,
      unique: "username should be unique",
      default: () => "user-" + UUID.generate().toString(),

      trim: true,
    },
    birthDate: {
      type: String,
      require: true,
      validate: [validator.isDate, "please supply valid date"],
    },
    password: {
      type: String,
      required: true,
      // match: [
      //   /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/,
      //   "Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters",
      // ],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
    },
    verificationExpiry: {
      type: Date,
    },
    website: String,
    location: String,
    bio: String,
    avatar: {
      type: String,
      default: avatar,
    },
    cover: String,
    followers: [{type: mongoose.Types.ObjectId, ref: "User"}],
    followings: [{type: mongoose.Types.ObjectId, ref: "User"}],
    tweets: [{type: mongoose.Types.ObjectId, ref: "Tweet"}],
    likes: [{type: mongoose.Types.ObjectId, ref: "Tweet"}],
    chats: [{type: mongoose.Types.ObjectId, ref: "Chat"}],
    notifications: [{type: mongoose.Types.ObjectId, ref: "Notification"}],
  },
  {timestamps: true}
);

UserSchema.index({username: "text", name: "text"});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", UserSchema);
export default User;
