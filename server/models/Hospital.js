import mongoose from "mongoose";

const HospitalSchema = new mongoose.Schema(
  {
    hospitalName: {
      type: String,
      required: [true, "You must provide a name."],
      minlength: [2, "Please provide at least 2 characters long."],
      maxlength: [300, "The name cannot exceed 300 characters."],
      unique: true,
    },
    location: {
      type: String,
      required: [true, "You must provide a city name."],
      minlength: [2, "Please provide at least 2 characters long."],
      maxlength: [300, "The name cannot exceed 300 characters."],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Hospital", HospitalSchema);
