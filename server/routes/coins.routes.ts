import { Router } from "express";
import { getCoinsByRoom } from "../controllers/coins.controller";
const router = Router();

router.get("/coins/room/:room", getCoinsByRoom);

export default router;