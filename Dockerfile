# Stage 1: Build the React/Vite Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY payguard-x/frontend/package*.json ./
RUN npm ci
COPY payguard-x/frontend/ ./
RUN npm run build

# Stage 2: Python FastAPI Backend + Static UI Serving
FROM python:3.11-slim
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends gcc g++ curl && rm -rf /var/lib/apt/lists/*

COPY payguard-x/backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY payguard-x/backend/ ./
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

ENV PORT=7860
EXPOSE 7860

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-7860}"]
