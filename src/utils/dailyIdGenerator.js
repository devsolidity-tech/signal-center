class DailyIdGenerator {
	constructor() {
		this.currentDate = "";
		this.sequenceNumber = 0;
		this.scheduleMidnightReset();
	}

	/**
	 * Returns today's date as ddmmyyyy
	 */
	getDateString() {
		const now = new Date();
		const dd = String(now.getDate()).padStart(2, "0");
		const mm = String(now.getMonth() + 1).padStart(2, "0");
		const yyyy = now.getFullYear();
		return `${dd}${mm}${yyyy}`;
	}

	/**
	 * Generates the next ID, resetting the counter if the date has changed
	 * @returns {string} ID in format ddmmyyyy_sequenceNumber
	 */
	generateId() {
		const today = this.getDateString();
		if (today !== this.currentDate) {
			this.currentDate = today;
			this.sequenceNumber = 0;
		}
		this.sequenceNumber++;
		const seqStr = String(this.sequenceNumber).padStart(3, "0");
		return `${today}_${seqStr}`;
	}

	/**
	 * Schedules a reset at the next midnight to clear the date and sequence
	 */
	scheduleMidnightReset() {
		const now = new Date();
		const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
		const msUntilMidnight = nextMidnight - now;
		setTimeout(() => {
			this.currentDate = "";
			this.sequenceNumber = 0;
			this.scheduleMidnightReset(); // reschedule for the following day
		}, msUntilMidnight);
	}
}

export default new DailyIdGenerator();
