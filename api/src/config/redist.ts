import { Redis } from "ioredis";
import { getSecret } from "./secrets.js";

export const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
  password: getSecret("redis_password", ""), // Optional password support
  maxRetriesPerRequest: null,
});
