import { Router } from "express"
import { authenticate } from "../middleware/userMiddleware";
import { createGewog, deleteGewog, getGewogById, getGewogs, updateGewog } from "../controllers/gewogControllers";



const router = Router();

router.post("/", authenticate, createGewog);

router.get("/:id", authenticate, getGewogById);

router.get("/", authenticate, getGewogs);

router.patch("/:id", authenticate, updateGewog);

router.delete("/:id", authenticate, deleteGewog);



export default router;
