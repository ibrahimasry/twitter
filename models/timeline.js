import mongoose from "mongoose";
import validator from "validator";
import mongodbErrorHandler from "mongoose-mongodb-errors";
const {Schema} = mongoose;
const TimelineSchema = new Schema(
  {
    owner: {type: mongoose.Types.ObjectId, ref: "User"},
    tweets: [{type: mongoose.Types.ObjectId, ref: "Tweet"}],
  },
  {timestamps: true}
);

export default mongoose.model("Timeline", TimelineSchema);
