# {Feature Name} - Product Requirements Document

> **Created:** {Date}  
> **Author:** @pm  
> **Status:** Draft | Review | Approved  
> **Brief:** `docs/specs/{feature}/BRIEF.md`

## Executive Summary

<!-- 2-3 sentence summary of what we're building and why -->

---

## Goals & Non-Goals

### Goals

1. Goal 1
2. Goal 2
3. Goal 3

### Non-Goals

1. Non-goal 1 (and why)
2. Non-goal 2 (and why)

---

## User Stories (Detailed)

### Epic 1: {Epic Title}

#### Story 1.1: {Title}

**As a** {user type},  
**I want to** {action},  
**So that** {benefit}.

**Acceptance Criteria:**

```gherkin
Feature: {Feature name}
  
  Scenario: {Scenario name}
    Given {context}
    And {additional context}
    When {action}
    Then {result}
    And {additional result}
```

**UI/UX Notes:**

- Note 1
- Note 2

**Edge Cases:**

- Edge case 1: {how to handle}
- Edge case 2: {how to handle}

#### Story 1.2: {Title}

...

### Epic 2: {Epic Title}

...

---

## Functional Requirements

### FR-001: {Requirement Title}

- **Description:** {what the system must do}
- **Priority:** Must Have | Should Have | Nice to Have
- **Stories:** Story 1.1, Story 1.2

### FR-002: {Requirement Title}

...

---

## Non-Functional Requirements

### Performance

- NFR-P01: {requirement, e.g., "Page load < 2s"}

### Security

- NFR-S01: {requirement, e.g., "All data encrypted at rest"}

### Accessibility

- NFR-A01: WCAG 2.1 AA compliance

### Scalability

- NFR-SC01: {requirement}

---

## User Interface

### Wireframes

<!-- Link to wireframes or ASCII diagrams -->

```
┌─────────────────────────────────────────┐
│ {Screen Name}                           │
├─────────────────────────────────────────┤
│                                         │
│   {Layout description}                  │
│                                         │
└─────────────────────────────────────────┘
```

### User Flows

```
[Entry Point] 
    → [Step 1] 
    → [Decision Point]
        ├─ Yes → [Step 2a] → [End State A]
        └─ No → [Step 2b] → [End State B]
```

### Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| Desktop (>1024px) | |
| Tablet (768-1024px) | |
| Mobile (<768px) | |

---

## Data Requirements

### Data Entities

| Entity | Fields | Source |
|--------|--------|--------|
| Entity 1 | field1, field2 | New / Existing |

### Data Validation

| Field | Validation Rules |
|-------|------------------|
| field1 | Required, max 255 chars |

### Data Migration

- [ ] No migration needed
- [ ] Migration from: {source}

---

## Integration Points

| System | Type | Direction | Notes |
|--------|------|-----------|-------|
| {auth provider} | Auth | Incoming | SSO |
| {backend service} | API | Both | Primary backend |

---

## Feature Flags

| Flag | Description | Default |
|------|-------------|---------|
| `feature_{name}_enabled` | Enable {feature} | false |

---

## Rollout Plan

### Phase 1: Internal Testing

- Environment: Development
- Users: Internal team
- Duration: X days
- Success Criteria: {criteria}

### Phase 2: Beta

- Environment: Staging
- Users: Selected customers
- Duration: X days
- Success Criteria: {criteria}

### Phase 3: General Availability

- Environment: Production
- Users: All customers
- Rollout: Gradual (X% per day)

---

## Success Metrics

| Metric | Baseline | Target | Measurement Method |
|--------|----------|--------|-------------------|
| Metric 1 | X | Y | {how} |
| Metric 2 | X | Y | {how} |

---

## Open Questions

- [ ] Q1: {question} - Owner: {who} - Due: {date}
- [ ] Q2: {question} - Owner: {who} - Due: {date}

---

## Appendix

### A. Glossary

| Term | Definition |
|------|------------|
| Term 1 | Definition |

### B. References

- Brief: `docs/specs/{feature}/BRIEF.md`
- Technical Spec: `docs/specs/{feature}/TECHNICAL.md`
- Related: {links}

---

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Owner | | | |
| Engineering Lead | | | |
| UX Lead | | | |
