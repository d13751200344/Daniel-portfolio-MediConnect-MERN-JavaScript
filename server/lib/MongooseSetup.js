import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export default () => {
  //connect to mongodb using mongoose
  mongoose
    .connect(
      `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_DATABASE}.${process.env.MONGO_TOKEN}.mongodb.net/?retryWrites=true&w=majority`
    )
    .then(() => console.info("MongoDB connected"))
    .catch((error) => console.error(error));
};
