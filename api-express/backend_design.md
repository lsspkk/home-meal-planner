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

---

This design ensures a simple, secure, and easily deployable backend for the Home Meal Planner app, with minimal dependencies and straightforward file-based storage.
