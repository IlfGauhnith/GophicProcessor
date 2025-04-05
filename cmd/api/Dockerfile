# Use Golang 1.24.1 based on Alpine
FROM golang:1.24.1-alpine

RUN apk update && apk add --no-cache bash

WORKDIR /app

# Copy the go.work file to enable multi-module workspace
COPY go.work ./

# Copy the API module files (go.mod, go.sum) from cmd/api
COPY cmd/api/go.mod cmd/api/go.sum ./

# Copy the rest of the project, so that pkg is available (this copies the entire repository)
COPY . .

RUN go mod download



# Build the binary for the API service; adjust the build path to point to cmd/api
RUN go build -o api ./cmd/api

# Expose the port your API listens on
EXPOSE 8080

# Start the API
CMD ["./api"]
