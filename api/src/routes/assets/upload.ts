import { Router } from "express";
import multer from "multer";
import crypto from "crypto";
import { minioClient } from "../../config/minio.js";
import { assetQueue } from "../../config/queue.js";
import { redis } from "../../config/redist.js";
import dotenv from "dotenv";

dotenv.config();

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.array("files"), async (req, res) => {
  try {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const files = req.files as Express.Multer.File[];
    const uploadedAssets = [];

    for (const file of files) {
      const assetId = crypto.randomUUID();
      const objectName = `raw/${assetId}-${file.originalname}`;

      // 1. Upload raw file to MinIO
      await minioClient.putObject(
        process.env.MINIO_BUCKET_NAME || "assets",
        objectName,
        file.buffer,
        file.size,
        {
          "Content-Type": file.mimetype,
        }
      );

      // 2. Store internal metadata in Redis
      const now = new Date().toISOString();
      await redis.hset(`asset:${assetId}`, {
        id: assetId,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        objectName,
        status: "processing",
        uploadDate: now,
      });

      // Add to sets
      const timestamp = Date.now();
      await redis.zadd("assets:all", timestamp, assetId);

      if (file.mimetype.startsWith("image/")) {
        await redis.zadd("assets:type:image", timestamp, assetId);
      } else if (file.mimetype.startsWith("video/")) {
        await redis.zadd("assets:type:video", timestamp, assetId);
      }

      // 3. Push job to queue
      await assetQueue.add("process-asset", {
        assetId,
        objectName,
        mimeType: file.mimetype,
        originalName: file.originalname,
        size: file.size,
      });

      uploadedAssets.push({ assetId, originalName: file.originalname });
    }

    res.json({
      success: true,
      message: `${files.length} files uploaded and queued`,
      data: uploadedAssets
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
});

export default router;
