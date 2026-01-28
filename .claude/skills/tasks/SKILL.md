---
name: tasks
description: Manage tasks and plans using the tasks/ directory.
---

# Task Management Skill

Manage the project backlog, track progress, and organize implementation plans.

---

## Directory Structure

Task data files live in `tasks/` at the project root:

```
tasks/
├── TASKS.md      # Main backlog with all tasks
└── plans/        # Implementation plans for tasks
    ├── PLAN-task-2-npm-lifecycle-scripts.md
    ├── PLAN-task-4-permission-prompts.md
    └── PLAN-task-7-external-spec-handling.md
```

## Files

| File/Directory | Purpose |
|----------------|---------|
| `tasks/TASKS.md` | Main backlog file with all tasks organized by priority/status |
| `tasks/plans/` | Directory containing implementation plans for tasks |

## TASKS.md Structure

```markdown
# Tasks / Improvements Backlog

## High Priority
### N. Task title [CRITICAL]
Description...

## Pending
### N. Task title
Description...

## Low Priority
### N. Task title
Description...

## Merged
### N. Task title → merged into #M

## Completed
### N. Task title ✓
**Completed: YYYY-MM-DD**
Description of what was done...
**Plan:** [plans/PLAN-task-N-slug.md](plans/PLAN-task-N-slug.md)
```

---

## Commands

### View Backlog

```
User: /tasks
User: /tasks list
User: show me the backlog
```

**Action:** Read and summarize TASKS.md, grouped by section.

Output format:
```
## High Priority (N items)
- #9: sdd-init should produce ready-to-work components [CRITICAL]

## Pending (N items)
- #10: Missing /sdd-help command
- #11: Missing deeper config integration
...

## Low Priority (N items)
- #3: Docs missing: CMDO Guide
...

## Recently Completed (last 5)
- #7: External spec handling ✓ (2026-01-28)
- #2: Add npm run scripts ✓ (2026-01-28)
...
```

### View Single Task

```
User: /tasks 19
User: show me task 19
User: what's task #19 about?
```

**Action:** Find and display the full task entry from TASKS.md.

### Add New Task

```
User: /tasks add <description>
User: add a new task: <description>
```

**Workflow:**
1. Determine next available task number (scan for highest N, add 1)
2. Ask user for priority level (High/Pending/Low)
3. Add task to appropriate section in TASKS.md
4. Confirm addition with task number

Format for new task:
```markdown
### N. Task title
Description provided by user. Expand if needed to capture the full intent.
```

### Complete Task

```
User: /tasks complete 7
User: mark task 7 as done
User: task 7 is complete
```

**Workflow:**
1. Find task N in TASKS.md
2. Move task to ## Completed section
3. Add completion date and ✓ marker
4. If a plan exists in `plans/`, link it
5. Summarize what was accomplished (ask user if needed)

Format:
```markdown
### N. Task title ✓
**Completed: YYYY-MM-DD**

Summary of what was done...

**Plan:** [plans/PLAN-task-N-slug.md](plans/PLAN-task-N-slug.md)
```

### Merge Tasks

```
User: /tasks merge 28 into 27
User: merge task 28 into 27
```

**Workflow:**
1. Find both tasks
2. Move the merged task (28) to ## Merged section
3. Update format to: `### 28. Task title → merged into #27`
4. Optionally update target task (27) to include merged context

### Change Priority

```
User: /tasks prioritize 15 high
User: move task 15 to high priority
User: task 15 is now critical
```

**Workflow:**
1. Find task in current section
2. Move to target priority section
3. Add [CRITICAL] tag if moving to High Priority and user indicates critical

### Create Plan

```
User: /tasks plan 19
User: create a plan for task 19
```

**Workflow:**
1. Read the task from TASKS.md
2. Analyze codebase to understand scope
3. Create `tasks/plans/PLAN-task-N-slug.md` with:
   - Problem summary
   - Files to modify
   - Implementation steps
   - Verification steps
4. Link plan from task entry (optional, until completed)

Plan template:
```markdown
# Plan: Task Title (Task N)

## Status: IN PROGRESS | COMPLETED ✓

**Completed: YYYY-MM-DD (vX.Y.Z)** ← only when done

---

## Problem Summary

Brief description of what needs to be done.

## Files to Modify

| File | Changes |
|------|---------|
| path/to/file.ts | Description of changes |

## Implementation

### Step 1: Description

Details...

### Step 2: Description

Details...

## Verification

1. How to verify step 1 works
2. How to verify step 2 works
...
```

### Review Plans

```
User: /tasks plans
User: show me all plans
```

**Action:** List all files in `tasks/plans/` directory with their status.

---

## Examples

### Adding a Task

```
User: /tasks add Need better error messages when spec validation fails

Agent: What priority level?
1. High Priority - Critical or blocking issues
2. Pending - Normal priority, to be done
3. Low Priority - Nice to have, not urgent

User: 2

Agent: ✓ Added task #48 to Pending:

### 48. Better error messages for spec validation failures
Need better error messages when spec validation fails. Should provide clear guidance on what's wrong and how to fix it.
```

### Completing a Task

```
User: /tasks complete 7

Agent: Found task #7: External spec handling is broken

Moving to Completed section...

What was accomplished? (I'll summarize or you can provide details)

User: Fixed all external spec issues - specs are now self-sufficient

Agent: ✓ Moved task #7 to Completed:

### 7. External spec handling is broken ✓
**Completed: 2026-01-28**

Fixed all issues with external spec processing:
- Specs generated from `sdd-init` with external spec now include both SPEC.md and PLAN.md
- External specs with 3+ changes produce epic structures
- Generated specs embed full content making them self-sufficient

**Plan:** [plans/PLAN-task-7-external-spec-handling.md](plans/PLAN-task-7-external-spec-handling.md)
```

### Creating a Plan

```
User: /tasks plan 19

Agent: Reading task #19: Create task management skill in marketplace

Analyzing what's needed...

Creating plan at tasks/plans/PLAN-task-19-task-management-skill.md

✓ Plan created. Key points:
- Add task management at tasks/
- Support add/complete/merge/prioritize operations
- Integrate with tasks/TASKS.md and tasks/plans/

View the plan? (yes/no)
```

---

## Task Numbering

- Task numbers are permanent identifiers (never reused)
- Find the highest existing number and increment for new tasks
- Numbers may have gaps (due to merges, deletions)
- Reference tasks as `#N` or `task N`

## Best Practices

1. **Keep tasks atomic** - One clear outcome per task
2. **Merge related tasks** - Don't duplicate effort
3. **Link plans** - Always link implementation plans when completing
4. **Update status** - Move tasks through sections as work progresses
5. **Add context** - When completing, summarize what was actually done
6. **Date everything** - Completion dates help track velocity
