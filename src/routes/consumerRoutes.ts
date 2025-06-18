
import { Router } from "express";
import { authenticate } from "../middleware/userMiddleware";
import { createConsumer, deleteConsumer, getConsumerById, getAllConsumers, updateConsumer } from "../controllers/consumerControllers";



const router = Router();

router.post("/", authenticate, createConsumer);

router.get("/:id", authenticate, getConsumerById);

router.get("/", authenticate, getAllConsumers);

router.patch("/:id", authenticate, updateConsumer);

router.delete("/:id", authenticate, deleteConsumer);


export default router;
