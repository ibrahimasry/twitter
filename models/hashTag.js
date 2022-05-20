import mongoose from "mongoose";
import validator from "validator";
import mongodbErrorHandler from "mongoose-mongodb-errors";
const {Schema} = mongoose;
const HashTagSchema = new Schema({
  content: String,
  tweets: [{type: mongoose.Types.ObjectId, ref: "Tweet"}],
});

const HashTag = mongoose.model("HashTag", HashTagSchema);
export default HashTag;
