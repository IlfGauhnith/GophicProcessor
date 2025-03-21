# GophicProcessor Project Structure

This project uses a monorepo with a multi-module approach, organized into two main directories: **`cmd/`** and **`pkg/`**.

## How to Run

1. **Prerequisites:**  
   Ensure you have Docker and Docker Compose installed on your system.

2. **Starting the Services:**  
   In the project root directory (where your `docker-compose.yml` file is located), run:

   ```bash
   docker-compose up --build
   
## Overview

- **`cmd/`**: Contains the entry points (executables) for different services.
- **`pkg/`**: Contains shared libraries and reusable code that can be imported across the project.

---

## `cmd/` Directory

- **Purpose:**  
  Houses application entry points. Each subdirectory here represents a separate service (e.g., API, Worker).

- **Structure & Contents:**  
  - **`cmd/api/`**  
    - Contains the `main.go` for the RESTful API (using Gin).
    - Has its own `go.mod` file to manage dependencies independently.
  - **`cmd/worker/`**  
    - Contains the `main.go` for the background worker service.
    - Also maintains its own `go.mod` file.

- **Benefits:**  
  - **Separation of Concerns:** Each service's startup logic is isolated.
  - **Modularity:** Makes building, testing, and deploying individual services easier.

---

## `pkg/` Directory

- **Purpose:**  
  Contains shared packages and libraries that are used by one or more services.

- **Structure & Contents:**  
  - **`pkg/auth/`**: Handles Google OAuth and authentication utilities.
  - **`pkg/db/`**: Manages database connections and models.
  - **`pkg/mq/`**: Contains RabbitMQ connection utilities and message handling code.
  - **`pkg/imageproc/`**: Core image processing logic shared between services.

- **Benefits:**  
  - **Reusability:** Shared code can be used across multiple services, reducing duplication.
  - **Testability:** Libraries without entry point code are easier to test in isolation.
  - **Organization:** Keeps business logic separate from application-specific code.

---

## How They Work Together

- **Collaboration:**  
  Executable services in `cmd/` import and utilize functionality from shared packages in `pkg/`. For example, the API service uses `pkg/auth` for authentication and `pkg/db` for database interactions, while the worker service leverages `pkg/mq` for message queuing and `pkg/imageproc` for processing images.

- **Scalability:**  
  This structure allows for adding new executables (like CLI tools or additional services) in `cmd/` without impacting the core business logic stored in `pkg/`.

---

This structure follows common Go community practices and is inspired by well-known project layout patterns. It helps keep the code modular, scalable, and easy to navigate, making it ideal for growing projects like GophicProcessor.

## Docker Compose Configuration

The docker-compose file orchestrates four main services:

- **db:**  
  Uses the official PostgreSQL 13 image. It creates a database using environment variables (`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`) and persists data with a named volume (`db_data`).

- **rabbitmq:**  
  Runs RabbitMQ with the management plugin enabled, exposing ports 5672 (for AMQP) and 15672 (for the management UI). It uses environment variables for default user credentials.

- **api:**  
  Builds the API service from the `./cmd/api` directory using its Dockerfile. It depends on the `db` and `rabbitmq` services and sets environment variables for database connectivity, RabbitMQ, and Google OAuth credentials.

- **worker:**  
  Builds the worker service from the `./cmd/worker` directory using its Dockerfile. Like the API, it depends on the `db` and `rabbitmq` services and shares the same environment configuration for accessing the database and message queue.

All services are connected via a custom bridge network (`gophic-network`), ensuring they can communicate seamlessly. This setup allows you to easily develop and run a microservices architecture with consistent environments and persistent data.
