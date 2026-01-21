---
name: planning
description: Templates for implementation plans.
---


# Planning Skill

## Plan Location

Plans are stored alongside their specs:

`specs/features/YYYY/MM/DD/<feature-name>/PLAN.md`

This keeps all feature documentation (spec + plan) together in one location.

## Phase Structure

- Each phase is independently reviewable
- Contract changes come first
- Phases build on each other sequentially

---

## Template: Implementation Plan

```markdown
---
title: Implementation Plan: [Feature Name]
spec: ./SPEC.md
issue: [PROJ-XXX]
created: YYYY-MM-DD
sdd_version: [X.Y.Z]
---

# Implementation Plan: [Feature Name]

## Overview

**Spec:** [link to spec]
**Issue:** [link to issue]

## Phases

### Phase 0: Domain Documentation (Prerequisite)
**Agent:** `spec-writer`

**CRITICAL:** This phase MUST be completed before any code implementation begins.

Tasks:
- [ ] Update `specs/domain/glossary.md` with new/modified terms
- [ ] Create/update definition specs in `specs/domain/definitions/`
- [ ] Document use cases in `specs/domain/use-cases/` (if applicable)
- [ ] Update `specs/architecture/` if architectural changes needed

Deliverables:
- Updated domain glossary
- Definition specifications for all new domain concepts
- Use case documentation (if applicable)

**Verification:**
- [ ] All new terms from the feature spec are in the glossary
- [ ] All new domain concepts have definition specs
- [ ] Existing definitions updated if behavior changes

### Phase 1: API Contract
**Agent:** `api-designer`

Tasks:
- [ ] Update `components/contract/openapi.yaml`
- [ ] Add schemas for [definitions]
- [ ] Generate types

Deliverables:
- Updated OpenAPI spec
- Generated TypeScript types

### Phase 2: Backend Implementation
**Agent:** `backend-dev`

Tasks:
- [ ] Add domain definitions to `model/definitions/`
- [ ] Implement use-cases in `model/use-cases/`
- [ ] Add DAL methods
- [ ] Wire up controller

Deliverables:
- Working API endpoints

### Phase 3: Frontend Implementation
**Agent:** `frontend-dev`

Tasks:
- [ ] Create components
- [ ] Add hooks
- [ ] Integrate with API

Deliverables:
- Working UI

### Phase 4: Testing
**Agent:** `tester`

Tasks:
- [ ] Integration tests
- [ ] E2E tests

Deliverables:
- Test suites passing

### Phase 5: Review
**Agent:** `reviewer`, `db-advisor`

Tasks:
- [ ] Spec compliance review
- [ ] Database review (if applicable)

## Dependencies

- [External dependencies or blockers]

## Risks

| Risk | Mitigation |
|------|------------|
| [Risk] | [How to mitigate] |
```
