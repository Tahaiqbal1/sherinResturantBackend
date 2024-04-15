import orderModel from "../models/orderModel.js";

export const createOrderController = async (req, res) => {
  try {
    const newOrder = new orderModel(req.body);
    const savedOrder = await newOrder.save();
    res
      .status(201)
      .json({ message: "Order created successfully", data: savedOrder });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating order", error: error.toString() });
  }
};

export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel.find().populate("cartItems.product");
    res
      .status(200)
      .json({ message: "Orders fetched successfully", data: orders });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.toString() });
  }
};

export const deleteOrderController = async (req, res) => {
  try {
    const order = await orderModel.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res
      .status(200)
      .json({ message: "Order deleted successfully", data: order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting order", error: error.toString() });
  }
};
