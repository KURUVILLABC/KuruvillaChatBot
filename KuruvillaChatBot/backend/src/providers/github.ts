/**
 * GitHub provider for fetching profile data
 */

export interface GitHubProfile {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
}

export interface GitHubRepository {
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  languages: string[];
  stars: number;
}

export interface GitHubProvider {
  getProfile(username: string): Promise<GitHubProfile | null>;
  getRepositories(username: string): Promise<GitHubRepository[]>;
  isConfigured(): boolean;
}

/**
 * Real GitHub Provider using GitHub API
 */
export class RealGitHubProvider implements GitHubProvider {
  constructor(private username: string = "KURUVILLABC") {}

  async getProfile(username: string): Promise<GitHubProfile | null> {
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (response.status === 404) return null;
      if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
      
      const data: any = await response.json();
      return {
        login: data.login,
        name: data.name || data.login,
        bio: data.bio || null,
        avatar_url: data.avatar_url,
        public_repos: data.public_repos,
        followers: data.followers,
        following: data.following,
      };
    } catch (error) {
      console.error(`Failed to fetch GitHub profile for ${username}:`, error);
      return null;
    }
  }

  async getRepositories(username: string): Promise<GitHubRepository[]> {
    try {
      const response = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=10&sort=stars&direction=desc`
      );
      if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
      
      const data = (await response.json()) as any[];
      const repos: GitHubRepository[] = [];
      
      // Fetch detailed language info for each repo
      for (const repo of data) {
        const languages = await this.fetchRepositoryLanguages(username, repo.name);
        repos.push({
          name: repo.name,
          description: repo.description,
          url: repo.html_url,
          language: repo.language,
          languages: languages,
          stars: repo.stargazers_count || 0,
        });
      }
      
      return repos;
    } catch (error) {
      console.error(`Failed to fetch GitHub repos for ${username}:`, error);
      return [];
    }
  }

  private async fetchRepositoryLanguages(owner: string, repo: string): Promise<string[]> {
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`);
      if (!response.ok) return [];
      
      const data = (await response.json()) as any;
      if (!data || typeof data !== 'object') return [];
      return Object.keys(data).sort((a, b) => (data[a] || 0) - (data[b] || 0)).slice(0, 5).reverse();
    } catch (error) {
      console.error(`Failed to fetch languages for ${owner}/${repo}:`, error);
      return [];
    }
  }

  isConfigured(): boolean {
    return true;
  }
}

/**
 * Mock GitHub Provider for development
 */
/**
 * Mock GitHub Provider for testing
 */
export class MockGitHubProvider implements GitHubProvider {
  async getProfile(username: string): Promise<GitHubProfile | null> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (username.toLowerCase() === 'kuruvillabc') {
      return {
        login: 'KURUVILLABC',
        name: 'Kuruvilla B C',
        bio: 'Coding is my passion. Hence I do it with pleasure, not with pressure',
        avatar_url: 'https://avatars.githubusercontent.com/u/69909186?v=4',
        public_repos: 16,
        followers: 3,
        following: 3,
      };
    }

    return null;
  }

  async getRepositories(username: string): Promise<GitHubRepository[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (username.toLowerCase() === 'kuruvillabc') {
      return [
        {
          name: 'KuruvillaChatBot',
          description: 'Professional profile knowledge system with conversational AI',
          url: 'https://github.com/KURUVILLABC/KuruvillaChatBot',
          language: 'TypeScript',
          languages: ['TypeScript', 'JavaScript', 'CSS', 'HTML'],
          stars: 0,
        },
        {
          name: 'GitLabMRMate',
          description: 'Merge request tracking and management tool',
          url: 'https://github.com/KURUVILLABC/GitLabMRMate',
          language: 'JavaScript',
          languages: ['JavaScript', 'Python'],
          stars: 2,
        },
        {
          name: 'MRTracker',
          description: 'Merge Request tracking and analytics',
          url: 'https://github.com/KURUVILLABC/MRTracker',
          language: 'JavaScript',
          languages: ['JavaScript', 'CSS', 'HTML'],
          stars: 2,
        },
        {
          name: 'RGBOO',
          description: 'RGB color guess game',
          url: 'https://github.com/KURUVILLABC/RGBOO',
          language: 'JavaScript',
          languages: ['JavaScript', 'CSS', 'HTML'],
          stars: 2,
        },
        {
          name: 'Omnisearch',
          description: 'Keyword-based bookmark navigation tool',
          url: 'https://github.com/KURUVILLABC/Omnisearch',
          language: null,
          languages: ['JavaScript', 'CSS'],
          stars: 2,
        },
        {
          name: 'Firepoker-app-Cheat',
          description: 'Agile Planning Poker console cheat code',
          url: 'https://github.com/KURUVILLABC/Firepoker-app-Cheat',
          language: 'JavaScript',
          languages: ['JavaScript'],
          stars: 3,
        },
        {
          name: 'Pianissist-AI',
          description: 'AI-powered piano that plays based on voice input',
          url: 'https://github.com/KURUVILLABC/Pianissist-AI',
          language: 'JavaScript',
          languages: ['JavaScript', 'Web Audio API'],
          stars: 0,
        },
        {
          name: 'GlowingCSSButtosSocialMedia',
          description: '3D rotating glowing CSS buttons for social media',
          url: 'https://github.com/KURUVILLABC/GlowingCSSButtosSocialMedia',
          language: 'CSS',
          languages: ['CSS', 'HTML', 'JavaScript'],
          stars: 2,
        },
        {
          name: 'CSS-3D-RotatingCube-For-Contact-Section',
          description: '3D Rotating Cube design for contact section',
          url: 'https://github.com/KURUVILLABC/CSS-3D-RotatingCube-For-Contact-Section',
          language: 'CSS',
          languages: ['CSS', 'HTML'],
          stars: 1,
        },
        {
          name: 'Thanal-House_Rental_Platform',
          description: 'House rental platform for owners and tenants',
          url: 'https://github.com/KURUVILLABC/Thanal-House_Rental_Platform',
          language: 'HTML',
          languages: ['HTML', 'CSS', 'JavaScript'],
          stars: 0,
        },
      ];
    }

    return [];
  }

  isConfigured(): boolean {
    return true;
  }
}
