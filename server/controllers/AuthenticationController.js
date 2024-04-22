import passport from "passport";

// Render the login page
export const login = (_, res) => {
  res.render("authentication/login", { title: "Login" });
};

// Authenticate user using Passport's local strategy
export const authenticate = async (req, res, next) => {
  /* Passport's authentication middleware for local strategy is invoked with options. 
    - passport.authenticate()() will get arguments: 1. strategy name, 
    2. options, and 3. a callback function, and the callback function will 
    be called after the strategy is done.
    */
  passport.authenticate(
    "local", // strategy name
    {
      successRedirect: "/", // Redirect on successful authentication
      failureRedirect: "/login", // Redirect on failed authentication
    },
    (error, user) => {
      // Callback function
      if (error) {
        req.session.notifications = [
          { alertType: "alert-danger", message: "Issue with logging in" },
        ];
        return next(error);
      }

      if (!user) {
        req.session.notifications = [
          { alertType: "alert-danger", message: "No user found." },
        ];
        res.format({
          "text/html": () => {
            return res.redirect("/login");
          },
          "application/json": () =>
            res.status(403).json({
              status: 403,
              message: "NOT AUTHORIZED",
            }),
          default: () => res.status(406).send("NOT ACCEPTABLE"),
        });
      }
      // Log in the user and redirect to the home page
      req.logIn(user, (err) => {
        if (err) return next(err);

        req.session.notifications = [
          { alertType: "alert-success", message: "Successfully logged in" },
        ];
        res.format({
          "text/html": () => {
            res.redirect("/");
          },
          "application/json": () => {
            res.status(200).json({
              status: 200,
              message: "SUCCESS",
              user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                nickname: user.nickname,
                email: user.email,
                minc: user.minc,
              },
            });
          },
          default: () => {
            res.status(406).send("NOT ACCEPTABLE");
          },
        });
      });
    }
  )(req, res, next);
  /* (req, res, next) will be passed to the local strategy, which will be used to authenticate the user
    - Invoke this Passport middleware with request, response, and next middleware function */
};

// Logout user, destroy session, and clear cookies
export const logout = (req, res, next) => {
  // Logout the user by removing user information from the session
  req.logout((error) => {
    if (error) return next(error);

    // Otherwise, destroy the user's session, removing session data from the server
    req.session.destroy((error) => {
      if (error) return next(error);

      // Clear the "connect.sid" cookie used for tracking the session
      res.clearCookie("connect.sid", { path: "/" });

      // Redirect the user to the login page after successful logout
      res.format({
        "text/html": () => res.redirect("/login"),
        "application/json": () =>
          res.status(200).json({ status: 200, message: "SUCCESS" }),
        default: () => res.status(406).send("NOT ACCEPTABLE"),
      });
    });
  });
};

// Helper functions below:

// Check if the user is authenticated, and redirect to login if not
export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next(); // Proceed if authenticated

  res.clearCookie("connect.sid", { path: "/" });

  res.format({
    "text/html": () => res.redirect("/login"),
    "application/json": () =>
      res.status(401).json({ status: 401, message: "NOT AUTHORIZED" }),
    default: () => res.status(406).send("NOT ACCEPTABLE"),
  });
};

/* Check if the user has a specific role
- it can be :
"export function isRole(role) { ... }" or 
"export const isRole = (role) => { ... }   */
export const isRole = (role) => {
  /* Return a middleware function for role-based access. 
  - The reason for returning a function is to pass the role as an argument. */
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      // Check if user is not authenticated
      req.status = 401; // Unauthorized status code

      return next(new Error("NOT AUTHORIZED")); //Return an error for unauthorized access
    }

    if (role !== req.user.role) {
      // Check if user's role doesn't match the specified role
      req.status = 403; // Forbidden status code

      return next(new Error("FORBIDDEN")); // Return an error for forbidden access
    }

    next(); // Proceed if user has the correct role
  };
};
