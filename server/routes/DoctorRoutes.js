import { Router } from "express";
import {
  index,
  show,
  add,
  edit,
  create,
  update,
  remove,
} from "../controllers/DoctorsController.js";
import {
  isAuthenticated,
  isRole,
} from "../controllers/AuthenticationController.js";

const router = Router(); //create a new router object so that we can define routes for it

/* The first argument represents the relative path, and the other one is the 
controller function we imported which contains view files path */
router.get("/", index);
router.get("/new", isAuthenticated, add);
router.get("/:id", show);
router.get("/:id/edit", isAuthenticated, edit);
router.post("/", isAuthenticated, create);
router.put("/:id", isAuthenticated, update);
router.delete("/:id", isAuthenticated, isRole("ADMIN"), remove);

export default router;
