# Profile AI Knowledge System & Grounded Chatbot

> An AI-powered professional profile knowledge system that retrieves information from LinkedIn and GitHub, generates a structured knowledge base, and provides a conversational chatbot grounded in that knowledge.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Features](#features)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Development](#development)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Knowledge Base](#knowledge-base)
- [Testing](#testing)
- [Security](#security)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/KuruvillaChatBot.git
cd KuruvillaChatBot

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your configuration

# Start development servers
npm run dev:backend    # Terminal 1
npm run dev:frontend   # Terminal 2
```

### First Time Setup

1. **Configure Profile**:
   ```bash
   # .env
   PROFILE_DISPLAY_NAME="Your Name"
   PROFILE_GITHUB_USERNAME="your-github"
   PROFILE_LINKEDIN_ID="your-linkedin" (if available)
   ```

2. **Set up API Keys**:
   ```bash
   # GitHub (optional, for higher rate limits)
   GITHUB_TOKEN="your-github-token"
   
   # AI Provider (OpenAI or Anthropic)
   AI_PROVIDER="openai"
   OPENAI_API_KEY="sk-..."
   
   # LinkedIn (if official API available)
   LINKEDIN_CLIENT_ID="..."
   LINKEDIN_CLIENT_SECRET="..."
   LINKEDIN_REDIRECT_URI="http://localhost:3000/auth/linkedin/callback"
   ```

3. **Sync Profile Data**:
   ```bash
   # Fetch and generate knowledge base
   npm run sync
   ```

4. **Open Application**:
   ```
   Frontend: http://localhost:5173
   Backend:  http://localhost:3000
   Admin:    http://localhost:5173/admin
   ```

---

## Project Overview

### What This Project Does

```
LinkedIn Profile
       ↓
   [Fetch Data]
       ↓
   [Normalize]
       ├─ Extract: experience, education, skills
       ├─ Validate: dates, formats
       └─ Track: source, retrieval time

GitHub Profile
       ↓
   [Fetch Data]
       ↓
   [Normalize]
       ├─ Extract: repos, languages, contributions
       ├─ Validate: availability, quality
       └─ Track: source, retrieval time

       ↓
    [Merge]
       ├─ Combine sources
       ├─ Resolve conflicts
       └─ Preserve manual overrides

       ↓
    [Validate & Version]
       ├─ Schema validation
       ├─ Semantic checks
       └─ Create immutable version

       ↓
    [Publish to Browser]
       ├─ Store in IndexedDB
       ├─ Enable offline use
       └─ Update chatbot context

       ↓
    [Chatbot]
       ├─ "Hello" → Natural response
       ├─ "What's your experience?" → Grounded answer from KB
       └─ "Unknown question" → "I don't have that info"
```

### Key Principles

1. **Source-Grounded**: All facts come from LinkedIn/GitHub/Manual
2. **No Hallucination**: Chatbot refuses to invent missing information
3. **Immutable Versions**: Knowledge base history preserved
4. **Offline Capable**: Works from cached knowledge base
5. **Modular**: Each component has one responsibility
6. **Vendor-Independent**: AI provider can be swapped
7. **RAG-Ready**: Architecture supports future vector search

---

## Architecture

### High-Level Components

```
Browser Frontend (React)
    ↓ REST API
Fastify Backend (Node.js)
    ├─ LinkedIn Adapter
    ├─ GitHub Adapter
    ├─ AI Provider (abstraction)
    └─ Knowledge Engine
        ├─ Normalizer
        ├─ Builder
        ├─ Merger
        └─ Validator
```

### Data Flow

```
External APIs → Normalize → Build KB → Merge → Validate → Version → Browser Storage → Retrieval → Chat
```

### Directory Structure

```
KuruvillaChatBot/
├── frontend/                  # React application
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── services/         # Business logic
│   │   ├── hooks/            # Custom React hooks
│   │   ├── types/            # TypeScript types
│   │   └── App.tsx
│   └── package.json
│
├── backend/                   # Node.js/Fastify server
│   ├── src/
│   │   ├── routes/           # HTTP endpoints
│   │   ├── controllers/      # Request handlers
│   │   ├── services/         # Business logic
│   │   ├── providers/        # External API adapters
│   │   ├── schemas/          # Zod validation
│   │   └── server.ts
│   └── package.json
│
├── knowledge/                 # Knowledge base definitions
│   ├── schema/               # JSON schemas
│   └── additional/           # Manual knowledge
│
├── .ai/                       # AI development artifacts
│   ├── agents/               # Multi-step workflows
│   ├── skills/               # Reusable procedures
│   └── hooks/                # Lifecycle automation
│
├── docs/                      # Documentation
│   ├── ARCHITECTURE.md
│   ├── IMPLEMENTATION-PLAN.md
│   ├── API.md
│   └── ...
│
└── README.md                  # This file
```

---

## Technology Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **Vite** | Build tool |
| **Tailwind CSS** | Styling |
| **Dexie.js** | IndexedDB abstraction |
| **Zod** | Runtime validation |
| **Axios** | HTTP client |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js** | Runtime |
| **Fastify** | Web framework |
| **TypeScript** | Type safety |
| **Zod** | Schema validation |
| **Axios** | HTTP client |
| **node-cache** | In-memory caching |

### External APIs
| Service | Purpose |
|---------|---------|
| **LinkedIn** | Profile data (if available) |
| **GitHub** | Repo & profile data |
| **OpenAI/Anthropic** | LLM for responses |

### Development
| Tool | Purpose |
|------|---------|
| **Vitest** | Unit testing |
| **Playwright** | E2E testing |
| **ESLint** | Linting |
| **Prettier** | Code formatting |
| **TypeScript** | Type checking |

---

## Features

### Implemented (MVP Phase)

- ✓ React frontend with chat interface
- ✓ Fastify backend API
- ✓ GitHub provider integration
- ✓ LinkedIn provider (mock or real, depending on access)
- ✓ Profile normalization
- ✓ Knowledge base generation
- ✓ Knowledge validation and versioning
- ✓ IndexedDB storage in browser
- ✓ Chatbot with greeting recognition
- ✓ Knowledge-grounded responses
- ✓ Hallucination prevention
- ✓ Sync orchestration
- ✓ Offline capability

### Planned (Future)

- [ ] Vector embeddings + semantic search (RAG)
- [ ] Voice/speech input and output
- [ ] Conversation memory
- [ ] 3D avatar
- [ ] Multiple profiles
- [ ] GraphQL API (alternative to REST)
- [ ] PostgreSQL database
- [ ] Authentication & multi-user
- [ ] Analytics dashboard
- [ ] Webhook integrations

---

## Getting Started

### Installation Steps

#### 1. Clone Repository
```bash
git clone https://github.com/yourusername/KuruvillaChatBot.git
cd KuruvillaChatBot
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Configure Environment

Copy the template:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```bash
# Profile Configuration
PROFILE_DISPLAY_NAME="John Doe"
PROFILE_GITHUB_USERNAME="johndoe"
PROFILE_LINKEDIN_ID="johndoe-12345"  # If using LinkedIn

# GitHub Configuration
GITHUB_TOKEN="ghp_xxxxxxxxxxxx"  # Optional, for higher rate limits

# AI Provider Configuration
AI_PROVIDER="openai"  # or "anthropic"
OPENAI_API_KEY="sk-..."
# OR
ANTHROPIC_API_KEY="sk-ant-..."

# LinkedIn Configuration (if using official API)
LINKEDIN_CLIENT_ID="..."
LINKEDIN_CLIENT_SECRET="..."
LINKEDIN_REDIRECT_URI="http://localhost:3000/auth/linkedin/callback"

# Application Configuration
NODE_ENV="development"
PORT=3000
FRONTEND_URL="http://localhost:5173"
```

#### 4. Start Development Servers

**Terminal 1 - Backend**:
```bash
npm run dev:backend
```

**Terminal 2 - Frontend**:
```bash
npm run dev:frontend
```

#### 5. Open Application
- Frontend: http://localhost:5173
- API: http://localhost:3000
- Health: http://localhost:3000/api/health

---

## Configuration

### Environment Variables

#### Profile
- `PROFILE_DISPLAY_NAME` - Name shown in chatbot
- `PROFILE_GITHUB_USERNAME` - GitHub username to fetch
- `PROFILE_LINKEDIN_ID` - LinkedIn profile ID or username

#### GitHub
- `GITHUB_TOKEN` - Optional GitHub personal access token (for rate limits)

#### AI Provider
- `AI_PROVIDER` - `"openai"` or `"anthropic"` (default: `"openai"`)
- `OPENAI_API_KEY` - OpenAI API key (if using OpenAI)
- `ANTHROPIC_API_KEY` - Anthropic API key (if using Anthropic)

#### LinkedIn (if available)
- `LINKEDIN_CLIENT_ID` - OAuth client ID
- `LINKEDIN_CLIENT_SECRET` - OAuth client secret
- `LINKEDIN_REDIRECT_URI` - OAuth redirect URL

#### Development
- `NODE_ENV` - `"development"` or `"production"`
- `PORT` - Backend port (default: 3000)
- `FRONTEND_URL` - Frontend URL for CORS

### Profiles

**Development Mode** (mock providers):
```bash
AI_PROVIDER="mock"
GITHUB_TOKEN=""  # Will use mock data
```

**Production Mode** (real APIs):
```bash
AI_PROVIDER="openai"
OPENAI_API_KEY="sk-..."
GITHUB_TOKEN="ghp_..."
LINKEDIN_CLIENT_ID="..."  # If available
```

---

## Development

### Running Tests

```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# All tests
npm run test

# Coverage
npm run test:coverage
```

### Linting & Formatting

```bash
# Check linting
npm run lint

# Fix linting
npm run lint:fix

# Format code
npm run format

# Type check
npm run typecheck
```

### Building

```bash
# Build frontend
npm run build:frontend

# Build backend
npm run build:backend

# Build both
npm run build
```

### Project Scripts

```bash
# Synchronize knowledge base
npm run sync

# Validate knowledge base
npm run validate:knowledge

# Build knowledge base
npm run build:knowledge

# Check configuration
npm run check:config

# Clean build artifacts
npm run clean
```

---

## Deployment

### Frontend Deployment

```bash
# Build static site
npm run build:frontend

# Deploy dist/ folder to:
# - Vercel
# - Netlify
# - AWS S3 + CloudFront
# - GitHub Pages
# - Any static host
```

### Backend Deployment

```bash
# Build
npm run build:backend

# Deploy to:
# - Heroku: git push heroku main
# - Railway: railway up
# - Fly.io: flyctl deploy
# - DigitalOcean: Deploy with droplet + systemd
# - AWS Lambda (with serverless framework)
# - Docker container
```

### Docker (Optional)

```dockerfile
# Build backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build:backend
EXPOSE 3000
CMD ["npm", "run", "start:backend"]
```

### Environment in Production

```bash
# Use secret manager:
# - AWS Secrets Manager
# - HashiCorp Vault
# - GitHub Secrets (for CI/CD)
# - Railway/Fly.io environment variables

# Never commit .env to Git
```

---

## API Documentation

### Chat Endpoint

```http
POST /api/chat
Content-Type: application/json

{
  "message": "What projects have you built?",
  "conversation": [
    {
      "role": "user",
      "content": "Hello"
    },
    {
      "role": "assistant",
      "content": "Hi there!"
    }
  ]
}
```

**Response**:
```json
{
  "answer": "I've built several projects including...",
  "sources": [
    {
      "type": "github",
      "url": "https://github.com/..."
    }
  ],
  "knowledgeBaseVersion": "1.2.0"
}
```

### Sync Endpoint

```http
POST /api/sync

Response:
{
  "status": "syncing",
  "progress": 0.5,
  "message": "Fetching GitHub data..."
}
```

### Health Endpoint

```http
GET /api/health

Response:
{
  "status": "ok",
  "version": "1.0.0",
  "knowledge_base_version": "1.2.0"
}
```

See [docs/API.md](docs/API.md) for complete API documentation.

---

## Knowledge Base

The knowledge base is a structured, versioned JSON document containing:

- **Profile Information**: Name, title, bio, contact
- **Experience**: Employment history with companies, roles, dates
- **Education**: Degrees, schools, graduation dates
- **Skills**: Technical skills, languages, tools
- **Projects**: GitHub repositories, personal projects
- **Achievements**: Awards, certifications, publications
- **Metadata**: Sources, version, generated timestamp

### Schema

See [knowledge/schema/knowledge.schema.json](knowledge/schema/knowledge.schema.json) for the complete schema.

### Additional Knowledge

Manual overrides are stored in [knowledge/additional/additional-knowledge.json](knowledge/additional/additional-knowledge.json):

```json
{
  "version": 1,
  "entries": [
    {
      "id": "custom-001",
      "category": "personality",
      "content": "Passionate about open source",
      "enabled": true
    }
  ]
}
```

See [docs/KNOWLEDGE-BASE.md](docs/KNOWLEDGE-BASE.md) for complete documentation.

---

## Testing

### Test Structure

```
tests/
├── unit/                  # Individual function tests
│   ├── services/
│   ├── utils/
│   └── validation/
├── integration/           # Multi-component tests
│   ├── knowledge-engine/
│   ├── providers/
│   └── sync/
└── e2e/                   # Full user flow tests
    ├── chat.spec.ts
    ├── sync.spec.ts
    └── admin.spec.ts
```

### Running Tests

```bash
# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Specific test
npm run test -- services/knowledge

# E2E
npm run test:e2e
```

### Mocking

Development uses mock implementations:
- `MockLinkedInProvider`
- `MockGitHubProvider`
- `MockAIProvider`
- `MockKnowledgeStorage`

These allow full testing without API credentials.

---

## Security

### Key Security Features

1. **No Hallucination**: Chatbot refuses to invent facts
2. **Provenance Tracking**: All facts traceable to source
3. **Atomic Updates**: Knowledge base never partially updated
4. **Input Validation**: All user input validated
5. **Rate Limiting**: Protected against abuse
6. **Prompt Injection Defense**: System prompt protected
7. **Secret Protection**: Credentials never exposed
8. **CORS Configured**: Origin restrictions in place

### Security Best Practices

- **Never** commit `.env` to Git
- **Never** expose API keys to frontend
- **Always** validate external API responses
- **Always** sanitize error messages
- **Use** HTTPS in production
- **Rotate** credentials regularly
- **Monitor** logs for suspicious activity

See [docs/SECURITY.md](docs/SECURITY.md) for complete security guidelines.

---

## Troubleshooting

### Common Issues

#### "API key not found"
```bash
# Solution: Check .env file has OPENAI_API_KEY or ANTHROPIC_API_KEY
cat .env | grep API_KEY
```

#### "GitHub rate limit exceeded"
```bash
# Solution: Add GitHub token to .env
GITHUB_TOKEN="ghp_..."
```

#### "IndexedDB quota exceeded"
```bash
# Solution: Clear browser storage or delete old KB versions
# In browser console: indexedDB.deleteDatabase('ProfileAI_DB')
```

#### "LinkedIn provider not responding"
```bash
# Solution: Switch to mock provider
AI_PROVIDER="mock"
# Check network in browser DevTools
```

#### "Knowledge base validation failed"
```bash
# Solution: Check additional knowledge JSON format
npm run validate:knowledge
```

### Debug Mode

Enable verbose logging:
```bash
DEBUG=* npm run dev:backend
```

### Logs

- Backend logs: `./logs/app.log`
- Browser console: DevTools → Console tab

---

## Contributing

### Development Workflow

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature
   ```

2. Implement feature with tests:
   ```bash
   npm run dev          # Start servers
   npm run test:watch   # Run tests
   ```

3. Run quality gates:
   ```bash
   npm run lint
   npm run typecheck
   npm run test
   ```

4. Create pull request

### Code Standards

See [.github/copilot-instructions.md](.github/copilot-instructions.md) for comprehensive engineering standards.

### AI Development Artifacts

Significant features should have corresponding:
- **Agent** (.ai/agents/) - Multi-step workflow
- **Skill** (.ai/skills/) - Reusable procedure
- **Hook** (.ai/hooks/) - Lifecycle automation

---

## Architecture & Design

- [ARCHITECTURE.md](docs/ARCHITECTURE.md) - System design and components
- [IMPLEMENTATION-PLAN.md](docs/IMPLEMENTATION-PLAN.md) - Phased development plan
- [API.md](docs/API.md) - REST API specification
- [KNOWLEDGE-BASE.md](docs/KNOWLEDGE-BASE.md) - Knowledge base design
- [SECURITY.md](docs/SECURITY.md) - Security architecture
- [DEPLOYMENT.md](docs/DEPLOYMENT.md) - Deployment guide
- [DEVELOPMENT-WORKFLOW.md](docs/DEVELOPMENT-WORKFLOW.md) - Developer guide

---

## License

MIT License - see LICENSE file for details

---

## Support

- **Documentation**: See `docs/` folder
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Security**: Report to maintainers privately

---

## Project Status

**Current Phase**: 0 (Architecture) → Phase 1 (Backend Foundation)

**Implementation Progress**:
- [ ] Phase 0: Architecture ✓ (In progress)
- [ ] Phase 1: Backend Foundation
- [ ] Phase 2: Frontend Foundation
- [ ] Phase 3: GitHub Provider
- [ ] Phase 4: LinkedIn Provider
- [ ] Phase 5: Normalization
- [ ] Phase 6: Knowledge Engine
- [ ] Phase 7: IndexedDB Storage
- [ ] Phase 8: Chatbot
- [ ] Phase 9: Sync Orchestration
- [ ] Phase 10: Security
- [ ] Phase 11: Testing
- [ ] Phase 12: CI/CD
- [ ] Phase 13: Final Audit

See [IMPLEMENTATION-PLAN.md](docs/IMPLEMENTATION-PLAN.md) for detailed phase breakdown.

---

**Last Updated**: 2025-01-15  
**Maintainer**: Development Team  
**Repository**: https://github.com/yourusername/KuruvillaChatBot
