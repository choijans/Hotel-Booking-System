#!/bin/bash

# filepath: c:\JoshTest\Hotel-Booking-System\Hotel-Booking-System\run_all_services.sh

# Define paths
BACKEND_DIR="vaycay-backend"
FRONTEND_DIR="vaycay-frontend"
DOCKER_COMPOSE_FILE="$BACKEND_DIR/docker-compose.yml"

# Function to check if Docker Compose is already running
is_docker_compose_running() {
  docker ps --filter "name=docker-compose" --format "{{.Names}}" | grep -q "nats"
}

# Step 1: Start Docker Compose if not already running
echo "Checking Docker Compose status..."
if is_docker_compose_running; then
  echo "Docker Compose is already running."
else
  echo "Starting Docker Compose..."
  (cd "$BACKEND_DIR" && docker-compose up -d --build)
fi

# Step 2: Start backend services
echo "Starting backend services..."
for service in payment_status_listener.js payments_service.js bookings_service.js; do
  echo "Starting $service..."
  (cd "$BACKEND_DIR" && node "$service") &
done

# Step 3: Start frontend
echo "Starting frontend..."
(cd "$FRONTEND_DIR" && npm install && npm run dev) &

echo "All services are running!"