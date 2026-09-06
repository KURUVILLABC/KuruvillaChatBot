# GitHub Data Ingestion Agent

## Purpose

Fetch, normalize, and validate public GitHub profile data and repositories for a target user.

## Responsibilities

1. **Fetch** profile: username, bio, company, location, followers, repos
2. **Fetch** repositories: names, descriptions, stars, languages, topics
3. **Extract** useful metadata: primary languages, most popular projects
4. **Transform** raw GitHub API response to unified ProfileData model
5. **Handle** rate limits and pagination
6. **Implement** caching to avoid redundant API calls
7. **Track** source and retrieval timestamp
8. **Handle** errors gracefully

## Inputs

- GitHub username (public)
- Optional GitHub token (for higher rate limits: 60 → 5000 requests/hour)
- Previous cached data (for change detection)

## Outputs

- `GitHubData` object containing:
  - Profile basics (name, bio, location, company, avatar, followers)
  - Repositories array (name, description, language, stars, topics, URL)
  - Primary languages (computed from repos)
  - GitHub URL
  - Metadata (source, retrieved timestamp, last modified)

## Workflow

```
1. Validate configuration
   └─ Check username is provided

2. Check rate limits
   ├─ Look at X-RateLimit-Remaining header
   └─ If low: wait or use cached data

3. Fetch user profile
   ├─ GET /users/{username}
   └─ Extract: name, bio, location, company, avatar_url, followers

4. Fetch repositories
   ├─ GET /users/{username}/repos?sort=stars&per_page=100
   ├─ Handle pagination if >100 repos
   └─ Extract: name, description, language, stargazers_count, topics

5. Extract useful analytics
   ├─ Count languages used
   ├─ Calculate primary language
   └─ Identify top repos by stars

6. Normalize data
   ├─ Map API fields to unified model
   ├─ Validate formats
   └─ Clean descriptions

7. Compute source hash
   ├─ Hash: profile data + repo list
   └─ Compare with previous: detect changes

8. Attach metadata
   ├─ Source: "github"
   ├─ Timestamp
   ├─ URL: https://github.com/{username}
   └─ Hash for change detection

9. Return GitHubData
   └─ Ready for merging with LinkedIn and manual data
```

## Tools / Services Used

- **HTTP Client**: Axios (for API requests)
- **Caching**: node-cache (to avoid redundant calls)
- **Rate Limit Management**: Track X-RateLimit headers
- **Validation**: Zod schema validation
- **Logger**: Structured logger

## Rules

1. **Use public GitHub API** — No scraping or unofficial access
2. **Respect rate limits** — 60 requests/hour (unauthenticated), 5000/hour (authenticated)
3. **Don't require authentication** — Public profile data is free
4. **Preserve accuracy** — Don't invent metrics or repos
5. **Track provenance** — Source is always "github"
6. **Handle pagination** — Repos can exceed 30 default results

## Failure Handling

| Failure | Behavior |
|---------|----------|
| User not found (404) | Log error, return empty profile, suggest username check |
| Rate limit exceeded (403) | Use cached data if available, log warning |
| Network timeout | Retry up to 3 times with backoff |
| Malformed response | Log raw response, return cached data if available |
| Invalid username | Validate before API call, return error |

## Validation

- Username is alphanumeric (GitHub rules)
- Profile data structure matches schema
- Repository data validates against schema
- Timestamps are ISO 8601
- URLs are valid
- Stars/followers are non-negative integers

## Example Execution

```typescript
// Initialize provider
const github = new GitHubProvider({
  token: process.env.GITHUB_TOKEN, // Optional
});

// Fetch data
const data = await github.fetchProfile("torvalds");

// Result:
{
  profile: {
    username: "torvalds",
    name: "Linus Torvalds",
    bio: "...",
    company: "Linux Foundation",
    location: "Portland, OR",
    avatar: "...",
    followers: 250000,
    following: 0,
    publicRepos: 150,
  },
  repositories: [
    {
      name: "linux",
      description: "Linux kernel source tree",
      language: "C",
      stars: 185000,
      topics: ["kernel", "linux"],
      url: "https://github.com/torvalds/linux",
    }
  ],
  primaryLanguages: ["C", "Shell"],
  metadata: {
    source: "github",
    retrievedAt: "2025-01-15T10:30:00Z",
    cacheHash: "xyz789...",
    url: "https://github.com/torvalds",
  }
}
```

## Change Detection

Compare profile data hash with previous:
- If hash unchanged: skip rebuild
- If hash changed: trigger knowledge base rebuild

```typescript
const currentHash = crypto
  .createHash('sha256')
  .update(JSON.stringify(data))
  .digest('hex');

if (currentHash !== cachedHash) {
  // Trigger KB rebuild
}
```

---

**Agent Version**: 1.0  
**Status**: To be implemented (Phase 3)  
**Complexity**: Low-Medium (straightforward REST API)  
**Rate Limit**: 60 req/hour (public) or 5000 req/hour (with token)
