# A8 M10 — Request/Response — Movimientos y Reportes

### GET `/api/v1/transactions`

#### Request

```
GET /api/v1/transactions?page=1&limit=20&type=income&date_from=2026-01-01&date_to=2026-12-31 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Response 200 OK

```json
{
  "data": [
    {
      "id": 1,
      "type": "income",
      "category": "membership",
      "amount": 50000,
      "description": "Cuota mensual marzo",
      "transaction_date": "2026-03-01"
    },
    {
      "id": 2,
      "type": "expense",
      "category": "materials",
      "amount": 25000,
      "description": "Material para Festival",
      "transaction_date": "2026-04-08"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

---

### GET `/api/v1/transactions/balance`

#### Request

```
GET /api/v1/transactions/balance?date_from=2026-01-01&date_to=2026-12-31 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Response 200 OK

```json
{
  "data": {
    "balance": 1700000,
    "total_income": 2500000,
    "total_expenses": 800000,
    "date_from": "2026-01-01",
    "date_to": "2026-12-31"
  }
}
```

---

### GET `/api/v1/transactions/monthly`

#### Request

```
GET /api/v1/transactions/monthly?year=2026 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Response 200 OK

```json
{
  "data": [
    {
      "month": 1,
      "income": 200000,
      "expenses": 50000,
      "balance": 150000
    },
    {
      "month": 2,
      "income": 180000,
      "expenses": 70000,
      "balance": 110000
    }
  ]
}
```

---

### GET `/api/v1/reports/general`

#### Request

```
GET /api/v1/reports/general?date_from=2026-01-01&date_to=2026-12-31 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Response 200 OK

```json
{
  "data": {
    "income": {
      "total": 2500000,
      "by_category": [
        { "category": "membership", "amount": 1500000 },
        { "category": "event", "amount": 500000 },
        { "category": "fine", "amount": 300000 },
        { "category": "other", "amount": 200000 }
      ]
    },
    "expenses": {
      "total": 800000,
      "by_category": [
        { "category": "materials", "amount": 300000 },
        { "category": "services", "amount": 250000 },
        { "category": "maintenance", "amount": 150000 },
        { "category": "other", "amount": 100000 }
      ]
    },
    "balance": 1700000,
    "date_from": "2026-01-01",
    "date_to": "2026-12-31"
  }
}
```

---

### GET `/api/v1/reports/events/:eventId`

#### Request

```
GET /api/v1/reports/events/1 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Response 200 OK

```json
{
  "data": {
    "event_id": 1,
    "event_title": "Festival Escolar",
    "date": "2026-04-10",
    "income": {
      "total": 100000,
      "contributions": {
        "count": 30,
        "total": 60000
      },
      "other": 40000
    },
    "expenses": {
      "total": 80000,
      "by_category": [
        { "category": "materials", "amount": 50000 },
        { "category": "services", "amount": 30000 }
      ]
    },
    "balance": 20000,
    "attendance": {
      "total_parents": 45,
      "attended": 35,
      "absent": 10,
      "attendance_rate": "77.8%"
    }
  }
}
```

---

### GET `/api/v1/reports/parent/:parentId`

#### Request

```
GET /api/v1/reports/parent/5?date_from=2026-01-01&date_to=2026-12-31 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Response 200 OK

```json
{
  "data": {
    "parent_id": 5,
    "parent_name": "Carlos López",
    "children": [
      { "id": 1, "name": "Sofía García", "grade": "3ro" }
    ],
    "fines": {
      "total": 15000,
      "paid": 10000,
      "pending": 5000,
      "count": { "total": 3, "paid": 2, "pending": 1 }
    },
    "attendance": {
      "total_events": 8,
      "attended": 7,
      "absent": 1,
      "rate": "87.5%"
    },
    "contributions": {
      "total": 16000,
      "count": 2
    }
  }
}
```
