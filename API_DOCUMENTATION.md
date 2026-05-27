# Personal Spendwise API Documentation

Base URL:

```text
http://your-domain.com/api
```

Local development URL:

```text
http://127.0.0.1:8000/api
```

All protected endpoints require these headers:

```http
Accept: application/json
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN
```

## Authentication

### Login

```http
POST /api/v1/auth/login
```

Request body:

```json
{
  "email": "user@example.com",
  "password": "password",
  "device_name": "iPhone"
}
```

Validation:

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| email | Yes | string | Must be a valid email address. |
| password | Yes | string | User password. |
| device_name | No | string | Maximum 255 characters. Used as the Sanctum token name. |

Success response:

```json
{
  "token": "1|plain-text-token",
  "token_type": "Bearer",
  "user": {
    "id": 1,
    "name": "User Name",
    "email": "user@example.com"
  }
}
```

Mobile example:

```js
const response = await fetch(`${API_URL}/v1/auth/login`, {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email,
    password,
    device_name: 'mobile-app',
  }),
});

const data = await response.json();

// Store data.token securely and send it as a Bearer token.
```

### Logout

```http
POST /api/v1/auth/logout
```

Requires authentication.

Success response:

```http
204 No Content
```

Mobile example:

```js
await fetch(`${API_URL}/v1/auth/logout`, {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  },
});

// Remove the token from secure storage after a successful response.
```

## Current User

```http
GET /api/user
```

Requires authentication.

Success response:

```json
{
  "id": 1,
  "name": "User Name",
  "email": "user@example.com"
}
```

## Categories

### List Categories

```http
GET /api/v1/categories
```

Requires authentication. Returns paginated data, 10 records per page.

### Create Category

```http
POST /api/v1/categories
```

Request body:

```json
{
  "name": "Food",
  "slug": "food",
  "icon": "utensils",
  "color": "#22c55e"
}
```

Validation:

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| name | Yes | string | Maximum 255 characters. |
| slug | No | string | Maximum 255 characters. Must be unique. Generated from `name` if empty. |
| icon | No | string | Maximum 255 characters. |
| color | No | string | Maximum 32 characters. |

Response item:

```json
{
  "id": 1,
  "name": "Food",
  "slug": "food",
  "icon": "utensils",
  "color": "#22c55e",
  "created_at": "2026-05-20T00:00:00.000000Z",
  "updated_at": "2026-05-20T00:00:00.000000Z"
}
```

Other category endpoints:

```text
GET    /api/v1/categories/{id}
PUT    /api/v1/categories/{id}
PATCH  /api/v1/categories/{id}
DELETE /api/v1/categories/{id}
```

## Budgets

### List Budgets

```http
GET /api/v1/budgets
```

Requires authentication. Returns paginated data, 10 records per page, ordered by latest date.

### Create Budget

```http
POST /api/v1/budgets
```

Request body:

```json
{
  "category_id": 1,
  "amount": 250.0,
  "date": "2026-05-27"
}
```

Validation:

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| category_id | Yes | integer | Must exist in categories. |
| amount | Yes | number | Minimum 0.01. |
| date | Yes | date | Example: `2026-05-27`. |

Response item:

```json
{
  "id": 1,
  "category_id": 1,
  "amount": "250.00",
  "date": "2026-05-27",
  "category": {
    "id": 1,
    "name": "Food",
    "slug": "food",
    "icon": "utensils",
    "color": "#22c55e",
    "created_at": "2026-05-20T00:00:00.000000Z",
    "updated_at": "2026-05-20T00:00:00.000000Z"
  },
  "created_at": "2026-05-20T00:00:00.000000Z",
  "updated_at": "2026-05-20T00:00:00.000000Z"
}
```

Other budget endpoints:

```text
GET    /api/v1/budgets/{id}
PUT    /api/v1/budgets/{id}
PATCH  /api/v1/budgets/{id}
DELETE /api/v1/budgets/{id}
```

## Transactions

### List Transactions

```http
GET /api/v1/transactions
```

Requires authentication. Returns paginated data, 10 records per page, ordered by latest date.

### Create Transaction

```http
POST /api/v1/transactions
```

Request body:

```json
{
  "title": "Lunch",
  "category_id": 1,
  "budget_id": 1,
  "amount": 12.5,
  "description": "Office lunch",
  "type": "expense",
  "date": "2026-05-27"
}
```

Validation:

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| title | Yes | string | Maximum 255 characters. |
| category_id | Yes | integer | Must exist in categories. |
| budget_id | Yes | integer | Must exist in budgets. |
| amount | Yes | number | Minimum 0.01. |
| description | No | string | Nullable. |
| type | Yes | string | Must be `expense` or `income`. |
| date | Yes | date | Example: `2026-05-27`. |

Response item:

```json
{
  "id": 1,
  "title": "Lunch",
  "category_id": 1,
  "budget_id": 1,
  "user_id": 1,
  "amount": "12.50",
  "description": "Office lunch",
  "type": "expense",
  "date": "2026-05-27",
  "category": {},
  "budget": {},
  "user": {
    "id": 1,
    "name": "User Name",
    "email": "user@example.com"
  },
  "created_at": "2026-05-20T00:00:00.000000Z",
  "updated_at": "2026-05-20T00:00:00.000000Z"
}
```

Other transaction endpoints:

```text
GET    /api/v1/transactions/{id}
PUT    /api/v1/transactions/{id}
PATCH  /api/v1/transactions/{id}
DELETE /api/v1/transactions/{id}
```

## Pagination

List endpoints return Laravel paginated JSON:

```json
{
  "data": [],
  "links": {},
  "meta": {}
}
```

Use the `page` query parameter:

```http
GET /api/v1/transactions?page=2
```

## Common Status Codes

| Status | Meaning |
| --- | --- |
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 401 | Unauthenticated |
| 404 | Not Found |
| 422 | Validation Error |

## Notes for Mobile Integration

- Store the login token in secure storage.
- Send the token on every protected request as `Authorization: Bearer YOUR_TOKEN`.
- Call logout before deleting the local token so the server token is revoked.
- The current API includes login, logout, current user, categories, budgets, and transactions.
- There is no API registration endpoint currently.
