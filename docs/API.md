# API Documentation - Amanah Digital

## Base URL
```
Development: http://localhost:5000/api
Production: https://api.amanahdigital.com/api
```

## Authentication

Semua endpoint yang memerlukan autentikasi menggunakan JWT token yang dapat dikirim melalui:
1. **Authorization Header**: `Bearer <token>`
2. **Cookie**: `token=<jwt_token>`

## Response Format

Semua response menggunakan format JSON standar:

### Success Response
```json
{
  "success": true,
  "data": {
    // response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description"
  }
}
```

## Endpoints

### Authentication

#### POST /auth/register
Mendaftarkan user baru ke sistem.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "user",
      "is_verified": false
    }
  }
}
```

**Error Responses:**
- `400`: Validation error (email sudah terdaftar, password terlalu lemah)
- `500`: Server error

#### POST /auth/login
Login user dengan email dan password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "user"
    }
  }
}
```

**Error Responses:**
- `400`: Invalid credentials
- `401`: Email atau password salah
- `500`: Server error

#### POST /auth/logout
Logout user dan invalidate token.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

#### GET /auth/me
Mendapatkan informasi user yang sedang login.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "user",
      "created_at": "2024-12-19T10:00:00Z"
    }
  }
}
```

**Error Responses:**
- `401`: Token tidak valid atau expired
- `404`: User tidak ditemukan

## Rate Limiting

- **General API**: 100 requests per 15 menit per IP
- **Auth endpoints**: 5 requests per menit per IP (untuk login/register)

## Security Headers

Semua response menyertakan security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security` (HTTPS only)

## Error Codes

| Code | Description |
|------|-------------|
| 400  | Bad Request - Invalid input |
| 401  | Unauthorized - Invalid or missing token |
| 403  | Forbidden - Insufficient permissions |
| 404  | Not Found - Resource tidak ditemukan |
| 429  | Too Many Requests - Rate limit exceeded |
| 500  | Internal Server Error |

## Development Notes

### Testing dengan cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","first_name":"Test","last_name":"User"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Get Profile:**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

*Dokumentasi ini akan diupdate seiring dengan penambahan endpoint baru.*