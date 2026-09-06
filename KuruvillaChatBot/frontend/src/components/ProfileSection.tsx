import { useEffect, useState } from 'react';
import './ProfileSection.css';

interface Knowledge {
  profile: {
    id: string;
    name: string;
    title: string;
    bio?: string;
  };
  experience: Array<{
    id: string;
    title: string;
    company: string;
    description?: string;
  }>;
  skills: Array<{
    id: string;
    name: string;
    category?: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    description?: string;
    technologies?: string[];
    url?: string;
  }>;
}

export function ProfileSection() {
  const [knowledge, setKnowledge] = useState<Knowledge | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadKnowledge();
  }, []);

  const loadKnowledge = async () => {
    try {
      const response = await fetch('/api/knowledge');
      if (response.ok) {
        const data = (await response.json()) as Knowledge;
        setKnowledge(data);
      }
    } catch (error) {
      console.error('Failed to load knowledge:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="profile-section">
        <p className="loading-message">Loading profile...</p>
      </section>
    );
  }

  if (!knowledge) {
    return (
      <section className="profile-section">
        <p className="empty-message">No knowledge base loaded. Click "Synchronize Now" to load profile data.</p>
      </section>
    );
  }

  const profile = knowledge.profile;
  const initials = profile.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <section className="profile-section">
      <div className="profile-header">
        <div className="profile-avatar">{initials}</div>
        <div className="profile-info">
          <h2 className="profile-name">{profile.name}</h2>
          <p className="profile-title">{profile.title}</p>
        </div>
      </div>

      {profile.bio && (
        <div className="profile-bio">
          <p>{profile.bio}</p>
        </div>
      )}

      <div className="profile-links">
        <a href="#" className="profile-link">
          <span className="icon">🔗</span>
          GitHub
        </a>
        <a href="#" className="profile-link">
          <span className="icon">💼</span>
          LinkedIn
        </a>
      </div>

      <div className="profile-sections">
        {knowledge.experience.length > 0 && (
          <div className="profile-subsection">
            <h3>Experience ({knowledge.experience.length})</h3>
            <div className="subsection-list">
              {knowledge.experience.map((exp) => (
                <div key={exp.id} className="list-item">
                  <strong>{exp.title}</strong>
                  <span className="company">{exp.company}</span>
                  {exp.description && <p className="description">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {knowledge.skills.length > 0 && (
          <div className="profile-subsection">
            <h3>Skills ({knowledge.skills.length})</h3>
            <div className="skills-list">
              {knowledge.skills.map((skill) => (
                <span key={skill.id} className="skill-tag">
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {knowledge.projects.length > 0 && (
          <div className="profile-subsection">
            <h3>Projects ({knowledge.projects.length})</h3>
            <div className="subsection-list">
              {knowledge.projects.map((proj) => (
                <div key={proj.id} className="list-item">
                  <strong>{proj.name}</strong>
                  {proj.description && <p className="description">{proj.description}</p>}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="technologies">
                      <span className="tech-label">Technologies:</span>
                      <div className="tech-tags">
                        {proj.technologies.map((tech) => (
                          <span key={tech} className="tech-tag">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
