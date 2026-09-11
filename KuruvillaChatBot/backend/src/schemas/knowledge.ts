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
  portfolioUrl: z.string().url().optional(),
  linkedinUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  codepenUrl: z.string().url().optional(),
  email: z.string().email().optional(),
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
 * Default profile knowledge used before the first provider sync.
 * Keep this dataset editable so local development and the public profile have useful context immediately.
 */
export function createDefaultKnowledgeBase(): KnowledgeBase {
  const retrievedAt = new Date();

  return {
    id: 'kb-default',
    version: '1.0.0',
    createdAt: retrievedAt,
    updatedAt: retrievedAt,
    profile: {
      id: 'profile-1',
      name: 'Kuruvilla Biju Cheruvallil',
      title: 'Full Stack Developer',
      bio: 'Passionate Software Engineer and Full Stack Developer with experience delivering end-to-end solutions across diverse projects. I create my own initiatives, tackle complex challenges, and build innovative digital experiences. I have collaborated with diverse teams, contributed to customer-focused solutions, and adapted quickly to changing requirements with a fast-learning mindset.',
      profileImageUrl: 'https://avatars.githubusercontent.com/u/69909186?v=4',
      portfolioUrl: 'https://iamkuruvilla.netlify.app/',
      linkedinUrl: 'https://www.linkedin.com/in/kuruvilla-biju-cheruvallil-b28475206/',
      githubUrl: 'https://github.com/KURUVILLABC',
      codepenUrl: 'https://codepen.io/k13c',
      email: 'itsmekuruvilla@gmail.com',
    },
    experience: [
      {
        id: 'exp-1',
        title: 'Software Engineer',
        company: 'Redblack Software',
        startDate: new Date('2025-08-01'),
        description: 'Full-stack development focused mainly on frontend work, DOM manipulation script development, Epic ownership, customer-centric development, UI design and development, REST APIs, OpenAPI, and feature development. Contributed to copilot development environment by creating custom agents, skills, prompts.',
        source: { type: 'manual', url: 'https://iamkuruvilla.netlify.app/', retrievedAt },
      },
      {
        id: 'exp-2',
        title: 'Software Engineer',
        company: 'intelliflo',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-08-01'),
        description: 'Full-stack both web and desktop development, multiple feature deliveries, major merge request reviews, DOM manipulation, QA support, performance testing, developing batch scripts, and REST APIs. Created minor applications for internal organisation usage to make work easier.',
        source: { type: 'manual', url: 'https://iamkuruvilla.netlify.app/', retrievedAt },
      },
      {
        id: 'exp-3',
        title: 'Associate Software Engineer',
        company: 'intelliflo',
        startDate: new Date('2023-07-01'),
        endDate: new Date('2025-01-01'),
        description: 'Full-stack development with Aurelia, HTML, CSS, JavaScript, C#, and SQL. Reviewed merge requests, fixed bugs, developed features, created scripts, and built applications to make work easier.',
        source: { type: 'manual', url: 'https://iamkuruvilla.netlify.app/', retrievedAt },
      },
      {
        id: 'exp-4',
        title: 'Software Development Intern',
        company: 'Global Development Community Program (GDCP)',
        startDate: new Date('2023-03-01'),
        description: 'Training in Julia, data science, web development, ethical hacking, and social engineering.',
        source: { type: 'manual', url: 'https://iamkuruvilla.netlify.app/', retrievedAt },
      },
      {
        id: 'exp-5',
        title: 'Data Engineer Intern',
        company: 'Skypoint Cloud',
        startDate: new Date('2022-10-01'),
        endDate: new Date('2022-11-01'),
        description: 'Training in Azure Data Factory, Azure Cosmos DB, Microsoft Azure, Azure Data Lake, and Azure Databricks.',
        source: { type: 'manual', url: 'https://iamkuruvilla.netlify.app/', retrievedAt },
      },
      {
        id: 'exp-6',
        title: 'Django Developer Intern',
        company: 'Kites Softwares Pvt. Ltd.',
        startDate: new Date('2022-05-01'),
        endDate: new Date('2022-07-01'),
        description: 'Worked with Python, Django, web development, and frontend development, and developed six projects.',
        source: { type: 'manual', url: 'https://iamkuruvilla.netlify.app/', retrievedAt },
      },
      {
        id: 'exp-7',
        title: 'Student Trainee',
        company: 'Camino Infotech Pvt. Ltd.',
        startDate: new Date('2022-01-01'),
        endDate: new Date('2022-02-01'),
        description: 'Training in Python, Django, web development, and backend development.',
        source: { type: 'manual', url: 'https://iamkuruvilla.netlify.app/', retrievedAt },
      },
    ],
    education: [
      {
        id: 'edu-1',
        school: 'Kerala Technical University',
        degree: 'Bachelor of Technology',
        field: 'Information Technology (IT)',
        startDate: new Date('2011-06-01'),
        endDate: new Date('2015-05-01'),
        description: 'Focused on computer science fundamentals, data structures, algorithms, and software engineering. Information Technology is a broad field that encompasses the study, design, development, implementation, support, and management of computer-based information systems, particularly software applications.',
        source: { type: 'manual', retrievedAt },
      },
      {
        id: 'edu-2',
        school: 'Online Courses & Certifications',
        degree: 'Various Technical Certifications',
        field: 'AI, Machine Learning, Full Stack Development',
        description: 'Continuous learning through courses and practical projects in AI systems, machine learning, React, Node.js, and cloud technologies.',
        source: { type: 'manual', retrievedAt },
      },
    ],
    skills: ([
      ['C#', 'Programming Languages'],
      ['Python', 'Programming Languages'],
      ['Julia', 'Programming Languages'],
      ['C++', 'Programming Languages'],
      ['C', 'Programming Languages'],
      ['Java', 'Programming Languages'],
      ['HTML', 'Web Development'],
      ['CSS', 'Web Development'],
      ['JavaScript', 'Web Development'],
      ['Aurelia', 'Web Development'],
      ['Django', 'Web Development'],
      ['React', 'Web Development'],
      ['AWS', 'Cloud Computing'],
      ['Azure', 'Cloud Computing'],
      ['GCD', 'Cloud Computing'],
      ['SQL', 'Data Engineering'],
      ['Cosmos DB', 'Data Engineering'],
      ['Data Lake', 'Data Engineering'],
      ['Hadoop', 'Data Engineering'],
      ['PySpark', 'Data Engineering'],
      ['Excel', 'Data Science'],
      ['R', 'Data Science'],
      ['Power BI', 'Data Science'],
      ['Photoshop', 'Adobe'],
      ['Illustrator', 'Adobe'],
      ['Premiere Pro', 'Adobe'],
    ] as Array<[string, string]>).map(([name, category], index) => ({
      id: `skill-${index + 1}`,
      name,
      category,
      source: { type: 'manual' as const, url: 'https://iamkuruvilla.netlify.app/', retrievedAt },
    })),
    projects: ([
      ['3D - Rotating Cube', 'A 3D rotating cube model design for contact pages.', 'HTML, CSS, JavaScript', 'https://iamkuruvilla.netlify.app/'],
      ['RGBOO', 'RGB colour guessing game.', 'HTML, CSS, JavaScript', 'https://iamkuruvilla.netlify.app/'],
      ['Pianissist - AI', 'Browser-based piano playable with mouse, keyboard, or voice through a microphone.', 'JavaScript, Web Audio API', 'https://iamkuruvilla.netlify.app/'],
      ['Thanal', 'House rental platform with a feature for pooling houses for rent.', 'HTML, CSS, JavaScript', 'https://iamkuruvilla.netlify.app/'],
      ['Merge With Gratitude', 'A fun website showing a random meme about reviewing code before navigating to code changes.', 'HTML, CSS, JavaScript', 'https://iamkuruvilla.netlify.app/'],
      ['Reminder Clock', 'A web UI for a reminder clock.', 'HTML, CSS, JavaScript', 'https://iamkuruvilla.netlify.app/'],
    ] as Array<[string, string, string, string]>).map(([name, description, technologyList, url]) => ({
      id: name,
      name,
      description,
      url,
      technologies: technologyList.split(', '),
      source: { type: 'manual' as const, url, retrievedAt },
    })),
    githubProfile: {
      username: 'KURUVILLABC',
      profileUrl: 'https://github.com/KURUVILLABC',
      publicRepositories: 16,
      followers: 3,
      following: 3,
      bio: 'Coding is my passion. Hence I do it with pleasure, not with pressure',
    },
    sources: [
      { type: 'manual', url: 'https://iamkuruvilla.netlify.app/', retrievedAt },
      { type: 'manual', url: 'https://github.com/KURUVILLABC', retrievedAt },
      { type: 'manual', url: 'https://www.linkedin.com/in/kuruvilla-biju-cheruvallil-b28475206/', retrievedAt },
    ],
  };
}

/**
 * Validate a knowledge base
 */
export function validateKnowledgeBase(data: unknown): KnowledgeBase {
  return KnowledgeBaseSchema.parse(data);
}
