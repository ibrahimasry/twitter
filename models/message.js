import mongoose from "mongoose";
import validator from "validator";
import mongodbErrorHandler from "mongoose-mongodb-errors";
import {Timestamp} from "mongodb";
const {Schema} = mongoose;
const MessageSchema = new Schema(
  {
    text: String,
    sender: {type: mongoose.Types.ObjectId, ref: "User"},
    chat: {type: mongoose.Types.ObjectId, ref: "Chat"},
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {timestamps: true}
);
const Message = mongoose.model("Message", MessageSchema);
export default Message;
