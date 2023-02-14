import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";

//  @desc Create new Order
// @route POST/api/orders
// @ access  PRIVATE

export const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No Order Items 🤐");
    return;
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

//  @desc GET Order details BY ID
// @route GET/api/orders/:id
// @ access  PRIVATE

export const getOrderByID = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    res.json(order);
  } else {
    res.json(404);
    throw new Error("Order Not Found 😯");
  }
});

//  @desc update order to paid
// @route GET/api/orders/:id/pay
// @ access  PRIVATE

export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.json(404);
    throw new Error("Order Not Found 😯");
  }
});

//  @desc Get Logged In User Orders
// @route GET/api/orders/myorders
// @ access  PRIVATE

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

//  @desc Get all orders
// @route GET/api/orders/myorders
// @ access  PRIVATE

export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "id name");
  res.json(orders);
});

//  @desc update order to delivered
// @route GET/api/orders/:id/deliver
// @ access  PRIVATE/Admin

export const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.json(404);
    throw new Error("Order Not Found 😯");
  }
});
