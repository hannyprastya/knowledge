# {Feature Name} - Technical Specification

> **Created:** {Date}  
> **Author:** @architect  
> **Status:** Draft | Review | Approved  
> **PRD:** `docs/specs/{feature}/PRD.md`

## Overview

<!-- Brief technical summary of the solution -->

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        {Feature Name}                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   [Component 1] ──► [Component 2] ──► [Component 3]             │
│        │                                    │                    │
│        ▼                                    ▼                    │
│   [Database]                          [External Service]        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## API Contracts

### Endpoints

#### `POST /v1/{resource}`

Create a new {resource}.

**Request:**

```json
{
  "field1": "string",
  "field2": 123,
  "nested": {
    "field3": true
  }
}
```

**Response (201):**

```json
{
  "id": "uuid",
  "field1": "string",
  "field2": 123,
  "created_at": "2024-12-20T00:00:00Z"
}
```

**Errors:**

| Code | Description |
|------|-------------|
| 400 | Validation error |
| 401 | Unauthorized |
| 403 | Forbidden |
| 409 | Conflict (duplicate) |

#### `GET /v1/{resource}`

List {resources} with pagination.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | int | 1 | Page number |
| per_page | int | 25 | Items per page (max 100) |
| sort | string | created_at | Sort field |
| order | string | desc | Sort order (asc/desc) |

**Response (200):**

```json
{
  "data": [...],
  "meta": {
    "current_page": 1,
    "per_page": 25,
    "total": 100,
    "total_pages": 4
  }
}
```

#### `GET /v1/{resource}/{id}`

...

#### `PUT /v1/{resource}/{id}`

...

#### `DELETE /v1/{resource}/{id}`

...

---

## Domain Events

### Published Events

| Event | Trigger | Payload |
|-------|---------|---------|
| `{Resource}Created` | POST success | `{ id, ... }` |
| `{Resource}Updated` | PUT success | `{ id, changes, ... }` |
| `{Resource}Deleted` | DELETE success | `{ id }` |

### Consumed Events

| Event | Source | Action |
|-------|--------|--------|
| `{OtherEvent}` | {Source module} | {What happens} |

---

## Database Schema

### Tables

```sql
-- Schema: {schema_name}

CREATE TABLE {schema_name}.{table_name} (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- columns
    created_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ
);

CREATE INDEX idx_{table}_field ON {schema_name}.{table_name} (field);
```

### Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────┐
│   Entity A   │───────│   Entity B   │
├──────────────┤  1:N  ├──────────────┤
│ id           │       │ id           │
│ name         │       │ entity_a_id  │
└──────────────┘       └──────────────┘
```

### Migrations

| Order | File | Description |
|-------|------|-------------|
| 1 | `YYYYMMDDHHMMSS_create_{table}.sql` | Create {table} |
| 2 | `YYYYMMDDHHMMSS_add_{column}.sql` | Add {column} to {table} |

---

## Component Design

### Module Structure

```
{module-or-package}/
├── api/
│   ├── dto.{ext}              # Request/Response DTOs
│   ├── handlers.{ext}         # Route handlers
│   └── ...
├── domain/
│   ├── entities/
│   │   └── {entity}.{ext}     # Domain entity
│   ├── services/
│   │   └── {service}.{ext}    # Domain service
│   ├── events.{ext}           # Domain events
│   └── errors.{ext}           # Domain errors
├── infra/
│   └── repos/
│       └── {repo}.{ext}       # Repository implementation
└── {manifest}                 # Package manifest
```

### Key Types

```
// Entity
{Entity} {
    id: UUID
    // ...
}

// Service interface
{Entity}Service {
    create(input: Create{Entity}Input) -> {Entity}
    get_by_id(id: UUID) -> Option<{Entity}>
    // ...
}
```

---

## Sequence Diagrams

### Create {Resource} Flow

```
User        Frontend       API           Service        Database
 │              │            │               │              │
 │──[1] Submit──►│            │               │              │
 │              │──[2] POST──►│               │              │
 │              │            │──[3] validate─►│              │
 │              │            │               │──[4] INSERT──►│
 │              │            │               │◄──[5] OK──────│
 │              │            │◄──[6] entity──│              │
 │              │◄──[7] 201──│               │              │
 │◄──[8] Show───│            │               │              │
```

---

## Security Considerations

### Authentication

- [ ] Token validation against identity provider
- [ ] Token claims include required identifiers

### Authorization

- [ ] RBAC via permission checks
- [ ] Resource-level access control

### Data Protection

- [ ] Access scoping enforced at query level (if applicable)
- [ ] Sensitive fields encrypted at rest
- [ ] PII handling compliant with applicable regulations

### Input Validation

- [ ] All inputs validated and sanitized
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (output encoding)

---

## Performance Considerations

### Caching Strategy

| Data | Cache | TTL | Invalidation |
|------|-------|-----|--------------|
| {data} | Redis | 5m | On update |

### Database Indexes

| Table | Index | Columns | Type |
|-------|-------|---------|------|
| {table} | idx_{name} | col1, col2 | B-tree |

### Query Optimization

- [ ] Eager loading for relationships
- [ ] Pagination for list endpoints
- [ ] Query analysis performed

### Scaling

- Horizontal: {notes}
- Vertical: {notes}

---

## Testing Strategy

### Unit Tests

- [ ] Domain service logic
- [ ] Entity validation
- [ ] Error handling

### Integration Tests

- [ ] API endpoint tests
- [ ] Database repository tests

### E2E Tests

- [ ] Happy path flows
- [ ] Error scenarios

---

## Implementation Order

| Order | Component | Estimated | Dependencies |
|-------|-----------|-----------|--------------|
| 1 | Database migrations | 2h | None |
| 2 | Domain entities & services | 4h | #1 |
| 3 | Repository implementation | 3h | #2 |
| 4 | API handlers | 4h | #3 |
| 5 | Frontend components | 6h | #4 |
| 6 | E2E tests | 3h | #5 |

---

## Rollback Plan

1. Revert API deployment to previous version
2. Run down migration (if safe)
3. Notify affected users

---

## Monitoring & Observability

### Metrics

| Metric | Type | Description |
|--------|------|-------------|
| `{feature}_requests_total` | Counter | Total requests |
| `{feature}_latency_seconds` | Histogram | Request latency |

### Logging

- Request/response logging (sanitized)
- Error logging with context

### Alerts

| Alert | Condition | Severity |
|-------|-----------|----------|
| High error rate | >5% 5xx in 5m | Critical |
| High latency | p99 > 2s | Warning |

---

## Open Technical Questions

- [ ] TQ1: {question} - Decision needed by: {date}
- [ ] TQ2: {question} - Decision needed by: {date}

---

## References

- Brief: `docs/specs/{feature}/BRIEF.md`
- PRD: `docs/specs/{feature}/PRD.md`
- Pattern: `docs/patterns/{pattern}.md`
- Architecture: `docs/technical/architecture/ARCHITECTURE_PLAN.md`

---

## Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Tech Lead | | | Pending |
| Architect | | | Pending |
| Security | | | Pending |
