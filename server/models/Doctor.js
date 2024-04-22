import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema(
  {
    doctorName: {
      type: String,
      required: [true, "You must provide a name."],
      minlength: [2, "Please provide at least 2 characters long."],
      maxlength: [300, "The name cannot exceed 300 characters."],
    },
    medicalSpecialty: {
      type: String,
      required: [true, "You must provide a medical specialty."],
      minlength: [2, "Please provide at least 2 characters long."],
      maxlength: [300, "It cannot exceed 300 characters."],
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: [true, "You need a hospital ID."],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Doctor", DoctorSchema);
