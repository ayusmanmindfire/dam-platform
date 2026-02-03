import { Router } from "express";
import multer from "multer";
import crypto from "crypto";
import { minioClient } from "../config/minio.js";
import { assetQueue } from "../config/queue.js";
import dotenv from "dotenv";

dotenv.config();

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = req.file;
    const assetId = crypto.randomUUID();
    const objectName = `raw/${assetId}-${file.originalname}`;

    // 1️Upload raw file to MinIO
    await minioClient.putObject(
      process.env.MINIO_BUCKET_NAME || "assets",
      objectName,
      file.buffer,
      file.size,
      {
        "Content-Type": file.mimetype,
      }
    );

    // Push job to queue
    await assetQueue.add("process-asset", {
      assetId,
      objectName,
      mimeType: file.mimetype,
      originalName: file.originalname,
      size: file.size,
    });

    // Respond immediately
    res.json({
      success: true,
      assetId,
      message: "File uploaded and queued for processing",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
});

export default router;
