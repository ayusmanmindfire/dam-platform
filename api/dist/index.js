import express from "express";
import cors from "cors";
import uploadRoute from "./routes/upload.js";
import dotenv from "dotenv";
import { redis } from "./config/redist.js";
import { BUCKET_NAME, minioClient } from "./config/minio.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.get("/health", async (_req, res) => {
    const pong = await redis.ping();
    res.json({ status: "ok", redis: pong });
});
app.use("/upload", uploadRoute);
app.get("/files", async (req, res) => {
    try {
        const objects = [];
        const stream = minioClient.listObjectsV2(BUCKET_NAME, "", true);
        stream.on("data", (obj) => objects.push(obj.name || ""));
        stream.on("error", (err) => {
            console.error(err);
            res.status(500).json({ success: false, message: "Failed to list files" });
        });
        stream.on("end", () => {
            res.json({ success: true, files: objects });
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to list files" });
    }
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map