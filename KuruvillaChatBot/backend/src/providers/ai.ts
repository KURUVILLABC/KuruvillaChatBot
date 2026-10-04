/**
 * AI Provider abstraction
 * Different implementations can be used based on configuration
 */

import { KnowledgeBaseSchema, type KnowledgeBase } from '../schemas/knowledge.js';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
}

export interface ChatResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AIProvider {
  chat(request: ChatRequest): Promise<ChatResponse>;
  isConfigured(): boolean;
}

/**
 * Mock AI Provider for development
 * Respects system prompts and generates contextual responses
 */
export class MockAIProvider implements AIProvider {
  async chat(request: ChatRequest): Promise<ChatResponse> {
    const systemMessage = request.messages.find((m) => m.role === 'system');
    const userMessages = request.messages.filter((message) => message.role === 'user');
    const userContent = userMessages.at(-1)?.content ?? '';
    const systemPrompt = systemMessage?.content ?? '';
    const priorContext = request.messages
      .filter((message) => message.role !== 'system')
      .slice(0, -1)
      .slice(-4)
      .map((message) => message.content)
      .join(' ');
    const knowledgeBase = this.extractKnowledgeBase(systemPrompt);
    const response = knowledgeBase
      ? this.generateDigitalTwinResponse(userContent, priorContext, knowledgeBase)
      : this.generateAssistantResponse(userContent.toLowerCase());

    return {
      content: response,
      usage: {
        promptTokens: 50,
        completionTokens: response.split(' ').length,
        totalTokens: 50 + response.split(' ').length,
      },
    };
  }

  private generateDigitalTwinResponse(
    question: string,
    priorContext: string,
    knowledgeBase: KnowledgeBase,
  ): string {
    const normalizedQuestion = question.toLowerCase();
    const normalizedContext = priorContext.toLowerCase();
    const searchText = `${normalizedQuestion} ${normalizedContext}`;
    const words = this.getSearchWords(searchText);
    const mentionsProject = knowledgeBase.projects.some((project) =>
      normalizedQuestion.includes(project.name.toLowerCase()),
    );
    const mentionsEmployer = knowledgeBase.experience.some((experience) =>
      normalizedQuestion.includes(experience.company.toLowerCase()),
    );
    const wantsProjects = mentionsProject || /\b(project|projects|repository|repositories|repo|built|created|portfolio)\b/.test(normalizedQuestion);
    const wantsExperience = mentionsEmployer || /\b(experience|career|employment|employer|work|job|role|company|companies|workplace|current|previous|contribution|contributions|internship|internships)\b/.test(normalizedQuestion);
    const wantsEducation = /\b(education|degree|school|university|college|study|studied|graduat|certification|course)\w*\b/.test(normalizedQuestion);
    const wantsSkills = /\b(skill|skills|technology|technologies|language|languages|expertise|stack|framework|tool)\w*\b/.test(normalizedQuestion);

    if (/\b(hello|hi|hey|good morning|good afternoon|good evening)\b/.test(normalizedQuestion)) {
      return `Hi, I'm ${knowledgeBase.profile.name}. What would you like to know about my work or projects?`;
    }
    if (/\b(thanks|thank you)\b/.test(normalizedQuestion)) {
      return "You're welcome. Glad I could help.";
    }
    if (/\b(how are you|how's it going)\b/.test(normalizedQuestion)) {
      return "I'm here and ready to help. What would you like to know about my professional profile?";
    }

    if (/\b(portfolio|website|email|contact|linkedin)\b/.test(normalizedQuestion)) {
      const links = [
        /\b(portfolio|website)\b/.test(normalizedQuestion) && knowledgeBase.profile.portfolioUrl
          ? `Portfolio: ${knowledgeBase.profile.portfolioUrl}`
          : '',
        /\b(email|contact)\b/.test(normalizedQuestion) && knowledgeBase.profile.email
          ? `Email: ${knowledgeBase.profile.email}`
          : '',
        /\blinkedin\b/.test(normalizedQuestion) && knowledgeBase.profile.linkedinUrl
          ? `LinkedIn: ${knowledgeBase.profile.linkedinUrl}`
          : '',
      ].filter(Boolean);
      if (links.length > 0) return links.join('\n');
    }

    if (wantsProjects) {
      const explicitlyNamedProjects = knowledgeBase.projects.filter((project) =>
        normalizedQuestion.includes(project.name.toLowerCase()),
      );
      const matches = explicitlyNamedProjects.length > 0
        ? explicitlyNamedProjects
        : this.rankItems(knowledgeBase.projects, words, (project) =>
          `${project.name} ${project.description ?? ''} ${project.technologies.join(' ')}`,
        );
      const wantsAll = /\b(all|every|list)\b/.test(normalizedQuestion);
      const wantsSingleProject = /\b(one|a project|an example|any project)\b/.test(normalizedQuestion) ||
        (mentionsProject && !/\b(projects|repositories|compare|both|all|list)\b/.test(normalizedQuestion));
      const selected = matches.length > 0
        ? matches.slice(0, wantsAll ? matches.length : wantsSingleProject ? 1 : 5)
        : knowledgeBase.projects.slice(0, wantsAll ? knowledgeBase.projects.length : 5);
      if (selected.length === 0) return "I don't have project details in the profile yet.";
      return selected.map((project) => {
        const description = project.description ? ` ${project.description}` : '';
        const technologies = project.technologies.length > 0
          ? ` It uses ${project.technologies.join(', ')}.`
          : '';
        const link = project.url ? ` ${project.url}` : '';
        return `${project.name}:${description}${technologies}${link}`;
      }).join('\n\n');
    }

    if (wantsExperience) {
      const currentOnly = /\b(current|currently|present|now|latest)\b/.test(normalizedQuestion);
      const wantsAll = /\b(all|every|list)\b/.test(normalizedQuestion);
      const openRoles = knowledgeBase.experience.filter((experience) => !experience.endDate);
      const latestOpenStart = Math.max(...openRoles.map((experience) => experience.startDate.getTime()));
      const matches = currentOnly
        ? openRoles.filter((experience) => experience.startDate.getTime() === latestOpenStart)
        : this.rankItems(knowledgeBase.experience, words, (experience) =>
          `${experience.title} ${experience.company} ${experience.description ?? ''}`,
        );
      const selected = matches.length > 0
        ? matches.slice(0, wantsAll || currentOnly ? matches.length : 4)
        : knowledgeBase.experience.slice(0, wantsAll ? knowledgeBase.experience.length : 4);
      if (selected.length === 0) return "I don't have work experience details in the profile yet.";
      return selected.map((experience) => {
        const startDate = experience.startDate.toLocaleDateString('en', { month: 'long', year: 'numeric' });
        const endDate = experience.endDate?.toLocaleDateString('en', { month: 'long', year: 'numeric' });
        const isLatestOpenRole = !experience.endDate && experience.startDate.getTime() === latestOpenStart;
        const dateRange = endDate
          ? `${startDate} to ${endDate}`
          : isLatestOpenRole
            ? `${startDate} to present`
            : `starting ${startDate}`;
        const description = experience.description ? ` ${experience.description}` : '';
        return `${experience.title} at ${experience.company} (${dateRange}).${description}`;
      }).join('\n\n');
    }

    if (wantsEducation) {
      const matches = this.rankItems(knowledgeBase.education, words, (education) =>
        `${education.school} ${education.degree} ${education.field} ${education.description ?? ''}`,
      );
      const selected = matches.length > 0 ? matches.slice(0, 3) : knowledgeBase.education;
      if (selected.length === 0) return "I don't have education details in the profile yet.";
      return selected.map((education) => {
        const dates = education.startDate && education.endDate
          ? ` (${education.startDate.getFullYear()}-${education.endDate.getFullYear()})`
          : '';
        const description = education.description ? ` ${education.description}` : '';
        return `${education.degree} in ${education.field} from ${education.school}${dates}.${description}`;
      }).join('\n\n');
    }

    if (wantsSkills) {
      const previousProject = this.rankItems(
        knowledgeBase.projects,
        this.getSearchWords(searchText),
        (project) => `${project.name} ${project.description ?? ''}`,
      )[0];
      if (previousProject && /\b(stack|technology|technologies|framework|tool|used)\b/.test(normalizedQuestion)) {
        return `${previousProject.name} uses ${previousProject.technologies.join(', ')}.`;
      }
      const category = knowledgeBase.skills.find((skill) =>
        skill.category && normalizedQuestion.includes(skill.category.toLowerCase()),
      )?.category;
      const selected = category
        ? knowledgeBase.skills.filter((skill) => skill.category === category)
        : this.rankItems(knowledgeBase.skills, words, (skill) => `${skill.name} ${skill.category ?? ''}`);
      const additionalLanguageSkills = category === 'Programming Languages' && /\blanguages?\b/.test(normalizedQuestion)
        ? knowledgeBase.skills.filter((skill) => skill.name.toLowerCase() === 'javascript')
        : [];
      const skills = selected.length > 0
        ? [...selected, ...additionalLanguageSkills]
        : knowledgeBase.skills;
      if (skills.length === 0) return "I don't have skills listed in the profile yet.";
      const grouped = new Map<string, string[]>();
      for (const skill of skills) {
        const group = skill.category ?? 'Other';
        grouped.set(group, [...(grouped.get(group) ?? []), skill.name]);
      }
      return [...grouped.entries()].map(([group, names]) => `${group}: ${names.join(', ')}`).join('\n');
    }

    if (/\b(github|repositories|followers|following|organization|organizations)\b/.test(normalizedQuestion)) {
      const github = knowledgeBase.githubProfile;
      if (!github) return `My GitHub profile is ${knowledgeBase.profile.githubUrl ?? 'not listed in the profile'}.`;
      const profileUrl = typeof github.profileUrl === 'string' ? github.profileUrl : knowledgeBase.profile.githubUrl;
      const repositoryCount = typeof github.publicRepositories === 'number'
        ? ` It lists ${github.publicRepositories} public repositories.`
        : '';
      return `My GitHub profile is ${profileUrl ?? 'not listed in the profile'}.${repositoryCount}`;
    }

    if (/\b(who are you|about yourself|tell me about yourself|your name|name|title|bio)\b/.test(normalizedQuestion)) {
      const { name, title, bio } = knowledgeBase.profile;
      if (/\bbio\b/.test(normalizedQuestion) && bio) return bio;
      if (/\btitle\b/.test(normalizedQuestion)) return `My profile lists my title as ${title}.`;
      return `${name} here. I'm a ${title}.${bio ? ` ${bio}` : ''}`;
    }

    const profileFacts = [
      `${knowledgeBase.profile.name} ${knowledgeBase.profile.title} ${knowledgeBase.profile.bio ?? ''}`,
      ...knowledgeBase.projects.map((project) => `${project.name} ${project.description ?? ''} ${project.technologies.join(' ')}`),
      ...knowledgeBase.experience.map((experience) => `${experience.title} ${experience.company} ${experience.description ?? ''}`),
      ...knowledgeBase.education.map((education) => `${education.school} ${education.degree} ${education.field} ${education.description ?? ''}`),
      ...knowledgeBase.skills.map((skill) => `${skill.name} ${skill.category ?? ''}`),
    ];
    const hasRelevantFact = profileFacts.some((fact) => this.scoreText(fact, words) > 0);
    if (!hasRelevantFact) {
      return "I don't have that detail in my profile, so I don't want to guess. I can still help with a particular role, project, skill, or education detail.";
    }
    return "I can help with that. Could you narrow it down to a project, role, skill, or education detail so I can give you the exact information from my profile?";
  }

  private extractKnowledgeBase(systemPrompt: string): KnowledgeBase | null {
    const match = /KNOWLEDGE_BASE_JSON_START\s*([\s\S]*?)\s*KNOWLEDGE_BASE_JSON_END/.exec(systemPrompt);
    if (!match?.[1]) return null;
    try {
      const serializedKnowledge = JSON.parse(match[1], (key, value: unknown) =>
        /(At|Date)$/.test(key) && typeof value === 'string' ? new Date(value) : value,
      );
      return KnowledgeBaseSchema.parse(serializedKnowledge);
    } catch {
      return null;
    }
  }

  private getSearchWords(text: string): Set<string> {
    const aliases: Record<string, string[]> = {
      workplace: ['current', 'work', 'experience'],
      employer: ['company', 'experience'],
      "employer's": ['company', 'experience'],
      technologies: ['technology', 'skill'],
      stack: ['technology', 'skill'],
      framework: ['technology', 'skill'],
      built: ['project'],
      created: ['project'],
      made: ['project'],
      repo: ['project'],
      repositories: ['project'],
      career: ['experience'],
      job: ['experience'],
      role: ['experience'],
      studied: ['education'],
      degree: ['education'],
      university: ['education'],
    };
    const words = new Set(text.toLowerCase().match(/[a-z0-9+#.]+/g) ?? []);
    for (const word of [...words]) {
      for (const alias of aliases[word] ?? []) words.add(alias);
    }
    return words;
  }

  private scoreText(text: string, words: Set<string>): number {
    const textWords = new Set(text.toLowerCase().match(/[a-z0-9+#.]+/g) ?? []);
    let score = 0;
    for (const word of words) {
      if (word.length > 2 && [...textWords].some((textWord) =>
        textWord === word || (word.length >= 5 && textWord.includes(word)),
      )) score += word.length > 5 ? 2 : 1;
    }
    return score;
  }

  private rankItems<T>(items: T[], words: Set<string>, getText: (item: T) => string): T[] {
    return items
      .map((item, index) => ({ item, index, score: this.scoreText(getText(item), words) }))
      .filter((match) => match.score > 0)
      .sort((left, right) => right.score - left.score || left.index - right.index)
      .map((match) => match.item);
  }

  private generateAssistantResponse(userContent: string): string {
    if (/\b(hello|hi|hey)\b/.test(userContent)) {
      return "Hello. I can help with questions about the professional profile.";
    }
    return "I don't have enough profile context to answer that reliably.";
  }

  isConfigured(): boolean {
    return true;
  }
}

/**
 * OpenAI Provider for production use
 * Uses real OpenAI API with knowledge base grounding
 */
export class OpenAIProvider implements AIProvider {
  private apiKey: string;
  private client: any;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    
    if (!apiKey) {
      throw new Error('OpenAI API key is required but not provided');
    }
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      // Lazy load OpenAI client on first use
      if (!this.client) {
        const OpenAI = (await import('openai')).default;
        this.client = new OpenAI({
          apiKey: this.apiKey,
        });
      }

      const response = await this.client.chat.completions.create({
        model: 'gpt-4o',
        messages: request.messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature: request.temperature ?? 0.7,
        max_tokens: request.maxTokens ?? 1000,
      });

      const content = response.choices[0]?.message?.content ?? '';

      return {
        content,
        usage: {
          promptTokens: response.usage?.prompt_tokens ?? 0,
          completionTokens: response.usage?.completion_tokens ?? 0,
          totalTokens: response.usage?.total_tokens ?? 0,
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`OpenAI API call failed: ${errorMessage}`);
    }
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }
}

/**
 * Groq Provider for production use
 * Ultra-fast LLM inference with generous free tier
 */
export class GroqProvider implements AIProvider {
  private apiKey: string;
  private client: any;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    
    if (!apiKey) {
      throw new Error('Groq API key is required but not provided');
    }
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      // Lazy load Groq client on first use
      if (!this.client) {
        const Groq = (await import('groq-sdk')).default;
        this.client = new Groq({
          apiKey: this.apiKey,
        });
      }

      const response = await this.client.chat.completions.create({
        model: 'gemma-7b-it',
        messages: request.messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature: request.temperature ?? 0.7,
        max_tokens: request.maxTokens ?? 1000,
      });

      const content = response.choices[0]?.message?.content ?? '';

      return {
        content,
        usage: {
          promptTokens: response.usage?.prompt_tokens ?? 0,
          completionTokens: response.usage?.completion_tokens ?? 0,
          totalTokens: response.usage?.total_tokens ?? 0,
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Groq API call failed: ${errorMessage}`);
    }
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }
}

/**
 * Google Gemini Provider
 * Uses Google's Generative AI API with gemini-pro model
 */
export class GeminiProvider implements AIProvider {
  private apiKey: string;
  private client: any;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    if (!apiKey) {
      throw new Error('Gemini API key is required but not provided');
    }
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      if (!this.client) {
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        this.client = new GoogleGenerativeAI(this.apiKey);
      }

      const model = this.client.getGenerativeModel({ model: 'gemini-1.5-flash' });

      // Gemini API uses a different format - convert messages
      // Build conversation history for Gemini
      const history = request.messages
        .filter((msg) => msg.role !== 'system')
        .slice(0, -1) // Exclude last user message (will be in content)
        .map((msg) => ({
          role: msg.role === 'assistant' ? 'model' : msg.role,
          parts: [{ text: msg.content }],
        }));

      const systemPrompt = request.messages.find((m) => m.role === 'system')?.content ?? '';
      const lastMessage = request.messages[request.messages.length - 1]?.content ?? '';

      const result = await model.generateContent({
        contents: [
          ...history,
          {
            role: 'user',
            parts: [{ text: lastMessage }],
          },
        ],
        systemInstruction: systemPrompt,
        generationConfig: {
          temperature: request.temperature ?? 0.7,
          maxOutputTokens: request.maxTokens ?? 1000,
        },
      });

      const content = result.response.text();

      return {
        content,
        usage: {
          promptTokens: 0, // Gemini API doesn't provide token counts in free tier
          completionTokens: 0,
          totalTokens: 0,
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Gemini API call failed: ${errorMessage}`);
    }
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }
}
