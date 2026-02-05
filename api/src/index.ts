import express from "express";
import cors from "cors";
import uploadRoute from "./routes/assets/upload.js"
import getAllAssetsRoute from "./routes/assets/allAssets.js";
import downloadRoute from "./routes/assets/download.js";
import getSingleAssetRoute from "./routes/assets/getSingle.js";
import dotenv from "dotenv";
import { redis } from "./config/redist.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", async (_req, res) => {
  const pong = await redis.ping();
  res.json({ status: "ok", redis: pong });
});

// assets routes
app.use("/upload", uploadRoute);
app.use("/assets", getAllAssetsRoute);
app.use("/assets", getSingleAssetRoute);
app.use("/assets", downloadRoute);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
