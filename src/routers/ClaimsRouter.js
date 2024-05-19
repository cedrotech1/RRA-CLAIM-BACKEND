import express from "express";
import {
  addClaimController,
  Claims,
  approveClaimController,
  rejectClaimController,
  deleteOneClaimController,
  getOneClaimController,
  pendingController,
  updateClaimController
} from "../controllers/ClaimsController";
import { protect } from "../middlewares/protect";
const router = express.Router();
router.delete("/delete/:id", protect, deleteOneClaimController);   
router.post("/add", protect, addClaimController);
router.get("/", protect, Claims);
router.get("/pending", protect, pendingController);
router.get("/one/:id", protect, getOneClaimController);
router.put("/approve/:id", protect, approveClaimController);
router.put("/reject/:id", protect, rejectClaimController);
router.put("/update/:id", protect, updateClaimController);
export default router;
