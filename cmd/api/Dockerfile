# Use Golang 1.24.1 based on Alpine for a minimal image
FROM golang:1.24.1-alpine

WORKDIR /app

# Copy the go.mod and go.sum files for dependency caching
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the application code
COPY . .

# Build the binary for the API service
RUN go build -o api .

# Expose the port your API listens on
EXPOSE 8080

# Start the API
CMD ["./api"]
