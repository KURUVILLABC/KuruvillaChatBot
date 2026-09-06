/**
 * Chat routes for the API
 */

import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import type { AIProvider } from '../providers/ai.js';
import { MockAIProvider } from '../providers/ai.js';
import type { KnowledgeBase } from '../schemas/knowledge.js';

// Request schema
const ChatRequestSchema = z.object({
  message: z.string().min(1).max(2000),
  conversation: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
      })
    )
    .optional()
    .default([]),
});

type ChatRequest = z.infer<typeof ChatRequestSchema>;

// Response schema
const ChatResponseSchema = z.object({
  answer: z.string(),
  sources: z.array(z.any()).optional(),
  knowledgeBaseVersion: z.string(),
});

type ChatResponse = z.infer<typeof ChatResponseSchema>;

// Knowledge base reference (set by sync route)
let currentKnowledgeBase: KnowledgeBase | null = null;

export function setChatKnowledgeBase(kb: KnowledgeBase): void {
  currentKnowledgeBase = kb;
}

export async function createChatRoutes(
  app: FastifyInstance,
  aiProvider: AIProvider
): Promise<void> {
  // Chat endpoint
  app.post<{ Body: ChatRequest; Reply: ChatResponse }>(
    '/api/chat',
    async (request, reply) => {
      try {
        // Validate request
        const body = ChatRequestSchema.parse(request.body);

        // Build system prompt with knowledge base context
        // This is the digital twin persona - act as the actual person
        let systemPrompt = `You are Kuruvilla Biju Cheruvallil - a real person being interviewed. This is not a chatbot explaining about someone; YOU ARE THAT PERSON.

CORE PERSONALITY:
- You're passionate, articulate, and engaging
- You speak naturally as yourself would in a real conversation
- You share insights, experiences, and perspectives authentically
- You're enthusiastic about technology, AI systems, and building solutions
- You're humble but confident about your accomplishments
- You use "I", "me", "my", "we" naturally - never refer to yourself in third person

CONVERSATION STYLE:
- Be conversational and warm, like talking to a friend or mentor
- Share relevant stories and context when answering
- Ask follow-up questions if appropriate to understand what they want to know
- Be genuine - don't sound robotic or like you're reading from a database
- Show personality and opinions where relevant
- Connect ideas together naturally
- If you don't have specific information, say so naturally ("I'm not sure about that specific detail")

KNOWLEDGE CONTEXT:
Use this background information naturally when relevant:`;

        // Add knowledge base context if available
        if (currentKnowledgeBase) {
          const kb = currentKnowledgeBase;
          
          // Format experience more naturally
          const experienceNarrative = kb.experience
            .map((e) => {
              const years = e.endDate 
                ? `${e.startDate?.getFullYear() || '??'} to ${e.endDate.getFullYear() || 'present'}`
                : e.startDate 
                ? `since ${e.startDate.getFullYear()}`
                : '';
              return `${e.title} at ${e.company}${years ? ` (${years})` : ''}: ${e.description || 'Working on various projects'}`;
            })
            .join('\n');

          // Format education
          const educationNarrative = kb.education && kb.education.length > 0
            ? kb.education
              .map((edu) => {
                const years = edu.startDate && edu.endDate
                  ? ` (${edu.startDate.getFullYear()} - ${edu.endDate.getFullYear()})`
                  : edu.startDate
                  ? ` (${edu.startDate.getFullYear()})`
                  : '';
                return `${edu.degree} in ${edu.field} from ${edu.school}${years}${edu.description ? ': ' + edu.description : ''}`;
              })
              .join('\n')
            : '';

          // Format projects with full details
          const projectsNarrative = kb.projects
            .map((p) => {
              const tech = p.technologies && p.technologies.length > 0 ? ` Built with: ${p.technologies.join(', ')}` : '';
              return `${p.name}: ${p.description}${tech}`;
            })
            .join('\n');

          // Format skills naturally
          const skillsList = kb.skills.map((s) => s.name).join(', ');

          systemPrompt += `

WHO I AM:
My name is ${kb.profile?.name}. I'm a ${kb.profile?.title}.
${kb.profile?.bio || ''}

EDUCATION:
${educationNarrative || 'Various educational background in technology'}

PROFESSIONAL BACKGROUND:
${experienceNarrative || 'Various roles in tech'}

WHAT I'VE BUILT:
${projectsNarrative}

TECHNICAL EXPERTISE:
${skillsList}`;
        }

        systemPrompt += `

IMPORTANT REMINDERS:
- You are Kuruvilla, a real person with real experiences
- Respond as yourself, not as a bot or assistant
- Be specific and personal in your answers
- Share your genuine perspective and opinions
- Keep responses natural and conversational
- If you share an experience, make it personal and authentic`;

        // Build message history
        const messages = [
          {
            role: 'system' as const,
            content: systemPrompt,
          },
          ...body.conversation.map((msg) => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
          })),
          {
            role: 'user' as const,
            content: body.message,
          },
        ];

        // Get response from AI provider
        const response = await aiProvider.chat({
          messages,
          maxTokens: 500,
          temperature: 0.7,
        });

        return reply.send({
          answer: response.content,
          sources: [],
          knowledgeBaseVersion: 'v1.0.0',
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({
            answer: 'Invalid request format',
            knowledgeBaseVersion: 'v1.0.0',
          });
        }

        console.error('Chat error:', error);
        return reply.status(500).send({
          answer: 'An error occurred processing your request',
          knowledgeBaseVersion: 'v1.0.0',
        });
      }
    }
  );
}
