import mongoose from "mongoose";
import validator from "validator";
import mongodbErrorHandler from "mongoose-mongodb-errors";
import bcrypt from "bcrypt";
import { UUID } from "bson";
import shortUUID from "short-uuid";
const { Schema } = mongoose;

const avatar =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIIAAACCCAMAAAC93eDPAAAAP1BMVEXM1t1ld4bP2eBecYFhdIPS3ONbbn7H0dlwgY+9yNCQnqmgrbfCzNSbqbOHlaKvu8S2wcqns713iJWBkJ1rfIs6HY93AAADQklEQVR4nO2a2barIAxAJYAjClX+/1sv2nad9nZKMLF9YD/1PLFPwmRIVRUKhUKhUCgUCoVCoXA4APDk54Hj2yqM0xyN1ibO0xgqe6wFQJhUGtyoDZNE1BQODAWAn6+j/2HM7I+SgGbRDwKbhF6aQxysV08FNgnlrbwBjPqVwIoexeNg3xusDsJxAF+/N1Cq9qJxgPDRIDkESYemfTkT/zBtI2dg+w8T4TIderHpAB3KIDl0UqmABZGGLRWLkAJ0iLl4phYKA/TIIKQw9DIKTcQaKBVFFgWckJNxRZ8kwmAndB5SJiaJdUnJg0wmIBCCkMIgsEvDQJgKaTIM/AqkqSAzGSzmhLpRaPkVgJSHlAn+RDTo3flMzb4kUJeVOwX2JQGemgj2+xtxTUqsyg939ycK7Ld5GElrMq1KfgX8ZeGiwH5lKAq/ovAD0/EH9gXKzXFTYL89Ej4izkh8SlAV2AV+4cqC/Kq+IvF1TTyt+c/qFUomTCsg8LnQdRcEmcJb0+IVhGo9iGrbFbGqG2AXhRYqL6zgKj1mERNYHTB1R1GDyp7MpwKwOUlXgF2vnj8FbCnQqnfidXAAN7Rm5b/RV9rBHfMqAtb5fmnT/1xfSHFpl967I9+nAMBC41zXhdB1zjXpz2+80m0mG98Yu1D4NdaVufGlV/O0KwQ/jH1iHHzYdoYDx4cqjMscda0v1DrOyxiqg6JhIUxRPx5VRus4BRB/MAbb9ap+fVLWqu9EE7K2LXy+L0g2MoCbHtsWnoTCTEJ3BqjGGnt9rcdKQMKGlvIp0wbueZlCgMnBbTaYAwEN5up8T83aVQJdJJZ5VnTkK7RAoCXhimF7IwOfM/4Znm/L3BjwxYFcaruHofAGLmbHYItD3L9TzrsMksO8U8BOGavxHr3v0ZRc9n3qsKsU3OwXWNlReALaO/UrzJQdBkJ96z351S9ULxeG7H4v8ivIa3LfR5p9m9ItJq+vhPw++468grBlNEgOGfsT23I4k7Mo0D11ODI679CNhVjoDYisk3FToE9I3jzk1MY7XoGVjmbAckrfQz2zib1cGKj9XpbU1ocj0hQcexBSGBzFALyEAmmDhEFCgXRik9tGUAov3u3+ASamJN6xYibBAAAAAElFTkSuQmCC";
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
      default: () => "user-" + shortUUID.generate().slice(0, 8).toString(),

      trim: true,
      lowercase: true,
    },
    birthDate: {
      type: String,
      require: true,
      validate: [validator.isDate, "please supply valid date"],
    },
    password: {
      type: String,
      required: true,
      select: false,
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
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        "Please use a valid URL with HTTP or HTTPS",
      ],
    },
    location: String,
    bio: String,
    avatar: {
      type: String,
      default: avatar,
    },
    cover: String,
    followers: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    followings: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    tweets: [{ type: mongoose.Types.ObjectId, ref: "Tweet" }],
    likes: [{ type: mongoose.Types.ObjectId, ref: "Tweet" }],
    chats: [{ type: mongoose.Types.ObjectId, ref: "Chat" }],
    notifications: [{ type: mongoose.Types.ObjectId, ref: "Notification" }],
  },
  { timestamps: true }
);

UserSchema.index({ username: "text", name: "text" });

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", UserSchema);
export default User;
