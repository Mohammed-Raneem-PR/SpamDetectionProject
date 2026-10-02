#!/bin/bash
cd "$(dirname "$0")/frontend"
echo "Starting Vite Frontend on 0.0.0.0:5173..."
npm run dev -- --host 0.0.0.0
