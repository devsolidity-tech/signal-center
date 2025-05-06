export function toReadableDate(timestamp) {
	if (!timestamp) return null;

	// Firestore Timestamp → JS Date
	const date = timestamp.toDate();

	// Format using a locale that outputs "YYYY-MM-DD HH:mm:ss"
	// en-CA (Canadian English) with these options produces the exact layout we want.
	const options = {
		timeZone: "Asia/Jakarta",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
	};

	// e.g. "2025-05-05 18:02:55"
	return date.toLocaleString("en-CA", options).replace(",", "");
}

export function convertEpochMilliToGmt7(epochMilli) {
	const date = new Date(epochMilli);
	const gmt7Offset = 7 * 60; // GMT+7 in minutes
	const localTime = new Date(date.getTime() + gmt7Offset * 60 * 1000);
	return localTime.toISOString().replace("T", " ").substring(0, 19);
}

export function convertEpochToGmt7(epochSeconds) {
	const date = new Date(epochSeconds * 1000); // convert to ms
	const gmt7Offset = 7 * 60; // minutes
	const localTime = new Date(date.getTime() + gmt7Offset * 60 * 1000);
	return localTime.toISOString().replace("T", " ").substring(0, 19);
}
