/**
 * Sync and knowledge generation routes
 */

import type { FastifyInstance } from 'fastify';
import type { GitHubProvider } from '../providers/github.js';
import type { LinkedInProvider } from '../providers/linkedin.js';
import type { AIProvider } from '../providers/ai.js';
import { createKnowledgeBase, validateKnowledgeBase, type KnowledgeBase } from '../schemas/knowledge.js';
import { setChatKnowledgeBase } from './chat.js';
import { config } from '../config.js';

interface SyncStatus {
  status: 'idle' | 'syncing' | 'success' | 'error';
  message: string;
  lastSync?: Date;
  nextSync?: Date;
  knowledgeVersion?: string;
}

let syncStatus: SyncStatus = {
  status: 'idle',
  message: 'Ready to synchronize',
};

let currentKnowledgeBase: KnowledgeBase | null = null;

export async function createSyncRoutes(
  app: FastifyInstance,
  githubProvider: GitHubProvider,
  linkedinProvider: LinkedInProvider,
  _aiProvider: AIProvider
): Promise<void> {
  // Sync endpoint - fetch and build knowledge base
  app.post<{ Reply: { status: string; knowledgeVersion: string } }>(
    '/api/sync',
    async (_request, reply) => {
      try {
        syncStatus = {
          status: 'syncing',
          message: 'Synchronizing profile data...',
        };

        // Fetch data from GitHub
        const githubProfile = await githubProvider.getProfile(config.profileGitHubUsername);
        const githubRepos = await githubProvider.getRepositories(config.profileGitHubUsername);

        // Fetch data from LinkedIn
        const linkedinProfile = await linkedinProvider.getProfile();
        const linkedinExperience = await linkedinProvider.getExperience();
        const linkedinSkills = await linkedinProvider.getSkills();
        const linkedinEducation = await linkedinProvider.getEducation();

        // Determine profile data (LinkedIn takes precedence if available)
        const profileName = linkedinProfile?.name || githubProfile?.name || config.profileDisplayName;
        const profileTitle = linkedinProfile?.title || 'Developer';
        const profileBio = linkedinProfile?.headline || githubProfile?.bio || 'Software Developer';

        // Create knowledge base
        const kb = createKnowledgeBase({
          id: 'profile-1',
          name: profileName,
          title: profileTitle,
          bio: profileBio,
          profileImageUrl: githubProfile?.avatar_url,
        });

        // Add experience from LinkedIn
        if (linkedinExperience && linkedinExperience.length > 0) {
          kb.experience = linkedinExperience.map((exp, idx) => ({
            id: `exp-${idx}`,
            title: exp.title,
            company: exp.company,
            startDate: new Date(exp.startDate),
            endDate: exp.endDate ? new Date(exp.endDate) : undefined,
            description: exp.description || undefined,
            source: { type: 'linkedin', retrievedAt: new Date() },
          }));
        }

        // Add education from LinkedIn
        if (linkedinEducation && linkedinEducation.length > 0) {
          kb.education = linkedinEducation.map((edu, idx) => ({
            id: `edu-${idx}`,
            school: edu.school,
            degree: edu.degree,
            field: edu.field,
            startDate: edu.startDate ? new Date(edu.startDate) : undefined,
            endDate: edu.endDate ? new Date(edu.endDate) : undefined,
            description: edu.description || undefined,
            source: { type: 'linkedin', retrievedAt: new Date() },
          }));
        }

        // Combine skills from both LinkedIn and GitHub repos
        const skillsMap = new Map<string, { name: string; endorsements?: number; fromGithub: boolean; fromLinkedIn: boolean }>();

        // Add LinkedIn skills
        if (linkedinSkills && linkedinSkills.length > 0) {
          linkedinSkills.forEach((skill) => {
            if (!skillsMap.has(skill.name.toLowerCase())) {
              skillsMap.set(skill.name.toLowerCase(), {
                name: skill.name,
                endorsements: skill.endorsements,
                fromLinkedIn: true,
                fromGithub: false,
              });
            } else {
              const existing = skillsMap.get(skill.name.toLowerCase())!;
              existing.fromLinkedIn = true;
              if (skill.endorsements && (!existing.endorsements || skill.endorsements > existing.endorsements)) {
                existing.endorsements = skill.endorsements;
              }
            }
          });
        }

        // Add technologies from GitHub repos
        githubRepos.forEach((repo) => {
          repo.languages?.forEach((lang) => {
            const key = lang.toLowerCase();
            if (!skillsMap.has(key)) {
              skillsMap.set(key, {
                name: lang,
                fromLinkedIn: false,
                fromGithub: true,
              });
            } else {
              skillsMap.get(key)!.fromGithub = true;
            }
          });
          // Also add main language if present
          if (repo.language) {
            const key = repo.language.toLowerCase();
            if (!skillsMap.has(key)) {
              skillsMap.set(key, {
                name: repo.language,
                fromLinkedIn: false,
                fromGithub: true,
              });
            } else {
              skillsMap.get(key)!.fromGithub = true;
            }
          }
        });

        // Add common skills if not already present
        const commonSkills = ['Full Stack Development', 'Web Development', 'Open Source', 'Software Engineering'];
        commonSkills.forEach((skill) => {
          const key = skill.toLowerCase();
          if (!skillsMap.has(key)) {
            skillsMap.set(key, {
              name: skill,
              fromLinkedIn: false,
              fromGithub: true,
            });
          }
        });

        // Convert map to array
        kb.skills = Array.from(skillsMap.values()).map((skill, idx) => ({
          id: `skill-${idx}`,
          name: skill.name,
          category: skill.fromLinkedIn ? 'Professional' : 'Technical',
          endorsements: skill.endorsements,
          source: { 
            type: skill.fromLinkedIn && skill.fromGithub ? 'linkedin' : skill.fromLinkedIn ? 'linkedin' : 'github', 
            retrievedAt: new Date() 
          },
        }));

        // Add projects from GitHub repos (top 10) with detailed technologies
        kb.projects = githubRepos.slice(0, 10).map((repo) => {
          const technologies = repo.languages && repo.languages.length > 0 ? repo.languages : (repo.language ? [repo.language] : []);
          return {
            id: repo.name,
            name: repo.name,
            description: repo.description || 'A project I built and maintain',
            url: repo.url,
            technologies: technologies,
            source: { type: 'github', url: repo.url, retrievedAt: new Date() },
          };
        });

        // Validate
        validateKnowledgeBase(kb);
        currentKnowledgeBase = kb;
        
        // Update chat with new knowledge base
        setChatKnowledgeBase(kb);

        syncStatus = {
          status: 'success',
          message: 'Profile data synchronized successfully',
          lastSync: new Date(),
          knowledgeVersion: kb.version,
        };

        return reply.send({
          status: 'success',
          knowledgeVersion: kb.version,
        });
      } catch (error) {
        console.error('Sync error:', error);
        syncStatus = {
          status: 'error',
          message: `Failed to synchronize profile data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        };
        return reply.status(500).send({
          status: 'error',
          knowledgeVersion: currentKnowledgeBase?.version || 'none',
        });
      }
    }
  );

  // Get sync status
  app.get<{ Reply: SyncStatus }>('/api/sync/status', async (_request, reply) => {
    return reply.send(syncStatus);
  });

  // Get current knowledge base
  app.get<{ Reply: any }>('/api/knowledge', async (_request, reply) => {
    if (!currentKnowledgeBase) {
      return reply.status(404).send({
        error: 'Knowledge base not yet generated. Please run sync first.',
      });
    }

    const { experience, education, skills, projects, profile } = currentKnowledgeBase;
    return reply.send({
      profile,
      experience,
      education,
      skills,
      projects,
    });
  });
}
