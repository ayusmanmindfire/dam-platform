import { Router } from "express";
import { redis } from "../../config/redist.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const type = req.query.type as string; // 'image' | 'video'

    const start = (page - 1) * limit;
    const stop = start + limit - 1;

    let key = "assets:all";
    if (type === "image") key = "assets:type:image";
    else if (type === "video") key = "assets:type:video";

    // Get asset IDs (Sorted by time descending)
    const assetIds = await redis.zrevrange(key, start, stop);
    const total = await redis.zcard(key);

    if (!assetIds.length) {
      return res.json({
        success: true,
        data: [],
        pagination: { page, limit, total, pages: Math.ceil(total / limit) }
      });
    }

    // Pipeline to fetch details for all assets
    const pipeline = redis.pipeline();
    assetIds.forEach((id: string) => pipeline.hgetall(`asset:${id}`));

    const results = await pipeline.exec();

    // Format results
    let assets = (results?.map(([err, data]: any) => {
      if (err) return null;
      return data;
    }).filter(Boolean)) || [];

    // Filter by search query (simple in-memory filter)
    const searchQuery = req.query.search as string;
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      assets = assets.filter((asset: any) =>
        asset.originalName?.toLowerCase().includes(lowerQuery)
      );
    }

    res.json({
      success: true,
      data: assets,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

export default router;
