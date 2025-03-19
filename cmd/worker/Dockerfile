# Use Golang 1.24.1 on Alpine
FROM golang:1.24.1-alpine

WORKDIR /app

# Copy the go.work file to enable multi-module workspace
COPY go.work ./

# Copy the WORKER module files (go.mod, go.sum) from cmd/worker
COPY cmd/worker/go.mod cmd/worker/go.sum ./
# Copy the rest of the project, so that pkg is available (this copies the entire repository)
COPY . .

RUN go mod download

# Build the binary for the API service; adjust the build path to point to cmd/api
RUN go build -o worker ./cmd/worker

CMD ["./worker"]
