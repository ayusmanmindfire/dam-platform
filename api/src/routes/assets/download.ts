import { Router } from "express";
import { BUCKET_NAME, minioClient } from "../../config/minio.js";

const router = Router();
router.get("/:assetId/download", async (req, res) => {
  const { assetId } = req.params;

  try {
    const stream = minioClient.listObjectsV2(
      BUCKET_NAME,
      `raw/${assetId}`,
      true
    );

    stream.on("data", async (obj) => {
      if (!obj.name) return;

      const fileStream = await minioClient.getObject(BUCKET_NAME, obj.name);
      res.setHeader("Content-Disposition", `attachment`);
      fileStream.pipe(res);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

export default router;