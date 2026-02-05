import { Router } from "express";
import { redis } from "../../config/redist.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    // Get all asset IDs from Redis (Sorted by time descending)
    const assetIds = await redis.zrevrange("assets:all", 0, -1);

    if (!assetIds.length) {
      return res.json({ success: true, data: [] });
    }

    // Pipeline to fetch details for all assets
    const pipeline = redis.pipeline();
    assetIds.forEach((id: string) => pipeline.hgetall(`asset:${id}`));

    const results = await pipeline.exec();

    // Format results
    const assets = results?.map(([err, data]: any) => {
      if (err) return null;
      return data;
    }).filter(Boolean);

    res.json({ success: true, data: assets });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

export default router;
