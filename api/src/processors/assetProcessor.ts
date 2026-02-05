import sharp from "sharp";
import ffmpeg from "fluent-ffmpeg";
import { minioClient } from "../config/minio.js";
import { redis } from "../config/redist.js";
import fs from "fs";
import path from "path";
import os from "os";

const TEMP_DIR = os.tmpdir();

export async function processImage(jobData: any) {
    const { assetId, objectName, mimeType } = jobData;
    console.log(`Processing image: ${assetId}`);

    // Disable sharp cache to prevent file locking on Windows
    sharp.cache(false);

    // Download from MinIO
    const tempInput = path.join(TEMP_DIR, `${assetId}-input`);
    const tempOutput = path.join(TEMP_DIR, `${assetId}-thumb.webp`); // Convert to WebP

    try {
        await minioClient.fGetObject(
            process.env.MINIO_BUCKET_NAME || "assets",
            objectName,
            tempInput
        );

        // Get Metadata & Resize
        const metadata = await sharp(tempInput).metadata();
        await sharp(tempInput)
            .resize(300) // Thumbnail width
            .toFormat("webp")
            .toFile(tempOutput);

        // Upload Thumbnail
        const thumbName = `thumbnails/${assetId}.webp`;
        await minioClient.fPutObject(
            process.env.MINIO_BUCKET_NAME || "assets",
            thumbName,
            tempOutput,
            { "Content-Type": "image/webp" }
        );

        // Update Redis
        await redis.hset(`asset:${assetId}`, {
            status: "ready",
            width: metadata.width,
            height: metadata.height,
            thumbnail: thumbName,
            processedAt: new Date().toISOString(),
        });

    } catch (err) {
        console.error(`Error processing image ${assetId}:`, err);
        await redis.hset(`asset:${assetId}`, { status: "failed" });
        throw err;
    } finally {
        // Cleanup with retry/ignore pattern
        try {
            if (fs.existsSync(tempInput)) fs.unlinkSync(tempInput);
            if (fs.existsSync(tempOutput)) fs.unlinkSync(tempOutput);
        } catch (e) {
            console.error("Failed to cleanup temp files:", e);
        }
    }
}

export async function processVideo(jobData: any) {
    const { assetId, objectName } = jobData;
    console.log(`Processing video: ${assetId}`);

    const tempInput = path.join(TEMP_DIR, `${assetId}-video`);
    const tempThumb = path.join(TEMP_DIR, `${assetId}-thumb.png`);

    try {
        // Download
        await minioClient.fGetObject(
            process.env.MINIO_BUCKET_NAME || "assets",
            objectName,
            tempInput
        );

        // Generate Thumbnail
        await new Promise((resolve, reject) => {
            ffmpeg(tempInput)
                .screenshots({
                    count: 1,
                    folder: TEMP_DIR,
                    filename: `${assetId}-thumb.png`,
                    size: "320x?",
                })
                .on("end", resolve)
                .on("error", reject);
        });

        // Upload Thumbnail
        const thumbName = `thumbnails/${assetId}.png`;
        await minioClient.fPutObject(
            process.env.MINIO_BUCKET_NAME || "assets",
            thumbName,
            tempThumb,
            { "Content-Type": "image/png" }
        );

        // Extract Metadata
        await new Promise((resolve, reject) => {
            ffmpeg.ffprobe(tempInput, async (err: any, metadata: any) => {
                if (err) return reject(err);
                const duration = metadata.format.duration;
                // Update Redis
                await redis.hset(`asset:${assetId}`, {
                    status: "ready",
                    thumbnail: thumbName,
                    duration: duration,
                    processedAt: new Date().toISOString(),
                });
                resolve(true)
            });
        })


    } catch (err) {
        console.error(`Error processing video ${assetId}:`, err);
        await redis.hset(`asset:${assetId}`, { status: "failed" });
        throw err;
    } finally {
        if (fs.existsSync(tempInput)) fs.unlinkSync(tempInput);
        if (fs.existsSync(tempThumb)) fs.unlinkSync(tempThumb);
    }
}
