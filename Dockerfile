# -----------------------------
# Stage 1: Build React Frontend
# -----------------------------
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci || npm install
COPY frontend/ ./
RUN npm run build

# -----------------------------
# Stage 2: Python Backend + Server
# -----------------------------
FROM python:3.11-slim

WORKDIR /app

# Install Tesseract OCR for image scanning
RUN apt-get update && apt-get install -y --no-install-recommends tesseract-ocr \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

COPY backend backend
COPY model model

# Copy built frontend from Stage 1 so FastAPI serves both UI & API together
COPY --from=frontend-builder /app/frontend/dist frontend/dist

WORKDIR /app/backend
CMD ["sh", "-c", "uvicorn app:app --host 0.0.0.0 --port ${PORT:-8000}"]
