import { Router } from "express";
import {
	createOrder,
	getAllOrders,
	getOrderByOrderId,
	deleteOrderByOrderId,
	updateOrderByOrderId,
	closeOrderByOrderId,
	getOrdersExcept,
	getOrderByLatestTimestamp,
} from "../controllers/ordersController.js";

const router = Router();

router.get("/", (req, res) => {
	res.send("Hello from ES6 Express Router!");
});

router.post("/orders", createOrder);
router.get("/orders", getAllOrders);
router.get("/orders/latestTimestamp/:latestTimestamp", getOrderByLatestTimestamp);
router.get("/orders/:orderId", getOrderByOrderId);
router.delete("/orders/:orderId", deleteOrderByOrderId);
router.put("/orders/:orderId", updateOrderByOrderId);
router.get("/orders/close/:orderId", closeOrderByOrderId);
router.post("/orders/exclude", getOrdersExcept);

export default router;
