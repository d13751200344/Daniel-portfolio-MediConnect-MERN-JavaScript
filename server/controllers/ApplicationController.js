import Application from "../models/Application.js";
import jwt from "jsonwebtoken";
import passport from "passport";

export const index = async (req, res, next) => {
  try {
    // .find() would return an array contains all related data
    const applications = await Application.find();
    res.render("applications/index", {
      //first argument is view location, the others are the data that will be pass to the view file
      applications,
      title: "Applications List",
    });
  } catch (error) {
    console.log("Error in ApplicationController.index");
    next(error);
  }
};

export const show = async (req, res, next) => {
  try {
    // "findAndVerifyApplication()" is defined below
    const application = await findAndVerifyApplication(req);
    res.render("applications/show", {
      application,
      title: "Application View",
    });
  } catch (error) {
    console.log("Error in ApplicationController.show");
    next(error);
  }
};

export const add = async (req, res, next) => {
  try {
    res.render("applications/add", {
      formType: "create",
      title: "New Application",
    });
  } catch (error) {
    console.log("Error in ApplicationController.add");
    next(error);
  }
};

export const edit = async (req, res, next) => {
  try {
    const application = await findAndVerifyApplication(req);
    res.render("applications/edit", {
      application,
      formType: "update",
      title: "Edit Application",
    });
  } catch (error) {
    console.log("Error in ApplicationController.edit");
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const { name } = req.body; // we get name, and key & secret will be auto-generated (default value in the model)
    const application = new Application({ name });
    await application.save();
    req.session.notifications = [
      {
        alertType: "alert-success",
        message: "Application created successfully",
      },
    ]; //works with the notification function in "/app.js"
    res.redirect("/applications");
  } catch (error) {
    req.session.notifications = [
      { alertType: "alert-danger", message: "Application failed to create" },
    ];
    console.log("Error in ApplicationController.create");
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const { name } = req.body;
    const application = await findAndVerifyApplication(req);
    application.name = name;
    await application.save();
    req.session.notifications = [
      {
        alertType: "alert-success",
        message: "Application was updated successfully",
      },
    ];
    res.redirect("/applications");
  } catch (error) {
    req.session.notifications = [
      { alertType: "alert-danger", message: "Application failed to update" },
    ];
    console.log("Error in ApplicationController.update");
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const application = await findAndVerifyApplication(req);
    await Application.findByIdAndDelete(application.id);
    req.session.notifications = [
      {
        alertType: "alert-success",
        message: "Application deleted successfully",
      },
    ];
    res.redirect("/applications");
  } catch (error) {
    req.session.notifications = [
      { alertType: "alert-danger", message: "Application failed to delete" },
    ];
    console.log("Error in ApplicationController.remove");
    next(error);
  }
};

// helpers below:

// 1. Find and verify the application
async function findAndVerifyApplication(req) {
  const application = await Application.findById(req.params.id);
  //or .findOne({ _id: req.params.id });
  if (!application) {
    req.status = 404;
    throw new Error("Application does not exist");
  }
  return application;
}

// 2. Create a token for the application
export const requestToken = async (req, res, next) => {
  const { key, secret } = req.body; // get key and secret from the post request body
  const application = await Application.findOne({ key, secret });
  // find the application by key and secret

  if (!application) {
    res.status = 403;
    return res.json({ status: 403, message: "FORBIDDEN" });
  }

  // create a token and send it back to the client
  const token = jwt.sign(
    {
      id: application._id,
    },
    process.env.SECRET_KEY
  );
  /* the token is created by using jwt.sign method, and it will be signed by the secret key in the .env file, and we send the token back to the client */
  res.json({ status: 200, token, message: "SUCCESS" });
};

/* 3. Authenticate the application by verifying the jwt token
- authenticate the application by using passport-jwt strategy; it won't use session, 
	so set session to false, and it will call the third one callback function after the 
	authentication is done to handle the result */
export const authenticate = async (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (error, application) => {
    if (error) return next(error);
    if (!application) return res.status(401).json({ message: "Unauthorized" });

    //if the application is verified, then set the application to the request object
    req.application = application;
    return next();
  })(req, res, next);
  /* The immediately-invoked function expression (IIFE) (req, res, next) is used in this context to immediately invoke the passport. It serves to properly invoke passport.authenticate with the necessary parameters and in the correct context within the middleware chain. It ensures that the authentication process integrates seamlessly into the request handling process. */
};
