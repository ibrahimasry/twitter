import mongoose from "mongoose";
import validator from "validator";
import mongodbErrorHandler from "mongoose-mongodb-errors";
const {Schema} = mongoose;
const NotificationSchema = new Schema({
  content: String,
  from: {type: mongoose.Types.ObjectId, ref: "User"},
  to: [{type: mongoose.Types.ObjectId, ref: "User"}],
  isRead: {
    type: Boolean,
    default: false,
  },
  link: String,
});

export default mongoose.model("Notification", NotificationSchema);
