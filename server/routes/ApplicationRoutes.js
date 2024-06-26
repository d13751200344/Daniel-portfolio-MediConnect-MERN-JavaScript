import { Router } from "express";
import {
  index,
  show,
  add,
  edit,
  create,
  update,
  remove,
} from "../controllers/ApplicationController.js";
import { isRole } from "../controllers/AuthenticationController.js";

const router = Router();

/* use the isAuthenticated middleware to protect the routes
- Check if the user has the "ADMIN" role so that the user can access the routes below */
router.use(isRole("ADMIN"));

// routes:
router.get("/", index);
router.get("/new", add);
router.get("/:id", show);
router.get("/:id/edit", edit);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;
