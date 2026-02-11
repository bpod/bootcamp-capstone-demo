---
name: document-api
description: Generate comprehensive API endpoint documentation with request/response schemas, authentication, error codes, and usage examples
---

Generate API documentation for ${selection} or ${file} following OpenAPI/Swagger conventions.

**Workflow:**

1. **Analyze**: Extract HTTP method, endpoint, parameters, authentication
2. **Schema**: Document request/response body with types
3. **Examples**: Provide curl and JavaScript fetch examples
4. **Errors**: List possible error codes and meanings

**Documentation Structure**:

- **Endpoint**: Method + path
- **Description**: What it does
- **Authentication**: Required tokens/keys
- **Parameters**: Query, path, body params with types
- **Request Example**: curl + fetch
- **Response Example**: Success + error cases
- **Status Codes**: 200, 400, 401, 404, 500 meanings

**Format**: Markdown compatible with API docs generators (OpenAPI, Swagger, Postman)

Provide complete, copy-pasteable examples. 2. **URL Path** - Route with parameters 3. **Authentication** - Required headers, tokens 4. **Request Body** - Shape and validation rules 5. **Query Parameters** - Filtering, pagination, sorting 6. **Response Format** - Success and error responses 7. **Status Codes** - All possible HTTP status codes 8. **Rate Limiting** - Request limits per time period

**Example Endpoint to Document:**

```typescript
// POST /api/users
// Create new user account

interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: "user" | "admin";
}

interface CreateUserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
}
```

---

### Step 2: Document Endpoint Overview

**Endpoint Header:**

```markdown
## Create User

Creates a new user account with the provided information.

**Endpoint:** `POST /api/users`

**Authentication:** Required (API Key or Bearer Token)

**Rate Limit:** 10 requests per minute

**Description:**

Creates a new user account in the system. Performs email validation and password strength checking. Sends welcome email to the provided address.

**Use Cases:**

- User registration flow
- Admin creating user accounts
- Bulk user import (with appropriate rate limiting)

**Requirements:**

- Email must be unique (returns 409 if exists)
- Password must be at least 8 characters
- First and last name must not be empty
```

---

### Step 3: Document Authentication

**Authentication Section:**

````markdown
### Authentication

This endpoint requires authentication via one of the following methods:

#### Bearer Token (Recommended)

Include JWT token in Authorization header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
````

**How to get token:**

```bash
# Login to get token
curl -X POST https://api.example.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret"}'

# Response includes token
{
  "token": "eyJhbGciOi...",
  "expiresIn": 3600
}
```

#### API Key (Alternative)

Include API key in header:

```http
X-API-Key: sk_live_1234567890abcdef
```

**How to get API key:**

1. Log in to dashboard at https://dashboard.example.com
2. Navigate to Settings → API Keys
3. Click "Create New Key"
4. Copy key (shown only once!)

**Security Notes:**

- ⚠️ Never commit API keys to version control
- ⚠️ Use environment variables to store keys
- ⚠️ Regenerate keys if compromised
- ⚠️ Use different keys for dev/staging/production

````

***

### Step 4: Document Request Format

**Request Schema:**

```markdown
### Request

#### Headers

| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `Authorization` | string | Yes | Bearer token or API key |
| `Content-Type` | string | Yes | Must be `application/json` |
| `X-Request-ID` | string | No | Unique request identifier for tracing |

#### Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | Yes | User email address (must be valid email format) |
| `password` | string | Yes | User password (min 8 characters, must include uppercase, lowercase, number) |
| `firstName` | string | Yes | User first name (1-50 characters) |
| `lastName` | string | Yes | User last name (1-50 characters) |
| `role` | string | No | User role: `'user'` or `'admin'` (default: `'user'`) |

#### Request Schema (TypeScript)

```typescript
interface CreateUserRequest {
  email: string;           // Valid email format
  password: string;        // Min 8 chars, mixed case + number
  firstName: string;       // 1-50 characters
  lastName: string;        // 1-50 characters
  role?: 'user' | 'admin'; // Default: 'user'
}
````

#### JSON Schema

```json
{
  "type": "object",
  "required": ["email", "password", "firstName", "lastName"],
  "properties": {
    "email": {
      "type": "string",
      "format": "email",
      "maxLength": 255
    },
    "password": {
      "type": "string",
      "minLength": 8,
      "maxLength": 100,
      "pattern": "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$"
    },
    "firstName": {
      "type": "string",
      "minLength": 1,
      "maxLength": 50
    },
    "lastName": {
      "type": "string",
      "minLength": 1,
      "maxLength": 50
    },
    "role": {
      "type": "string",
      "enum": ["user", "admin"],
      "default": "user"
    }
  }
}
```

#### Validation Rules

- **Email:**
  - Must be valid email format
  - Must be unique (checked server-side)
  - Case-insensitive (normalized to lowercase)
  - Max 255 characters

- **Password:**
  - Minimum 8 characters
  - Must contain: uppercase, lowercase, number
  - Special characters allowed but not required
  - Not stored in plain text (bcrypt hashed)

- **Name Fields:**
  - Cannot be empty or whitespace-only
  - Trimmed automatically
  - Special characters allowed
  - Max 50 characters each

````

***

### Step 5: Document Response Format

**Response Schema:**

```markdown
### Response

#### Success Response (201 Created)

```json
{
  "id": "usr_1a2b3c4d5e6f",
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "user",
  "createdAt": "2026-02-10T12:00:00.000Z",
  "emailVerified": false,
  "profile": {
    "avatarUrl": null,
    "bio": null
  }
}
````

#### Response Schema (TypeScript)

```typescript
interface CreateUserResponse {
  id: string; // Unique user ID (format: usr_xxxxxxxxxxxx)
  email: string; // User email (normalized to lowercase)
  firstName: string; // User first name
  lastName: string; // User last name
  role: "user" | "admin"; // User role
  createdAt: string; // ISO 8601 timestamp
  emailVerified: boolean; // Email verification status
  profile: {
    avatarUrl: string | null; // Profile picture URL
    bio: string | null; // User bio
  };
}
```

#### Response Fields

| Field               | Type         | Description                           |
| ------------------- | ------------ | ------------------------------------- |
| `id`                | string       | Unique user identifier (immutable)    |
| `email`             | string       | User email (normalized to lowercase)  |
| `firstName`         | string       | User first name                       |
| `lastName`          | string       | User last name                        |
| `role`              | string       | User role (`'user'` or `'admin'`)     |
| `createdAt`         | string       | Account creation timestamp (ISO 8601) |
| `emailVerified`     | boolean      | Whether email has been verified       |
| `profile.avatarUrl` | string\|null | Profile picture URL (null if not set) |
| `profile.bio`       | string\|null | User bio (null if not set)            |

**Note:** Password is never returned in responses for security.

````

***

### Step 6: Document Error Responses

**Error Scenarios:**

```markdown
### Error Responses

#### 400 Bad Request

Invalid request body or validation failure.

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      {
        "field": "email",
        "message": "Must be a valid email address"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters and include uppercase, lowercase, and number"
      }
    ]
  }
}
````

**Possible validation errors:**

- Email format invalid
- Password too weak
- Required fields missing
- Field values too long
- Invalid role value

#### 401 Unauthorized

Missing or invalid authentication credentials.

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

**Causes:**

- No Authorization header provided
- Invalid or expired token
- API key not found or disabled

#### 403 Forbidden

Authenticated but insufficient permissions.

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient permissions to create admin users"
  }
}
```

**Causes:**

- User trying to create admin account without admin role
- API key doesn't have user creation permission

#### 409 Conflict

Email address already exists in system.

```json
{
  "error": {
    "code": "DUPLICATE_EMAIL",
    "message": "A user with this email address already exists",
    "details": {
      "email": "john.doe@example.com"
    }
  }
}
```

#### 429 Too Many Requests

Rate limit exceeded.

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again in 60 seconds.",
    "retryAfter": 60
  }
}
```

**Rate Limits:**

- 10 requests per minute per IP address
- 100 requests per hour per API key

#### 500 Internal Server Error

Server error (should be rare).

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred",
    "requestId": "req_abc123def456"
  }
}
```

**If you encounter 500 errors:**

1. Check server status at https://status.example.com
2. Retry with exponential backoff
3. Contact support with requestId if persistent

### Error Response Schema (TypeScript)

```typescript
interface ErrorResponse {
  error: {
    code: string; // Error code (see table below)
    message: string; // Human-readable error message
    details?: any; // Additional error context
    requestId?: string; // Request ID for support
    retryAfter?: number; // Seconds to wait before retry (rate limiting)
  };
}
```

### Error Codes

| Code                  | HTTP Status | Description               |
| --------------------- | ----------- | ------------------------- |
| `VALIDATION_ERROR`    | 400         | Request validation failed |
| `UNAUTHORIZED`        | 401         | Authentication required   |
| `FORBIDDEN`           | 403         | Insufficient permissions  |
| `DUPLICATE_EMAIL`     | 409         | Email already exists      |
| `RATE_LIMIT_EXCEEDED` | 429         | Too many requests         |
| `INTERNAL_ERROR`      | 500         | Server error              |

````

***

### Step 7: Provide Code Examples

**Usage Examples in Multiple Languages:**

```markdown
### Code Examples

#### JavaScript/TypeScript (fetch)

```typescript
async function createUser(userData: CreateUserRequest): Promise<CreateUserResponse> {
  const response = await fetch('https://api.example.com/api/users', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`API Error: ${error.error.message}`);
  }

  return response.json();
}

// Usage
try {
  const newUser = await createUser({
    email: 'john.doe@example.com',
    password: 'SecurePass123',
    firstName: 'John',
    lastName: 'Doe',
  });
  console.log('User created:', newUser.id);
} catch (error) {
  console.error('Failed to create user:', error);
}
````

#### JavaScript (axios)

```javascript
const axios = require("axios");

async function createUser(userData) {
  try {
    const response = await axios.post(
      "https://api.example.com/api/users",
      userData,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_TOKEN}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with error status
      console.error("API Error:", error.response.data.error);
    } else {
      // Network error
      console.error("Network Error:", error.message);
    }
    throw error;
  }
}
```

#### cURL

```bash
curl -X POST https://api.example.com/api/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }'
```

#### Python (requests)

```python
import requests
import os

def create_user(user_data):
    url = "https://api.example.com/api/users"
    headers = {
        "Authorization": f"Bearer {os.environ['API_TOKEN']}",
        "Content-Type": "application/json"
    }

    response = requests.post(url, json=user_data, headers=headers)

    if response.ok:
        return response.json()
    else:
        error = response.json()
        raise Exception(f"API Error: {error['error']['message']}")

# Usage
try:
    new_user = create_user({
        "email": "john.doe@example.com",
        "password": "SecurePass123",
        "firstName": "John",
        "lastName": "Doe"
    })
    print(f"User created: {new_user['id']}")
except Exception as e:
    print(f"Error: {e}")
```

#### Error Handling Example

```typescript
async function createUserWithRetry(
  userData: CreateUserRequest,
  maxRetries = 3,
): Promise<CreateUserResponse> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch("https://api.example.com/api/users", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.status === 429) {
        // Rate limited - wait and retry
        const retryAfter = parseInt(
          response.headers.get("Retry-After") || "60",
        );
        console.log(`Rate limited. Retrying after ${retryAfter}s...`);
        await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
        continue;
      }

      if (response.status === 409) {
        // Duplicate email - don't retry
        const error = await response.json();
        throw new Error(`Email already exists: ${error.error.details.email}`);
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          `API Error (${response.status}): ${error.error.message}`,
        );
      }

      return response.json();
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      console.log(`Attempt ${attempt + 1} failed, retrying...`);
      await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }

  throw new Error("Max retries exceeded");
}
```

````

***

### Step 8: Document Related Endpoints

**Related Operations:**

```markdown
### Related Endpoints

#### List Users

`GET /api/users`

Retrieve paginated list of users.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20, max: 100)
- `role` (string): Filter by role (`'user'` or `'admin'`)
- `sort` (string): Sort field (`'createdAt'`, `'email'`, `'lastName'`)
- `order` (string): Sort order (`'asc'` or `'desc'`)

**Example:**
```bash
GET /api/users?page=1&limit=20&role=user&sort=createdAt&order=desc
````

**See:** [List Users Documentation](#list-users)

---

#### Get User by ID

`GET /api/users/:id`

Retrieve single user by ID.

**Example:**

```bash
GET /api/users/usr_1a2b3c4d5e6f
```

**See:** [Get User Documentation](#get-user)

---

#### Update User

`PATCH /api/users/:id`

Update user information (partial update).

**Supports updating:** email, firstName, lastName, profile

**Example:**

```bash
PATCH /api/users/usr_1a2b3c4d5e6f
{
  "firstName": "Jane",
  "profile": {
    "bio": "Software Engineer"
  }
}
```

**See:** [Update User Documentation](#update-user)

---

#### Delete User

`DELETE /api/users/:id`

Soft delete user account (can be restored within 30 days).

**Example:**

```bash
DELETE /api/users/usr_1a2b3c4d5e6f
```

**See:** [Delete User Documentation](#delete-user)

````

***

## Documentation Templates

### Template 1: GET Endpoint

```markdown
## [Endpoint Name]

[Brief description]

**Endpoint:** `GET /api/resource`

**Authentication:** Required/Optional

### Request

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `param1` | string | Yes | Description |

### Response

#### Success (200 OK)

\`\`\`json
{
  "data": []
}
\`\`\`

### Code Example

\`\`\`typescript
const response = await fetch('/api/resource');
const data = await response.json();
\`\`\`
````

### Template 2: POST Endpoint

```markdown
## [Endpoint Name]

[Brief description]

**Endpoint:** `POST /api/resource`

**Authentication:** Required

### Request

#### Body Parameters

| Parameter | Type   | Required | Description |
| --------- | ------ | -------- | ----------- |
| `field1`  | string | Yes      | Description |

### Response

#### Success (201 Created)

\`\`\`json
{
"id": "123",
"field1": "value"
}
\`\`\`

### Errors

- **400**: Validation error
- **409**: Resource already exists

### Code Example

\`\`\`typescript
const response = await fetch('/api/resource', {
method: 'POST',
body: JSON.stringify(data)
});
\`\`\`
```

---

## Variables

- `${selection}` - Selected API code (optional)
- `${file}` - API route file path (optional)
- `${workspaceFolder}` - Project root directory

---

## Success Criteria

After running this prompt:

✅ Endpoint purpose clearly explained  
✅ Authentication requirements documented  
✅ Request format specified with validation rules  
✅ Response format documented with all fields  
✅ All error responses documented with codes  
✅ Code examples provided in multiple languages  
✅ Rate limits and constraints specified  
✅ Related endpoints linked for discoverability

---

## Example Usage

**Document Existing API Endpoint:**

```
@workspace /document-api

[Select API route code or provide file path]
```

**For Specific Endpoint:**

```
Document the POST /api/users endpoint from src/routes/users.ts
```

**Generate OpenAPI Specification:**

```
Generate OpenAPI 3.0 spec for all user management endpoints
```

---

## Follow-up Actions

After generating API documentation:

1. **Validate Against Implementation** - Ensure docs match actual behavior
2. **Generate OpenAPI Spec** - Create swagger.json/yaml
3. **Set Up API Playground** - Integrate with Swagger UI or Postman
4. **Add to Developer Portal** - Publish to documentation site
5. **Create Postman Collection** - Import/export for testing
6. **Update Client SDKs** - Regenerate if using code generation

---

## API Documentation Tools

### OpenAPI/Swagger

```bash
# Generate OpenAPI spec from documentation
npx swagger-jsdoc -d swaggerDef.js routes/**/*.js -o swagger.json

# Serve Swagger UI
npx swagger-ui-express
```

### Postman

```bash
# Export OpenAPI to Postman collection
# https://www.postman.com/collection/

# Run collection tests
newman run collection.json
```

### API Testing

```bash
# Test endpoints
npm run test:api

# Generate API coverage report
npx @openapitools/openapi-generator-cli validate -i swagger.json
```

---

## References

- [OpenAPI Specification](https://swagger.io/specification/)
- [REST API Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [JSON Schema](https://json-schema.org/)
- [API Design Guidelines](https://github.com/microsoft/api-guidelines)
