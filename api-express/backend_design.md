# Backend Design: Minimal Express.js API for Home Meal Planner

## Overview

This backend provides user authentication and simple data storage for recipes and weekly menus, using file-based storage and basic authentication. It is designed to be run in Docker, with persistent data stored in a `data/` directory mounted as a Docker volume.

## Features

- User management with password hashing (users stored in `users.json`)
- Scripts to add users and change passwords
- Endpoints for user authentication and password reset
- Endpoints for loading/saving recipes and weekly menus (per user)
- File-based storage for user data (e.g., `uuid-recipes.json`, `uuid-weeklymenus.json`)
- Configurable file size limits and rate limiting (per minute, hour, day)
- All endpoints require Basic Auth (username:password)
- Rate limiting tracked in memory per account id

## Data Storage

- All data files are stored in the `data/` directory (outside Docker container via volume)
- `users.json`: Stores user records (uuid, username, password hash)
- `uuid-recipes.json`: Stores recipes for a user
- `uuid-weeklymenus.json`: Stores weekly menus for a user

## Data Consistency

The backend implements a timestamp-based optimistic concurrency control mechanism to prevent data loss from concurrent modifications:

### Timestamp Mechanism

- Each data file (`uuid-recipes.json`, `uuid-weeklymenus.json`) includes a `lastModified` timestamp field
- When data is retrieved via GET endpoints, the current timestamp is included in the response
- When data is updated via POST endpoints, the client must include the `lastModified` timestamp from their last fetch

### Conflict Detection

- Before saving, the backend compares the incoming `lastModified` timestamp with the current file's timestamp
- If the incoming timestamp is older than the file's current timestamp, it indicates another client has modified the data
- In this case, the backend responds with a 409 Conflict status and JSON error message:

  ```json
  {
    "error": "Data has been modified by another client",
    "message": "Please reload the data before saving to avoid overwriting recent changes",
    "code": "STALE_DATA"
  }
  ```

### Update Process

1. Client fetches data with GET request, receives data + `lastModified` timestamp
2. Client modifies data locally
3. Client sends POST request with modified data + original `lastModified` timestamp
4. Backend validates timestamp and either:
   - Saves data and updates `lastModified` to current time (success)
   - Returns 409 error if timestamp indicates stale data (conflict)

This ensures data integrity without complex locking mechanisms while providing clear feedback to clients about concurrent modifications.

## User Management

- **Add User Script**: Adds a new user with a unique username and hashed password
- **Change Password Script**: Changes password for an existing user
- Both scripts operate on `users.json`

## API Endpoints

- `POST /user/<id>/resetpassword`: Authenticated user can change their password
- `GET /user`: Returns user id for authenticated user (via Basic Auth)
- `GET /recipes`: Returns recipes for authenticated user (rate limited)
- `POST /recipes`: Saves recipes for authenticated user (rate limited, file size checked)
- `GET /weekmenus`: Returns weekly menus for authenticated user (rate limited)
- `POST /weekmenus`: Saves weekly menus for authenticated user (rate limited, file size checked)

## Security & Validation

- All endpoints require Basic Auth
- Only allow file operations in `data/` directory
- Check file size before saving (configurable limit)
- Rate limits (per minute, hour, day) are configurable and enforced per user

## Docker & Deployment

- Backend runs in Docker
- `data/` directory is mounted as a Docker volume for persistence
- All scripts and backend code reside in the container, but data is external

## Rate Limiting

- In-memory map tracks API calls per account id
- Configurable limits for per minute, hour, and day
- Applies to all users collectively

## Configuration

- File size limit (bytes)
- Rate limits (per minute, hour, day)
- Data directory path

## CORS Configuration

To securely allow cross-origin requests from your frontend (e.g., `foobar.vercel.app`) to your Dockerized backend (e.g., `foobar.example.com`), configure CORS (Cross-Origin Resource Sharing) in Express using environment variables. This ensures flexibility and keeps sensitive settings out of version control.

### 1. Environment Variable for CORS

- Create a `.env` file (or similar) in your project root (do **not** commit this file to git; add `.env` to `.gitignore`).
- Add a variable for allowed origins, e.g.:

  ```env
  CORS_ORIGIN=https://foobar.vercel.app
  ```

  You can specify multiple origins as a comma-separated list if needed:

  ```env
  CORS_ORIGIN=https://foobar.vercel.app,https://another-frontend.com
  ```

### 2. Express CORS Setup

- Use the [`cors`](https://www.npmjs.com/package/cors) middleware in your Express app.
- Read the allowed origins from the environment variable and configure the middleware accordingly. Example:

  ```js
  // ... existing code ...
  require('dotenv').config()
  const cors = require('cors')

  const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
    : []

  app.use(
    cors({
      origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true)
        if (allowedOrigins.includes(origin)) {
          return callback(null, true)
        } else {
          return callback(new Error('Not allowed by CORS'))
        }
      },
      credentials: true,
    })
  )
  // ... existing code ...
  ```

### 3. Passing Environment Variables to Docker

- When running your backend in Docker, pass the `.env` file to the container:
  - **Docker Compose**: Use the `env_file` option in your `docker-compose.yml`:
    ```yaml
    services:
      backend:
        image: your-backend-image
        env_file:
          - .env
        # ... other config ...
    ```
  - **Docker CLI**: Use the `--env-file` flag:
    ```sh
    docker run --env-file .env your-backend-image
    ```

### 4. Security Notes

- Never commit your `.env` file to version control.
- Only allow trusted frontend origins.
- Review CORS settings before deploying to production.

## Authentication Header Encoding

The frontend encodes the username and password for HTTP Basic Authentication as follows:

- Each of the username and password is first URL-encoded (using `encodeURIComponent`).
- Then, each is base64-encoded separately.
- The resulting header is: `Authorization: Basic <base64(username)>:<base64(password)>`

The backend must decode each part using base64 and then decodeURIComponent to recover the original credentials, including any UTF-8 characters.

This design ensures a simple, secure, and easily deployable backend for the Home Meal Planner app, with minimal dependencies and straightforward file-based storage.
