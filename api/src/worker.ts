import { Worker } from "bullmq";
import dotenv from "dotenv";
import { processImage, processVideo } from "./processors/assetProcessor.js";

dotenv.config();

const connection = {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
};

const worker = new Worker(
    "asset-processing",
    async (job) => {
        console.log(`Starting job ${job.id}: ${job.name}`);

        try {
            if (job.data.mimeType.startsWith("image/")) {
                await processImage(job.data);
            } else if (job.data.mimeType.startsWith("video/")) {
                await processVideo(job.data);
            } else {
                console.log(`Unknown mime type: ${job.data.mimeType}`);
            }
        } catch (err) {
            console.error(`Job ${job.id} failed:`, err);
            throw err;
        }
    },
    { connection }
);

console.log("Worker started...");

worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed!`);
});

worker.on("failed", (job, err) => {
    console.error(`Job ${job?.id} failed with ${err.message}`);
});
