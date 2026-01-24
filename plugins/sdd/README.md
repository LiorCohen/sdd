# Spec-Driven Development (SDD) Plugin

A comprehensive Claude Code plugin for spec-driven development methodology designed for full-stack TypeScript/React teams.

## Overview

This plugin implements a complete workflow where **specifications are the source of truth**. Every change (feature, bugfix, or refactor) lives in markdown specifications before it lives in code.

```
Specs → Plans → Implementation → Tests → Validation
  ↑                                           |
  └───────────── Feedback Loop ───────────────┘
```

### Core Methodology

**Specifications are Truth**: Every change starts with a spec in `specs/changes/YYYY/MM/DD/<change-name>/SPEC.md` before any code is written. Specs include:
- Frontmatter with metadata (title, type, status, domain, issue tracking)
- Type-specific sections (user stories for features, symptoms for bugfixes, goals for refactors)
- Acceptance criteria (Given/When/Then format)
- Domain concepts and constraints
- References to related specs and glossary terms

**Change Types**: The plugin supports three types of changes:
- **feature** - New functionality with full 6-phase implementation
- **bugfix** - Fix existing behavior with streamlined 4-phase process
- **refactor** - Code restructuring with streamlined 4-phase process

**Git as State Machine**: Pull requests represent draft specs. Merging to main activates them. No separate "draft" status field needed.

**Issue Tracking Required**: Every spec must reference a tracking issue (JIRA, GitHub, etc.) in the frontmatter `issue` field.

### Key Files in `specs/`

| File | Purpose |
|------|---------|
| `INDEX.md` | Registry of all specifications (auto-updated) |
| `SNAPSHOT.md` | Current product state and capabilities |
| `domain/glossary.md` | Domain terminology definitions |
| `domain/definitions/` | Core business object definitions |
| `domain/use-cases/` | Business use case definitions |
| `architecture/` | Architecture decision records |
| `changes/YYYY/MM/DD/<name>/` | Change specifications (SPEC.md + PLAN.md) |

## Key Features

### 10 Specialized Agents

Agents are invoked by asking Claude to use them (e.g., "Use the planner agent to create an implementation plan").

| Agent | Model | Purpose |
|-------|-------|---------|
| spec-writer | opus | Create/maintain specifications |
| planner | opus | Break specs into implementation phases |
| api-designer | sonnet | Design OpenAPI contracts |
| frontend-dev | sonnet | React components (MVVM architecture) |
| backend-dev | sonnet | CMDO architecture Node.js backend |
| db-advisor | opus | Database performance review |
| devops | sonnet | Kubernetes, Helm, Testkube |
| ci-dev | sonnet | CI/CD pipelines |
| tester | sonnet | Test automation via Testkube |
| reviewer | opus | Code review and spec compliance |

### 4 Slash Commands

| Command | Purpose |
|---------|---------|
| `/sdd-init --name [name]` | Initialize new project from template |
| `/sdd-new-change --type [type] --name [name]` | Create change spec and plan (feature, bugfix, or refactor) |
| `/sdd-implement-change [change-dir]` | Execute implementation plan |
| `/sdd-verify-change [change-dir]` | Verify implementation matches spec |

### Architectural Patterns
- **CMDO Backend Architecture** - "Commando" (Controller Model DAL Operator) with strict infrastructure/domain separation
- **MVVM Frontend Architecture** - Model-View-ViewModel with TanStack ecosystem
- **Contract-First API Design** - OpenAPI specs generate TypeScript types for both frontend and backend
- **Immutability Enforced** - `readonly` everywhere, no mutations, native JavaScript only
- **OpenTelemetry by Default** - Structured logging (Pino), standard metrics, custom spans, trace propagation

## Quick Start

```
┌─────────────────┐
│ 1. Write Spec   │  /sdd-new-change --type feature --name user-auth
└────────┬────────┘
         ↓
┌─────────────────┐
│ 2. Create Plan  │  (automatically generated with spec)
└────────┬────────┘
         ↓
┌─────────────────┐
│ 3. Implement    │  /sdd-implement-change specs/changes/.../user-auth
└────────┬────────┘
         ↓
┌─────────────────┐
│ 4. Verify       │  /sdd-verify-change specs/changes/.../user-auth
└─────────────────┘
```

**Initialize a new project:**
```bash
/sdd-init --name my-app
```

The init command uses product discovery to understand what you're building, then recommends components. For multiple instances (e.g., separate admin/public webapps), it will prompt during setup.

**Create a change** (feature, bugfix, or refactor):
```bash
/sdd-new-change --type feature --name user-authentication
/sdd-new-change --type bugfix --name fix-session-timeout
/sdd-new-change --type refactor --name extract-validation-layer
```

**Implement and verify:**
```bash
/sdd-implement-change specs/changes/2026/01/21/user-authentication
/sdd-verify-change specs/changes/2026/01/21/user-authentication
```

## Project Structure

When you initialize a project with `/sdd-init`, you get:

```
your-project/
├── specs/
│   ├── INDEX.md                   # Registry of all specifications
│   ├── SNAPSHOT.md                # Current product state
│   ├── domain/
│   │   ├── glossary.md           # Domain terminology definitions
│   │   └── definitions/          # Domain definitions
│   ├── architecture/             # Architecture documentation
│   └── changes/                  # Change specifications
│       └── YYYY/MM/DD/<change-name>/
│           ├── SPEC.md           # Change specification
│           └── PLAN.md           # Implementation plan
├── components/
│   ├── config/                   # Environment configuration
│   ├── contract/                 # OpenAPI specs (types generated here)
│   ├── server/                   # Node.js backend (CMDO architecture)
│   ├── webapp/                   # React frontend (MVVM architecture)
│   ├── database/                 # PostgreSQL migrations, seeds, scripts
│   ├── helm/                     # Kubernetes deployment charts
│   └── testing/                  # Testkube test definitions
└── .github/workflows/            # CI/CD pipelines
```

## Support

For issues or questions:
- Open an issue in the [marketplace repository](https://github.com/LiorCohen/claude-code-plugins)
- Check the [Claude Code documentation](https://docs.anthropic.com/claude/docs/claude-code)

## License

MIT
