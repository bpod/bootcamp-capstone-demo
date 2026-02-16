---
name: Document API
description: Generate API documentation for endpoints and services
agent: agent
tools: ["readonly"]
---

# Document API

Generate comprehensive API documentation for REST APIs, GraphQL schemas, or service interfaces.

## Documentation Elements

1. **Endpoint Overview**: Purpose and functionality
2. **Request Format**: Methods, URLs, parameters, body
3. **Response Format**: Success and error responses
4. **Authentication**: Required auth headers or tokens
5. **Examples**: Realistic request/response examples
6. **Error Codes**: All possible error responses

## REST API Documentation Template

**Endpoint:** `POST /api/users`

**Description:** Create a new user account

**Authentication:** Required (Bearer token)

**Request:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response (201 Created):**

```json
{
  "id": "usr_abc123",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2026-02-12T08:00:00Z"
}
```

**Errors:**

- `400 Bad Request`: Invalid email or password format
- `409 Conflict`: Email already registered
- `500 Internal Server Error`: Server error

## GraphQL Documentation

For GraphQL schemas, document:

- Queries and their arguments
- Mutations and their inputs
- Types and their fields
- Examples with actual queries

## Output Format

Generate documentation that includes:

1. **API Overview**: What the API does
2. **Base URL**: Production and development endpoints
3. **Authentication**: How to authenticate requests
4. **Endpoints/Queries**: Detailed documentation for each
5. **Data Models**: Type definitions and schemas
6. **Rate Limiting**: If applicable
7. **Changelog**: API version and changes

Use OpenAPI/Swagger format when possible for REST APIs.
