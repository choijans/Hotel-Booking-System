# Use latest Go version (>=1.24)
FROM golang:1.24-bookworm as builder

WORKDIR /app

# Copy the module files and download dependencies first (for better caching)
COPY go.mod go.sum ./
RUN go mod tidy && go mod download

# Copy the rest of the application files
COPY . .

# Build the application
RUN go build -o jwt-generator

# Use a minimal runtime image
FROM gcr.io/distroless/base-debian12

WORKDIR /root/

COPY --from=builder /app/jwt-generator .

CMD ["./jwt-generator"]
