# Use latest Go version (>=1.24)
FROM golang:1.24-bookworm as builder

WORKDIR /app

# Copy module files and download dependencies
COPY go.mod go.sum ./
RUN go mod tidy && go mod download

# Copy the rest of the application
COPY . .

# Build the application
RUN go build -o bookings_service

# Use a minimal runtime image
FROM gcr.io/distroless/base-debian12

WORKDIR /root/

COPY --from=builder /app/bookings_service .

CMD ["./bookings_service"]
