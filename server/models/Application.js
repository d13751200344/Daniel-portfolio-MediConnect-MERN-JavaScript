import mongoose, { Schema } from "mongoose"; //{Schema} here so that we don't need `new mongoose.Schema`
import { generateRandomHexKey } from "../routes/UserRoutes.js";
import crypto from "crypto";

const ApplicationSchema = new Schema({  //because we import {Schema} from mongoose
    name: {
        type: String,
        required: [true, "You need a name for your application"]
    },
    key: {
        type: String,
        required: [true, "You need an application key"],
        default: (generateRandomHexKey(16)) // generates 16 hexadecimal characters
    },
    secret: {
        type: String,
        required: [true, "You need an application key"],
        default: (crypto.randomBytes(8).toString("hex")) // generates 16 hexadecimal characters
    }
}, { timestamps: true });

export default mongoose.model("Application", ApplicationSchema);