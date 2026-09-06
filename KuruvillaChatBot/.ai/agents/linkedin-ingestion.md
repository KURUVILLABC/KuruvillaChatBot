# LinkedIn Data Ingestion Agent

## Purpose

Fetch, normalize, and validate profile data from LinkedIn's official API (if available) or provide a well-documented mock implementation for development.

## Responsibilities

1. **Authenticate** with LinkedIn using OAuth 2.0 or API access
2. **Fetch** profile data: personal info, experience, education, skills, certifications
3. **Transform** raw LinkedIn API response to unified ProfileData model
4. **Validate** data completeness and format
5. **Track** provenance (when fetched, source URL, external ID)
6. **Handle** errors: auth failures, rate limits, permission issues
7. **Implement** fallback: clear mock provider if real API unavailable

## Inputs

- LinkedIn configuration (client ID, secret, redirect URI)
- Profile identifier (LinkedIn username or profile URL)
- Previous cached data (for change detection)

## Outputs

- `LinkedInData` object containing:
  - Profile basics (name, title, headline, location, photo)
  - Experience array (company, role, dates, description)
  - Education array (school, degree, field, dates)
  - Skills array (skill name, endorsements)
  - Certifications
  - Metadata (source, retrieved timestamp, API response hash)

## Workflow

### Real Implementation Path (if API available)

```
1. Check configuration
   └─ If missing: switch to MockLinkedInProvider

2. Authenticate
   ├─ OAuth 2.0 flow if needed
   └─ Get access token

3. Fetch profile data
   ├─ Call /me endpoint
   ├─ Call /experiences endpoint
   ├─ Call /education endpoint
   └─ Call /skills endpoint

4. Handle API responses
   ├─ Check HTTP status
   ├─ Validate JSON structure
   └─ Retry on transient failure

5. Normalize data
   ├─ Map API fields to unified model
   ├─ Validate dates and formats
   └─ Extract clean facts

6. Attach provenance
   ├─ Record source: "linkedin"
   ├─ Record timestamp: "2025-01-15T10:30:00Z"
   └─ Record external IDs

7. Return LinkedInData
   └─ Ready for merging with other sources
```

### Mock Implementation Path (if API unavailable)

```
1. Detect missing configuration
   └─ Log: "LinkedIn API not configured, using mock provider"

2. Return realistic test data
   ├─ Example profile: realistic person
   ├─ Example experience: 3-4 jobs
   ├─ Example education: 2 degrees
   └─ Example skills: 15-20 skills

3. Clearly mark as mock
   ├─ Log warning when initialized
   ├─ Add note in metadata: "source": "mock"
   └─ Potentially add watermark: "[MOCK DATA - NOT REAL]"
```

## Tools / Services Used

- **HTTP Client**: Axios (for API requests)
- **OAuth**: passport-linkedin-oauth2 or manual OAuth flow
- **Validation**: Zod schema validation
- **Caching**: node-cache (to avoid redundant API calls)
- **Logger**: Structured logger (winston or pino)

## Rules

1. **Never scrape LinkedIn** — Use official API only
2. **Respect rate limits** — 200 requests/day (standard API limit)
3. **Preserve authenticity** — Don't invent missing data
4. **Track source** — Every fact must have source metadata
5. **Handle expiration** — Token refresh logic for OAuth
6. **Fail gracefully** — Return mock data or error message, never crash

## Failure Handling

| Failure | Behavior |
|---------|----------|
| Invalid credentials | Log error, switch to mock, document requirement |
| Rate limit exceeded | Backoff and retry, or use cached data |
| Network timeout | Retry with exponential backoff (max 3 attempts) |
| API returns 403 (permission denied) | Log error, document required scope |
| Malformed response | Log raw response, validate against schema |
| No cached data available | Return empty profile, prompt user to configure |

## Validation

- Schema validation using Zod
- Data types: all dates are ISO 8601 strings
- All arrays are non-null
- Required fields are present
- URLs are valid if provided

## Example Execution

```typescript
// Initialize the provider
const provider = new LinkedInProvider({
  clientId: process.env.LINKEDIN_CLIENT_ID,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  redirectUri: process.env.LINKEDIN_REDIRECT_URI,
});

// Or fallback to mock
const provider = new MockLinkedInProvider();

// Fetch data
const data = await provider.fetchProfile("bill-gates");

// Result:
{
  profile: {
    name: "Bill Gates",
    title: "Co-chair, Bill & Melinda Gates Foundation",
    bio: "...",
    photo: "..."
  },
  experience: [
    {
      company: "Microsoft",
      role: "Co-founder & Former CEO",
      startDate: "1975-04-04",
      endDate: "2000-01-13",
      description: "..."
    }
  ],
  metadata: {
    source: "linkedin",
    retrievedAt: "2025-01-15T10:30:00Z",
    apiResponseHash: "abc123..."
  }
}
```

---

**Agent Version**: 1.0  
**Status**: To be implemented (Phase 4)  
**Complexity**: Medium (OAuth + rate limiting)
