# DAM Platform - Frontend

A modern, responsive web interface for the Digital Asset Management platform.

## 🛠 Tech Stack

- **Framework**: React (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn UI, Lucide React
- **State/Data**: TanStack React Query
- **Routing**: React Router DOM
- **HTTP Client**: Axios

## 📂 Key Dependencies

- `tailwindcss`: v4.0.0 (Native Vite plugin)
- `sonner`: For toast notifications.
- `@tanstack/react-query`: For server state management and caching.

## 🚀 Setup & Run

### Prerequisites
- Node.js v20+

### Installation
```bash
npm install
```

### Environment Variables
Create a `.env` file if you need to override defaults:
```env
VITE_API_URL=http://localhost:4000
```

### Running Locally
```bash
npm run dev
```
Access the app at `http://localhost:5173`.

### Building for Production
```bash
npm run build
```
Output will be in the `dist/` directory.

## 🧩 Project Structure

- **`src/pages/`**: Main page views (Dashboard, Assets, Upload, Settings).
- **`src/components/`**: Reusable UI components.
- **`src/services/`**: API service layer (`assetService.ts`).
- **`src/api/`**: Axios client configuration (`apiClient.ts`).
- **`src/config/`**: App-wide configuration.
- **`src/lib/`**: Utilities (e.g., `cn` for Tailwind class merging).
