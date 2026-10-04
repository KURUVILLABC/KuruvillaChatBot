import Fastify from 'fastify';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { MockAIProvider } from '../providers/ai.js';
import { createDefaultKnowledgeBase } from '../schemas/knowledge.js';
import { createChatRoutes } from './chat.js';

const defaultAnswer = 'My knowledge base is focused on my professional profile.';

describe('POST /api/chat with the default AI provider', () => {
  const app = Fastify();

  beforeAll(async () => {
    await createChatRoutes(app, new MockAIProvider());
  });

  afterAll(async () => {
    await app.close();
  });

  it.each([
    ['Tell me about Omnisearch', ['Omnisearch', 'bookmarks', 'JavaScript']],
    ['What does Pianissist-AI do?', ['Pianissist-AI', 'microphone', 'Web Audio API']],
    ['Tell me about GitLabMRMate', ['GitLabMRMate', 'GitLab API']],
    ['What is the Thanal rental project?', ['Thanal-House_Rental_Platform', 'tenants']],
    ['What is Bank-Management-System built with?', ['Bank-Management-System', 'Python']],
    ['Which project is this chatbot?', ['KuruvillaChatBot', 'Fastify']],
    ['What role do I have at Redblack Software?', ['Software Engineer', 'Redblack Software', 'August 2025']],
    ['What am I working on at my current workplace?', ['Redblack Software', 'OpenAPI', 'DOM']],
    ['What did I do at intelliflo?', ['intelliflo', 'merge request', 'REST APIs']],
    ['When did I work at Kites Softwares?', ['Kites Softwares', 'May 2022', 'July 2022']],
    ['Where did I study and what degree did I earn?', ['Kerala Technical University', 'Bachelor of Technology']],
    ['What are my cloud computing skills?', ['Cloud Computing', 'Azure', 'AWS']],
    ['Which programming languages are listed in my skills?', ['Programming Languages', 'Python', 'JavaScript']],
    ['What is on my GitHub profile?', ['github.com/KURUVILLABC', 'public repositories']],
    ['What is my portfolio website?', ['iamkuruvilla.netlify.app']],
    ['What is your title?', ['Full Stack Developer']],
  ])('answers from the knowledge base for: %s', async (message, expectedFacts) => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/chat',
      payload: { message, conversation: [] },
    });
    const body = response.json<{ answer: string; knowledgeBaseVersion: string }>();

    expect(response.statusCode).toBe(200);
    expect(body.knowledgeBaseVersion).toBe('1.0.0');
    expect(body.answer).not.toContain(defaultAnswer);
    for (const fact of expectedFacts) {
      expect(body.answer.toLowerCase()).toContain(fact.toLowerCase());
    }
  });

  it('uses the previous turn to answer a project follow-up', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/chat',
      payload: {
        message: 'Which technologies did it use?',
        conversation: [
          { role: 'user', content: 'Tell me about Omnisearch' },
          { role: 'assistant', content: 'Omnisearch helps navigate links and old bookmarks.' },
        ],
      },
    });
    const body = response.json<{ answer: string }>();

    expect(body.answer).toContain('Omnisearch');
    expect(body.answer).toContain('JavaScript');
    expect(body.answer).toContain('Keyboard Navigation');
  });

  it('answers project technology questions even when the project is named in the same question', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/chat',
      payload: { message: 'What technologies did I use for Omnisearch?', conversation: [] },
    });
    const body = response.json<{ answer: string }>();

    expect(body.answer).toContain('Omnisearch');
    expect(body.answer).toContain('JavaScript');
    expect(body.answer).toContain('Keyboard Navigation');
  });

  it('keeps a named-project answer focused despite broad terms in the conversation history', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/chat',
      payload: {
        message: 'Could you walk me through Omnisearch?',
        conversation: [
          { role: 'assistant', content: 'Ask me about my work experience, projects, skills, education, or professional background.' },
        ],
      },
    });
    const body = response.json<{ answer: string }>();

    expect(body.answer).toContain('Omnisearch');
    expect(body.answer).not.toContain('KuruvillaChatBot');
    expect(body.answer).not.toContain('MergeWithGratitude');
  });

  it('uses the project named in the latest question instead of the previous project', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/chat',
      payload: {
        message: 'What does Pianissist-AI let someone do?',
        conversation: [
          { role: 'user', content: 'Could you walk me through Omnisearch?' },
          { role: 'assistant', content: 'Omnisearch helps navigate links and old bookmarks. https://github.com/KURUVILLABC/Omnisearch' },
        ],
      },
    });
    const body = response.json<{ answer: string }>();

    expect(body.answer).toContain('Pianissist-AI');
    expect(body.answer).toContain('microphone voice input');
    expect(body.answer).toContain('github.com/KURUVILLABC/Pianissist-AI');
    expect(body.answer).not.toContain('Omnisearch');
  });

  it('does not present an older undated internship as current employment', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/chat',
      payload: { message: 'What is my current job?', conversation: [] },
    });
    const body = response.json<{ answer: string }>();

    expect(body.answer).toContain('Redblack Software');
    expect(body.answer).not.toContain('Global Development Community Program');
  });

  it('states when a profile detail is unavailable instead of guessing', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/chat',
      payload: { message: 'What is my favorite movie?', conversation: [] },
    });
    const body = response.json<{ answer: string }>();

    expect(body.answer).toContain("I don't have that detail in my profile");
    expect(body.answer).not.toContain(defaultAnswer);
  });

  it('uses the currently installed knowledge base when it changes', async () => {
    const knowledgeBase = createDefaultKnowledgeBase();
    knowledgeBase.profile.title = 'Updated Profile Title';
    const { setChatKnowledgeBase } = await import('./chat.js');
    setChatKnowledgeBase(knowledgeBase);

    const response = await app.inject({
      method: 'POST',
      url: '/api/chat',
      payload: { message: 'Who are you?', conversation: [] },
    });
    const body = response.json<{ answer: string }>();

    expect(body.answer).toContain('Updated Profile Title');
  });
});