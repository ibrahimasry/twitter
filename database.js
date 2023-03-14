import mongoose from "mongoose";
const { connect } = mongoose;
const url = process.env.MONGO;

async function db(params) {
  try {
    await mongoose.connect(url);
    console.log("done");
  } catch (error) {
    handleError(error);
  }
}

export default db;
