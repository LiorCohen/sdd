---
name: contract-scaffolding
description: Scaffolds OpenAPI contract component with type generation.
---

# Contract Scaffolding Skill

Creates an OpenAPI contract component that defines the API specification and generates TypeScript types for use by server and webapp components.

## When to Use

This skill is called by the main `scaffolding` skill when creating the contract component. Unlike server and webapp, contract is always a single instance.

## What It Creates

```
components/contract/
├── package.json          # Build scripts for type generation
├── openapi.yaml          # OpenAPI 3.0 specification
├── .gitignore            # Ignores generated/ directory
└── generated/            # Generated types (git-ignored)
    └── types.ts          # Generated after npm run generate:types
```

## OpenAPI Template

The template `openapi.yaml` includes:

- Basic info section with project name and description
- `/health` endpoint (standard lifecycle probe)
- `/greetings` endpoints (example CRUD operations)
- Reusable schemas (Greeting, Error)

## Type Generation

The contract component generates TypeScript types from the OpenAPI spec:

```bash
cd components/contract
npm run generate:types
```

This creates `generated/types.ts` which is consumed by:
- Server components (request/response types)
- Webapp components (API client types)

## Template Variables

| Variable | Description |
|----------|-------------|
| `{{PROJECT_NAME}}` | Project name (used in API info) |
| `{{PROJECT_DESCRIPTION}}` | API description |

## Usage

Called programmatically by the scaffolding script:

```python
from contract_scaffolding import scaffold_contract

scaffold_contract(
    target_dir="/path/to/project",
    project_name="my-app",
    project_description="My application API",
)
```

## Templates Location

All templates are colocated in this skill's `templates/` directory:

```
skills/contract-scaffolding/templates/
├── package.json
└── openapi.yaml
```

## Related Skills

- `api-design` - API design patterns and conventions
- `typescript-standards` - TypeScript coding conventions

## Integration with Other Components

```
                    ┌─────────────────┐
                    │    contract/    │
                    │  openapi.yaml   │
                    └────────┬────────┘
                             │
                    npm run generate:types
                             │
                    ┌────────▼────────┐
                    │   generated/    │
                    │    types.ts     │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
    ┌─────────▼─────────┐       ┌───────────▼───────────┐
    │      server/      │       │        webapp/        │
    │  imports types    │       │    imports types      │
    └───────────────────┘       └───────────────────────┘
```
