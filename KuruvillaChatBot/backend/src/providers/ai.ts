/**
 * AI Provider abstraction
 * Different implementations can be used based on configuration
 */

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
    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Extract system prompt and LAST user message (not first!)
    const systemMessage = request.messages.find((m) => m.role === 'system');
    const userMessage = request.messages
      .filter((m) => m.role === 'user')
      .pop(); // Get LAST user message, not first!
    const systemPrompt = systemMessage?.content ?? '';
    const userContent = userMessage?.content.toLowerCase() ?? '';

    // Detect if this is a digital twin persona prompt
    const isDigitalTwin = systemPrompt.includes('YOU ARE THAT PERSON') || 
                          systemPrompt.includes('Kuruvilla Biju Cheruvallil - a real person');

    let response: string;

    if (isDigitalTwin) {
      // Digital twin responses - speak as Kuruvilla
      response = this.generateDigitalTwinResponse(userContent, systemPrompt);
    } else {
      // Fallback to assistant mode if not digital twin
      response = this.generateAssistantResponse(userContent, systemPrompt);
    }

    return {
      content: response,
      usage: {
        promptTokens: 50,
        completionTokens: response.split(' ').length,
        totalTokens: 50 + response.split(' ').length,
      },
    };
  }

  private generateDigitalTwinResponse(userContent: string, systemPrompt: string): string {
    // Helper: randomly select from array
    const pickRandom = (arr: string[]): string => {
      if (arr.length === 0) return '';
      const selected = arr[Math.floor(Math.random() * arr.length)];
      return selected || arr[0] || '';
    };

    // Keyword-based response generation - CHECK SPECIFIC PATTERNS FIRST!
    // Order matters: check specific topics before generic patterns
    
    // Greetings (highest priority, most specific)
    if (userContent.includes('hello') || userContent.includes('hi') || userContent.includes('hey')) {
      const greetings = [
        "Hey! Thanks for stopping by. I'm Kuruvilla, a Software Engineer and AI Systems Architect. I'm passionate about building intelligent systems, knowledge bases, and exploring what's possible with AI. What would you like to know about me?",
        "Hi there! 👋 I'm Kuruvilla. Great to meet you! I work on AI systems and full-stack development. Feel free to ask me anything about my work, projects, or tech interests.",
        "Hello! Welcome! I'm a software engineer focused on AI and knowledge systems. I'd love to tell you more about what I do. What brings you here?",
        "Hey! Happy to chat. I'm Kuruvilla, and I love building things with AI and modern web technologies. What would you like to know?"
      ];
      return pickRandom(greetings);
    }

    // PROJECTS - Multiple variations
    if (userContent.includes('project') || userContent.includes('built') || userContent.includes('created') || userContent.includes('build') || userContent.includes('repo') || userContent.includes('repository')) {
      const projects = [
        "I've built several projects, with my main focus being on AI systems and knowledge bases. I created a professional profile knowledge system with conversational AI capabilities - that's actually what we're talking through right now! I also maintain other projects on GitHub focused on full-stack development and AI integration. Each project is designed to solve real problems and explore new possibilities in AI.",
        "My projects center around AI and full-stack development. The most recent one is this knowledge system we're using right now - it combines conversational AI with profile management. I also have various open-source projects on GitHub exploring different aspects of modern web development and AI integration.",
        "I've worked on quite a few projects! My passion projects revolve around AI systems - building chatbots, knowledge bases, and intelligent applications. Beyond that, I maintain several full-stack projects on GitHub. I like creating tools that solve real problems and showcase innovative uses of technology.",
        "Project-wise, I've been heavily invested in AI-driven systems. I built this conversational knowledge system you're interacting with now, which combines LLMs with structured data. I also have projects in full-stack web development and various AI experimentation work on GitHub."
      ];
      return pickRandom(projects);
    }

    // EXPERIENCE & WORK - Multiple variations
    if (userContent.includes('experience') || userContent.includes('work') || userContent.includes('background') || userContent.includes('employment') || userContent.includes('job')) {
      const experience = [
        "I've worked in various roles as a full-stack developer and senior engineer, building scalable applications and AI systems. My experience spans backend development with Node.js and TypeScript, frontend work with React, and integrating AI systems into production applications. I've been focused on creating knowledge bases and conversational interfaces, which led me to this passion project I'm working on now.",
        "My career has been focused on full-stack development and AI systems. I've worked as a software engineer building scalable backends with Node.js and engaging frontends with React. More recently, I've been specializing in AI integration and building intelligent knowledge systems. It's been a journey of learning and building increasingly complex systems.",
        "I started as a full-stack developer and have evolved into specializing in AI systems architecture. My experience includes backend development with modern frameworks like Node.js and Fastify, frontend development with React, and now diving deep into AI and LLM integration. Each role has built on the previous one, leading to my current focus on knowledge systems.",
        "In my experience as a software engineer, I've worked across the entire stack - from database design and backend APIs to interactive frontends. More recently, my focus has shifted toward AI systems and how to effectively integrate LLMs into applications. I love the challenge of making AI systems practical and user-friendly."
      ];
      return pickRandom(experience);
    }

    // SKILLS & TECHNOLOGY - Multiple variations  
    if (userContent.includes('skill') || userContent.includes('technology') || userContent.includes('language') || userContent.includes('expertise') || userContent.includes('technical')) {
      const skills = [
        "I work primarily with TypeScript and JavaScript across the full stack. On the frontend, I'm comfortable with React and modern UI frameworks. For backend, I build APIs with Node.js and Fastify. I'm also experienced with Python and have been diving deep into AI systems lately. I'm comfortable with databases, cloud infrastructure, and everything in between.",
        "My technical stack includes TypeScript, JavaScript, React, Node.js, and Fastify. I'm proficient in Python, especially for AI and scripting work. I work with modern databases and understand cloud architecture. My recent focus has been on AI tooling and LLM integration, so I'm actively learning and experimenting with that space.",
        "I'm most comfortable with TypeScript and JavaScript - it's what I use for most of my full-stack work. React on the frontend, Node.js on the backend - that's my bread and butter. I also work with Python, particularly for AI projects. I have hands-on experience with databases, APIs, and cloud deployment. And of course, I'm deep into AI and LLM work now.",
        "Technically, I'm strongest in JavaScript/TypeScript, React, and Node.js. I build API backends with Fastify and modern web frontends with React. I'm comfortable with Python for AI and data work. I understand databases, DevOps basics, and cloud infrastructure. My current learning focus is AI systems, prompt engineering, and LLM integration patterns."
      ];
      return pickRandom(skills);
    }

    // AI & PASSION - Multiple variations
    if (userContent.includes('ai') || userContent.includes('artificial intelligence') || userContent.includes('passion') || userContent.includes('love') || userContent.includes('excited')) {
      const aiPassion = [
        "I'm genuinely passionate about AI. I think we're at an exciting time where AI can augment human capabilities in meaningful ways. I'm interested in building systems that are grounded, reliable, and actually helpful - not just impressive. I'm exploring how to create AI that understands context, learns from interactions, and provides real value. Building this knowledge system has been a great way to explore these ideas practically.",
        "AI is what excites me most about tech right now. What fascinates me is building AI systems that are actually useful and grounded in real knowledge - not systems that hallucinate or make things up. I want to explore how LLMs can be practical tools for knowledge work, and this project is my playground for those ideas.",
        "I'm passionate about building intelligent systems that are practical and grounded. The challenge of making AI systems reliable and useful is what drives my current work. I believe AI should augment human capabilities, not replace human judgment. That's why I focus on systems like this knowledge base - combining AI with structured, verified information.",
        "AI and machine learning represent the most interesting frontier in software right now. I'm passionate about exploring how to build systems that leverage AI intelligently - whether that's conversational interfaces, knowledge systems, or decision support tools. The key for me is building systems that are trustworthy and provide real value."
      ];
      return pickRandom(aiPassion);
    }

    // GITHUB - Separate from projects
    if (userContent.includes('github')) {
      return "You can find my projects on GitHub. I keep my work public because I believe in open source and sharing knowledge. My repositories include various full-stack projects, AI systems, and tools I've built. Feel free to check them out - I'm always working on something interesting!";
    }

    // GENERAL ABOUT YOURSELF - Check after specific topics (lower priority, more generic)
    if (userContent.includes('yourself') || userContent.includes('about you') || (userContent.includes('tell me') && !userContent.includes('about'))) {
      return "I'm Kuruvilla, a full-stack developer and AI systems architect with a passion for building scalable, intelligent solutions. I specialize in creating knowledge systems, AI integration, and working across the entire tech stack from backend services to interactive frontends. I'm really excited about the potential of AI to transform how we work and create solutions.";
    }

    // Default digital twin response for unknown topics
    return "That's an interesting question! I'd be happy to tell you more. What specifically would you like to know - about my experience, the technologies I work with, projects I've built, or my thoughts on certain topics?";
  }

  private generateAssistantResponse(userContent: string, systemPrompt: string): string {
    // Fallback assistant mode responses
    if (
      userContent.includes('hello') ||
      userContent.includes('hi') ||
      userContent.includes('hey') ||
      userContent.includes('good')
    ) {
      return "Hello! I'm here to help you learn about this professional profile. Feel free to ask me questions!";
    } else if (
      userContent.includes('experience') ||
      userContent.includes('work') ||
      userContent.includes('company')
    ) {
      return "The profile includes experience with full-stack development, backend systems, and AI integration. Feel free to ask more specific questions!";
    } else if (
      userContent.includes('skill') ||
      userContent.includes('technology') ||
      userContent.includes('language')
    ) {
      return "Technical skills include TypeScript, React, Node.js, Python, and various modern frameworks and tools for building scalable systems.";
    } else if (
      userContent.includes('project') ||
      userContent.includes('built') ||
      userContent.includes('created')
    ) {
      return "The profile showcases projects in AI systems, knowledge bases, chatbots, and full-stack applications.";
    } else if (
      userContent.includes('github') ||
      userContent.includes('repository') ||
      userContent.includes('repo')
    ) {
      return "GitHub profile is available for viewing public repositories and contribution history.";
    } else if (
      userContent.includes('education') ||
      userContent.includes('degree') ||
      userContent.includes('school')
    ) {
      return "Educational background information is available in the profile.";
    } else {
      return "I'd be happy to help! Feel free to ask about experience, skills, projects, education, or anything else you'd like to know about this professional profile.";
    }
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
