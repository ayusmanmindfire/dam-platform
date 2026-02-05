import { Router } from "express";
import dotenv from "dotenv";
import { BUCKET_NAME, minioClient } from "../../config/minio.js";

dotenv.config();

const router = Router();

router.get("/", async (req, res) => {
  try {
    const assets: any[] = [];
    const stream = minioClient.listObjectsV2(BUCKET_NAME, "raw/", true);

    stream.on("data", (obj) => {
      if (!obj.name) return;
      if (!obj.name.startsWith("raw/")) return;

      const rest = obj.name.replace("raw/", "");
      const [assetId, ...nameParts] = rest.split("-");
      const originalName = nameParts.join("-");

      assets.push({
        assetId,
        objectName: obj.name,
        originalName,
        size: obj.size,
        lastModified: obj.lastModified,
        type: obj.name.includes(".mp4") ? "video" : "image",
        status: "uploaded", // later from DB
      });
    });

    stream.on("end", () => {
      res.json({ success: true, data: assets });
    });

    stream.on("error", (err) => {
      console.error(err);
      res.status(500).json({ success: false, message: "Failed to list assets" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

export default router;
