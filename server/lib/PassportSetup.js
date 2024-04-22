// Import the necessary modules and dependencies (not shown in the provided code)
import passport from "passport";
import User from "../models/User.js";
import JwtStrategy from "passport-jwt/lib/strategy.js"; //authentication strategy for Passport using JSON Web Tokens
import ExtractJwt from "passport-jwt/lib/extract_jwt.js"; //utility function to extract JWT from request
import Application from "../models/Application.js";

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from the request's Authorization header
  secretOrKey: process.env.SECRET_KEY,
  // Use the secret key from the environment variables to verify the JWT signature
};

// Middleware function to set up Passport for authentication
export default (app) => {
  // Setup Passport local strategy (for username/password authentication)
  passport.use(User.createStrategy());
  // Use the User model's createStrategy method
  //createStrategy is a static method provided by passport-local-mongoose that returns a LocalStrategy instance

  // Configure Passport to serialize and deserialize user data for session management
  passport.serializeUser(User.serializeUser());
  // Serialize user data for session storage, convert an object to Json string and store it in session
  passport.deserializeUser(User.deserializeUser());
  // Deserialize user data from session storage (from Json string to an object)

  // JWT Strategy
  passport.use(
    new JwtStrategy(options, async (jwtPayload, done) => {
      const app = await Application.findById(jwtPayload.id);

      if (!app) return done(null, false);

      return done(null, true);
    })
  );

  // Initialize Passport and enable session support
  app.use(passport.initialize());
  app.use(passport.session());

  /* Custom middleware to set local variables for authentication status and user roles so that we can use it in .ejs file */
  app.use((req, res, next) => {
    /* .locals is an object that contains response local variables scoped to the request
	- Set local variables for the current user and authentication status */
    //".isAuthenticated()" is a method provided by Passport
    res.locals.isAuthenticated = req.isAuthenticated();
    /* Check if the user is authenticated. ".isAuthenticated()" is a method provided by Passport, and it checks if the user is authenticated by checking the session, if the session have "req.user" then the user is authenticated by passport, and if the session doesn't have "req.user" then the user is not authenticated by passport */
    res.locals.isAdmin = req.user?.role === "ADMIN"; // Check if the user has the "ADMIN" role
    res.locals.isUser = req.user?.role === "USER"; // Check if the user has the "USER" role
    next();
  });
};
