# Backend Setup Guide

## Overview
This document provides guidance for implementing the backend API for the School Equipment Loan Management System.

## Technology Stack Options

### Option 1: Node.js with Express
```bash
npm init -y
npm install express cors dotenv bcryptjs jsonwebtoken mongoose
npm install --save-dev nodemon @types/node @types/express
```

### Option 2: Spring Boot
```xml
<!-- Add to pom.xml -->
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
</dependencies>
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('student', 'staff', 'admin') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Equipment Table
```sql
CREATE TABLE equipment (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    condition ENUM('excellent', 'good', 'fair') NOT NULL,
    quantity INT NOT NULL,
    available INT NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Borrow Requests Table
```sql
CREATE TABLE borrow_requests (
    id VARCHAR(36) PRIMARY KEY,
    equipment_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'returned') NOT NULL DEFAULT 'pending',
    quantity INT NOT NULL,
    notes TEXT,
    request_date TIMESTAMP NOT NULL,
    approved_date TIMESTAMP NULL,
    return_date TIMESTAMP NULL,
    approved_by VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (equipment_id) REFERENCES equipment(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Docker Commands

### Build the Docker image
```bash
docker build -t school-equipment-api .
```

### Run the container
```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="your-database-url" \
  -e JWT_SECRET="your-secret-key" \
  school-equipment-api
```

### Run with docker-compose
Create a `docker-compose.yml`:
```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/schoolequipment
      - JWT_SECRET=your-secret-key
    depends_on:
      - db
  
  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=schoolequipment
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Then run:
```bash
docker-compose up -d
```

## API Documentation

The OpenAPI specification is provided in `openapi.yaml`. You can:

1. **View in Swagger UI**: Upload the file to https://editor.swagger.io
2. **Generate API docs**: Use tools like Redoc or Swagger UI
3. **Generate client SDKs**: Use OpenAPI Generator

## Key Implementation Requirements

### 1. Authentication & Authorization
- Implement JWT-based authentication
- Hash passwords using bcrypt
- Validate roles for protected endpoints
- Token expiration: 24 hours recommended

### 2. Business Logic
- **Availability Check**: When approving a request, reduce equipment.available
- **Quantity Validation**: Prevent borrowing more than available
- **Concurrent Requests**: Handle race conditions when multiple users request same equipment
- **Status Transitions**: Only allow valid state changes (pending → approved/rejected, approved → returned)

### 3. Security
- Enable CORS with frontend origin
- Sanitize user inputs
- Use parameterized queries to prevent SQL injection
- Rate limiting on auth endpoints
- Validate JWT on protected routes

### 4. Error Handling
- Return consistent error format (see openapi.yaml)
- Proper HTTP status codes
- Detailed error messages for development, generic for production

### 5. Testing
```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# API tests using curl
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@school.com","password":"password123"}'
```

## Environment Variables
Create a `.env` file:
```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/schoolequipment
JWT_SECRET=your-very-secure-secret-key-change-this
JWT_EXPIRES_IN=24h
NODE_ENV=development
CORS_ORIGIN=http://localhost:8080
```

## Connecting to Frontend

The frontend expects:
- Base URL: `http://localhost:3000/api/v1`
- JWT token in Authorization header: `Bearer <token>`
- JSON request/response format

Update frontend API calls in a new file `src/lib/api.ts`:
```typescript
const API_BASE = 'http://localhost:3000/api/v1';

export const apiClient = {
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  },
  // Add more API methods...
};
```

## Next Steps

1. Review the OpenAPI spec (`openapi.yaml`)
2. Set up your backend project structure
3. Implement the database schema
4. Create API endpoints following the specification
5. Test using Postman or curl
6. Build Docker image and deploy
7. Update frontend to use real API instead of mock data

For questions or clarification, refer to the OpenAPI documentation.
