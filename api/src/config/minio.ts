import { Client } from "minio";
import dotenv from "dotenv";
import { getSecret } from "./secrets.js";

dotenv.config();

export const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: Number(process.env.MINIO_PORT) || 9000,
  useSSL: process.env.MINIO_USE_SSL === "false",
  accessKey: getSecret("minio_access_key", "minioadmin"),
  secretKey: getSecret("minio_secret_key", "minioadmin"),
});

export const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || "assets";

// Ensure bucket exists
export async function ensureBucketExists() {
  const exists = await minioClient.bucketExists(BUCKET_NAME);
  if (!exists) {
    await minioClient.makeBucket(BUCKET_NAME, "us-east-1"); // region can be anything
    console.log(`Bucket '${BUCKET_NAME}' created`);
  }
}

// Call it immediately (optional)
ensureBucketExists().catch(console.error);