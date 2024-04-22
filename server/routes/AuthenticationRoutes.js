import {
  login,
  authenticate,
  logout,
  isAuthenticated,
} from "../controllers/AuthenticationController.js";
import { Router } from "express";
import { add } from "../controllers/UsersController.js";
/* Import the add function from the UsersController so we can use it to display 
the user registration page in the register route */

// Create an instance of the Express Router
const router = Router();

// Define routes and their associated controller functions
// These routes are used for authentication and user management

// Route to display the login page
router.get("/login", login);

// Route to handle user authentication (login)
router.post("/authenticate", authenticate);

// Route to handle user logout (requires authentication, you have to log in first to log out)
router.get("/logout", isAuthenticated, logout);

// Route to display the user registration page
router.get("/register", add);

// Export the router for use in other parts of the application
export default router;
