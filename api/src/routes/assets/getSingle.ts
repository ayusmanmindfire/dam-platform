import { Router } from "express";
import { redis } from "../../config/redist.js";

const router = Router();

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const asset = await redis.hgetall(`asset:${id}`);

    if (!asset || Object.keys(asset).length === 0) {
      return res.status(404).json({ success: false, message: "Asset not found" });
    }

    res.json({ success: true, data: asset });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

export default router;
