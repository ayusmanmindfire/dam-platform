# DAM Platform - Backend API

The backend service for the DAM platform, responsible for file handling, metadata storage, and background processing.

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database (Metadata)**: Redis (using `ioredis`)
- **Queue**: BullMQ (Redis-based)
- **Object Storage**: MinIO (S3 compatible)
- **Processing**: `sharp` (Images), `fluent-ffmpeg` (Videos)

## 📂 Project Structure

- **`src/index.ts`**: Entry point for API server.
- **`src/worker.ts`**: Entry point for Background Worker.
- **`src/routes/`**: API Route definitions.
- **`src/processors/`**: Logic for processing images and videos.
- **`src/config/`**: Configuration for Redis, MinIO, and Queues.
- **`infra/`**: Docker and Swarm configurations.

## 🚀 Setup & Run

### Prerequisites
- Redis and MinIO must be running (see `infra/docker-compose.yml`).
- FFmpeg must be installed on the system if running locally.

### Installation
```bash
npm install
```

### Environment Variables
Create a `.env` file (or use system env vars):
```env
PORT=4000
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_BUCKET_NAME=assets
MINIO_ACCESS_KEY=minioadmin  # Or via Docker Secret
MINIO_SECRET_KEY=minioadmin  # Or via Docker Secret
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Running Locally

**1. Start API Server**
```bash
npm run dev
```
Runs on `http://localhost:4000`.

**2. Start Worker**
The worker consumes jobs from the queue to generate thumbnails and extract metadata.
```bash
npm run worker
```

### 🐳 Docker Commands

- **Build Image**: `npm run docker:build`
- **Push Image**: `npm run docker:push`
- **Deploy to Swarm**: `npm run swarm:deploy`
- **Remove Stack**: `npm run swarm:rm`

## 📡 API Endpoints

- `POST /upload`: Upload one or multiple files (`multipart/form-data`).
- `GET /assets`: List assets with pagination and filtering.
- `GET /assets/download/:id`: Stream asset content (supports `?type=thumbnail`).
- `GET /assets/:id`: Get single asset metadata.
- `GET /admin/stats`: Get dashboard statistics.
