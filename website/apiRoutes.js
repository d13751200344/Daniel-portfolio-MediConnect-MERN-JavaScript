import { Router } from "express";
import * as Hospital from "./facade/controllers/HospitalsController.js";
import * as User from "./facade/controllers/UsersController.js";
import * as Doctor from "./facade/controllers/DoctorsController.js";

const router = Router();

router.get("/hospitals", Hospital.index);
router.get("/hospitals/:id", Hospital.show);

router.get("/users/:id", User.show);
router.post("/users", User.create);
router.put("/users/:id", User.update);
router.post("/users/authenticate", User.authenticate);
router.post("/users/logout", User.logout);

router.get("/doctors", Doctor.index);
router.get("/doctors/:id", Doctor.show);
router.post("/doctors", Doctor.create);
router.put("/doctors/:id", Doctor.update);

export default router;
