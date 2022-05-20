import mongoose from "mongoose";
import validator from "validator";
import mongodbErrorHandler from "mongoose-mongodb-errors";
const { Schema } = mongoose;
const RetweetSchema = new Schema({

    retweetBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,


    },

    tweet: {
        type: mongoose.Types.ObjectId,
        ref: "Tweet",
        required: true,
    },
});
const Retweet = mongoose.model("Retweet", RetweetSchema);
export default Retweet;
