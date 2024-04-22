import crypto from "crypto"; // Built-in Node.js module for cryptographic operations
import { Router } from "express";
import {
  index,
  show,
  add,
  edit,
  create,
  update,
  remove,
} from "../controllers/UsersController.js";
import {
  isAuthenticated,
  isRole,
} from "../controllers/AuthenticationController.js";

// Create an instance of the Express Router
const router = Router();

/* Define routes and associate them with controller actions, these routes are used 
for user management and access control
- The first argument represents the relative path, 
the OPTIONAL second one is a middleware, 
the third one is the controller function we imported containing view files path */

router.get("/", isAuthenticated, isRole("ADMIN"), index);

// Route to display the user registration page
router.get("/new", add);

// Route to display a user's profile page
router.get("/:id", isAuthenticated, show);

// Route to display the user editing page
router.get("/:id/edit", isAuthenticated, edit);

// Route to create a new user
router.post("/", create);

// Route to update an existing user's information
router.put("/:id", isAuthenticated, update);

// Route to delete an existing user (admin access only)
router.delete("/:id", isAuthenticated, isRole("ADMIN"), remove);

// Function to generate a random hexadecimal key
export function generateRandomHexKey(length = 8) {
  return crypto.randomBytes(length / 2).toString("hex");
}

export default router;
