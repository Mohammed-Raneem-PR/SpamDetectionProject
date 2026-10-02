#!/bin/bash
cd "$(dirname "$0")/backend"
echo "Starting FastAPI Backend on 0.0.0.0:8000..."
./venv/bin/python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload
