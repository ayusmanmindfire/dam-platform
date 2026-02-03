import { Queue } from "bullmq";
import dotenv from "dotenv";
dotenv.config();
export const assetQueue = new Queue("asset-processing", {
    connection: {
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: Number(process.env.REDIS_PORT) || 6379,
    },
});
//# sourceMappingURL=queue.js.map