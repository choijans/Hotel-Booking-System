#!/bin/bash

# Define paths
BACKEND_DIR="vaycay-backend"
FRONTEND_DIR="vaycay-frontend"

# Stop frontend (Node.js process)
echo "Stopping frontend..."
pkill -f "npm run dev"

# Stop backend services (Node.js processes)
echo "Stopping backend services..."
pkill -f "payment_status_listener.js"
pkill -f "payments_service.js"
pkill -f "bookings_service.js"

# Stop Docker containers
echo "Stopping Docker containers..."
(cd "$BACKEND_DIR" && docker-compose down)

# Remove first run marker (optional)
# rm "$BACKEND_DIR/.first_run"

echo "All services have been stopped."