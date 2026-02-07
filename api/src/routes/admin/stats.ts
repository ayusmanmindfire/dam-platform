import { Router } from "express";
import { redis } from "../../config/redist.js";

const router = Router();

router.get("/stats", async (req, res) => {
    try {
        const totalAssets = await redis.zcard("assets:all");
        const totalImages = await redis.zcard("assets:type:image");
        const totalVideos = await redis.zcard("assets:type:video");

        // Simple calculation for storage used - in real app, maintain a counter
        // For now returning 0 or placeholder

        res.json({
            success: true,
            stats: {
                totalAssets,
                totalImages,
                totalVideos,
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

export default router;
