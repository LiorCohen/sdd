# CLAUDE.md - SDD Plugin

Guidance for Claude Code when working with the Spec-Driven Development plugin.

## What This Plugin Does

Implements a specification-driven workflow where every change (feature, bugfix, refactor) starts with a spec before code is written.

## Commands

| Command | Purpose |
|---------|---------|
| `/sdd-init --name [name] [--spec path]` | Initialize new project (optionally from external spec) |
| `/sdd-new-change --type [type] --name [name]` | Create spec and plan |
| `/sdd-implement-change [change-dir]` | Implement a change |
| `/sdd-verify-change [change-dir]` | Verify implementation |

## Agents

Invoke agents by asking Claude to use them (e.g., "Use the planner agent").

| Agent | Purpose |
|-------|---------|
| spec-writer | Create/maintain specifications |
| planner | Break specs into implementation phases |
| api-designer | Design OpenAPI contracts |
| frontend-dev | React components (MVVM) |
| backend-dev | Node.js backend (CMDO) |
| db-advisor | Database performance review |
| devops | Kubernetes, Helm, Testkube |
| ci-dev | CI/CD pipelines |
| tester | Test automation |
| reviewer | Code review and spec compliance |

## Key Directories

| Path | Purpose |
|------|---------|
| `specs/` | All specifications (INDEX.md, SNAPSHOT.md, changes/, domain/) |
| `components/contract/` | OpenAPI spec and generated types |
| `components/server/` | Backend code |
| `components/webapp/` | Frontend code |

## Core Rules

1. **Specs before code** - Every change needs a SPEC.md before implementation
2. **Issue tracking required** - Every spec must reference a tracking issue
3. **Contract-first** - OpenAPI specs generate types; never hand-write API types
4. **Use agents** - Each agent has specific skills; invoke the right one for the task
