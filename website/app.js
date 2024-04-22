import express from "express"; // Importing Express framework
import path from "path"; // Path module for handling file paths
import { fileURLToPath } from "url"; // Utility function to convert file URLs to paths
import apiRoutes from "./apiRoutes.js";

// Getting the current filename and directory path
const __filename = fileURLToPath(import.meta.url); // Getting the current filename
const __dirname = path.dirname(__filename); // Getting the current directory path

const app = express(); // Creating an Express application

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "build")));
// Serving static files from the React app build directory (when we run the app, files will be generated under "/WEBSITE/build".)

// Provide an API route set
app.use("/api", apiRoutes);

// Handling any requests by serving the React app's main HTML file
app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
  //when we run the app, files, including "index.html", will be auto-generated under "/WEBSITE/build"
});

export default app; // Exporting the Express app for use in other files
