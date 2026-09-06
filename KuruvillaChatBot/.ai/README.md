# AI Development Artifacts

This folder contains reusable AI-assisted engineering knowledge organized as **Agents**, **Skills**, and **Hooks**.

---

## Quick Navigation

- **[Agents](#agents)** — Multi-step workflows
- **[Skills](#skills)** — Reusable procedures and domain knowledge
- **[Hooks](#hooks)** — Lifecycle automation
- **[How to Use](#how-to-use)**
- **[Creating New Artifacts](#creating-new-artifacts)**

---

## Agents

Agents represent autonomous workflows with distinct responsibilities.

An Agent is useful when you need to:
- Execute a multi-step process
- Make independent decisions at each step
- Coordinate multiple services
- Produce well-defined outputs

### Current Agents

| Agent | Purpose | Status | Phase |
|-------|---------|--------|-------|
| [linkedin-ingestion.md](agents/linkedin-ingestion.md) | Fetch LinkedIn profile data | Planned | 4 |
| [github-ingestion.md](agents/github-ingestion.md) | Fetch GitHub profile & repos | Planned | 3 |
| profile-normalization.md | Normalize external data to unified model | TODO | 5 |
| knowledge-builder.md | Generate structured KB from sources | TODO | 6 |
| knowledge-merger.md | Merge KB with manual knowledge | TODO | 6 |
| knowledge-validator.md | Validate KB schema and semantics | TODO | 6 |
| knowledge-sync.md | Orchestrate full sync pipeline | TODO | 9 |
| chatbot-grounding.md | Ground chatbot responses in KB | TODO | 8 |

### Agent Template

```markdown
# [Agent Name]

## Purpose
## Responsibilities
## Inputs
## Outputs
## Workflow
## Tools / Services Used
## Rules
## Failure Handling
## Validation
## Example Execution
```

---

## Skills

Skills represent reusable engineering procedures, best practices, and domain knowledge.

A Skill is useful when:
- Multiple components need similar logic
- A procedure should be documented for humans and AI
- Best practices should be codified
- Complex domain knowledge needs capturing

### Current Skills

| Skill | Purpose | Status | Phase |
|-------|---------|--------|-------|
| [grounded-chatbot.md](skills/grounded-chatbot.md) | Build factual, hallucination-safe chatbot | Planned | 8 |
| [indexeddb-storage.md](skills/indexeddb-storage.md) | Manage browser KB storage atomically | Planned | 7 |
| external-profile-integration.md | Integrate external APIs safely | TODO | 2 |
| profile-data-normalization.md | Normalize various data formats | TODO | 5 |
| knowledge-base-management.md | Manage KB versioning & lifecycle | TODO | 6 |
| prompt-security.md | Protect against prompt injection | TODO | 10 |
| api-error-handling.md | Handle API errors consistently | TODO | 1 |

### Skill Template

```markdown
# [Skill Name]

## Purpose
## When To Use
## Preconditions
## Inputs
## Procedure
## Validation
## Failure Handling
## Best Practices
## Anti-Patterns
## Expected Output
```

---

## Hooks

Hooks represent automated checks or actions that occur at specific lifecycle points.

A Hook is useful when:
- An operation should happen automatically
- A deterministic check should run before/after action
- Quality gates should be automated
- Side effects need triggering

### Current Hooks

| Hook | Purpose | Status | Phase |
|------|---------|--------|-------|
| pre-sync-validation.md | Validate before starting sync | TODO | 9 |
| post-sync-validation.md | Validate after sync completes | TODO | 9 |
| pre-knowledge-publish.md | Final checks before publishing KB | TODO | 6 |
| post-knowledge-publish.md | Cleanup after KB published | TODO | 6 |
| pre-commit-quality-check.md | Lint/test before commit | TODO | 11 |

### Hook Template

```markdown
# [Hook Name]

## Trigger
## Purpose
## Preconditions
## Actions
## Failure Behavior
## Validation
## Example
```

---

## How to Use These Artifacts

### For AI Coding Agents

When implementing a feature:

1. **Find relevant Agents** — Determine which workflows apply
2. **Check dependencies** — See what other agents must run first
3. **Follow the workflow** — Execute the Agent step-by-step
4. **Reference Skills** — Consult relevant Skills for procedures
5. **Validate** — Use Validation section before considering complete
6. **Handle failures** — Check Failure Handling for edge cases

Example:
```
Implementing Sync Pipeline:
1. Start knowledge-sync Agent
   ├─ Call github-ingestion Agent
   ├─ Call linkedin-ingestion Agent
   ├─ Call knowledge-builder Agent
   ├─ Call knowledge-merger Agent
   ├─ Call knowledge-validator Agent
   └─ Use indexeddb-storage Skill for browser update
2. Run pre-knowledge-publish Hook
3. Run post-knowledge-publish Hook
```

### For Humans Reading Documentation

When understanding the system:

1. **Read ARCHITECTURE.md** in `docs/`
2. **Find relevant Agents** for that component
3. **Read the Agent's workflow**
4. **Reference Skills** for detailed procedures
5. **Check Hooks** for lifecycle details

### For Code Reviewers

When reviewing pull requests:

1. Check if new code should be documented as:
   - [ ] Agent (multi-step workflow)?
   - [ ] Skill (reusable procedure)?
   - [ ] Hook (lifecycle automation)?
2. If yes, require corresponding .md file
3. Verify .md follows template
4. Check .md contains real procedural knowledge

---

## Creating New Artifacts

### Decision Tree

```
Is it a multi-step workflow
with distinct responsibilities?
├─ YES → Create AGENT
└─ NO
    │
    ├─ Is it a reusable procedure
    │  or domain knowledge?
    │  ├─ YES → Create SKILL
    │  └─ NO
    │      │
    │      └─ Should it trigger
    │         automatically at
    │         a specific time?
    │         ├─ YES → Create HOOK
    │         └─ NO → Document in code comment
```

### Creating an Agent

1. **Copy the Agent template**
2. **Fill in Purpose** — Concise one-liner
3. **Define Inputs/Outputs** — Clear contracts
4. **Write Workflow** — Step-by-step execution
5. **Document Failure Handling** — For each error type
6. **Provide Example** — Real execution example
7. **Update this README** — Add to Agents table

### Creating a Skill

1. **Copy the Skill template**
2. **Explain When To Use** — Who needs this?
3. **Write Procedure** — Steps with code examples
4. **Document Best Practices** — What works well
5. **List Anti-Patterns** — What NOT to do
6. **Provide Example** — Real usage example
7. **Update this README** — Add to Skills table

### Creating a Hook

1. **Define Trigger** — Exactly when does this run?
2. **List Actions** — What does it do?
3. **Write Validation** — How do we know it worked?
4. **Document Failures** — What if it fails?
5. **Provide Example** — Configuration example
6. **Update this README** — Add to Hooks table

---

## File Structure

```
.ai/
├── README.md                          # This file
│
├── agents/                            # Multi-step workflows
│   ├── linkedin-ingestion.md
│   ├── github-ingestion.md
│   ├── profile-normalization.md
│   ├── knowledge-builder.md
│   ├── knowledge-merger.md
│   ├── knowledge-validator.md
│   ├── knowledge-sync.md
│   └── chatbot-grounding.md
│
├── skills/                            # Reusable procedures
│   ├── external-profile-integration.md
│   ├── profile-data-normalization.md
│   ├── knowledge-base-management.md
│   ├── indexeddb-storage.md
│   ├── grounded-chatbot.md
│   ├── prompt-security.md
│   └── api-error-handling.md
│
└── hooks/                             # Lifecycle automation
    ├── pre-sync-validation.md
    ├── post-sync-validation.md
    ├── pre-knowledge-publish.md
    ├── post-knowledge-publish.md
    └── pre-commit-quality-check.md
```

---

## Maintenance

### When to Update Artifacts

- [ ] After implementing the corresponding feature
- [ ] When a procedure changes (update the Skill)
- [ ] When adding error handling (update Failure Handling)
- [ ] When discovering anti-patterns (add to Anti-Patterns)
- [ ] Before major refactors (update impacted Agents/Skills)

### Quality Standards

Each artifact should:
- [ ] Have a clear, concise title
- [ ] Be self-contained (explain requirements)
- [ ] Include realistic examples
- [ ] Document all failure modes
- [ ] Be actionable (not vague)
- [ ] Reference related artifacts
- [ ] Have a status (Planned, Implemented, Deprecated)

---

## Integration with Development

### Phase Tracking

Each artifact lists which **Phase** it belongs to:
- Phase 1: Backend Foundation
- Phase 2: Frontend Foundation
- Phase 3: GitHub Provider
- Phase 4: LinkedIn Provider
- Phase 5: Normalization
- Phase 6: Knowledge Engine
- Phase 7: IndexedDB Storage
- Phase 8: Chatbot
- Phase 9: Sync Orchestration
- Phase 10: Security
- Phase 11: Testing
- Phase 12: CI/CD
- Phase 13: Final Audit

An Agent/Skill is created when its phase is implemented.

### Status Values

- **TODO** — Not yet documented
- **Planned** — Design complete, implementation pending
- **Implemented** — Feature complete, artifact accurate
- **Deprecated** — No longer used, kept for reference

---

## Examples

### Using an Agent

```typescript
// Implementing GitHub sync
import { GitHubIngestionAgent } from './agents/github-ingestion';

const agent = new GitHubIngestionAgent({
  token: process.env.GITHUB_TOKEN,
});

const data = await agent.fetchProfile('torvalds');

// Agent follows its documented workflow:
// 1. Validate config
// 2. Check rate limits
// 3. Fetch user profile
// 4. Fetch repos
// 5. Normalize data
// 6. Return with provenance
```

### Using a Skill

```typescript
// From grounded-chatbot.md Skill
import { ClassifyMessage, ValidateResponse } from './skills/grounded-chatbot';

const msgType = ClassifyMessage(userMessage);

if (msgType === 'greeting') {
  return GenerateGreeting(userMessage);
}

const relevantKB = await RetrieveKnowledge(userMessage);
const response = await CallLLM(systemPrompt, relevantKB);
const isValid = await ValidateResponse(response, kb);

if (!isValid) {
  return "I'm having trouble with that";
}

return response;
```

### Using a Hook

```typescript
// In sync orchestration
async function syncKnowledgeBase() {
  // Hook: pre-sync-validation
  if (!preValidation.passed()) {
    throw new Error("Sync preconditions not met");
  }
  
  // ... run sync ...
  
  // Hook: post-sync-validation
  if (!postValidation.passed()) {
    rollback();
    throw new Error("Sync result invalid");
  }
}
```

---

## Contributing

When adding new Agents/Skills/Hooks:

1. Follow the appropriate template
2. Include real examples
3. Document failure modes
4. List dependencies
5. Update this README
6. Get review from maintainers

---

## References

- [ARCHITECTURE.md](../docs/ARCHITECTURE.md) — System design
- [IMPLEMENTATION-PLAN.md](../docs/IMPLEMENTATION-PLAN.md) — Phase breakdown
- [copilot-instructions.md](../.github/copilot-instructions.md) — Engineering standards

---

**Last Updated**: 2025-01-15  
**Document Version**: 1.0  
**Status**: ACTIVE
