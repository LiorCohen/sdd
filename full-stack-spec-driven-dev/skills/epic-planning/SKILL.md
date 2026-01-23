---
name: epic-planning
description: Templates and guidelines for epic-level planning with phase-based PRs.
---


# Epic Planning Skill

## Purpose

Epics are large changes that span multiple implementation phases, where each phase is delivered as a separate PR. This skill provides structure for planning and tracking epics.

## When to Use Epics

Use epic-level planning when:

| Signal | Description |
|--------|-------------|
| Multi-component | Change touches 3+ components (contract, server, webapp, etc.) |
| Multi-domain | Change spans multiple business domains |
| Large scope | More than 10 acceptance criteria |
| Multiple PRs | Implementation naturally splits into 2+ independent deliverables |
| Team coordination | Multiple developers will work on different parts |

**Do NOT use epics for:**
- Single-component changes
- Bug fixes (use bugfix template)
- Refactors with limited scope
- Changes with < 5 acceptance criteria

## Epic Structure

```
specs/changes/YYYY/MM/DD/<epic-name>/
├── SPEC.md           # Epic specification (parent)
├── EPIC.md           # Epic plan with phase breakdown
└── phases/
    ├── 01-contract/
    │   ├── SPEC.md   # Phase spec (subset of epic ACs)
    │   └── PLAN.md   # Phase implementation plan
    ├── 02-backend/
    │   ├── SPEC.md
    │   └── PLAN.md
    └── 03-frontend/
        ├── SPEC.md
        └── PLAN.md
```

## Phase Naming Convention

Phases are numbered and named by their primary focus:

| Number | Name | Agent | Typical Content |
|--------|------|-------|-----------------|
| 01 | contract | api-designer | OpenAPI updates, type generation |
| 02 | backend | backend-dev | Server implementation |
| 03 | frontend | frontend-dev | UI implementation |
| 04 | infrastructure | devops | Helm, config changes |
| 05 | testing | tester | Integration/E2E tests |

Not all phases are required. Skip phases that don't apply.

## PR Strategy

**One PR per phase.** Each phase:
- Has its own branch: `epic/<epic-name>/phase-<NN>-<name>`
- Has its own PR with clear scope
- Can be reviewed and merged independently
- Must pass all tests before merge

**PR Size Guidelines:**
- Target: < 400 lines changed
- Maximum: 800 lines changed
- If phase exceeds limit, split into sub-phases (e.g., `02a-backend-models`, `02b-backend-api`)

## Dependencies Between Phases

Phases are sequential by default:
```
01-contract → 02-backend → 03-frontend → 04-infrastructure → 05-testing
```

Document any exceptions in the EPIC.md.

---

## Template: EPIC.md

```markdown
---
title: "Epic: [Epic Name]"
epic: [epic-name]
type: epic
spec: ./SPEC.md
issue: [PROJ-XXX]
created: YYYY-MM-DD
sdd_version: [X.Y.Z]
---

# Epic: [Epic Name]

## Overview

**Spec:** [./SPEC.md](./SPEC.md)
**Issue:** [PROJ-XXX](link)

[1-2 sentence summary of the epic's goal]

## Phases

| # | Phase | Agent | Status | PR | Description |
|---|-------|-------|--------|----|----|
| 01 | contract | api-designer | pending | — | [Brief description] |
| 02 | backend | backend-dev | pending | — | [Brief description] |
| 03 | frontend | frontend-dev | pending | — | [Brief description] |

## Acceptance Criteria Allocation

Map each acceptance criterion from the parent SPEC.md to a phase:

| AC | Description | Phase |
|----|-------------|-------|
| AC1 | [Short description] | 02-backend |
| AC2 | [Short description] | 02-backend |
| AC3 | [Short description] | 03-frontend |

## Phase Dependencies

```
01-contract
    ↓
02-backend (requires: contract types)
    ↓
03-frontend (requires: backend API)
```

## Cross-Cutting Concerns

Items that span multiple phases:

- **Error handling**: Defined in contract, implemented in backend, displayed in frontend
- **Validation**: Schema in contract, enforced in backend, shown in frontend

## Risks

| Risk | Impact | Mitigation | Phase Affected |
|------|--------|------------|----------------|
| [Risk] | [H/M/L] | [Mitigation] | [Phase] |

## Progress Tracking

Updated as phases complete:

- [ ] Phase 01: Contract
- [ ] Phase 02: Backend
- [ ] Phase 03: Frontend

## Notes

[Any additional context, decisions, or considerations]
```

---

## Template: Phase SPEC.md

Each phase has its own mini-spec derived from the parent epic SPEC.md:

```markdown
---
title: "[Epic Name] - Phase [NN]: [Phase Name]"
type: feature
parent_epic: ../SPEC.md
phase: [NN]-[name]
issue: [PROJ-XXX]
created: YYYY-MM-DD
sdd_version: [X.Y.Z]
---

# [Epic Name] - Phase [NN]: [Phase Name]

## Overview

**Parent Epic:** [../SPEC.md](../SPEC.md)
**Phase Focus:** [What this phase delivers]

## Acceptance Criteria

Subset of parent epic's ACs that this phase implements:

- [ ] **AC1:** Given [precondition], when [action], then [result]
- [ ] **AC2:** Given [precondition], when [action], then [result]

## Dependencies

**Requires (from previous phases):**
- [Types/APIs from phase 01]

**Provides (for next phases):**
- [APIs/components this phase exposes]

## Out of Scope

The following parent ACs are NOT part of this phase:
- AC3: [Handled in phase 03]
```

---

## Workflow: Creating an Epic

### Step 1: Identify Epic Candidates

During spec-decomposition, flag changes that meet epic criteria:
- Complexity score > 0.7
- More than 10 acceptance criteria
- Touches 3+ components

### Step 2: Create Epic Structure

```bash
# Create epic directory
specs/changes/2026/01/23/user-authentication/

# Create phase subdirectories
specs/changes/2026/01/23/user-authentication/phases/01-contract/
specs/changes/2026/01/23/user-authentication/phases/02-backend/
specs/changes/2026/01/23/user-authentication/phases/03-frontend/
```

### Step 3: Write Epic SPEC.md

Standard spec with all acceptance criteria for the entire epic.

### Step 4: Create EPIC.md

Use the template above. Map each AC to a phase.

### Step 5: Create Phase Specs

For each phase, create a SPEC.md with only that phase's ACs.

### Step 6: Create Phase Plans

Use standard planning templates within each phase directory.

---

## Workflow: Implementing an Epic

### For Each Phase:

1. **Branch**: `git checkout -b epic/<epic-name>/phase-<NN>-<name>`
2. **Implement**: Follow the phase's PLAN.md
3. **Test**: Ensure phase-specific tests pass
4. **PR**: Create PR with phase scope
5. **Review**: Get approval
6. **Merge**: Merge to main
7. **Update**: Mark phase complete in EPIC.md

### Handling Phase Failures

If a phase fails review:
1. Address feedback on the phase branch
2. Do NOT modify other phase branches
3. Re-submit for review

If requirements change mid-epic:
1. Update parent SPEC.md
2. Update affected phase SPECs
3. Re-plan affected phases
4. Document changes in EPIC.md

---

## PR Size Enforcement

### Measuring PR Size

Count lines changed (additions + deletions) in:
- Source files (`.ts`, `.tsx`, `.yaml`, etc.)
- Exclude: tests, generated files, package-lock.json

### Handling Oversized Phases

If a phase exceeds 800 lines:

1. **Split by layer** (backend):
   - `02a-backend-models`: Domain models and use-cases
   - `02b-backend-api`: Controllers and routes

2. **Split by feature** (frontend):
   - `03a-frontend-components`: UI components
   - `03b-frontend-integration`: API integration

3. **Update EPIC.md** with new phase structure

### Example Split

Before:
```
02-backend (estimated: 1200 lines)
```

After:
```
02a-backend-models (estimated: 500 lines)
02b-backend-api (estimated: 400 lines)
02c-backend-dal (estimated: 300 lines)
```

---

## Converting Change to Epic

If during planning a change is identified as needing epic structure:

1. Rename existing SPEC.md to SPEC.md (keep in place)
2. Create EPIC.md using template
3. Create phases/ subdirectory
4. Split ACs into phase specs
5. Update parent frontmatter to `type: epic`

---

## Quick Reference

```
Epic = Large change with multiple independently-mergeable phases
Phase = One PR worth of work (< 800 lines)
EPIC.md = Tracks phases, maps ACs, shows progress
Phase SPEC.md = Subset of parent ACs for one phase
```

**Signals to escalate to epic:**
- 10+ acceptance criteria
- 3+ components affected
- Estimated > 800 lines total
- Multiple domains involved
