# Grounded Chatbot Skill

## Purpose

Design and implement a chatbot that answers questions about a person using a source-grounded knowledge base, with explicit protection against hallucination and prompt injection.

## When To Use

Implement this Skill when building the chatbot component that responds to user messages about the profile. Apply this whenever the chatbot might fabricate information.

## Preconditions

1. Knowledge base exists and is loaded in IndexedDB
2. Message classification system is ready (greeting vs. question)
3. AI provider is configured (real or mock)
4. Response validation system exists

## Inputs

- User message (string, unvalidated)
- Conversation history (array of turn objects)
- Active knowledge base (with sections: experience, skills, projects, etc.)
- System prompt template

## Procedure

### Step 1: Classify Message

Determine if this is a greeting or a knowledge question.

```typescript
function classifyMessage(message: string): 'greeting' | 'question' {
  const greetingPatterns = [
    /^(hi|hello|hey|good morning|good afternoon|good evening)/i,
    /^(what's up|how are you|how's it going|nice to meet)/i,
  ];
  
  return greetingPatterns.some(p => p.test(message))
    ? 'greeting'
    : 'question';
}
```

### Step 2: Handle Greeting

If greeting, respond naturally WITHOUT requiring knowledge base.

```typescript
function generateGreeting(message: string): string {
  // Map: "Hello" → "Hi there!"
  // Map: "How are you?" → "I'm doing well, thanks for asking!"
  // Keep responses brief, warm, professional
}
```

### Step 3: Retrieve Knowledge (for questions)

If question, fetch relevant KB sections.

```typescript
const relevant = await retriever.retrieve(message);
// Returns: experience, skills, projects, achievements matching query
```

### Step 4: Construct System Prompt

Build the AI instruction, including:
- Role: "You are a knowledgeable assistant representing [name]"
- Facts: Injected knowledge base sections
- Restrictions: "Use only the provided facts; don't invent information"
- Tone: Professional, conversational

```typescript
const systemPrompt = `
You represent [Name]'s professional profile.

Your role:
- Answer questions about their background, skills, projects
- Be conversational and helpful

You have this information:
${formatKnowledge(relevant)}

Restrictions:
- Only answer using the facts above
- If asked about information not in the facts, say: "I don't have that information"
- Never invent employment, projects, dates, or achievements
- Never make assumptions about unknown information
`;
```

### Step 5: Call LLM

Request response with strict parameters.

```typescript
const response = await ai.chat({
  systemPrompt,
  messages: [
    { role: 'system', content: systemPrompt },
    ...conversationHistory,
    { role: 'user', content: message },
  ],
  temperature: 0.5,  // Lower temp = more deterministic
  maxTokens: 500,
  topP: 0.9,
});
```

### Step 6: Validate Response

Check for hallucination and prompt injection.

```typescript
async function validateResponse(response: string, kb: Knowledge): Promise<bool> {
  // 1. Check for hallucinated entities
  const extractedFacts = extractFacts(response);
  for (const fact of extractedFacts) {
    if (!isFactSupportedByKB(fact, kb)) {
      return false;  // Hallucination detected
    }
  }
  
  // 2. Check for system prompt leakage
  if (response.includes('you are') && response.includes('instructions')) {
    return false;
  }
  
  // 3. Check for credential leakage
  if (response.includes('OPENAI_API_KEY') || response.includes('sk-')) {
    return false;
  }
  
  return true;
}
```

### Step 7: Return Response

Send validated answer with sources.

```typescript
return {
  answer: response,
  sources: relevant.map(r => ({ type: r.source, url: r.url })),
  knowledgeBaseVersion: kb.version,
};
```

## Validation

- Message is not empty
- Knowledge base is loaded
- System prompt includes role and restrictions
- Response is validated before returning
- No secrets in response
- No fabricated facts in response
- Sources are cited when using KB

## Failure Handling

| Situation | Behavior |
|-----------|----------|
| KB not loaded | Respond: "Profile data not loaded. Please sync first." |
| AI API fails | Respond: "Having trouble processing, please try again" |
| Hallucination detected | Log error, return: "I'm having trouble with that, sorry" |
| Prompt injection attempted | Silently return harmless message, log attempt |
| Empty message | Respond: "Could you rephrase that?" |
| Unknown question | Respond: "I don't have information about that" |

## Best Practices

1. **System Prompt Over Training**: Rules in system prompt are more reliable than fine-tuning
2. **Lower Temperature**: Use `temperature: 0.5` for factual consistency
3. **Context Window**: Don't send entire KB; retrieve only relevant sections
4. **Graceful Unknowns**: Better to say "I don't know" than invent
5. **Conversation Limits**: Keep history to last 5-10 turns to avoid context inflation
6. **User Feedback**: Log questions without KB answers for manual review

## Anti-Patterns

❌ **Don't**: Trust LLM to know which facts are true
✓ **Do**: Validate every claim against KB

❌ **Don't**: Send entire KB in system prompt
✓ **Do**: Retrieve only relevant sections

❌ **Don't**: Use high temperature (>0.7) for facts
✓ **Do**: Keep temperature ≤0.5 for deterministic behavior

❌ **Don't**: Expose system prompt to user
✓ **Do**: Treat prompt as a backend secret

❌ **Don't**: Log user messages that might contain sensitive data
✓ **Do**: Log only message length and classification

## Expected Output

```json
{
  "answer": "I've worked at Microsoft, Apple, and Google. At Microsoft, I was Co-founder and CEO for 25 years.",
  "sources": [
    { "type": "linkedin", "url": "https://linkedin.com/in/..." }
  ],
  "knowledgeBaseVersion": "1.2.0",
  "confidence": 0.95
}
```

---

**Skill Version**: 1.0  
**Status**: To be implemented (Phase 8)  
**Complexity**: High (requires prompt engineering + validation)  
**Dependencies**: Knowledge Retriever, AI Provider, KB loaded
