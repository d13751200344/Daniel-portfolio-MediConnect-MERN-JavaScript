import User from "../models/User.js";

// Function to display a list of Users (admin access only)
export const index = async (_, res, next) => {
  try {
    // Retrieve a list of all users from the database
    const users = await User.find();

    // Render the user list page with the retrieved data
    res.render("users/index", {
      title: "List of Users",
      users,
    });
  } catch (error) {
    next(error);
  }
};

// Function to display a User's profile (admin access only)
export const show = async (req, res, next) => {
  try {
    // Find and verify a user based on the provided request parameters
    const user = await findAndVerifyUser(req);

    res.format({
      "text/html": () => {
        res.render("users/show", {
          user,
          title: "User View",
        });
      },
      "application/json": () => {
        res.status(200).json({
          status: 200,
          message: "SUCCESS",
          user: {
            id: user._id,
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
  } catch (error) {
    next(error);
  }
};

// Function to display a CMS interface for adding a new User
export const add = async (req, res, next) => {
  try {
    // Render the user addition form page
    res.render("users/add", {
      formType: "create",
      title: "New User",
    });
  } catch (error) {
    next(error);
  }
};

// Function to display a CMS interface for updating an existing User
export const edit = async (req, res, next) => {
  try {
    // Find and verify a user based on the provided request parameters
    const user = await findAndVerifyUser(req);

    // Render the user editing form page with the retrieved user data
    res.render("users/edit", {
      user,
      formType: "update",
      title: "Edit User",
    });
  } catch (error) {
    next(error);
  }
};

// Function to create a new User based on form input
export const create = async (req, res, next) => {
  try {
    // Extract and validate user input from the request (we don't want Id)
    const { firstName, lastName, nickname, email, password, minc } =
      getStrongParams(req);

    // Create a new User instance with the provided data
    const user = new User({ firstName, lastName, nickname, email, minc });

    // Validate user data and check for errors
    const validationErrors = user.validateSync();

    /* .validateSync() is a built-in method provided by Mongoose to validate the user data synchronously */
    if (validationErrors) {
      // Handle validation errors and display them to the user
      const message = Object.values(validationErrors.errors).map(
        (error) => error.message
      );

      res.status(400);

      throw new Error(message.join("\n"));
    }
    // Register the user with Passport's User.register method
    await User.register(user, password);
    /* .register is a static method provided by passport-local-mongoose that takes a user instance we just created and a password we got as arguments. 
    Don't use .save() because it will not hash the password
    */
    res.format({
      "text/html": () => {
        req.session.notifications = [
          {
            alertType: "alert-success",
            message: "User was created successfully",
          },
        ];
        res.redirect("/users");
      },
      "application/json": () => {
        res.status(201).json({ status: 201, message: "SUCCESS" });
      },
      default: () => {
        res.status(406).send("NOT ACCEPTABLE");
      },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Function to update an existing User based on form input
export const update = async (req, res, next) => {
  try {
    // Extract and validate user input from the request
    const { firstName, lastName, nickname, email, password, minc } =
      getStrongParams(req);

    // Find and verify a user based on the provided request parameters
    const user = await findAndVerifyUser(req);

    // Update user properties with the provided data from the form
    user.firstName = firstName;
    user.lastName = lastName;
    user.nickname = nickname;
    user.email = email;
    user.minc = minc;

    // Validate user data and check for errors
    const validationErrors = user.validateSync();

    if (validationErrors) {
      const message = Object.values(validationErrors.errors).map(
        (error) => error.message
      );

      res.status(400);

      throw new Error(message.join("\n"));
    }

    // Update the user's password (if provided)
    if (password) {
      await user.setPassword(password); //set the new password and hash it
    }

    // Save the updated user data
    user.save();

    res.format({
      "text/html": () => {
        req.session.notifications = [
          {
            alertType: "alert-success",
            message: "User was updated successfully",
          },
        ];
        res.redirect("/users");
      },
      "application/json": () => {
        res.status(200).json({ status: 200, message: "SUCCESS" });
      },
      default: () => {
        res.status(406).send("NOT ACCEPTABLE");
      },
    });
  } catch (error) {
    next(error);
  }
};

// Function to remove an existing User
export const remove = async (req, res, next) => {
  try {
    // Find and verify a user based on the provided request parameters
    await findAndVerifyUser(req);

    // Remove the user from the database
    await User.findByIdAndDelete(req.params.id);

    // Redirect to the user list page after successful user removal
    res.redirect("/users");
  } catch (error) {
    next(error);
  }
};

// Helpers below:

// Helper function to find and verify a user by their ID
async function findAndVerifyUser(req) {
  const user = await User.findById(req.params.id);

  if (!user) {
    // Handle the case where the user does not exist
    req.status = 404;
    throw new Error("User does not exist");
  }

  return user;
}

/**
 * This function is used to ensure that only approved fields are returned and used.
 *
 * @param { ExpressRequestObject } req - The Express request object containing user input
 * @returns { object } - An object containing approved fields
 */
function getStrongParams(req) {
  // Extract approved fields from the request body
  const { id, firstName, lastName, nickname, email, password, minc } = req.body;

  return { id, firstName, lastName, nickname, email, password, minc };
}
