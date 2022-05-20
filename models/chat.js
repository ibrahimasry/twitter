import mongoose from "mongoose";
import validator from "validator";
import mongodbErrorHandler from "mongoose-mongodb-errors";
const {Schema} = mongoose;
const ChatSchema = new Schema(
  {
    messages: [{type: mongoose.Types.ObjectId, ref: "Message"}],
    createdby: {type: mongoose.Types.ObjectId, ref: "User"},
    members: [{type: mongoose.Types.ObjectId, ref: "User"}],
    lastMessage: {type: mongoose.Types.ObjectId, ref: "Message"},
  },
  {timestamps: true}
);
const Chat = mongoose.model("Chat", ChatSchema);

const autoPopulateLead = function (next) {
  this.populate({
    path: "lastMessage",
    populate: {
      path: "sender",
      select: "username name avatar",
    },
  });

  next();
};
ChatSchema.pre("findOne", autoPopulateLead)
  .pre("find", autoPopulateLead)
  .pre("findById", autoPopulateLead);

export default Chat;
