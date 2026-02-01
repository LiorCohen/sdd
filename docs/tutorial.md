# Tutorial: Build a Restaurant Management System

This tutorial walks you through building a restaurant management system using the SDD plugin. You'll learn the complete SDD workflow from project initialization to a running application.

---

## What You'll Build

A restaurant management system with:
- **Menu Management**: Create, update, and organize menu items by category
- **Order Processing**: Take orders, track status, calculate totals
- **Customer Interface**: Browse menu and place orders

---

## Prerequisites

1. **Claude Code CLI** installed and authenticated
2. **SDD Plugin** installed:
   ```bash
   claude mcp add-plugin "https://raw.githubusercontent.com/LiorCohen/sdd/main/.claude-plugin/marketplace.json"
   ```
3. **Node.js 20+** and **npm**
4. **Docker** (for PostgreSQL)

---

## Part 1: Initialize the Project

### Step 1.1: Create and Enter Project Directory

```bash
mkdir restaurant-app
cd restaurant-app
claude
```

### Step 1.2: Run SDD Init

```
/sdd-init --name restaurant-app
```

SDD guides you through product discovery with questions about your application.

**Answer the questions:**

| Question | Your Answer |
|----------|-------------|
| What does your product do? | A restaurant management system for viewing menus and placing orders |
| Who are the users? | Restaurant staff and customers |
| What's the primary domain? | Restaurant Operations |
| What type of application? | Fullstack |

SDD recommends components based on your answers. Accept the defaults:
- config, contract, server, webapp, database, helm, testing, cicd

Type `yes` to approve and SDD scaffolds your project structure.

### Step 1.3: Install Dependencies

```bash
npm install
```

---

## Part 2: Create the Menu Feature

### Step 2.1: Create a Feature Branch

```bash
git checkout -b feature/menu-management
```

### Step 2.2: Create the Feature Spec

```
/sdd-new-change --type feature --name menu-management
```

**Answer the questions:**

| Question | Your Answer |
|----------|-------------|
| Describe this feature | Manage restaurant menu items including categories, prices, and availability |
| What domain? | Menu |
| Issue reference? | (optional) |

SDD creates two files in `changes/2026/02/01/menu-management/`:

- **SPEC.md** - Complete technical specification with user stories, API design, data model, acceptance criteria, and testing strategy
- **PLAN.md** - Implementation phases with assigned agents

### Step 2.3: Review the Spec

Open `SPEC.md` and review what SDD generated:

- **User Stories**: What users can do
- **API Endpoints**: REST API design for categories and menu items
- **Data Model**: Database tables and relationships
- **Acceptance Criteria**: Testable requirements in Given/When/Then format
- **Testing Strategy**: Unit, integration, and E2E test approach

Edit the spec if you need changes. The spec is the source of truth for implementation.

### Step 2.4: Commit the Spec

```
/commit
```

---

## Part 3: Implement the Menu Feature

### Step 3.1: Run Implementation

```
/sdd-implement-change changes/2026/02/01/menu-management
```

SDD reads your spec and executes implementation phases using specialized agents:

| Phase | Agent | What Happens |
|-------|-------|--------------|
| 1 | api-designer | Updates OpenAPI spec, generates TypeScript types |
| 2 | backend-dev | Implements server endpoints with TDD |
| 3 | frontend-dev | Builds React components with TDD |
| 4 | tester | Writes integration and E2E tests |
| 5 | reviewer | Verifies spec compliance |

Each agent works autonomously based on the spec. You'll see progress as files are created and tests pass.

### Step 3.2: Commit the Implementation

```
/commit
```

---

## Part 4: Add Order Management

### Step 4.1: Create the Order Feature

```
/sdd-new-change --type feature --name order-management
```

**Describe it**: Process customer orders with status tracking and total calculation

### Step 4.2: Review and Commit the Spec

Review `changes/2026/02/01/order-management/SPEC.md`, then:

```
/commit
```

### Step 4.3: Implement

```
/sdd-implement-change changes/2026/02/01/order-management
```

```
/commit
```

---

## Part 5: Verify Everything Works

### Step 5.1: Verify Each Feature

```
/sdd-verify-change changes/2026/02/01/menu-management
```

```
/sdd-verify-change changes/2026/02/01/order-management
```

SDD checks that:
- All acceptance criteria have corresponding tests
- All tests pass
- Implementation matches the spec

---

## Part 6: Run the Application

### Step 6.1: Start the Database

```
/sdd-run database setup restaurant-db
```

### Step 6.2: Run Migrations

```
/sdd-run database migrate restaurant-db
```

### Step 6.3: Generate Local Config

```
/sdd-config generate --env local --component server
```

### Step 6.4: Start the Services

In separate terminals:

```bash
# Terminal 1: Backend
cd components/server && npm run dev

# Terminal 2: Frontend
cd components/webapp && npm run dev
```

### Step 6.5: Open the Application

- Frontend: http://localhost:5173
- API: http://localhost:3000

---

## Part 7: Merge and Continue

### Step 7.1: Merge Your Branch

```bash
git checkout main
git merge feature/menu-management
```

### Step 7.2: Add More Features

Each new feature follows the same pattern:

```
git checkout -b feature/your-feature
/sdd-new-change --type feature --name your-feature
# Review and edit SPEC.md
/commit
/sdd-implement-change changes/.../your-feature
/commit
/sdd-verify-change changes/.../your-feature
git checkout main && git merge feature/your-feature
```

---

## Summary

| Step | Command |
|------|---------|
| Initialize project | `/sdd-init --name <name>` |
| Create feature spec | `/sdd-new-change --type feature --name <name>` |
| Implement feature | `/sdd-implement-change <change-dir>` |
| Verify feature | `/sdd-verify-change <change-dir>` |
| Manage config | `/sdd-config generate --env <env>` |
| Database operations | `/sdd-run database <action>` |

**The SDD workflow:**

1. **Spec first** - Define what you're building before writing code
2. **Specialized agents** - Each agent handles its domain (API, backend, frontend, testing)
3. **TDD built-in** - Tests are written during implementation
4. **Verification** - Ensure implementation matches spec

---

## Troubleshooting

### "Command not found: /sdd-init"

Install the SDD plugin:
```bash
claude mcp add-plugin "https://raw.githubusercontent.com/LiorCohen/sdd/main/.claude-plugin/marketplace.json"
```

### "Database connection refused"

Start the database:
```bash
/sdd-run database setup restaurant-db
```

### "Tests failing"

Check test output:
```bash
npm test -- --reporter verbose
```

Ensure migrations are current:
```bash
/sdd-run database migrate restaurant-db
```

---

## Next Steps

Ideas for extending your restaurant app:

- `/sdd-new-change --type feature --name user-authentication`
- `/sdd-new-change --type feature --name payment-processing`
- `/sdd-new-change --type feature --name table-reservations`

---

## Further Reading

- [Commands Reference](commands.md)
- [Agents Reference](agents.md)
- [Configuration Guide](config-guide.md)
- [Workflows](workflows.md)
