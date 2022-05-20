import mongoose from "mongoose";
const {connect} = mongoose;
const url = process.env.MONGO;

async function db(params) {
  connect(
    url,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    () => {
      console.log("Connected to MongoDB");
    }
  );
  mongoose.connection.on("error", (error) => console.log(error));
}

export default db;
