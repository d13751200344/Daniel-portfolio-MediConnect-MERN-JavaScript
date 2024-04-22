import { Router } from "express";
import {
  index as HospitalIndex,
  show as HospitalShow,
} from "../controllers/HospitalsController.js";
import {
  index as DoctorIndex,
  show as DoctorShow,
  create as DoctorCreate,
  update as DoctorUpdate,
} from "../controllers/DoctorsController.js";
import {
  show as userShow,
  create as userCreate,
  update as userUpdate,
} from "../controllers/UsersController.js";
import {
  isAuthenticated,
  authenticate as userAuthenticate,
  logout as userLogout,
} from "../controllers/AuthenticationController.js";
import {
  requestToken,
  authenticate as applicationAuthenticate,
} from "../controllers/ApplicationController.js";

// Creates a router
const router = Router();

// Only users who accept JSON data are allowed because this is an API
router.use((req, res, next) => {
  if (req.headers["accept"] !== "application/json") {
    //if the content-type is not application/json
    req.headers["accept"] = "application/json";
    //change the accept in header to application/json
    res.status(406);
    const error = new Error("NOT ACCEPTABLE");
    error.status = 406;
    next(error);
  }
  next();
});

router.post("/authenticate", requestToken); //for asking for JWT when logging in

router.get("/hospitals", applicationAuthenticate, HospitalIndex);
router.get("/hospitals/:id", applicationAuthenticate, HospitalShow);

router.get("/doctors", applicationAuthenticate, DoctorIndex);
router.get("/doctors/:id", applicationAuthenticate, DoctorShow);
router.post("/doctors", applicationAuthenticate, isAuthenticated, DoctorCreate);
router.put(
  "/doctors/:id",
  applicationAuthenticate,
  isAuthenticated,
  DoctorUpdate
);

router.get("/users/:id", applicationAuthenticate, isAuthenticated, userShow);
router.post("/users", applicationAuthenticate, userCreate);
router.put("/users/:id", applicationAuthenticate, isAuthenticated, userUpdate);
router.post("/users/authenticate", applicationAuthenticate, userAuthenticate); //for logging in
router.post(
  "/users/logout",
  applicationAuthenticate,
  isAuthenticated,
  userLogout
);

export default router;
