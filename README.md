# Digital Asset Management (DAM) Platform

A clear, scalable, and modern solution for managing digital assets. This platform enables users to upload, process, tag, and organize images and videos efficiently using a microservices architecture.

```mermaid
graph TD
    User((User))
    subgraph "Frontend"
        Web[Web App (React)]
    end
    subgraph "Backend Services"
        API[API Server (Express)]
        Worker[Worker Service (BullMQ)]
    end
    subgraph "Infrastructure"
        MinIO[(MinIO Storage)]
        Redis[(Redis Cache/Queue)]
    end

    User -->|Interacts| Web
    Web -->|HTTP Requests| API
    API -->|Upload/Download| MinIO
    API -->|Enqueue Jobs| Redis
    Worker -->|Process Jobs| Redis
    Worker -->|Read/Write Assets| MinIO
```

## 🚀 Features

- **Multi-File Upload**: Drag & drop support for multiple files.
- **Background Processing**: Automatic thumbnail generation and video metadata extraction using BullMQ workers.
- **Asset Gallery**: Filterable and searchable grid view of assets.
- **Preview & Download**: Direct streaming of original assets and thumbnails.
- **Modern UI**: Built with React, Tailwind CSS v4, and Shadcn UI.
- **Scalable Backend**: Node.js/Express API with Redis for caching and queues, MinIO for object storage.
- **Containerized**: Full Docker and Docker Swarm support for easy deployment.

## 🏗 Architecture

The project is structured as a monorepo with the following components:

- **`web/`**: Frontend application (React + Vite + TypeScript).
- **`api/`**: Backend API and Worker process (Node.js + Express + BullMQ).
- **`api/infra/`**: Infrastructure configuration (Docker Compose, Swarm).

## 🛠 Prerequisites

- **Node.js**: v20 or higher
- **Docker & Docker Compose**: For running infrastructure services.
- **FFmpeg**: Required on the host machine if running the backend *outside* of Docker.

## 🏁 Quick Start

### 1. Start Infrastructure
Run Redis and MinIO:
```bash
cd api/infra
docker-compose up -d
```
- MinIO Console: http://localhost:9001 (User/Pass: `minioadmin` / `minioadmin`)
- Redis: `localhost:6379`

### 2. Start Backend API & Worker
The backend handles API requests and background processing.

```bash
cd api
npm install
npm run dev      # Starts API Server on port 4000
```
Open a **new terminal** for the worker (required for thumbnails):
```bash
cd api
npm run worker   # Starts Background Worker
```

### 3. Start Frontend
```bash
cd web
npm install
npm run dev
```
Access the app at `http://localhost:5173`.

## 📦 Deployment

The platform is designed to run on Docker Swarm.

```bash
# In api/ directory
npm run docker:build
npm run docker:push
npm run swarm:deploy
```

See `api/infra/swarm.yml` for stack configuration.

## 📄 Documentation

- [Frontend README](./web/README.md)
- [Backend README](./api/README.md)