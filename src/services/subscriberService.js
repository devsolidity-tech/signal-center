import { db } from "../database/firebase.js";

export const isValidSubscriber = async (accountNo) => {
	try {
		const snapshot = await db
			.collection("subscribers")
			.where("accountNo", "==", accountNo)
			.limit(1)
			.get();

		if (!snapshot.empty) {
			return true;
		}
		console.log(`No Account found for the provided accountNo ${accountNo}`);
	} catch (error) {
		console.log(error);
	}
	return false;
};
