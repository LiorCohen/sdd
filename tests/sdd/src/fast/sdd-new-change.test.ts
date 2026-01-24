/**
 * Test: /sdd-new-change command
 * Verifies that spec-writer and planner agents are invoked correctly.
 */

import * as fsp from 'node:fs/promises';
import * as path from 'node:path';
import { describe, expect, it, beforeAll } from 'vitest';
import {
  createTestProject,
  runClaude,
  agentWasUsed,
  agentOrder,
  projectFindDir,
  type TestProject,
} from '../test-helpers.js';

const NEW_CHANGE_PROMPT = `Run /sdd-new-change --type feature --name user-auth to create a new change specification.

Change name: user-auth
Change type: feature
Issue reference: TEST-001
Domain: Core
Description: User authentication with email and password

When prompted, provide these answers:
- Change name: user-auth
- Type: feature
- Issue: TEST-001
- Domain: Core
- Description: Basic user authentication allowing users to sign up, log in, and log out using email and password credentials.

Proceed through the entire workflow:
1. Create the SPEC.md using the spec-writer agent
2. Create the PLAN.md using the planner agent

IMPORTANT:
- Do not ask any questions. Use the values provided above.
- You MUST use the spec-writer agent to create the spec.
- You MUST use the planner agent to create the plan.
- Complete both the spec and the plan before finishing.`;

describe('sdd-new-change command', () => {
  let testProject: TestProject;

  beforeAll(async () => {
    testProject = await createTestProject('sdd-new-change');

    // Create minimal project structure that /sdd-new-change expects
    await fsp.mkdir(path.join(testProject.path, 'specs', 'changes'), { recursive: true });
    await fsp.mkdir(path.join(testProject.path, 'specs', 'domain'), { recursive: true });
    await fsp.mkdir(path.join(testProject.path, 'components', 'contract'), { recursive: true });

    // Create minimal glossary
    await fsp.writeFile(
      path.join(testProject.path, 'specs', 'domain', 'glossary.md'),
      `# Glossary

## Domains

### Core
The primary business domain.

## Terms

(No terms defined yet)
`
    );

    // Create minimal INDEX.md
    await fsp.writeFile(
      path.join(testProject.path, 'specs', 'INDEX.md'),
      `# Specifications Index

## Active Changes

(No changes yet)
`
    );
  });

  it('invokes spec-writer and planner agents', async () => {
    console.log(`\nTest project directory: ${testProject.path}\n`);
    console.log('Created minimal project structure\n');
    console.log('Running /sdd-new-change...');

    const result = await runClaude(NEW_CHANGE_PROMPT, testProject.path, 300);

    // Save output for debugging
    await fsp.writeFile(path.join(testProject.path, 'claude-output.json'), result.output);

    console.log('\nVerifying agent invocations...\n');

    // Verify agents were used
    expect(agentWasUsed(result, 'spec-writer')).toBe(true);
    expect(agentWasUsed(result, 'planner')).toBe(true);

    // Verify agent order (spec-writer should come before planner)
    expect(agentOrder(result, 'spec-writer', 'planner')).toBe(true);

    console.log('\nVerifying generated files...\n');

    // Find the generated spec directory
    const specDir = projectFindDir(testProject, 'user-auth');

    expect(specDir).not.toBeNull();
    console.log(`Found spec directory: ${specDir}`);

    // Verify SPEC.md exists and has correct content
    const specFile = path.join(specDir!, 'SPEC.md');
    const specExists = await fsp
      .stat(specFile)
      .then((s) => s.isFile())
      .catch(() => false);
    expect(specExists).toBe(true);

    const specContent = await fsp.readFile(specFile, 'utf-8');
    expect(specContent).toContain('sdd_version:');
    expect(specContent).toContain('issue:');
    expect(specContent).toContain('type:');

    // Verify PLAN.md exists and has correct content
    const planFile = path.join(specDir!, 'PLAN.md');
    const planExists = await fsp
      .stat(planFile)
      .then((s) => s.isFile())
      .catch(() => false);
    expect(planExists).toBe(true);

    const planContent = await fsp.readFile(planFile, 'utf-8');
    expect(planContent).toContain('sdd_version:');

    console.log('\nAll assertions passed!');
  }, 360000); // 6 minute timeout
});
