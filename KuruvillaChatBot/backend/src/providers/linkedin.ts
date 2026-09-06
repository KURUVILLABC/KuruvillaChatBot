/**
 * LinkedIn provider for fetching profile data
 */

export interface LinkedInProfile {
  id: string;
  name: string;
  title: string;
  headline: string;
  summary: string | null;
  profile_url: string;
  picture_url: string | null;
}

export interface LinkedInExperience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string | null;
  description: string | null;
}

export interface LinkedInSkill {
  id: string;
  name: string;
  endorsements?: number;
}

export interface LinkedInEducation {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface LinkedInProvider {
  getProfile(): Promise<LinkedInProfile | null>;
  getExperience(): Promise<LinkedInExperience[]>;
  getSkills(): Promise<LinkedInSkill[]>;
  getEducation(): Promise<LinkedInEducation[]>;
  isConfigured(): boolean;
}

/**
 * Configuration-based LinkedIn Provider for production
 */
export class RealLinkedInProvider implements LinkedInProvider {
  private profile: LinkedInProfile | null;
  private experience: LinkedInExperience[];
  private skills: LinkedInSkill[];
  private education: LinkedInEducation[];

  constructor() {
    // Load from environment variables or config
    this.profile = this.loadProfileFromEnv();
    this.experience = this.loadExperienceFromEnv();
    this.skills = this.loadSkillsFromEnv();
    this.education = this.loadEducationFromEnv();
  }

  private loadProfileFromEnv(): LinkedInProfile | null {
    const profile = process.env.LINKEDIN_PROFILE_JSON;
    if (!profile) return null;

    try {
      return JSON.parse(profile) as LinkedInProfile;
    } catch (error) {
      console.error("Failed to parse LINKEDIN_PROFILE_JSON:", error);
      return null;
    }
  }

  private loadExperienceFromEnv(): LinkedInExperience[] {
    const experience = process.env.LINKEDIN_EXPERIENCE_JSON;
    if (!experience) return [];

    try {
      return JSON.parse(experience) as LinkedInExperience[];
    } catch (error) {
      console.error("Failed to parse LINKEDIN_EXPERIENCE_JSON:", error);
      return [];
    }
  }

  private loadSkillsFromEnv(): LinkedInSkill[] {
    const skills = process.env.LINKEDIN_SKILLS_JSON;
    if (!skills) return [];

    try {
      return JSON.parse(skills) as LinkedInSkill[];
    } catch (error) {
      console.error("Failed to parse LINKEDIN_SKILLS_JSON:", error);
      return [];
    }
  }

  private loadEducationFromEnv(): LinkedInEducation[] {
    const education = process.env.LINKEDIN_EDUCATION_JSON;
    if (!education) return [];

    try {
      return JSON.parse(education) as LinkedInEducation[];
    } catch (error) {
      console.error("Failed to parse LINKEDIN_EDUCATION_JSON:", error);
      return [];
    }
  }

  async getProfile(): Promise<LinkedInProfile | null> {
    return this.profile;
  }

  async getExperience(): Promise<LinkedInExperience[]> {
    return this.experience;
  }

  async getSkills(): Promise<LinkedInSkill[]> {
    return this.skills;
  }

  async getEducation(): Promise<LinkedInEducation[]> {
    return this.education;
  }

  isConfigured(): boolean {
    return this.profile !== null;
  }
}

/**
 * Mock LinkedIn Provider for development
 */
export class MockLinkedInProvider implements LinkedInProvider {
  async getProfile(): Promise<LinkedInProfile | null> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 400));

    return {
      id: 'kuruvilla-biju-cheruvallil',
      name: 'Kuruvilla Biju Cheruvallil',
      title: 'Software Engineer & AI Systems Architect',
      headline: 'Passionate about building AI systems, knowledge bases, and conversational interfaces | Full Stack Developer',
      summary: 'Experienced software engineer with passion for AI systems and web technologies. Specializing in full-stack development, AI integration, and knowledge base systems. Strong track record of building scalable applications and innovative solutions.',
      profile_url: 'https://linkedin.com/in/kuruvilla-biju-cheruvallil',
      picture_url: null,
    };
  }

  async getExperience(): Promise<LinkedInExperience[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 400));

    return [
      {
        id: 'exp-1',
        title: 'Senior Software Engineer / Full Stack Developer',
        company: 'Various Tech Companies',
        startDate: '2020-01',
        endDate: null,
        description: 'Building scalable applications, AI systems, and knowledge base platforms. Expertise in TypeScript, React, Node.js, and AI integration. Led development of conversational AI systems and full-stack applications.',
      },
      {
        id: 'exp-2',
        title: 'Full Stack Developer',
        company: 'Tech Startups',
        startDate: '2018-06',
        endDate: '2019-12',
        description: 'Developed web applications using modern frameworks. Worked on both frontend and backend systems. Implemented REST APIs, database optimization, and frontend components using React.',
      },
      {
        id: 'exp-3',
        title: 'Junior Developer / Intern',
        company: 'Various Companies',
        startDate: '2015-06',
        endDate: '2018-05',
        description: 'Started career learning web development, software engineering best practices, and cloud technologies. Worked with HTML, CSS, JavaScript, and backend technologies.',
      },
    ];
  }

  async getSkills(): Promise<LinkedInSkill[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return [
      { id: 'skill-1', name: 'TypeScript', endorsements: 45 },
      { id: 'skill-2', name: 'JavaScript', endorsements: 52 },
      { id: 'skill-3', name: 'React', endorsements: 38 },
      { id: 'skill-4', name: 'Node.js', endorsements: 35 },
      { id: 'skill-5', name: 'Full Stack Development', endorsements: 42 },
      { id: 'skill-6', name: 'AI Systems', endorsements: 28 },
      { id: 'skill-7', name: 'API Design', endorsements: 32 },
      { id: 'skill-8', name: 'Database Design', endorsements: 25 },
      { id: 'skill-9', name: 'Web Development', endorsements: 40 },
      { id: 'skill-10', name: 'Problem Solving', endorsements: 35 },
    ];
  }

  async getEducation(): Promise<LinkedInEducation[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return [
      {
        id: 'edu-1',
        school: 'University of Kerala',
        degree: 'Bachelor of Technology',
        field: 'Computer Science and Engineering',
        startDate: '2011-06',
        endDate: '2015-05',
        description: 'Graduated with distinction. Focused on computer science fundamentals, data structures, algorithms, and software engineering.',
      },
      {
        id: 'edu-2',
        school: 'Online Courses & Certifications',
        degree: 'Various Technical Certifications',
        field: 'AI, Machine Learning, Full Stack Development',
        description: 'Completed courses in AI systems, machine learning, React, Node.js, and cloud technologies from platforms like Coursera, Udemy, and others.',
      },
    ];
  }

  isConfigured(): boolean {
    return true;
  }
}
