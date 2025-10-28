# ANS Backend Service

This directory contains the source code for the Agent Network System (ANS) backend service.

## Overview

The backend is a Node.js application built with Express. It provides the core API for the Agent Network System.

As of the current version, it exposes a single, tested endpoint for agent registration:

*   `POST /register`: Allows a new agent to register with the network by submitting a cryptographically signed payload.
*   `GET /lookup`: Allows for querying the network for registered agents.                                                                                                        │
*   `POST /verify`: Allows for programmatic verification of agent claims.                                                                                                        │

## Running the Service

The backend service is designed to be run as a Docker container. The easiest way to run it for local development is by using the `docker-compose.yml` file in the root of the repository.

1.  **Prerequisites:** Ensure you have [Docker](https://www.docker.com/products/docker-desktop/) installed and running.

2.  **From the root of the repository, run:**
    ```bash
    docker-compose up --build
    ```

This command will build the backend Docker image and start the service, along with a local Firestore emulator for database interactions. The service will be available at `http://localhost:8080`.