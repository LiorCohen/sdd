---
task_id: 11
title: Deeper config integration
status: new
created: 2026-01-30
---

# Plan: Deeper Config Integration (Task 11)

## Problem Summary

Configuration is fragmented and not integrated into the component model. Need a config component that:
- Lives in `components/config/` (user-owned, not marketplace abstraction)
- Provides typed config sections per component
- Uses directory-per-environment structure for config merging
- Minimizes environment variables (single `SDD_CONFIG_PATH`)

## Target Architecture

### Config as a Component

**Mandatory singleton** - every project has exactly one config component.

```
components/
├── config/                         # MANDATORY - always present, exactly one
│   ├── package.json                # Minimal package for workspace imports
│   ├── tsconfig.json               # TypeScript config for type exports
│   ├── envs/
│   │   ├── default/                # Base configuration (always merged first)
│   │   │   └── config.yaml
│   │   ├── local/                  # Local dev (always present)
│   │   │   └── config.yaml
│   │   └── {env}/                  # Other envs added as needed (staging, production, etc.)
│   │       └── config.yaml
│   ├── schemas/
│   │   └── config.schema.json      # Main schema (minimal, users extend)
│   └── types/                      # TypeScript type definitions
│       ├── index.ts                # Re-exports config types
│       └── {component}.ts          # Per-component types (added as needed)
│
├── server-task-service/
│   └── src/
│       ├── config/
│       │   └── load_config.ts      # Imports type from @config/types
│       └── index.ts
│
├── webapp-task-dashboard/
│   └── src/
│       └── config.ts               # Imports type from @config/types
│
└── contract-task-api/
    └── ...
```

### Directory Per Environment

Each environment has its own directory. Environments are **user-defined** - we don't assume which exist.

**Initial structure (scaffolded):**
```
components/config/
├── package.json                # Minimal package for workspace imports
├── tsconfig.json               # TypeScript config for type exports
├── envs/
│   ├── default/
│   │   └── config.yaml         # Base config (empty sections)
│   └── local/
│       └── config.yaml         # Local overrides (empty)
├── schemas/
│   └── config.schema.json      # Main schema (minimal)
└── types/
    ├── index.ts                # Re-exports config types
    └── server.ts               # Example type (minimal)
```

**Users add environments as needed:**
```
components/config/
├── envs/
│   ├── default/
│   ├── local/
│   ├── staging/       # Added when needed
│   └── production/    # Added when needed
└── schemas/
```

**Note:** Config is a minimal TypeScript project (no runtime code). It exists in the workspace so other components can import types from it. The YAML files are the source of truth. Config is propagated to components by `sdd-system` (invoked via `/sdd-config`). All config must adhere to the `config-standards` skill.

**Merge order:** `envs/default/` → `envs/{env}/`

Future-proof: Each env directory can be split into multiple files (servers.yaml, databases.yaml, etc.).

### Config Structure

```yaml
# components/config/envs/default/config.yaml

global: {}  # Reserved for future cross-cutting concerns

# Each component gets a section matching its directory name
# Users add properties as needed - these are just placeholders
server-task-service: {}
webapp-task-dashboard: {}
database-taskdb: {}
helm-task-service: {}
```

## Design Decisions

| Decision | Choice |
|----------|--------|
| Config component | **Mandatory** - exactly one per project, must be declared |
| In sdd-settings.yaml | Listed as `{type: config, name: config}` (singleton) |
| Section naming | Exact component directory names (`server-task-service`) |
| Schema authority | Config component defines all config schemas centrally |
| Components without config | Unlikely; most will have a section |
| Type definitions | Centralized in `components/config/types/`, imported by components |
| Environment variable | Single env var `SDD_CONFIG_PATH` (no APP_ENV/NODE_ENV) |
| sdd-system role | CLI tool only (generate, validate, diff) - NOT a library |

## Files to Create/Modify

### New Files (Config Scaffolding Skill)

| File | Purpose |
|------|---------|
| `plugin/skills/config-scaffolding/SKILL.md` | New skill for config component |
| `plugin/skills/config-scaffolding/templates/package.json` | Minimal package for workspace imports |
| `plugin/skills/config-scaffolding/templates/tsconfig.json` | TypeScript config for type exports |
| `plugin/skills/config-scaffolding/templates/envs/default/config.yaml` | Base config template |
| `plugin/skills/config-scaffolding/templates/envs/local/config.yaml` | Local override template |
| `plugin/skills/config-scaffolding/templates/schemas/config.schema.json` | Main schema (minimal) |
| `plugin/skills/config-scaffolding/templates/types/index.ts` | Re-exports config types |
| `plugin/skills/config-scaffolding/templates/types/server.ts` | Example component config type (minimal) |

### New Files (sdd-system CLI Commands)

**Note:** `sdd-system` is a CLI tool only. Components never import from it.

| File | Purpose |
|------|---------|
| `plugin/system/src/commands/config/generate.ts` | Generate merged config for a target environment |
| `plugin/system/src/commands/config/validate.ts` | Validate config against schemas |
| `plugin/system/src/commands/config/diff.ts` | Show differences between environments |

### New Files (Config Command & Skill)

| File | Purpose |
|------|---------|
| `plugin/commands/sdd-config.md` | `/sdd-config` command for config management |
| `plugin/skills/config-standards/SKILL.md` | Standards and patterns for configuration |

### New Files (Documentation)

| File | Purpose |
|------|---------|
| `docs/config-guide.md` | Developer workflow guide for config system |

### New Files (Tests)

| File | Purpose |
|------|---------|
| `tests/unit/commands/config/generate.test.ts` | Config merge logic tests |
| `tests/unit/commands/config/validate.test.ts` | Schema validation tests |
| `tests/unit/commands/config/diff.test.ts` | Diff output tests |
| `tests/integration/config-scaffolding.test.ts` | Config component scaffolding tests |
| `tests/integration/backend-config.test.ts` | Backend config loading tests |
| `tests/integration/project-init-config.test.ts` | Project init with config tests |
| `tests/snapshots/config-templates.test.ts` | Template snapshot tests |
| `tests/snapshots/generated-config.test.ts` | Generated config snapshot tests |
| `tests/fixtures/config/` | Test fixtures directory |

### Modifications

| File | Changes |
|------|---------|
| `plugin/skills/project-scaffolding/` | Remove `config/` from root, add `components/config/` |
| `plugin/skills/project-scaffolding/templates/config/` | **DELETE** - moved to config-scaffolding |
| `plugin/skills/backend-scaffolding/` | Remove dotenv, use config from `SDD_CONFIG_PATH` |
| `plugin/skills/project-settings/SKILL.md` | Add `config` as valid type (singleton, mandatory) |
| `plugin/commands/sdd-init.md` | Include config component in sdd-settings.yaml |
| `docs/getting-started.md` | Add config section, update structure diagram |
| `docs/components.md` | Add config component type documentation |
| `docs/workflows.md` | Add config workflow examples |
| `docs/commands.md` | Add /sdd-config command reference |
| `README.md` | Update quick start with config generation |

## Implementation

### Phase 1: Config Component Skill

Create `plugin/skills/config-scaffolding/` with YAML templates.

**1.1 SKILL.md**
```markdown
# Config Scaffolding Skill

Scaffold the config component for centralized configuration management.

## Output Structure

components/config/
├── package.json                # Minimal package for workspace imports
├── tsconfig.json               # TypeScript config for type exports
├── envs/
│   ├── default/
│   │   └── config.yaml         # Base config (empty sections)
│   └── local/
│       └── config.yaml         # Local overrides (empty)
├── schemas/
│   └── config.schema.json      # Main schema (minimal)
└── types/
    ├── index.ts                # Re-exports config types
    └── server.ts               # Example type (minimal)
```

**Note:** Config is a minimal TypeScript project (no runtime code). It exists so other components can import types. YAML files are the source of truth. Users add properties to config and types as needed. `sdd-system` CLI (via `/sdd-config`) generates merged configs.

**1.2 templates/package.json**
```json
{
  "name": "@{{PROJECT_NAME}}/config",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    "./types": "./types/index.ts"
  },
  "typesVersions": {
    "*": {
      "types": ["./types/index.ts"]
    }
  }
}
```

**1.3 templates/tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "noEmit": true,
    "declaration": true,
    "declarationMap": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["types/**/*.ts"]
}
```

**1.4 templates/envs/default/config.yaml**
```yaml
# yaml-language-server: $schema=../../schemas/config.schema.json
# Base configuration - other environments inherit from this

global: {}  # Reserved for future cross-cutting concerns

# Component sections - users add properties as needed
# Section names match component directory names exactly
```

**1.5 templates/envs/local/config.yaml**
```yaml
# yaml-language-server: $schema=../../schemas/config.schema.json
# Local development overrides
# Inherits from envs/default/ and overrides specific values
```

**1.6 templates/schemas/config.schema.json**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "config.schema.json",
  "title": "Project Configuration Schema",
  "type": "object",
  "additionalProperties": true
}
```

**Note:** Schema starts minimal. Users add properties as config evolves.

**1.7 templates/types/index.ts**
```typescript
// Re-export all config types for easy importing
// Users add exports as they create component-specific types
export type { ServerConfig } from './server';
```

**1.8 templates/types/server.ts**
```typescript
// Minimal starting point - users extend as needed
export type ServerConfig = Readonly<Record<string, unknown>>;
```

**Note:** Types start as `Record<string, unknown>`. Users define specific properties as their config evolves. Components import types via workspace package `@{{PROJECT_NAME}}/config/types`.

---

### Phase 2: Update Backend Template

Remove dotenv, use YAML config from `SDD_CONFIG_PATH`.

**2.1 Update `src/config/load_config.ts`**

**File:** `plugin/skills/backend-scaffolding/templates/src/config/load_config.ts`

**Before (current):**
```typescript
import dotenv from 'dotenv';

export type Config = Readonly<{
  readonly port: number;
  readonly probesPort: number;
  readonly nodeEnv: string;
  readonly logLevel: string;
  readonly databaseUrl: string;
}>;

export const loadConfig = (): Config => {
  dotenv.config();

  const port = parseInt(process.env.PORT ?? '3000', 10);
  const probesPort = parseInt(process.env.PROBES_PORT ?? '9090', 10);
  const nodeEnv = process.env.NODE_ENV ?? 'development';
  const logLevel = process.env.LOG_LEVEL ?? 'info';
  const databaseUrl = process.env.DATABASE_URL ?? '...';

  return { port, probesPort, nodeEnv, logLevel, databaseUrl };
};
```

**After:**
```typescript
import { readFileSync, existsSync } from 'fs';
import { parse } from 'yaml';
import Ajv from 'ajv';
import type { ServerConfig } from '@{{PROJECT_NAME}}/config/types';

// Re-export type for convenience
export type { ServerConfig as Config } from '@{{PROJECT_NAME}}/config/types';

export const loadConfig = (): ServerConfig => {
  const configPath = process.env.SDD_CONFIG_PATH;
  if (!configPath) {
    throw new Error('SDD_CONFIG_PATH environment variable is required');
  }

  const config = parse(readFileSync(configPath, 'utf-8'));

  // Validate against schema (schema placed alongside config by sdd-system)
  const schemaPath = configPath.replace(/\.yaml$/, '.schema.json');
  if (existsSync(schemaPath)) {
    const schema = JSON.parse(readFileSync(schemaPath, 'utf-8'));
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    if (!validate(config)) {
      throw new Error(`Config validation failed: ${JSON.stringify(validate.errors)}`);
    }
  }

  return config as ServerConfig;
};
```

**Note:** Schema validation happens BOTH at generate time (`/sdd-config generate`) AND at runtime. The `sdd-system` places the schema file alongside the config (e.g., `local-config.yaml` + `local-config.schema.json`).

**2.2 Update `package.json`**

Remove `dotenv` dependency, add `yaml`, `ajv`, and workspace dependency on config:

```diff
- "dotenv": "^16.x.x",
+ "yaml": "^2.3.4",
+ "ajv": "^8.12.0",
+ "@{{PROJECT_NAME}}/config": "workspace:*",
```

---

### Phase 3: Update Project Scaffolding

**3.1 Config is explicit and mandatory**

Config component is **mandatory** and **explicit**:
- Listed in `sdd-settings.yaml` as `{type: config, name: config}`
- Always created by `sdd-init`
- Cannot be removed or made optional
- Exactly one config component allowed (singleton)

**3.2 Update sdd-init flow**

Config component is scaffolded automatically with every project:
1. Add `{type: config, name: config}` to `sdd-settings.yaml` components
2. Create `components/config/` structure with `envs/` and `schemas/` directories
3. Create `envs/default/config.yaml` with `global` section + sections for declared components
4. Create `envs/local/config.yaml` with minimal overrides
5. Other environments (staging, production, etc.) added to `envs/` as needed

**3.3 Update project-settings skill**

- Add `config` as a valid component type
- Enforce singleton constraint: only one config component allowed
- Directory: `components/config/` (always `type-name` since type = name)

**3.4 Remove legacy config/ folder**

This change **removes** the `config/` folder that was sibling to `components/`:

```
# BEFORE (current)
project/
├── config/              ← REMOVED
├── components/
│   ├── server-*/
│   └── webapp-*/
└── sdd-settings.yaml

# AFTER (new)
project/
├── components/
│   ├── config/          ← NEW (mandatory)
│   ├── server-*/
│   └── webapp-*/
└── sdd-settings.yaml
```

Update scaffolding templates to:
- Remove `config/` folder from project root template
- Add `components/config/` to project structure

---

### Phase 4: Helm Integration

**4.1 Helm templates use config sections**

The helm-scaffolding skill creates templates that:
- Mount config as a ConfigMap
- Set `SDD_CONFIG_PATH` env var pointing to the mounted file

```yaml
# helm-{name}/templates/deployment.yaml (scaffolded)
spec:
  containers:
    - name: {{ .Release.Name }}
      env:
        - name: SDD_CONFIG_PATH
          value: /app/config/config.yaml
      volumeMounts:
        - name: config
          mountPath: /app/config
          readOnly: true
  volumes:
    - name: config
      configMap:
        name: {{ .Release.Name }}-config
```

**4.2 ConfigMap template**

```yaml
# helm-{name}/templates/configmap.yaml (scaffolded)
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-config
data:
  config.yaml: |
    {{- toYaml .Values.config | nindent 4 }}
```

**Note:** How users populate `.Values.config` at deploy time is outside plugin scope. Users can use `--set-file`, values files, or CI/CD tooling.

---

### Phase 5: Config Command & Standards Skill

**5.1 /sdd-config command**

Create `plugin/commands/sdd-config.md` for configuration management:

```markdown
# /sdd-config

Manage project configuration.

## Operations

### generate
Generate merged config file for a target environment.

Usage: /sdd-config generate --env <env> [--component <name>] [--output <path>]

- Merges envs/default/ with envs/{env}/ config
- **Validates against schemas/** before outputting (fails if invalid)
- **Places schema alongside config** (e.g., `config.yaml` + `config.schema.json`) for runtime validation
- If --component specified, extracts just that section
- If --output specified, writes to file; otherwise prints to stdout

### validate
Validate config against schemas.

Usage: /sdd-config validate [--env <env>]

- Validates config.yaml files against schemas/
- Reports schema violations
- Checks all environments if --env not specified

### diff
Show differences between environments.

Usage: /sdd-config diff <env1> <env2>

- Shows what changes between two environments
- Useful for reviewing production vs local differences

### add-env
Add a new environment directory.

Usage: /sdd-config add-env <env-name>

- Creates envs/{env}/ directory with empty config.yaml
- Config inherits from envs/default/
```

**5.2 config-standards skill**

Create `plugin/skills/config-standards/SKILL.md`:

```markdown
# Config Standards Skill

Standards and patterns for SDD configuration management.

## Principles

1. **Single source of truth** - All config lives in components/config/
2. **Environment layering** - envs/default/ → envs/{env}/ merge order
3. **No env vars** - Only SDD_CONFIG_PATH allowed
4. **Secrets as references** - Config contains K8s Secret names, not values
5. **Fail fast** - Validate config at startup, crash on invalid

## Naming Conventions

- Config sections match component directory names exactly
- Use kebab-case for all names
- Secret references end with `Secret` suffix (e.g., `passwordSecret`)

## Schema Management

- Main schema consolidates component subschemas via $ref
- Subschemas start minimal, grow as config evolves
- Use patternProperties for component type matching

## Local Development

1. Generate merged config: `sdd-system config generate --env local`
2. Output to component root as `local-config.yaml` (gitignored)
3. Start server with: `SDD_CONFIG_PATH=./local-config.yaml npm start`

```

**5.3 sdd-system CLI commands**

```bash
# Generate merged config
sdd-system config generate --env local --output ./local-config.yaml

# Validate all environments
sdd-system config validate

# Validate specific environment
sdd-system config validate --env production

# Diff environments
sdd-system config diff local production
```

---

## Verification

1. **Phase 1**: Config component scaffolds correctly with all templates
2. **Phase 2**: Backend component builds without dotenv, uses config via workspace import
3. **Phase 3**: `sdd-init` creates config component with sections for declared components
4. **Phase 4**: Helm templates mount config via ConfigMap and set `SDD_CONFIG_PATH`
5. **Phase 5**: `/sdd-config` command works, `sdd-system config` subcommands function
6. **Phase 6**: Documentation complete, developer workflow is clear and actionable
7. **Phase 7**: All tests pass, no regressions in existing functionality

## Environment Variables

**Single allowed env var:**

| Var | Purpose | Required |
|-----|---------|----------|
| `SDD_CONFIG_PATH` | Absolute path to config file | Yes |

**No other env vars.** All configuration comes from the file at `SDD_CONFIG_PATH`.

### Local Development

For local dev, a config file is **generated** and placed in the server root:

```bash
# Generate merged config for local environment
sdd-system config generate --env local --component server-task-service \
  --output components/server-task-service/local-config.yaml
```

The generated file is **gitignored** and never committed:
```gitignore
# components/server-task-service/.gitignore
local-config.yaml
```

Server startup:
```bash
SDD_CONFIG_PATH=./local-config.yaml npm start
```

## Gitignore

```gitignore
# Generated config files in server components (never commit)
components/server-*/local-config.yaml
```

**Note:** All config directories are committed. Secrets appear in config as **references** (secret names), not values:

```yaml
# Config contains reference, not actual secret
server-task-service:
  database:
    host: db.production.internal
    passwordSecret: "task-service-db-credentials"  # K8s Secret name
```

Helm maps these references to actual secrets:
```yaml
# helm-task-service/templates/deployment.yaml
env:
  - name: DB_PASSWORD
    valueFrom:
      secretKeyRef:
        name: {{ .Values.serverConfig.database.passwordSecret }}
        key: password
```

Actual secrets managed via `external-secrets` operator (syncs from Vault/AWS Secrets Manager).

---

## Phase 6: Documentation

### 6.1 Developer Workflow Guide

Create `docs/config-guide.md` with:

**Contents:**
1. **Overview** - What the config system is and why it exists
2. **Quick Start** - Getting from zero to running app with config
3. **Directory Structure** - Explanation of `components/config/` layout
4. **Adding Config Properties** - How to add new config to YAML, schema, and types
5. **Environment Management** - Adding new environments, layering behavior
6. **Local Development** - Step-by-step: generate → run → iterate
7. **Type Safety** - How workspace imports work, keeping types in sync
8. **Troubleshooting** - Common errors and fixes

**Developer Workflow Section:**
```markdown
## Local Development Workflow

1. **Add config property** to `components/config/envs/default/config.yaml`
2. **Add override** (if needed) to `components/config/envs/local/config.yaml`
3. **Update schema** in `components/config/schemas/config.schema.json`
4. **Update types** in `components/config/types/{component}.ts`
5. **Generate merged config**: `/sdd-config generate --env local --component server-task-service`
6. **Start server**: `SDD_CONFIG_PATH=./local-config.yaml npm start`
```

### 6.2 Update Existing Docs

| File | Changes |
|------|---------|
| `docs/getting-started.md` | Add config section, update project structure diagram |
| `docs/components.md` | Add `config` component type, explain mandatory singleton |
| `docs/workflows.md` | Add config workflow examples |
| `README.md` | Update quick start to include config generation step |

### 6.3 Command Reference

Add `/sdd-config` to `docs/commands.md`:
- All operations (generate, validate, diff, add-env)
- Example usage for each
- Common flags and options

---

## Phase 7: Testing

### 7.1 Unit Tests (sdd-system)

| Test File | Purpose |
|-----------|---------|
| `tests/unit/commands/config/generate.test.ts` | Config merge logic |
| `tests/unit/commands/config/validate.test.ts` | Schema validation |
| `tests/unit/commands/config/diff.test.ts` | Diff output |

**Test cases for generate:**
- Merges default → env correctly
- Missing env dir throws error
- Invalid YAML throws error
- Component extraction works
- Schema placed alongside output
- Schema validation fails on invalid config

**Test cases for validate:**
- Valid config passes
- Invalid config fails with meaningful error
- Missing schema warns (doesn't fail)
- All environments validated when no --env

**Test cases for diff:**
- Shows additions/removals/changes
- Handles missing sections
- Output format is readable

### 7.2 Integration Tests

| Test File | Purpose |
|-----------|---------|
| `tests/integration/config-scaffolding.test.ts` | Config component scaffolds correctly |
| `tests/integration/backend-config.test.ts` | Backend loads config from YAML |
| `tests/integration/project-init-config.test.ts` | sdd-init includes config component |

**Test cases for scaffolding:**
- Creates all expected files (`package.json`, `tsconfig.json`, etc.)
- File contents use correct placeholders
- Directory structure matches spec

**Test cases for backend loading:**
- Server starts with valid `SDD_CONFIG_PATH`
- Server fails fast with missing `SDD_CONFIG_PATH`
- Server fails fast with invalid config
- Schema validation runs at startup
- Type imports from workspace work

**Test cases for project init:**
- Config component added to `sdd-settings.yaml`
- `components/config/` created
- Config sections match declared components
- No legacy `config/` folder at root

### 7.3 Snapshot Tests

| Test File | Purpose |
|-----------|---------|
| `tests/snapshots/config-templates.test.ts` | Template file contents |
| `tests/snapshots/generated-config.test.ts` | Generated config output |

**Snapshot what:**
- All scaffolding template files
- Generated merged config for test fixtures
- Generated schema placement

### 7.4 Regression Tests

| Test | Purpose |
|------|---------|
| Existing projects still work | Ensure no breaking changes |
| dotenv removal doesn't break build | Backend compiles without dotenv |
| Workspace imports resolve | TypeScript finds config types |

**Key regressions to prevent:**
- Backend fails to import from `@project/config/types`
- Config merge produces incorrect output
- Schema validation false positives/negatives
- Helm templates missing env var or mount

### 7.5 Test Fixtures

Create fixtures in `tests/fixtures/config/`:

```
tests/fixtures/config/
├── valid-project/
│   └── components/
│       └── config/
│           ├── envs/
│           │   ├── default/config.yaml
│           │   └── local/config.yaml
│           └── schemas/config.schema.json
├── invalid-schema/
│   └── ... (config that fails validation)
├── missing-env/
│   └── ... (no local/ directory)
└── multi-component/
    └── ... (multiple server components)
```

---

## Out of Scope

- Config hot reload / file watching
- Remote config (Consul, Vault)
- Config encryption

## Dependencies

None - this task can proceed independently.
