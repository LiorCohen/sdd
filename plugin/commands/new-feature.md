---
name: new-feature
description: Start a new feature by creating a spec and implementation plan.
---

# /project:new-feature

Start a new feature.

## Usage

```
/project:new-feature [feature-name]
```

## Flow

### 0. Check Git Branch (CRITICAL - DO FIRST)

**Before collecting any information or creating any files:**

1. Run `git branch --show-current` to get the current branch name
2. If the current branch is `main` or `master`:
   - **STOP immediately**
   - Inform the user: "You are currently on the `main`/`master` branch."
   - Suggest: "Would you like to create a feature branch first? Suggested branch name: `feature/<feature-name>`"
   - Wait for user response:
     - If user says yes: Ask if they want to use the suggested name or provide their own
     - If user provides a branch name: Create the branch with `git checkout -b <branch-name>`
     - If user says no: Warn them that they're about to create files on main/master, ask for explicit confirmation
3. If on any other branch: Proceed to Step 1

**DO NOT proceed to Step 1 until the branch situation is resolved.**

### 1. Collect Feature Information

- Prompt for feature details:
  - Feature name (if not provided as argument)
  - Issue reference (required)
  - Domain
  - Brief description

### 2. Create Spec (`spec-writer` agent)

- Get current date in YYYY/MM/DD format
- Create `specs/features/YYYY/MM/DD/<feature-name>/SPEC.md` using template
- Fill in skeleton with user input
- Set `created` frontmatter field to current date
- Present for review and confirmation

### 3. Create Plan (`planner` agent)

- Analyze the spec
- Determine components affected (contract, server, webapp, helm, testing)
- Create `specs/features/YYYY/MM/DD/<feature-name>/PLAN.md` (same directory as spec)
- Break down into phases with agent assignments
- Estimate effort for each phase
- Present plan for approval

### 4. Review

- Show both spec and plan to user
- Wait for confirmation before proceeding
- If approved, update INDEX.md

## Important Notes

- **Branch check is mandatory**: The command will ALWAYS check the current git branch first
- **Feature branches recommended**: Working on `main`/`master` is discouraged for new features
- **Suggested naming**: `feature/<feature-name>` follows common git workflow conventions
- **User control**: Users can override the suggestion and proceed on main/master if they explicitly confirm

## Example Interaction

### Example 1: On main branch (creates feature branch)

```
User: /project:new-feature user-authentication

Agent: Checking current git branch...
Agent: You are currently on the `main` branch.
Agent: Would you like to create a feature branch first?
       Suggested branch name: `feature/user-authentication`

User: yes

Agent: Creating branch `feature/user-authentication`...
Agent: [Runs: git checkout -b feature/user-authentication]
Agent: ✓ Now on branch `feature/user-authentication`

Agent: Now let's gather information for the feature...
Agent: Please provide the issue reference (required):

User: PROJ-123

Agent: Which domain does this feature belong to?

User: Identity

Agent: Brief description of the feature:

User: Allow users to authenticate using email and password

Agent: [Creates spec and plan...]
```

### Example 2: Already on feature branch

```
User: /project:new-feature payment-processing

Agent: Checking current git branch...
Agent: Current branch: `feature/user-auth`
Agent: ✓ Proceeding on current branch

Agent: Now let's gather information for the feature...
Agent: Please provide the issue reference (required):

User: PROJ-456

[Continues with feature creation...]
```

### Example 3: On main branch (user declines branch creation)

```
User: /project:new-feature quick-fix

Agent: Checking current git branch...
Agent: You are currently on the `main` branch.
Agent: Would you like to create a feature branch first?
       Suggested branch name: `feature/quick-fix`

User: no

Agent: ⚠️  WARNING: You are about to create feature files directly on the `main` branch.
Agent: This is not recommended for the standard git workflow.
Agent: Are you sure you want to proceed? (yes/no)

User: yes

Agent: Proceeding on `main` branch...
Agent: Now let's gather information for the feature...

[Continues with feature creation...]
```