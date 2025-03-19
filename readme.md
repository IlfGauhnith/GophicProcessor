# GophicProcessor Project Structure

This project uses a monorepo with a multi-module approach, organized into two main directories: **`cmd/`** and **`pkg/`**.

## Overview

- **`cmd/`**: Contains the entry points (executables) for different services.
- **`pkg/`**: Contains shared libraries and reusable code that can be imported across the project.

---

## `cmd/` Directory

- **Purpose:**  
  Houses application entry points. Each subdirectory here represents a separate service (e.g., API, Worker).

- **Structure & Contents:**  
  - **`cmd/api/`**  
    - Contains the `main.go` for the RESTful API (using Gin or Echo).
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
