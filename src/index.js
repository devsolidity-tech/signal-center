import express from "express";
import rootRouter from "./routes/router.js";

const app = express();
const PORT = process.env.PORT || 3000;

// built-in middleware to parse JSON bodies
app.use(express.json());

app.use("/", rootRouter);

app.get("/epoch", (req, res) => {
	const currentEpoch = Math.floor(Date.now() / 1000);
	res.json({ epoch: currentEpoch });
});

app.listen(PORT, () => {
	console.log(`Server listening on http://localhost:${PORT}`);
});
