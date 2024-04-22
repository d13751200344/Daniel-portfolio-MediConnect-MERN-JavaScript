import express from "express";
import dotenv from "dotenv";
import MongooseSetup from "./lib/MongooseSetup.js";
import RoutesSetup from "./lib/RoutesSetup.js";
import PassportSetup from "./lib/PassportSetup.js";
import session from "express-session";
import cors from "cors";

dotenv.config();

const app = express();

// Setup CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
};

app.use(cors(corsOptions));

// Setup sessions
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false, //the session will not be saved on every request made to the server.
    saveUninitialized: false, //the session will only be saved if it has been modified.
    cookie: {
      //This object defines the settings for the session cookie goes to the user.
      httpOnly: true, //prevent client-side access to the cookie through JavaScript, make sure it can only be accessed through web browser,enhancing security
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    } /*In a production environment, it's set to "strict," which means the cookie 
    will only be sent in a first-party context. In a non-production environment, 
    it's set to "lax," allowing some third-party context*/,
  })
);

/* Set and clear session notification values, we clear the notifications after 
	we use them so that they won't be displayed again */
app.use((req, res, next) => {
  res.locals.notifications = req.session?.notifications;
  delete req.session?.notifications;

  next();
});

//connect to mongodb using mongoose
MongooseSetup();

//setup passport for authentication
PassportSetup(app);

app.set("view engine", "ejs"); //set ejs engine
app.use(express.static("public")); //states that static files are in public folder

app.use(express.json()); /* because we want to be able to read the body 
of the request, and this will transform the body into a json object */
app.use(express.urlencoded({ extended: true }));
//this will capture the data from the form and transform it into a json object

/*this custom middleware will allow us to use the delete and put methods because html forms only allow get and post, 
	so we need to override that by using a hidden input field. "_method" is the name of the hidden input field, 
	and the value will be the method we want to use */
app.use((req, _, next) => {
  if (req.body && typeof req.body === "object" && "_method" in req.body) {
    const method = req.body._method;

    delete req.body._method; //delete the _method property from the body, so that it won't be passed to the controller

    req.method = method; //set the method to the value of the _method property so that it will be passed to the controller
  }
  next();
});

RoutesSetup(app); //RoutesSetup will lead to "./lib/RoutesSetup.js"

app.use((error, req, res, __) => {
  if (typeof error === "string") {
    error = new Error(error); //make sure all errors will be an object
  }

  if (!error.status) error.status = 404;

  console.error(error); //for developers

  res.format({
    "text/html": () => {
      if (req.session) {
        req.session.notifications = [
          { alertType: "alert-danger", message: error.message },
        ];
      }
      // Outputs the error to the user
      res.status(error.status).send(error.message);
    },
    "application/json": () => {
      res
        .status(error.status)
        .json({ status: error.status, message: error.message });
    },
    default: () => {
      res.status(406).send("NOT APPLICABLE");
    },
  });
});

export default app;
