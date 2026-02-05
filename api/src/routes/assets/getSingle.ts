import { Router } from "express";
import { BUCKET_NAME, minioClient } from "../../config/minio.js";

const router = Router();
router.get("/:assetId", async (req, res) => {
  const { assetId } = req.params;

  try {
    const objects: any[] = [];
    const stream = minioClient.listObjectsV2(
      BUCKET_NAME,
      `raw/${assetId}`,
      true
    );

    stream.on("data", (obj) => objects.push(obj));

    stream.on("end", () => {
      if (!objects.length) {
        return res.status(404).json({ success: false, message: "Asset not found" });
      }

      const file = objects[0];

      res.json({
        success: true,
        data: {
          assetId,
          objectName: file.name,
          size: file.size,
          lastModified: file.lastModified,
        },
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

export default router;
