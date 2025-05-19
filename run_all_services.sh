#!/bin/bash

# Define paths
BACKEND_DIR="vaycay-backend"
FRONTEND_DIR="vaycay-frontend"
DOCKER_COMPOSE_FILE="$BACKEND_DIR/docker-compose.yml"
FIRST_RUN_FILE="$BACKEND_DIR/.first_run"

# Function to check if Docker Compose is already running
is_docker_compose_running() {
  docker ps --filter "name=nats" --format "{{.Names}}" | grep -q "nats"
}

# Function to start backend services
start_backend_services() {
  echo "Starting backend services..."
  services=("payment_status_listener.js" "payments_service.js" "bookings_service.js")
  for service in "${services[@]}"; do
    echo "Starting $service..."
    (cd "$BACKEND_DIR" && node "$service" &)
  done
}

# Check if this is the first run
if [ ! -f "$FIRST_RUN_FILE" ]; then
  echo "=============================================="
  echo "It appears this is your first time running the project."
  echo "We'll need to perform initial setup (this may take a while)."
  echo "=============================================="
  
  # First-time setup
  touch "$FIRST_RUN_FILE"
  
  # Build and start Docker containers
  echo "Building and starting Docker containers for the first time..."
  (cd "$BACKEND_DIR" && docker-compose up -d --build)
  
  # Install frontend dependencies
  echo "Installing frontend dependencies..."
  (cd "$FRONTEND_DIR" && npm install)
else
  echo "Existing project detected. Starting services..."
  
  # Start Docker if not running
  if ! is_docker_compose_running; then
    echo "Starting Docker containers..."
    (cd "$BACKEND_DIR" && docker-compose up -d)
  else
    echo "Docker containers are already running."
  fi
fi

# Start backend services
start_backend_services

echo "Starting frontend development server..."
(cd "$FRONTEND_DIR" && npm run dev) &

echo "=============================================="
echo "All services are running!"
echo "Press Ctrl+C to stop all services"
echo "=============================================="

# Wait for Ctrl+C to stop
trap "echo 'Stopping all services...'; exit" SIGINT
wait