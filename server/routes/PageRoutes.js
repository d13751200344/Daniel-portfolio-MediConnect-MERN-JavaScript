import { Router } from "express";
import { home } from "../controllers/PagesController.js";

const router = Router();

/* The first argument represents the relative path, and the other one is the 
controller function we imported which contains view files path */
router.get("/", home); //home will lead to "/PageController.js"

export default router;
