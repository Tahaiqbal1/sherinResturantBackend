import express from "express";

import {
  createOrderController,
  deleteOrderController,
  getAllOrdersController,
  getUserOrdersController,
} from "../controllers/orderController.js";
const router = express.Router();

router.post("/create-order", createOrderController);

router.get("/all-orders", getAllOrdersController);

router.get("/user/:userId", getUserOrdersController);

router.delete("/delete-order/:id", deleteOrderController);

export default router;
