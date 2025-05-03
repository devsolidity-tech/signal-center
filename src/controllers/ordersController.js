import OrderDTO from "../dto/OrderDTO.js";
import { symbols, openOrderType, updateOrderType } from "../utils/constant.js";
import { db, FieldValue } from "../database/firebase.js";
import { generateEpochId } from "../utils/timestampId.js";

const toReadableDate = (timestamp) =>
	timestamp && typeof timestamp.toDate === "function" ? timestamp.toDate().toISOString() : null;

export const createOrder = async (req, res) => {
	try {
		const orderDto = new OrderDTO(req.body);
		orderDto.validate();

		const allowedSymbol = symbols[orderDto.symbol];
		if (!allowedSymbol) throw new Error(`Unable to Open Order for ${orderDto.symbol}`);

		const allowedOrderType = openOrderType[orderDto.orderType];
		if (!allowedOrderType)
			throw new Error(`Unable to Open Order for order type : ${orderDto.orderType}`);

		orderDto.orderId = generateEpochId();

		const docRef = await db.collection("orders").add({
			orderId: orderDto.orderId,
			symbol: orderDto.symbol,
			orderType: orderDto.orderType,
			openPrice: orderDto.openPrice,
			stopLossPrice: orderDto.stopLossPrice,
			takeProfitPrice: orderDto.takeProfitPrice,
			orderSize: orderDto.orderSize,
			createdAt: FieldValue.serverTimestamp(),
		});

		const newOrderId = docRef.id;

		const orderLogDocRef = await db.collection("orders_log").add({
			docId: newOrderId,
			orderId: orderDto.orderId,
			symbol: orderDto.symbol,
			orderType: orderDto.orderType,
			openPrice: orderDto.openPrice,
			stopLossPrice: orderDto.stopLossPrice,
			takeProfitPrice: orderDto.takeProfitPrice,
			orderSize: orderDto.orderSize,
			createdAt: FieldValue.serverTimestamp(),
			transactionType: "ADD",
		});

		res.status(201).json({
			success: true,
			id: docRef.id,
			data: orderDto,
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const deleteOrderByOrderId = async (req, res) => {
	try {
		const { orderId } = req.params;
		const snapshot = await db.collection("orders").where("orderId", "==", orderId).limit(1).get();
		if (snapshot.empty) {
			return res.status(404).json({ success: false, message: "Order not found" });
		}
		const docRef = snapshot.docs[0].ref;
		await docRef.delete();

		res.json({ success: true, message: "Order deleted" });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

export const updateOrderByOrderId = async (req, res) => {
	try {
		const { orderId } = req.params;
		const orderDto = new OrderDTO({ orderId, ...req.body });
		orderDto.validateUpdate();

		const allowedOrderType = updateOrderType[orderDto.orderType];
		if (!allowedOrderType)
			throw new Error(`Unable to Update Order for order type : ${orderDto.orderType}`);

		const snapshot = await db.collection("orders").where("orderId", "==", orderId).limit(1).get();
		if (snapshot.empty) return res.status(404).json({ success: false, message: "Order not found" });
		const docRef = snapshot.docs[0].ref;
		await docRef.update({
			openPrice: orderDto.openPrice,
			stopLossPrice: orderDto.stopLossPrice,
			takeProfitPrice: orderDto.takeProfitPrice,
			orderSize: orderDto.orderSize,
			updatedAt: FieldValue.serverTimestamp(),
		});

		const orderLogDocRef = await db.collection("orders_log").add({
			orderId: orderDto.orderId,
			symbol: orderDto.symbol,
			orderType: orderDto.orderType,
			openPrice: orderDto.openPrice,
			stopLossPrice: orderDto.stopLossPrice,
			takeProfitPrice: orderDto.takeProfitPrice,
			orderSize: orderDto.orderSize,
			createdAt: FieldValue.serverTimestamp(),
			transactionType: "UPDATE",
		});

		res.json({ success: true, data: orderDto });
	} catch (error) {
		console.log(error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const closeOrderByOrderId = async (req, res) => {
	try {
		const { orderId } = req.params;

		const snapshot = await db.collection("orders").where("orderId", "==", orderId).limit(1).get();
		if (snapshot.empty) return res.status(404).json({ success: false, message: "Order not found" });
		const docRef = snapshot.docs[0].ref;
		await docRef.update({
			orderType: "CLOSE",
			updatedAt: FieldValue.serverTimestamp(),
		});

		const doc = snapshot.docs[0];
		const data = doc.data();

		const orderLogDocRef = await db.collection("orders_log").add({
			docId: doc.id,
			orderId: data.orderId,
			symbol: data.symbol,
			orderType: "CLOSE",
			openPrice: data.openPrice,
			stopLossPrice: data.stopLossPrice,
			takeProfitPrice: data.takeProfitPrice,
			orderSize: data.orderSize,
			createdAt: toReadableDate(data.createdAt),
			transactionType: "UPDATE",
		});

		res.json({ success: true, data: [] });
	} catch (error) {
		console.log(error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const getOrderByOrderId = async (req, res) => {
	try {
		const { orderId } = req.params;
		const snapshot = await db.collection("orders").where("orderId", "==", orderId).limit(1).get();
		if (snapshot.empty) {
			return res.status(404).json({ success: false, message: "Order not found" });
		}
		const doc = snapshot.docs[0];
		const data = doc.data();
		res.json({
			success: true,
			data: {
				docId: doc.id,
				orderId: data.orderId,
				symbol: data.symbol,
				orderType: data.orderType,
				openPrice: data.openPrice,
				stopLossPrice: data.stopLossPrice,
				takeProfitPrice: data.takeProfitPrice,
				orderSize: data.orderSize,
				createdAt: toReadableDate(data.createdAt),
				updatedAt: toReadableDate(data.updatedAt),
			},
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

export const getAllOrders = async (req, res) => {
	try {
		const limit = parseInt(req.query.limit, 10) || null;
		let query = db.collection("orders").orderBy("createdAt", "desc");
		if (limit > 0) {
			query = query.limit(limit);
		}
		const snapshot = await query.get();
		const orders = snapshot.docs.map((doc) => {
			const data = doc.data();
			return {
				docId: doc.id,
				orderId: data.orderId,
				symbol: data.symbol,
				orderType: data.orderType,
				openPrice: data.openPrice,
				stopLossPrice: data.stopLossPrice,
				takeProfitPrice: data.takeProfitPrice,
				orderSize: data.orderSize,
				createdAt: toReadableDate(data.createdAt),
				updatedAt: toReadableDate(data.updatedAt),
			};
		});
		res.json({ success: true, data: orders });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

export const getOrdersExcept = async (req, res) => {
	const { ids } = req.body;

	if (!Array.isArray(ids)) {
		return res
			.status(400)
			.json({ success: false, message: "`ids` must be an array of document IDs" });
	}

	try {
		// Fetch all orders, newest first
		const snapshot = await db.collection("orders").orderBy("createdAt", "desc").get();

		const results = [];
		snapshot.forEach((doc) => {
			const data = doc.data();
			if (!ids.includes(data.orderId)) {
				results.push({
					id: doc.id,
					...data,
					createdAt: data.createdAt?.toDate().toISOString() ?? null,
					updatedAt: data.updatedAt?.toDate().toISOString() ?? null,
				});
			}
		});

		res.json({ success: true, data: results });
	} catch (err) {
		console.error("Error fetching orders with exceptions:", err);
		res.status(500).json({ success: false, message: err.message });
	}
};
