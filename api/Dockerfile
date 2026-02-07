FROM node:20-alpine

# Install FFmpeg for video processing
RUN apk add --no-cache ffmpeg

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 4000

CMD ["node", "dist/index.js"]
