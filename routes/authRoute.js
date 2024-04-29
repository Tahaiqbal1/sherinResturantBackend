import express from "express";
import {
  forgotPasswordController,
  getAllUsersController,
  loginController,
  registerController,
  testController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/register", registerController);

router.post("/login", loginController);

router.post("/forgot-password", forgotPasswordController);

router.get("/admin-auth", requireSignIn, isAdmin, testController);

router.get("/all-users", getAllUsersController);

router.get("/test", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

export default router;
