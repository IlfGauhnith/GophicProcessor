# Use Golang 1.24.1 on Alpine
FROM golang:1.24.1-alpine

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Build the binary for the worker service
RUN go build -o worker .

CMD ["./worker"]
