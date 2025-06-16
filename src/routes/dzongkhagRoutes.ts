
import { Router } from "express";

import { authenticate } from "../middleware/userMiddleware";
import {
     createDzongkhag, deleteDzongkhag,
     getDzongkhagById, getDzongkhags, updateDzongkhag
} from "../controllers/DzongkhagControllers";


const router = Router();

router.post("/", authenticate, createDzongkhag);

router.get("/:id", authenticate, getDzongkhagById);

router.get("/", authenticate, getDzongkhags);

router.patch("/:id", authenticate, updateDzongkhag);

router.delete("/:id", authenticate, deleteDzongkhag);



export default router;
