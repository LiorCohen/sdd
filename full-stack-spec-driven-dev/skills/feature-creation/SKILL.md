---
name: feature-creation
description: Create feature specification and implementation plan with proper structure and frontmatter.
---

# Feature Creation Skill

## Purpose

Create a complete feature specification package consisting of:
- Feature directory: `specs/features/YYYY/MM/DD/<feature-name>/`
- Specification: `SPEC.md` with proper frontmatter
- Implementation plan: `PLAN.md` with 6-phase structure
- INDEX.md update with new feature entry

## Input

| Parameter | Required | Description |
|-----------|----------|-------------|
| `feature_name` | Yes | Slug for directory name (lowercase, hyphens) |
| `title` | Yes | Display title for the feature |
| `description` | Yes | Brief description (1-2 sentences) |
| `domain` | Yes | Primary domain (e.g., "Identity", "Billing") |
| `issue` | No | Issue reference (e.g., "PROJ-123"), defaults to "TBD" |
| `user_stories` | No | List of user stories for the spec |
| `acceptance_criteria` | No | List of acceptance criteria |
| `api_endpoints` | No | List of API endpoints this feature defines |
| `external_source` | No | Path to external spec (for traceability) |
| `decomposition_id` | No | UUID linking related features |
| `prerequisites` | No | List of prerequisite features (for dependencies) |

## Output

Returns a result with:
- `spec_path`: Path to created SPEC.md
- `plan_path`: Path to created PLAN.md
- `index_updated`: Boolean indicating INDEX.md was updated

## Workflow

### Step 1: Validate Inputs

1. Validate `feature_name` is a valid directory name:
   - Lowercase letters, numbers, hyphens only
   - No spaces or special characters
   - Not empty

2. Ensure required parameters are provided:
   - `feature_name`, `title`, `description`, `domain`

### Step 2: Generate Date Path

1. Get current date
2. Format as `YYYY/MM/DD`
3. Full path: `specs/features/YYYY/MM/DD/<feature_name>/`

### Step 3: Read Plugin Version

1. Read SDD plugin version from `.claude-plugin/plugin.json`
2. Use for `sdd_version` frontmatter field

### Step 4: Create Feature Directory

```bash
mkdir -p specs/features/YYYY/MM/DD/<feature_name>/
```

### Step 5: Create SPEC.md

Create `specs/features/YYYY/MM/DD/<feature_name>/SPEC.md` with:

#### Frontmatter

```yaml
---
title: <title>
status: active
domain: <domain>
issue: <issue or "TBD">
created: YYYY-MM-DD
updated: YYYY-MM-DD
sdd_version: <plugin_version>
external_source: <path>  # Only if provided
decomposition_id: <uuid>  # Only if provided
---
```

#### Content Structure

```markdown
## Overview

<description>

## External Source

> Only include if `external_source` is provided

This specification was imported from an external document: `<external_source>`

## User Stories

> Include if `user_stories` provided, otherwise use template

- As a [role], I want [capability] so that [benefit]
- ...

## Acceptance Criteria

> Include if `acceptance_criteria` provided, otherwise use template

- [ ] Given [context], when [action], then [result]
- ...

## API Contract

> Include if `api_endpoints` provided, otherwise use template

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| METHOD | /path | Description |

## Domain Concepts

> List any new domain terms introduced by this feature

- **Term**: Definition

## Out of Scope

> Explicitly list what this feature does NOT include

- Item 1
- Item 2

## Open Questions

> List any unresolved questions

- Question 1?
```

### Step 6: Create PLAN.md

Create `specs/features/YYYY/MM/DD/<feature_name>/PLAN.md`:

#### Frontmatter

```yaml
---
title: <title> - Implementation Plan
feature: <feature_name>
spec: ./SPEC.md
status: draft
created: YYYY-MM-DD
sdd_version: <plugin_version>
---
```

#### Content Structure

```markdown
## Overview

Implementation plan for: <title>

Specification: [SPEC.md](./SPEC.md)

## Prerequisites

> Only include if `prerequisites` provided

Complete implementation of the following features before starting:
- <prerequisite_1>
- <prerequisite_2>

## Implementation Phases

### Phase 0: Domain Documentation
**Agent:** `domain-expert`

- [ ] Review and update domain glossary
- [ ] Document any new domain concepts
- [ ] Ensure ubiquitous language is consistent

### Phase 1: API Contract
**Agent:** `contract-author`

- [ ] Define OpenAPI paths and operations
- [ ] Define request/response schemas
- [ ] Generate TypeScript types
- [ ] Review contract with team

### Phase 2: Backend Implementation
**Agent:** `backend-developer`

- [ ] Implement database models/migrations
- [ ] Implement service layer
- [ ] Implement API handlers
- [ ] Add input validation
- [ ] Add error handling

### Phase 3: Frontend Implementation
**Agent:** `frontend-developer`

- [ ] Create UI components
- [ ] Implement state management
- [ ] Connect to API endpoints
- [ ] Add loading/error states
- [ ] Implement form validation

### Phase 4: Testing
**Agent:** `test-engineer`

- [ ] Write unit tests for services
- [ ] Write integration tests for API
- [ ] Write E2E tests for critical paths
- [ ] Verify all acceptance criteria pass

### Phase 5: Review & Documentation
**Agent:** `reviewer`

- [ ] Code review
- [ ] Update API documentation
- [ ] Update user documentation (if needed)
- [ ] Final QA sign-off

## Notes

- Phases build on each other sequentially
- Update this plan as implementation progresses
```

### Step 7: Update INDEX.md

Add entry to `specs/INDEX.md`:

1. Find the `## Active Specifications` section (create if missing)
2. Add entry:
   ```markdown
   - [<title>](features/YYYY/MM/DD/<feature_name>/SPEC.md) - <description>
   ```

### Step 8: Return Result

Return:
```yaml
spec_path: specs/features/YYYY/MM/DD/<feature_name>/SPEC.md
plan_path: specs/features/YYYY/MM/DD/<feature_name>/PLAN.md
index_updated: true
```

## Example

```
Input:
  feature_name: user-authentication
  title: User Authentication
  description: Allow users to sign up, sign in, and manage sessions
  domain: Identity
  issue: PROJ-123

Output:
  spec_path: specs/features/2026/01/21/user-authentication/SPEC.md
  plan_path: specs/features/2026/01/21/user-authentication/PLAN.md
  index_updated: true
```

## Error Handling

- If feature directory already exists: Warn and ask for confirmation to overwrite
- If INDEX.md doesn't exist: Create it with basic structure
- If plugin.json can't be read: Use "unknown" for sdd_version and warn
