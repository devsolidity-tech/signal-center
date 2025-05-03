class OrderDTO {
	constructor(data = {}) {
		this.orderId = data.orderId;
		this.symbol = data.symbol;
		this.orderType = data.orderType;
		this.openPrice =
			typeof data.openPrice === "string" ? parseFloat(data.openPrice) : data.openPrice;
		this.stopLossPrice =
			typeof data.stopLossPrice === "string" ? parseFloat(data.stopLossPrice) : data.stopLossPrice;
		this.takeProfitPrice =
			typeof data.takeProfitPrice === "string"
				? parseFloat(data.takeProfitPrice)
				: data.takeProfitPrice;
		this.orderSize =
			typeof data.orderSize === "string" ? parseFloat(data.orderSize) : data.orderSize;
	}

	validate() {
		if (!this.symbol) throw new Error("symbol is required");
		if (!this.orderType) throw new Error("orderType is required");
		if (typeof this.openPrice !== "number" || isNaN(this.openPrice)) {
			throw new Error("openPrice must be a valid number");
		}
		if (typeof this.stopLossPrice !== "number" || isNaN(this.stopLossPrice)) {
			throw new Error("stopLossPrice must be a valid number");
		}
		if (typeof this.takeProfitPrice !== "number" || isNaN(this.takeProfitPrice)) {
			throw new Error("takeProfitPrice must be a valid number");
		}
		if (typeof this.orderSize !== "number" || isNaN(this.orderSize)) {
			throw new Error("orderSize must be a valid number");
		}
	}
}

export default OrderDTO;
