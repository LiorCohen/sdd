---
title: Move sdd-settings.yaml to .sdd/ directory
created: 2026-02-01
---

# Plan: Move sdd-settings.yaml to .sdd/ Directory

## Problem Summary

The `sdd-settings.yaml` configuration file currently lives at the project root. This task moves it into `.sdd/sdd-settings.yaml` to consolidate all SDD metadata (settings, checksums, state) into a single directory. This requires updating all references throughout the plugin and ensuring backwards compatibility for existing projects.

## Dependency Note

This task depends on **#35 (Checksumming and drift detection)** because that task will define the `.sdd/` directory structure. Once #35 is implemented, we'll know exactly what else lives in `.sdd/` and can ensure the settings file path integrates cleanly.

## Scope of Changes

Based on codebase analysis, `sdd-settings.yaml` is referenced in **36+ files** across:
- 1 runtime TypeScript file (config.ts)
- 1 hook TypeScript file (validate-write.ts)
- 1 permissions JSON file
- 1 skill file (project-settings/SKILL.md)
- ~30 documentation/spec/agent files

## Files to Modify

| File | Changes |
|------|---------|
| `plugin/skills/project-settings/SKILL.md` | Update path from `sdd-settings.yaml` to `.sdd/sdd-settings.yaml` |
| `plugin/system/src/lib/config.ts` | Update `findProjectRoot()` to look for `.sdd/sdd-settings.yaml` |
| `plugin/system/src/commands/hook/validate-write.ts` | Update `SAFE_FILES` and add `.sdd/` to `SAFE_DIRS` |
| `plugin/hooks/recommended-permissions.json` | Update permission patterns for new path |
| `plugin/skills/sdd-init/SKILL.md` | Update initialization to create `.sdd/` directory and file |
| `plugin/skills/sdd-new-change/SKILL.md` | Update path reference |
| `plugin/skills/sdd-implement-change/SKILL.md` | Update path reference |
| `plugin/skills/planning/SKILL.md` | Update path reference |
| `plugin/skills/change-creation/SKILL.md` | Update path reference |
| Agent files referencing sdd-settings.yaml | Update documentation paths |
| `tests/src/tests/workflows/sdd-new-change-external-spec.test.ts` | Update test fixtures |

## Implementation

### Phase 1: Core Runtime Changes

Update the TypeScript files that actually read/write the settings file:

1. **config.ts** - Update `findProjectRoot()`:
   - Change line 73 from `sdd-settings.yaml` to `.sdd/sdd-settings.yaml`
   - This is the only runtime code that checks for the file's existence

2. **validate-write.ts** - Update hook:
   - Add `.sdd/` to `SAFE_DIRS` array
   - Remove `sdd-settings.yaml` from `SAFE_FILES` (now covered by `.sdd/` dir)

3. **recommended-permissions.json** - Update patterns:
   - Add `Write(.sdd/**)` and `Edit(.sdd/**)`
   - Remove individual `sdd-settings.yaml` entries

### Phase 2: Skill Updates

Update all skill markdown files:

1. **project-settings/SKILL.md** - Primary skill managing the file:
   - Update "File Location" section to `.sdd/sdd-settings.yaml`
   - Update all workflow steps referencing the path
   - Add note about creating `.sdd/` directory if it doesn't exist

2. **sdd-init/SKILL.md** - Project initialization:
   - Update to create `.sdd/` directory
   - Write settings to `.sdd/sdd-settings.yaml`

3. **Other skills** - Update path references:
   - `sdd-new-change/SKILL.md`
   - `sdd-implement-change/SKILL.md`
   - `planning/SKILL.md`
   - `change-creation/SKILL.md`

### Phase 3: Agent Updates

Update agent documentation files that reference `sdd-settings.yaml`:
- `backend-dev`
- `frontend-dev`
- `api-designer`
- `devops`
- `ci-dev`
- `tester`

### Phase 4: Backwards Compatibility

Add migration support for existing projects:

1. **config.ts** - Add fallback check:
   - First look for `.sdd/sdd-settings.yaml`
   - If not found, check for root `sdd-settings.yaml` (legacy)
   - Log deprecation warning if legacy path found

2. **project-settings/SKILL.md** - Add migration guidance:
   - If legacy file exists, suggest migration
   - Optionally: auto-migrate on first update operation

### Phase 5: Test Updates

1. Update `sdd-new-change-external-spec.test.ts`:
   - Create `.sdd/` directory in test fixtures
   - Write settings to new path

2. Run full test suite to catch any missed references

## Verification

1. **Phase 1 complete when:**
   - `npm run build` succeeds
   - `findProjectRoot()` finds projects with `.sdd/sdd-settings.yaml`
   - Hook allows writes to `.sdd/` directory

2. **Phase 2 complete when:**
   - All skill files reference `.sdd/sdd-settings.yaml`
   - `sdd-init` creates the directory structure correctly

3. **Phase 3 complete when:**
   - All agent files updated
   - Grep for `sdd-settings.yaml` only finds:
     - This plan file
     - Backwards compatibility code
     - Migration documentation

4. **Phase 4 complete when:**
   - New projects use `.sdd/sdd-settings.yaml`
   - Old projects with root `sdd-settings.yaml` still work
   - Deprecation warning shown for legacy path

5. **Phase 5 complete when:**
   - All tests pass with new path structure

## Notes

- The `.sdd/` directory should be git-tracked (unlike `.git/`)
- Consider adding `.sdd/README.md` explaining the directory purpose
- Future tasks (#35, #66) will add more files to `.sdd/`:
  - `checksums.yaml` for drift detection
  - `state.yaml` for command session state
