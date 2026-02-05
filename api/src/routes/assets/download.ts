import { Router } from "express";
import { minioClient } from "../../config/minio.js";
import { redis } from "../../config/redist.js";

const router = Router();

router.get("/download/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query; // 'original' or 'thumbnail'

    const asset = await redis.hgetall(`asset:${id}`);

    if (!asset || Object.keys(asset).length === 0) {
      return res.status(404).json({ success: false, message: "Asset not found" });
    }

    let objectName = asset.objectName;
    if (type === "thumbnail" && asset.thumbnail) {
      objectName = asset.thumbnail;
    }

    if (!objectName) {
      return res.status(404).json({ success: false, message: "Asset file not found" });
    }

    // Generate Presigned URL (valid for 1 hour)
    const url = await minioClient.presignedGetObject(
      process.env.MINIO_BUCKET_NAME || "assets",
      objectName,
      60 * 60
    );

    res.json({ success: true, url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

export default router;