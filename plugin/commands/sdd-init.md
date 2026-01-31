---
name: sdd-init
description: Initialize a new project from the spec-driven template.
---

# /sdd-init

Initialize a new spec-driven project.

## Usage

```
/sdd-init --name <project-name>
```

**Arguments:**
- `--name <project-name>` (required): Name of the project directory to create

**Examples:**
```bash
/sdd-init --name my-app
```

## Workflow

**CRITICAL**: This command follows an approval-based workflow. Do NOT create any files or directories until the user has approved the project configuration.

**Permission Note**: This command creates ~50+ files. If the user hasn't configured SDD permissions, they will see many approval prompts. If you notice excessive prompts during execution, mention that they can reduce prompts by configuring permissions per `plugin/hooks/PERMISSIONS.md`.

This command orchestrates multiple skills to complete initialization:

| Phase | Skill Used                  | Purpose |
|-------|-----------------------------|----------------|
| 0     | (inline)                    | Parse arguments |
| 1     | `product-discovery`         | Understand what user is building |
| 2     | `component-recommendation`  | Recommend technical components |
| 3     | (inline)                    | Display configuration summary |
| 4     | (inline)                    | Get user approval |
| 5     | (inline)                    | Initialize git   |
| 6.1   | `project-settings`          | Create sdd-settings.yaml |
| 6.2   | `scaffolding`               | Create project structure |
| 6.3   | `domain-population`         | Populate specs from discovery |
| 7     | (inline)                    | Commit initial project files |
| 8     | (inline)                    | Display completion report |

---

## Phase Tracking (CRITICAL)

**You MUST complete ALL phases before declaring initialization complete.** Use this checklist to track progress:

```
[ ] Phase 0: Arguments parsed
[ ] Phase 1: Product discovery completed, results stored
[ ] Phase 2: Component recommendation completed
[ ] Phase 3: Configuration summary displayed
[ ] Phase 4: User approval received
[ ] Phase 5: Git repository initialized
[ ] Phase 6.1: sdd-settings.yaml created
[ ] Phase 6.2: Project structure scaffolded
[ ] Phase 6.3: Domain knowledge populated
[ ] Phase 7: Initial commit created
[ ] Phase 8: Completion report displayed
```

**DO NOT:**
- Stop after Phase 4 (approval) without completing Phases 5-8
- Declare "initialization complete" until Phase 8 is finished
- Ask the user "should I continue?" between phases - just proceed

**If interrupted**, resume from the last incomplete phase. The user should never need to ask "is init done?" - you must complete all phases in a single flow.

---

### Phase 0: Parse Arguments

1. **If no arguments provided**, display usage and exit:
   ```
   Usage: /sdd-init --name <project-name>

   Arguments:
     --name <project-name>  Name of the project directory to create (required)

   Examples:
     /sdd-init --name my-app
   ```
   **Do not proceed without `--name`.**

2. **Parse command arguments:**
   - Extract project name (required)

3. **Directory check:**
   - Validate project name (lowercase, hyphens allowed)
   - Check if current directory basename matches project name
   - If match and empty: Ask "Initialize here? (yes/no)"
   - If match and not empty: "Will create subdirectory '<project-name>/' instead."
   - Determine target directory for later phases

---

### Phase 1: Product Discovery

**INVOKE the `product-discovery` skill** with:

```yaml
project_name: <from Phase 0>
```

The skill conducts interactive discovery and returns:

```yaml
product_description: "1-2 sentence problem statement"
primary_domain: "Task Management"
user_personas:
  - type: "Project Manager"
    actions: "create projects, assign tasks"
core_workflows: ["Create projects", "Assign tasks"]
domain_entities: ["Team", "Project", "Task"]
integrations: ["Slack"]
constraints: []
scope: "mvp"
```

Store these results for subsequent phases.

---

### Phase 2: Technical Recommendation

**INVOKE the `component-recommendation` skill** with:

```yaml
discovery_results:
  product_description: <from Phase 1>
  primary_domain: <from Phase 1>
  user_personas: <from Phase 1>
  core_workflows: <from Phase 1>
  domain_entities: <from Phase 1>
  integrations: <from Phase 1>
  constraints: <from Phase 1>
  scope: <from Phase 1>
```

The skill recommends components and returns:

```yaml
project_type: "fullstack"
components:
  - type: contract
    name: contract
  - type: server
    name: server
  - type: webapp
    name: webapp
  - type: database
    name: database
  - type: helm
    name: helm
  - type: testing
    name: testing
  - type: cicd
    name: cicd
```

Store configuration for subsequent phases.

---

### Phase 3: Configuration Summary

Display a summary combining product context and technical configuration:

```markdown
## Project Configuration Summary

### Product Understanding

**Name:** <project-name>
**Problem:** <product_description>
**Domain:** <primary_domain>

**Users:**
- <User type 1>: <what they do>
- <User type 2>: <what they do>

**Core Capabilities:**
- <Capability 1>
- <Capability 2>

**Key Domain Entities:** <Entity1>, <Entity2>, <Entity3>
[**Integrations:** <list if any>]
[**Constraints:** <list if any>]

### Technical Configuration

**Location:** <target_directory>

**Components to create:**
- Contract (OpenAPI spec) - for <entities/workflows>
- Server (Node.js backend) - to handle <workflows>
- Webapp (React frontend) - for <user types>
- Database (PostgreSQL) - to persist <entities>
- Config (YAML configuration)
- Helm (Kubernetes deployment)
- Testing setup
- CI/CD workflows

### What Will Be Pre-populated

- **Glossary:** <Entity1>, <Entity2>, <Entity3>
- **User Personas:** <User type 1>, <User type 2>
- **Initial Use Cases:** Stubs for <Capability 1>, <Capability 2>

**Files to create:** ~XX files
```

---

### Phase 4: User Approval

**CRITICAL:** Ask the user explicitly:

```
Do you want to proceed with creating this project structure? (yes/no)
```

**DO NOT create any files until the user confirms with "yes".**

If the user says no, ask what they'd like to change and return to Phase 1 or Phase 2.

---

### Phase 5: Initialize Git Repository

Create the project directory (if it doesn't already exist) and initialize git before writing any project files:

If not already in a git repository:
```bash
mkdir -p ${TARGET_DIR} && cd ${TARGET_DIR} && git init
```

If already in a git repository (current directory case):
- Skip this phase (git is already initialized)

---

### Phase 6: Project Creation (Only After Approval)

#### Step 6.1: Create Project Settings

**INVOKE the `project-settings` skill** with operation `create`:

```yaml
plugin_version: <read from plugin's .claude-plugin/plugin.json>
project_name: <from Phase 0>
project_description: <from Phase 1>
project_domain: <from Phase 1>
project_type: <from Phase 2>
components: <from Phase 2>
```

Creates `sdd-settings.yaml` in the project root.

#### Step 6.2: Scaffold Project Structure

**INVOKE the `scaffolding` skill** with:

```yaml
project_name: <from Phase 0>
project_description: <from Phase 1>
primary_domain: <from Phase 1>
target_dir: <absolute path to target>
components: <from Phase 2>
```

#### Step 6.3: Populate Domain Knowledge

**INVOKE the `domain-population` skill** with:

```yaml
target_dir: <absolute path to target>
primary_domain: <from Phase 1>
product_description: <from Phase 1>
user_personas: <from Phase 1>
core_workflows: <from Phase 1>
domain_entities: <from Phase 1>
```

---

### Phase 7: Commit Initial Project Files

Stage and commit all created files using the commit-standards format:

```bash
cd ${TARGET_DIR} && git add .
```

Commit with proper message format:
```
Add <project-name>: Initialize spec-driven project

- Created project structure with <N> components
- Set up CMDO architecture (components/, specs/)
- Configured for <primary-domain> domain

Co-Authored-By: SDD Plugin vX.Y.Z
```

**If commit fails:** Display the error and ask the user how to proceed:
- "Commit failed: <error message>"
- Options: retry, skip commit, or abort initialization

Note: Since this is project initialization (not a feature), no version bump or changelog entry is needed.

---

### Phase 8: Completion Report

1. List the created structure:
   ```bash
   tree ${TARGET_DIR} -L 3 -I node_modules
   ```

2. Display completion message:

```
═══════════════════════════════════════════════════════════════
 PROJECT INITIALIZED: <project-name>
═══════════════════════════════════════════════════════════════

Location: <absolute-path-to-target-dir>
Domain: <primary-domain>

WHAT'S INCLUDED:

  ✓ Full project structure (backend, frontend, contract)
  ✓ CMDO architecture ready for your features
  ✓ Empty specs directory (ready for your first feature)

NEXT STEP:

  /sdd-new-change --type feature --name <your-first-feature>

  This will guide you through:
  1. Creating a specification for your feature
  2. Planning the implementation
  3. Building it step by step
```

**VERIFICATION:** Before displaying the completion report, confirm:
- [ ] All phases 0-8 completed (check the Phase Tracking checklist)
- [ ] Git commit was successful (Phase 7)
- [ ] Tree structure displays correctly

---

## Important Notes

- This command ALWAYS asks for user approval before creating files
- Users can customize which components to include
- Product discovery enables pre-populated glossary, use-cases, and component recommendations
- All skills are invoked in sequence with proper data passing between phases
- **Completion means Phase 8**: Never declare "done" before the completion report is displayed
- **To import an external spec:** Use `/sdd-new-change --spec <path>` after initialization
