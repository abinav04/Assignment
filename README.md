# User Management REST API

A simple REST API for managing users. Built with Node.js, Express, and MongoDB.

## Quick Start

```bash
git clone <your-repo>
cd Assignment
npm install
cp .env.example .env
npm run dev
```

Add your MongoDB URI to `.env`. Server runs at `http://localhost:5000`

## What You Need

- Node.js v14+
- MongoDB Atlas account (free tier)
- Git
- Postman or curl

## API Endpoints

**Base URL:** `http://localhost:5000/api/users`

### Get All Users

```bash
curl http://localhost:5000/api/users
```

### Get One User

```bash
curl http://localhost:5000/api/users/{userId}
```

### Create a User

```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","phone":"+1-555-0123","company":"Tech Inc"}'
```

Name and email are required. Email must be unique.

### Update a User

```bash
curl -X PUT http://localhost:5000/api/users/{userId} \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane"}'
```

Only send fields you're changing.

### Delete a User

```bash
curl -X DELETE http://localhost:5000/api/users/{userId}
```

## Code Layout

- **index.js** - Entry point. Starts the server.
- **src/app.js** - Express setup and middleware.
- **src/config/db.js** - MongoDB connection.
- **src/models/User.js** - Data schema.
- **src/routes/userRoutes.js** - URL routing.
- **src/controllers/userController.js** - Business logic with error handling (try-catch blocks).

## User Data

```javascript
{
  name: String (required),
  email: String (required, unique),
  phone: String (optional),
  company: String (optional),
  address: {
    city: String,
    zipcode: String,
    geo: { lat, lng }
  },
  createdAt: Date (automatic),
  updatedAt: Date (automatic)
}
```

## Errors

The API handles errors gracefully with proper status codes:

- **400** - Bad input (missing fields, invalid format, invalid ID)
- **404** - User not found
- **409** - Email already exists
- **500** - Server error

Every endpoint has try-catch blocks. If something fails, you get a meaningful error message instead of a crash.

## How It Works

When a request comes in, it goes through CORS → JSON parsing → routing → controller logic → database → response.

If anything breaks, try-catch catches it and returns a proper error code.

## REST Standards

- URLs are resources: `/api/users`, `/api/users/:id`
- HTTP methods matter: GET reads, POST creates, PUT updates, DELETE removes
- Proper status codes tell you what happened
- Everything is JSON

## Setup

Get your MongoDB connection string from MongoDB Atlas:

1. Create a cluster
2. Click "Connect" → copy connection string
3. Paste in `.env`

```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
```

## Testing

### Using Postman

1. **Download Postman** from https://www.postman.com/downloads/
2. **Create a new Collection** called "User API"

#### GET All Users

- **Method:** GET
- **URL:** http://localhost:5000/api/users
- **Headers:** None needed
- Click **Send**

#### GET One User

- **Method:** GET
- **URL:** http://localhost:5000/api/users/{userId}
- Replace `{userId}` with a real user ID from the database
- Click **Send**

#### POST Create User

- **Method:** POST
- **URL:** http://localhost:5000/api/users
- **Headers:** Set `Content-Type: application/json`
- **Body:** Go to Body tab → select "raw" → paste JSON:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-555-0123",
  "company": "Tech Inc",
  "address": {
    "city": "New York",
    "zipcode": "10001",
    "geo": {
      "lat": "40.7128",
      "lng": "-74.0060"
    }
  }
}
```

- Click **Send** → you'll get the user with an `_id`

#### PUT Update User

- **Method:** PUT
- **URL:** http://localhost:5000/api/users/{userId}
- Replace `{userId}` with the ID from previous response
- **Headers:** Set `Content-Type: application/json`
- **Body:** Only send fields you want to change:

```json
{
  "name": "Jane Doe",
  "company": "Updated Company"
}
```

- Click **Send**

#### DELETE User

- **Method:** DELETE
- **URL:** http://localhost:5000/api/users/{userId}
- Replace `{userId}` with the ID
- Click **Send** → returns 204 (success)

### Error Tests in Postman

**Test Missing Email:**

- POST to `http://localhost:5000/api/users`
- Body: `{"name":"John"}` (no email)
- Get **400** error

**Test Duplicate Email:**

- POST same email twice
- Second request gets **409** error

**Test Invalid ID:**

- GET `http://localhost:5000/api/users/invalidid`
- Get **400** error (invalid ID format)

**Test User Not Found:**

- GET `http://localhost:5000/api/users/65a1b2c3d4e5f6g7h8i9j0k0`
- Get **404** error


