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
      title: 'Full Stack Developer',
      headline: 'Passionate Software Engineer and Full Stack Developer',
      summary: 'Passionate Software Engineer and Full Stack Developer with experience delivering end-to-end solutions across diverse projects. Focused on creating initiatives, tackling complex challenges, and building innovative digital experiences.',
      profile_url: 'https://www.linkedin.com/in/kuruvilla-biju-cheruvallil-b28475206/',
      picture_url: null,
    };
  }

  async getExperience(): Promise<LinkedInExperience[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 400));

    return [
      {
        id: 'exp-1',
        title: 'Software Engineer',
        company: 'Redblack Software',
        startDate: '2025-08',
        endDate: null,
        description: 'Full-stack development focused mainly on frontend work, DOM manipulation script development, Epic ownership, customer-centric development, UI design and development, REST APIs, OpenAPI, and feature development.',
      },
      {
        id: 'exp-2',
        title: 'Software Engineer',
        company: 'intelliflo',
        startDate: '2025-01',
        endDate: '2025-08',
        description: 'Full-stack and desktop development, multiple feature deliveries, major merge request reviews, DOM manipulation, QA support, performance testing, batch scripts, and REST APIs.',
      },
      {
        id: 'exp-3',
        title: 'Associate Software Engineer',
        company: 'intelliflo',
        startDate: '2023-07',
        endDate: '2025-01',
        description: 'Full-stack development with Aurelia, HTML, CSS, JavaScript, C#, and SQL. Reviewed merge requests, fixed bugs, developed features, created scripts, and built applications to make work easier.',
      },
      {
        id: 'exp-4',
        title: 'Software Development Intern',
        company: 'Global Development Community Program (GDCP)',
        startDate: '2023-03',
        endDate: null,
        description: 'Training in Julia, data science, web development, ethical hacking, and social engineering.',
      },
      {
        id: 'exp-5',
        title: 'Data Engineer Intern',
        company: 'Skypoint Cloud',
        startDate: '2022-10',
        endDate: '2022-11',
        description: 'Training in Azure Data Factory, Azure Cosmos DB, Microsoft Azure, Azure Data Lake, and Azure Databricks.',
      },
      {
        id: 'exp-6',
        title: 'Django Developer Intern',
        company: 'Kites Softwares Pvt. Ltd.',
        startDate: '2022-05',
        endDate: '2022-07',
        description: 'Worked with Python, Django, web development, and frontend development, and developed six projects.',
      },
      {
        id: 'exp-7',
        title: 'Student Trainee',
        company: 'Camino Infotech Pvt. Ltd.',
        startDate: '2022-01',
        endDate: '2022-02',
        description: 'Training in Python, Django, web development, and backend development.',
      },
    ];
  }

  async getSkills(): Promise<LinkedInSkill[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return [
      'C#', 'Python', 'Julia', 'C++', 'C', 'Java',
      'HTML', 'CSS', 'JavaScript', 'Aurelia', 'Django', 'React',
      'AWS', 'Azure', 'GCD', 'SQL', 'Cosmos DB', 'Data Lake',
      'Hadoop', 'PySpark', 'Excel', 'R', 'Power BI', 'Photoshop',
      'Illustrator', 'Premiere Pro',
    ].map((name, index) => ({
      id: `skill-${index + 1}`,
      name,
    }));
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
