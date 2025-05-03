export function generateTimestampId() {
	const now = new Date();
	const hh = String(now.getHours()).padStart(2, "0");
	const mm = String(now.getMinutes()).padStart(2, "0");
	const ss = String(now.getSeconds()).padStart(2, "0");
	return `${hh}${mm}${ss}`;
}
export function generateEpochId() {
	return Date.now().toString();
}
