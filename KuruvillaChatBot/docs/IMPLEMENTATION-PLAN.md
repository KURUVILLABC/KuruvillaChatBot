# Implementation Plan - Profile AI Knowledge System & Grounded Chatbot

**Project Status**: PHASE 0 — Architecture Planning  
**Last Updated**: 2025-01-15  
**Repository**: KuruvillaChatBot

---

## Executive Summary

This document outlines the phased implementation of a production-quality AI-powered profile knowledge system with a grounded chatbot. The system retrieves profile information from LinkedIn and GitHub, generates a versioned knowledge base, and provides conversational AI responses grounded in that knowledge.

**Key Principles**:
- Separation of concerns across all layers
- Source provenance tracking for all facts
- Atomic knowledge base updates with rollback capability
- No AI hallucination of profile facts
- Modular, testable architecture
- RAG-ready design for future vector search

---

## Current State Analysis

### Existing Assets
- ✓ Comprehensive `copilot-instructions.md` with full engineering standards
- ✓ Git workflow agents/skills in `.github/`
- ✓ GitHub repository initialized
- ✓ .gitignore ready

### Missing Components
- ✗ Frontend application (React/Vite/TypeScript)
- ✗ Backend server (Fastify/Node.js/TypeScript)
- ✗ Package.json files (root, frontend, backend)
- ✗ Configuration and environment setup
- ✗ LinkedIn/GitHub provider implementations
- ✗ Knowledge engine (normalization, merging, validation)
- ✗ IndexedDB storage abstraction
- ✗ Chatbot implementation
- ✗ Sync mechanism and orchestration
- ✗ Tests and CI/CD

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend                        │
│  (Chat, Profile Display, Sync Status, Admin Panel)      │
└────────────────────┬────────────────────────────────────┘
                     │ (REST API)
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Fastify Backend (Node.js)                   │
│  (Controllers, Routes, Business Logic)                   │
└──────┬────────────┬──────────────┬──────────────────────┘
       │            │              │
       ▼            ▼              ▼
┌─────────────┐ ┌──────────┐ ┌──────────────┐
│  LinkedIn   │ │ GitHub   │ │ AI Provider  │
│  Provider   │ │ Provider │ │ (OpenAI/etc) │
│  Adapter    │ │ Adapter  │ │              │
└──────┬──────┘ └──────┬───┘ └──────────────┘
       │               │
       └───────┬───────┘
               ▼
        ┌────────────────────────┐
        │  Normalization Layer   │
        │  (Unified Profile      │
        │   Model with Provenance│
        └────────┬───────────────┘
                 ▼
        ┌────────────────────────┐
        │  Knowledge Engine      │
        │  ├─ Merger             │
        │  ├─ Validator          │
        │  ├─ Versioning        │
        │  └─ Provenance Track  │
        └────────┬───────────────┘
                 ▼
        ┌────────────────────────┐
        │ Additional Knowledge   │
        │ (Manual Overrides)     │
        └────────┬───────────────┘
                 ▼
        ┌────────────────────────┐
        │ Published KB Storage   │
        │ (JSON Versioned)       │
        └────────┬───────────────┘
                 ▼
    ┌────────────────────────────┐
    │  Browser IndexedDB         │
    │  (Persistent KB Storage)   │
    └────────┬───────────────────┘
             ▼
    ┌────────────────────────────┐
    │ Knowledge Retriever        │
    │ (Structured, RAG-ready)    │
    └────────┬───────────────────┘
             ▼
    ┌────────────────────────────┐
    │ Chatbot                    │
    │ ├─ Classification         │
    │ ├─ Greetings              │
    │ ├─ Grounding              │
    │ └─ Response Generation    │
    └────────────────────────────┘
```

---

## Technology Stack Decisions

### Frontend
- **Framework**: React 18 (TypeScript)
- **Build**: Vite (faster than Create React App)
- **Styling**: Tailwind CSS (utility-first, production-ready)
- **Storage**: IndexedDB via Dexie.js (lightweight abstraction)
- **Validation**: Zod (runtime schema validation)
- **Testing**: Vitest + Playwright (E2E)

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Fastify (fast, minimal, schema-driven)
- **Language**: TypeScript (strict mode)
- **Validation**: Zod (shared with frontend)
- **Testing**: Vitest + Supertest (API testing)

### AI Integration
- **Interface**: `AIProvider` abstraction
- **Initial Provider**: OpenAI (GPT-4 or GPT-4 Turbo)
- **Fallback Provider**: Mock provider (for development)
- **Structured Output**: JSON mode where available

### External APIs
- **LinkedIn**: Official API (if available) or configured mock
- **GitHub**: REST API v3 (public profile data)
- **Rate Limiting**: Respect provider limits, implement backoff

### Data & Validation
- **Schemas**: Zod (runtime validation)
- **Knowledge Storage**: IndexedDB (browser) + JSON (backend)
- **Database**: PostgreSQL (future, not Phase 1)

### Development & Quality
- **Linting**: ESLint
- **Formatting**: Prettier
- **Type Checking**: TypeScript strict mode
- **Testing**: Vitest (unit/integration) + Playwright (E2E)
- **CI/CD**: GitHub Actions

---

## Project Structure

```
KuruvillaChatBot/
│
├── frontend/                          # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat/
│   │   │   │   ├── ChatInterface.tsx
│   │   │   │   ├── MessageBubble.tsx
│   │   │   │   └── SuggestedQuestions.tsx
│   │   │   ├── Profile/
│   │   │   │   ├── ProfileCard.tsx
│   │   │   │   └── ProfileSection.tsx
│   │   │   ├── Sync/
│   │   │   │   ├── SyncStatus.tsx
│   │   │   │   └── ManualSync.tsx
│   │   │   ├── Admin/
│   │   │   │   ├── AdminPanel.tsx
│   │   │   │   ├── ConfigPanel.tsx
│   │   │   │   └── KnowledgeStatus.tsx
│   │   │   └── Common/
│   │   │       ├── Header.tsx
│   │   │       ├── Footer.tsx
│   │   │       └── ErrorBoundary.tsx
│   │   │
│   │   ├── services/
│   │   │   ├── api/
│   │   │   │   ├── client.ts
│   │   │   │   └── endpoints.ts
│   │   │   ├── chatbot/
│   │   │   │   ├── chatService.ts
│   │   │   │   └── types.ts
│   │   │   ├── knowledge/
│   │   │   │   ├── retriever.ts
│   │   │   │   └── types.ts
│   │   │   └── storage/
│   │   │       ├── KnowledgeStorage.ts
│   │   │       └── types.ts
│   │   │
│   │   ├── hooks/
│   │   │   ├── useChat.ts
│   │   │   ├── useKnowledge.ts
│   │   │   └── useSyncStatus.ts
│   │   │
│   │   ├── types/
│   │   │   ├── knowledge.ts
│   │   │   ├── chat.ts
│   │   │   └── profile.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── formatting.ts
│   │   │   ├── validation.ts
│   │   │   └── errors.ts
│   │   │
│   │   ├── config/
│   │   │   └── config.ts
│   │   │
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   │
│   ├── public/
│   ├── tests/
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── .env.example
│
├── backend/                           # Fastify server
│   ├── src/
│   │   ├── routes/
│   │   │   ├── chat.routes.ts
│   │   │   ├── sync.routes.ts
│   │   │   ├── health.routes.ts
│   │   │   └── admin.routes.ts
│   │   │
│   │   ├── controllers/
│   │   │   ├── ChatController.ts
│   │   │   ├── SyncController.ts
│   │   │   ├── AdminController.ts
│   │   │   └── HealthController.ts
│   │   │
│   │   ├── services/
│   │   │   ├── linkedin/
│   │   │   │   ├── LinkedInProvider.ts
│   │   │   │   └── types.ts
│   │   │   ├── github/
│   │   │   │   ├── GitHubProvider.ts
│   │   │   │   └── types.ts
│   │   │   ├── ai/
│   │   │   │   ├── AIProvider.ts (abstraction)
│   │   │   │   ├── OpenAIProvider.ts
│   │   │   │   ├── MockAIProvider.ts
│   │   │   │   └── types.ts
│   │   │   ├── knowledge/
│   │   │   │   ├── KnowledgeBuilder.ts
│   │   │   │   ├── KnowledgeMerger.ts
│   │   │   │   ├── KnowledgeValidator.ts
│   │   │   │   ├── KnowledgeNormalizer.ts
│   │   │   │   └── types.ts
│   │   │   ├── sync/
│   │   │   │   ├── SyncOrchestrator.ts
│   │   │   │   ├── SourcePoller.ts
│   │   │   │   └── ChangeDetector.ts
│   │   │   ├── chat/
│   │   │   │   ├── ChatService.ts
│   │   │   │   └── types.ts
│   │   │   └── storage/
│   │   │       ├── KnowledgeRepository.ts
│   │   │       └── types.ts
│   │   │
│   │   ├── schemas/
│   │   │   ├── knowledge.schemas.ts
│   │   │   ├── chat.schemas.ts
│   │   │   └── sync.schemas.ts
│   │   │
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts
│   │   │   ├── validation.ts
│   │   │   ├── logging.ts
│   │   │   ├── cors.ts
│   │   │   └── rateLimit.ts
│   │   │
│   │   ├── config/
│   │   │   ├── config.ts
│   │   │   ├── env.ts
│   │   │   └── providers.ts
│   │   │
│   │   ├── types/
│   │   │   ├── knowledge.ts
│   │   │   ├── profile.ts
│   │   │   ├── chat.ts
│   │   │   ├── sync.ts
│   │   │   └── providers.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── logger.ts
│   │   │   ├── errors.ts
│   │   │   ├── validators.ts
│   │   │   └── crypto.ts
│   │   │
│   │   └── server.ts
│   │
│   ├── tests/
│   ├── tsconfig.json
│   ├── package.json
│   └── .env.example
│
├── knowledge/                         # Knowledge base definitions
│   ├── schema/
│   │   ├── knowledge.schema.json
│   │   ├── profile.schema.json
│   │   └── versions/
│   │
│   ├── additional/
│   │   └── additional-knowledge.json
│   │
│   └── examples/
│       └── example-knowledge-base.json
│
├── scripts/                           # Automation & utilities
│   ├── sync.ts
│   ├── validate-knowledge.ts
│   ├── build-knowledge.ts
│   └── check-config.ts
│
├── tests/                             # Shared tests
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .ai/                               # AI development artifacts
│   ├── agents/
│   │   ├── linkedin-ingestion.md
│   │   ├── github-ingestion.md
│   │   ├── profile-normalization.md
│   │   ├── knowledge-builder.md
│   │   ├── knowledge-merger.md
│   │   ├── knowledge-validator.md
│   │   ├── knowledge-sync.md
│   │   └── chatbot-grounding.md
│   │
│   ├── skills/
│   │   ├── external-profile-integration.md
│   │   ├── profile-data-normalization.md
│   │   ├── knowledge-base-management.md
│   │   ├── indexeddb-storage.md
│   │   ├── grounded-chatbot.md
│   │   ├── prompt-security.md
│   │   └── api-error-handling.md
│   │
│   └── hooks/
│       ├── pre-sync-validation.md
│       ├── post-sync-validation.md
│       ├── pre-knowledge-publish.md
│       ├── post-knowledge-publish.md
│       └── pre-commit-quality-check.md
│
├── .github/
│   ├── copilot-instructions.md        # [EXISTS] Engineering standards
│   ├── agents/
│   ├── skills/
│   └── workflows/
│       ├── lint.yml
│       ├── test.yml
│       └── build.yml
│
├── docs/
│   ├── IMPLEMENTATION-PLAN.md         # [THIS FILE]
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── KNOWLEDGE-BASE.md
│   ├── SECURITY.md
│   ├── DEPLOYMENT.md
│   └── DEVELOPMENT-WORKFLOW.md
│
├── .env.example                       # Configuration template
├── .gitignore
├── README.md
└── package.json                       # Workspace root
```

---

## Implementation Phases

### Phase 0: Architecture ✓ IN PROGRESS
**Duration**: Immediate  
**Deliverables**:
- [ ] Documentation structure
- [ ] Project structure created
- [ ] Technology decisions documented
- [ ] Configuration template (.env.example)
- [ ] Initial AI artifacts structure
- [ ] Repository setup

**Tasks**:
1. Create docs/ with architecture.md, API.md, etc.
2. Set up .ai/ folder structure (agents, skills, hooks)
3. Create .env.example template
4. Create root README.md
5. Update .gitignore

---

### Phase 1: Backend Foundation
**Duration**: 2-3 hours  
**Deliverables**:
- Backend package.json with Fastify, TypeScript, Zod
- Project structure with tsconfig
- Fastify server initialization
- Error handling middleware
- Request validation middleware
- Health check endpoint
- Logging setup
- Configuration loading from .env

**Tasks**:
1. Initialize backend/package.json
2. Install: fastify, typescript, zod, dotenv, ts-node
3. Create src/server.ts with Fastify initialization
4. Create src/config/config.ts (environment loading)
5. Create src/middleware/ (error, validation, logging)
6. Create src/routes/health.ts
7. Create src/utils/logger.ts
8. Set up tsconfig.json with strict mode

**Quality Gates**:
- TypeScript compiles without errors
- Lint passes
- Server starts and responds to health endpoint

---

### Phase 2: Frontend Foundation
**Duration**: 2-3 hours  
**Deliverables**:
- Frontend Vite + React + TypeScript setup
- Basic layout and routing
- API client abstraction
- IndexedDB abstraction (Dexie)
- Chat UI shell
- TypeScript configuration

**Tasks**:
1. Initialize frontend/package.json
2. Set up Vite + React + TypeScript
3. Create src/App.tsx with basic layout
4. Create src/services/api/client.ts (HTTP client)
5. Create src/services/storage/KnowledgeStorage.ts (IndexedDB)
6. Create src/components/Chat/ChatInterface.tsx (shell)
7. Create src/config/config.ts
8. Set up tsconfig.json

**Quality Gates**:
- React app compiles
- TypeScript has no errors
- Chat shell renders
- Can open browser to localhost:5173

---

### Phase 3: GitHub Provider Implementation
**Duration**: 2-3 hours  
**Deliverables**:
- GitHubProvider with full profile + repo retrieval
- Error handling (rate limits, auth failures)
- Change detection (hash-based)
- Caching
- Mock provider for development
- Tests

**Tasks**:
1. Create src/services/github/types.ts (define interfaces)
2. Create src/services/github/GitHubProvider.ts (real implementation)
3. Create src/services/github/MockGitHubProvider.ts
4. Implement: profile fetch, repo fetch, rate limit handling
5. Add caching layer
6. Add hash-based change detection
7. Write unit tests
8. Create .ai/agents/github-ingestion.md

**Quality Gates**:
- Tests pass (with mock provider)
- Real provider can fetch data (when configured)
- Rate limit headers respected
- Error cases handled

---

### Phase 4: LinkedIn Provider Implementation
**Duration**: 3-4 hours  
**Deliverables**:
- LinkedInProvider abstraction
- OAuth 2.0 or API integration (based on available access)
- If restricted: clear mock implementation + documentation
- Error handling
- Token refresh logic
- Mock provider
- Tests

**Tasks**:
1. Assess available LinkedIn API access
2. Create src/services/linkedin/types.ts
3. Create src/services/linkedin/LinkedInProvider.ts
4. Create src/services/linkedin/MockLinkedInProvider.ts
5. Implement authentication method (OAuth or token-based)
6. Implement profile data retrieval
7. Implement experience/education/skills retrieval
8. Add error handling for auth/permission/rate limit
9. Write tests
10. Document LinkedIn setup in README
11. Create .ai/agents/linkedin-ingestion.md

**Quality Gates**:
- Mock provider works end-to-end
- Real provider works if credentials available
- Clear documentation of requirements
- Tests pass

---

### Phase 5: Normalization & Profile Model
**Duration**: 2-3 hours  
**Deliverables**:
- Unified profile schema (TypeScript + Zod)
- Normalization layer (LinkedIn → Profile)
- Normalization layer (GitHub → Profile)
- Provenance tracking
- Tests

**Tasks**:
1. Create src/types/profile.ts (unified model)
2. Create src/schemas/profile.schema.ts (Zod)
3. Create src/services/knowledge/KnowledgeNormalizer.ts
4. Implement normalizeLinkedInProfile()
5. Implement normalizeGitHubProfile()
6. Add provenance metadata to every fact
7. Write normalization tests
8. Create .ai/agents/profile-normalization.md
9. Create .ai/skills/profile-data-normalization.md

**Quality Gates**:
- Zod schemas compile
- LinkedIn → unified model works
- GitHub → unified model works
- Provenance preserved
- Tests pass

---

### Phase 6: Knowledge Engine
**Duration**: 4-5 hours  
**Deliverables**:
- KnowledgeBuilder (generates structured KB from normalized data)
- KnowledgeMerger (merges normalized + additional knowledge)
- KnowledgeValidator (schema + semantic validation)
- KnowledgeRepository (reads/writes KB to backend)
- Tests

**Tasks**:
1. Create src/types/knowledge.ts (KB schema)
2. Create src/schemas/knowledge.schemas.ts (Zod)
3. Create knowledge/schema/knowledge.schema.json
4. Create src/services/knowledge/KnowledgeBuilder.ts
5. Create src/services/knowledge/KnowledgeMerger.ts
6. Create src/services/knowledge/KnowledgeValidator.ts
7. Create src/services/storage/KnowledgeRepository.ts
8. Implement: generate, merge, validate, version
9. Write comprehensive tests
10. Create .ai/agents/knowledge-builder.md
11. Create .ai/agents/knowledge-merger.md
12. Create .ai/agents/knowledge-validator.md
13. Create .ai/skills/knowledge-base-management.md

**Quality Gates**:
- Knowledge schemas defined and validated
- Builder generates KB from normalized profiles
- Merger combines LinkedIn + GitHub + manual knowledge
- Validator catches schema violations
- Tests pass (unit + integration)

---

### Phase 7: IndexedDB Storage
**Duration**: 1-2 hours  
**Deliverables**:
- Dexie database setup
- KnowledgeStorage implementation (frontend)
- Atomic versioning and replacement
- Offline capability
- Tests

**Tasks**:
1. Install Dexie in frontend
2. Create src/services/storage/KnowledgeStorage.ts
3. Define IndexedDB schema (versions table, metadata table)
4. Implement: getActiveKB, saveVersion, markActive, replaceKB
5. Implement atomic transaction logic
6. Test: write, read, replacement, corruption recovery
7. Create .ai/skills/indexeddb-storage.md

**Quality Gates**:
- IndexedDB stores KB successfully
- Can retrieve locally
- Replacement is atomic
- Offline load works
- Tests pass

---

### Phase 8: Chatbot Implementation
**Duration**: 3-4 hours  
**Deliverables**:
- Chat message classification
- Greeting response generation
- Knowledge retrieval from KB
- Prompt engineering + system prompt
- LLM response generation
- Output validation
- Tests

**Tasks**:
1. Create src/services/knowledge/KnowledgeRetriever.ts
2. Create src/services/chatbot/ChatService.ts
3. Create message classifier (greeting vs. knowledge question)
4. Implement greeting responses
5. Implement knowledge retrieval logic
6. Create system prompt template
7. Create OpenAI integration in backend
8. Implement response validation
9. Implement hallucination prevention checks
10. Write comprehensive tests (greetings, questions, unknown info)
11. Create .ai/agents/chatbot-grounding.md
12. Create .ai/skills/grounded-chatbot.md

**Quality Gates**:
- Greetings handled naturally
- Knowledge questions retrieve KB sections
- Unknown questions responded appropriately
- Prompt injection attempts fail
- No hallucinated information
- Tests pass

---

### Phase 9: Sync Orchestration
**Duration**: 2-3 hours  
**Deliverables**:
- SyncOrchestrator (coordinates full sync pipeline)
- ChangeDetector (hashes for each source)
- SyncState tracking
- Rollback capability
- Sync API endpoint
- Tests

**Tasks**:
1. Create src/services/sync/SyncOrchestrator.ts
2. Create src/services/sync/ChangeDetector.ts
3. Implement: fetch LinkedIn, fetch GitHub, normalize, build KB, merge, validate, version, publish
4. Implement change detection (skip rebuild if unchanged)
5. Implement rollback (keep previous version)
6. Create POST /api/sync endpoint
7. Create GET /api/sync/status endpoint
8. Implement long-running sync with status tracking
9. Write integration tests
10. Create .ai/agents/knowledge-sync.md

**Quality Gates**:
- Full sync pipeline works end-to-end
- Changes detected correctly
- Rollback works
- API endpoints functional
- Tests pass

---

### Phase 10: Security Hardening
**Duration**: 2-3 hours  
**Deliverables**:
- Input validation middleware
- Rate limiting
- CORS configuration
- Secret protection (.env)
- Prompt injection defenses
- Error message sanitization
- Authentication (if needed)

**Tasks**:
1. Add Fastify rate limiter middleware
2. Configure CORS (restrict origins)
3. Add request size limits
4. Add input validation for all endpoints
5. Implement prompt injection detection in chat
6. Sanitize error messages (no stack traces)
7. Add secret detection in logging
8. Secure .env handling
9. Add request signing if needed
10. Security tests
11. Create .ai/skills/prompt-security.md
12. Create .ai/skills/api-error-handling.md

**Quality Gates**:
- Rate limiting works
- CORS properly configured
- No secrets logged
- Prompt injection blocked
- Errors sanitized

---

### Phase 11: Testing & Quality
**Duration**: 4-5 hours  
**Deliverables**:
- Unit tests (all services)
- Integration tests (provider + knowledge + sync)
- E2E tests (full user flow)
- Lint and format pass
- TypeScript strict mode clean

**Tasks**:
1. Write unit tests for all major services
2. Write integration tests (LinkedIn + KB generation)
3. Write integration tests (GitHub + KB generation)
4. Write E2E tests (open app → ask question → receive KB-grounded answer)
5. Run linter and fix issues
6. Run TypeScript compiler (strict mode)
7. Achieve >70% code coverage
8. Document test commands in README

**Quality Gates**:
- All tests pass
- Lint passes
- TypeScript clean
- Coverage >70%

---

### Phase 12: CI/CD & Deployment
**Duration**: 2 hours  
**Deliverables**:
- GitHub Actions workflows
- Lint CI
- Test CI
- Build CI
- Deployment documentation
- Environment setup guide

**Tasks**:
1. Create .github/workflows/lint.yml
2. Create .github/workflows/test.yml
3. Create .github/workflows/build.yml
4. Document environment variable setup
5. Document deployment steps (frontend + backend)
6. Create DEPLOYMENT.md
7. Create DEVELOPMENT-WORKFLOW.md

**Quality Gates**:
- CI pipeline passes on all commits
- Build succeeds
- Tests run automatically

---

### Phase 13: Final Audit & AI Artifacts
**Duration**: 2-3 hours  
**Deliverables**:
- All agents documented
- All skills documented
- All hooks documented
- Architecture reviewed
- Security audit
- Documentation complete
- Known limitations listed

**Tasks**:
1. Audit architecture against requirements
2. Audit security implementation
3. Create missing agent/skill/hook files
4. Finalize all documentation
5. Create comprehensive README
6. Document all external dependencies
7. List known limitations
8. Create final report

**Quality Gates**:
- All requirements met
- Security audit passed
- AI artifacts complete
- Documentation comprehensive

---

## External Configuration Required

### LinkedIn Integration
- **Requirement**: Access to LinkedIn API or mock implementation
- **If Using Official API**:
  - Client ID: `LINKEDIN_CLIENT_ID`
  - Client Secret: `LINKEDIN_CLIENT_SECRET`
  - Redirect URI: `LINKEDIN_REDIRECT_URI`
  - Requested scopes: profile, email (or available)
  - OAuth 2.0 flow
- **If Not Available**: MockLinkedInProvider with documentation

### GitHub Integration
- **Requirement**: Public data (no auth required for basic profile)
- **Optional**: GitHub token for higher rate limits
  - Token: `GITHUB_TOKEN`
  - Rate limit: 60/hour (unauthenticated) vs 5000/hour (authenticated)

### AI Provider
- **Initial Provider**: OpenAI
  - API Key: `OPENAI_API_KEY`
  - Model: `gpt-4` or `gpt-4-turbo-preview`
- **Alternative**: Anthropic Claude
  - API Key: `ANTHROPIC_API_KEY`
  - Model: `claude-3-sonnet`
- **Development**: MockAIProvider (no key needed)

### Profile Configuration
- **Display Name**: `PROFILE_DISPLAY_NAME` (e.g., "John Doe")
- **LinkedIn URL/ID**: `PROFILE_LINKEDIN_ID` (e.g., "johndoe" or "john-doe-123")
- **GitHub Username**: `PROFILE_GITHUB_USERNAME` (e.g., "johndoe")

---

## Dependencies Summary

### Frontend (package.json)
```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "dexie": "^3.x",
    "zod": "^3.x",
    "axios": "^1.x"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.x",
    "vite": "^4.x",
    "typescript": "^5.x",
    "tailwindcss": "^3.x"
  }
}
```

### Backend (package.json)
```json
{
  "dependencies": {
    "fastify": "^4.x",
    "zod": "^3.x",
    "dotenv": "^16.x",
    "axios": "^1.x",
    "node-cache": "^5.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "@types/node": "^20.x",
    "ts-node": "^10.x"
  }
}
```

---

## Success Criteria - Definition of Done

The project is complete when:

- [x] Phase 0: Architecture documented
- [ ] Phase 1: Backend foundation working
- [ ] Phase 2: Frontend foundation working
- [ ] Phase 3: GitHub provider implemented
- [ ] Phase 4: LinkedIn provider (real or mock)
- [ ] Phase 5: Profile normalization complete
- [ ] Phase 6: Knowledge engine complete
- [ ] Phase 7: IndexedDB storage working
- [ ] Phase 8: Chatbot responding correctly
- [ ] Phase 9: Sync pipeline orchestrated
- [ ] Phase 10: Security hardening complete
- [ ] Phase 11: Tests passing (>70% coverage)
- [ ] Phase 12: CI/CD configured
- [ ] Phase 13: Final audit passed
- [ ] No secrets in Git
- [ ] No fabricated facts in chatbot
- [ ] Provenance tracked for all facts
- [ ] Offline capability works
- [ ] Admin panel functional
- [ ] Error handling complete
- [ ] Documentation comprehensive
- [ ] AI artifacts (agents/skills/hooks) complete
- [ ] TypeScript strict mode clean
- [ ] Lint passes
- [ ] All endpoints tested
- [ ] RAG-ready architecture

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| LinkedIn API access unavailable | Medium | High | Use mock provider, document clearly |
| AI API rate limiting | Low | Medium | Implement backoff, queue management |
| IndexedDB quota exceeded | Low | Medium | Implement cleanup, version rotation |
| Hallucination in AI responses | Medium | Critical | Validate responses, refuse unknown facts |
| Secret exposure | Low | Critical | .env protection, secret scanning |
| Performance issues at scale | Low | Medium | Caching, pagination, lazy loading |
| Sync data corruption | Low | Critical | Atomic transactions, rollback capability |

---

## Next Steps

1. **Immediately**: Create documentation structure (docs/ folder)
2. **Then**: Set up .ai/ folder for agents/skills/hooks
3. **Then**: Begin Phase 1 (Backend Foundation)
4. **Continuous**: Create agents/skills/hooks as features are built
5. **Quality**: Run full quality gate after each phase

---

## References

- `.github/copilot-instructions.md` — Engineering standards
- Master Implementation Prompt — Complete requirements
- This file — Implementation phases and structure

---

**Document Version**: 1.0.0  
**Status**: PHASE 0 — Planning  
**Next Review**: After Phase 1 completion
