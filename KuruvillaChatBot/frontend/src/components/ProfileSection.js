import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import './ProfileSection.css';
export function ProfileSection() {
    const [knowledge, setKnowledge] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        loadKnowledge();
    }, []);
    const loadKnowledge = async () => {
        try {
            const response = await fetch('/api/knowledge');
            if (response.ok) {
                const data = (await response.json());
                setKnowledge(data);
            }
        }
        catch (error) {
            console.error('Failed to load knowledge:', error);
        }
        finally {
            setLoading(false);
        }
    };
    if (loading) {
        return (_jsx("section", { className: "profile-section", children: _jsx("p", { className: "loading-message", children: "Loading profile..." }) }));
    }
    if (!knowledge) {
        return (_jsx("section", { className: "profile-section", children: _jsx("p", { className: "empty-message", children: "No knowledge base loaded. Click \"Synchronize Now\" to load profile data." }) }));
    }
    const profile = knowledge.profile;
    const initials = profile.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();
    return (_jsxs("section", { className: "profile-section", children: [_jsxs("div", { className: "profile-header", children: [_jsx("div", { className: "profile-avatar", children: initials }), _jsxs("div", { className: "profile-info", children: [_jsx("h2", { className: "profile-name", children: profile.name }), _jsx("p", { className: "profile-title", children: profile.title })] })] }), profile.bio && (_jsx("div", { className: "profile-bio", children: _jsx("p", { children: profile.bio }) })), _jsxs("div", { className: "profile-links", children: [_jsxs("a", { href: "#", className: "profile-link", children: [_jsx("span", { className: "icon", children: "\uD83D\uDD17" }), "GitHub"] }), _jsxs("a", { href: "#", className: "profile-link", children: [_jsx("span", { className: "icon", children: "\uD83D\uDCBC" }), "LinkedIn"] })] }), _jsxs("div", { className: "profile-sections", children: [knowledge.experience.length > 0 && (_jsxs("div", { className: "profile-subsection", children: [_jsxs("h3", { children: ["Experience (", knowledge.experience.length, ")"] }), _jsx("div", { className: "subsection-list", children: knowledge.experience.map((exp) => (_jsxs("div", { className: "list-item", children: [_jsx("strong", { children: exp.title }), _jsx("span", { className: "company", children: exp.company }), exp.description && _jsx("p", { className: "description", children: exp.description })] }, exp.id))) })] })), knowledge.skills.length > 0 && (_jsxs("div", { className: "profile-subsection", children: [_jsxs("h3", { children: ["Skills (", knowledge.skills.length, ")"] }), _jsx("div", { className: "skills-list", children: knowledge.skills.map((skill) => (_jsx("span", { className: "skill-tag", children: skill.name }, skill.id))) })] })), knowledge.projects.length > 0 && (_jsxs("div", { className: "profile-subsection", children: [_jsxs("h3", { children: ["Projects (", knowledge.projects.length, ")"] }), _jsx("div", { className: "subsection-list", children: knowledge.projects.map((proj) => (_jsxs("div", { className: "list-item", children: [_jsx("strong", { children: proj.name }), proj.description && _jsx("p", { className: "description", children: proj.description }), proj.technologies && proj.technologies.length > 0 && (_jsxs("div", { className: "technologies", children: [_jsx("span", { className: "tech-label", children: "Technologies:" }), _jsx("div", { className: "tech-tags", children: proj.technologies.map((tech) => (_jsx("span", { className: "tech-tag", children: tech }, tech))) })] }))] }, proj.id))) })] }))] })] }));
}
