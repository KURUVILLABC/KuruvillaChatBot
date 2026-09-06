import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import './ChatSection.css';
const SUGGESTED_QUESTIONS = [
    'Tell me about the experience',
    'What are the technical skills?',
    'What projects have been built?',
    'Tell me about the GitHub profile',
    'What is the educational background?',
];
export function ChatSection({ serverStatus }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    // Add initial greeting from Kuruvilla
    useEffect(() => {
        setMessages([
            {
                id: 'greeting',
                role: 'assistant',
                content: 'Hey there! 👋 I\'m Kuruvilla. Thanks for stopping by. I\'m a Software Engineer and AI Systems Architect who\'s really passionate about building intelligent systems and exploring what\'s possible with AI. I love working on full-stack projects, knowledge systems, and creating tools that actually solve problems. Feel free to ask me anything - about my work, projects I\'ve built, technologies I use, or just chat about tech and ideas. What brings you here?',
                timestamp: new Date(),
            },
        ]);
    }, []);
    const handleSendMessage = async () => {
        if (!input.trim() || loading)
            return;
        const userMessage = {
            id: `msg-${Date.now()}`,
            role: 'user',
            content: input,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: input,
                    conversation: messages.map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to get response');
            }
            const data = await response.json();
            const assistantMessage = {
                id: `msg-${Date.now()}`,
                role: 'assistant',
                content: data.answer || 'I apologize, but I was unable to process your request.',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, assistantMessage]);
        }
        catch (error) {
            console.error('Chat error:', error);
            const errorMessage = {
                id: `msg-${Date.now()}`,
                role: 'assistant',
                content: 'Sorry, I encountered an error processing your message. Please try again.',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        }
        finally {
            setLoading(false);
        }
    };
    const handleSuggestedQuestion = (question) => {
        setInput(question);
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    return (_jsxs("section", { className: "chat-section", children: [_jsxs("div", { className: "chat-header", children: [_jsx("h2", { children: "Chat with Profile Assistant" }), _jsx("p", { className: "chat-status", children: serverStatus === 'connected' ? '🟢 Ready' : '🔴 Offline' })] }), _jsxs("div", { className: "chat-messages", children: [messages.map((msg) => (_jsxs("div", { className: `message ${msg.role}`, children: [_jsx("div", { className: "message-avatar", children: msg.role === 'user' ? '👤' : '🤖' }), _jsxs("div", { className: "message-content", children: [_jsx("p", { children: msg.content }), _jsx("time", { className: "message-time", children: msg.timestamp.toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        }) })] })] }, msg.id))), loading && (_jsxs("div", { className: "message assistant typing", children: [_jsx("div", { className: "message-avatar", children: "\uD83E\uDD16" }), _jsx("div", { className: "message-content", children: _jsxs("div", { className: "typing-indicator", children: [_jsx("span", {}), _jsx("span", {}), _jsx("span", {})] }) })] })), _jsx("div", { ref: messagesEndRef })] }), messages.length === 1 && (_jsxs("div", { className: "suggested-questions", children: [_jsx("p", { className: "suggested-label", children: "Try asking:" }), _jsx("div", { className: "suggestions", children: SUGGESTED_QUESTIONS.map((question) => (_jsx("button", { className: "suggestion-btn", onClick: () => handleSuggestedQuestion(question), children: question }, question))) })] })), _jsxs("div", { className: "chat-input-area", children: [_jsxs("div", { className: "input-wrapper", children: [_jsx("textarea", { value: input, onChange: (e) => setInput(e.target.value), onKeyPress: handleKeyPress, placeholder: "Ask me anything about Kuruvilla's profile...", rows: 3, disabled: !serverStatus || loading }), _jsx("button", { onClick: handleSendMessage, disabled: !input.trim() || loading || !serverStatus, className: "send-btn", children: loading ? '⏳' : '➤' })] }), _jsx("p", { className: "input-hint", children: "Press Enter to send, Shift+Enter for new line" })] })] }));
}
