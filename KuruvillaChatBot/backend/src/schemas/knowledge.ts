/**
 * Knowledge base schema and storage
 */

import { z } from 'zod';

// Schema definitions
export const SourceSchema = z.object({
  type: z.enum(['github', 'linkedin', 'manual', 'generated']),
  url: z.string().optional(),
  retrievedAt: z.date(),
});

export const ExperienceSchema = z.object({
  id: z.string(),
  title: z.string(),
  company: z.string(),
  startDate: z.date(),
  endDate: z.date().optional(),
  description: z.string().optional(),
  source: SourceSchema,
});

export const EducationSchema = z.object({
  id: z.string(),
  school: z.string(),
  degree: z.string(),
  field: z.string(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  description: z.string().optional(),
  source: SourceSchema,
});

export const SkillSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string().optional(),
  endorsements: z.number().optional(),
  source: SourceSchema,
});

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  url: z.string().optional(),
  technologies: z.array(z.string()),
  source: SourceSchema,
});

export const ProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  title: z.string(),
  bio: z.string().optional(),
  profileImageUrl: z.string().optional(),
});

export const KnowledgeBaseSchema = z.object({
  id: z.string(),
  version: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  profile: ProfileSchema,
  experience: z.array(ExperienceSchema),
  education: z.array(EducationSchema),
  skills: z.array(SkillSchema),
  projects: z.array(ProjectSchema),
  githubProfile: z.record(z.any()).optional(),
  sources: z.array(SourceSchema),
});

export type Source = z.infer<typeof SourceSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type Skill = z.infer<typeof SkillSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Profile = z.infer<typeof ProfileSchema>;
export type KnowledgeBase = z.infer<typeof KnowledgeBaseSchema>;

/**
 * Create a new knowledge base
 */
export function createKnowledgeBase(profile: Profile): KnowledgeBase {
  return {
    id: `kb-${Date.now()}`,
    version: '1.0.0',
    createdAt: new Date(),
    updatedAt: new Date(),
    profile,
    experience: [],
    education: [],
    skills: [],
    projects: [],
    sources: [
      {
        type: 'generated',
        retrievedAt: new Date(),
      },
    ],
  };
}

/**
 * Validate a knowledge base
 */
export function validateKnowledgeBase(data: unknown): KnowledgeBase {
  return KnowledgeBaseSchema.parse(data);
}
