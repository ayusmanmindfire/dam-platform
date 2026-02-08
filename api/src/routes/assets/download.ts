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

    // Increment download count (only for original)
    if (type !== 'thumbnail') {
      await redis.hincrby(`asset:${id}`, "downloads", 1);
    }

    let objectName = asset.objectName;
    if (type === "thumbnail") {
      if (!asset.thumbnail) {
        // If no thumbnail yet, maybe return a placeholder or 404
        // returning 404 for now so frontend handles fallback
        return res.status(404).json({ message: "Thumbnail not ready" });
      }
      objectName = asset.thumbnail;
    }

    if (!objectName) {
      return res.status(404).json({ success: false, message: "Asset file not found" });
    }

    const bucketName = process.env.MINIO_BUCKET_NAME || "assets";

    // Stream the file
    const dataStream = await minioClient.getObject(bucketName, objectName);

    // Determine mimeType
    let mimeType = asset.mimeType;
    if (type === 'thumbnail') {
      const ext = objectName.split('.').pop()?.toLowerCase();
      if (ext === 'webp') mimeType = 'image/webp';
      else if (ext === 'png') mimeType = 'image/png';
      else if (ext === 'jpg' || ext === 'jpeg') mimeType = 'image/jpeg';
      else mimeType = 'application/octet-stream';
    }

    res.setHeader('Content-Type', mimeType || 'application/octet-stream');

    // Optional: Set Content-Disposition for download
    if (type !== 'thumbnail') {
      res.setHeader('Content-Disposition', `attachment; filename="${asset.originalName}"`);
    }

    dataStream.pipe(res);

  } catch (err) {
    console.error(err);
    // If headers already sent, we can't send json
    if (!res.headersSent) {
      res.status(500).json({ success: false });
    }
  }
});

export default router;