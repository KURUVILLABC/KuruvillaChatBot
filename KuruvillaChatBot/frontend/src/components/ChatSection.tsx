import { useState, useRef, useEffect } from 'react';
import './ChatSection.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatSectionProps {
  serverStatus: 'connected' | 'disconnected';
}

const SUGGESTED_QUESTIONS = [
  'Tell me about the experience',
  'What are the technical skills?',
  'What projects have been built?',
  'Tell me about the GitHub profile',
  'What is the educational background?',
];

export function ChatSection({ serverStatus }: ChatSectionProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    if (!input.trim() || loading) return;

    const userMessage: Message = {
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

      const data = await response.json() as { answer: string };
      const assistantMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: data.answer || 'I apologize, but I was unable to process your request.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your message. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <section className="chat-section">
      <div className="chat-header">
        <h2>Chat with Profile Assistant</h2>
        <p className="chat-status">
          {serverStatus === 'connected' ? '🟢 Ready' : '🔴 Offline'}
        </p>
      </div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.role}`}>
            <div className="message-avatar">
              {msg.role === 'user' ? '👤' : '🤖'}
            </div>
            <div className="message-content">
              <p>{msg.content}</p>
              <time className="message-time">
                {msg.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </time>
            </div>
          </div>
        ))}
        {loading && (
          <div className="message assistant typing">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length === 1 && (
        <div className="suggested-questions">
          <p className="suggested-label">Try asking:</p>
          <div className="suggestions">
            {SUGGESTED_QUESTIONS.map((question) => (
              <button
                key={question}
                className="suggestion-btn"
                onClick={() => handleSuggestedQuestion(question)}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="chat-input-area">
        <div className="input-wrapper">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about Kuruvilla's profile..."
            rows={3}
            disabled={!serverStatus || loading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || loading || !serverStatus}
            className="send-btn"
          >
            {loading ? '⏳' : '➤'}
          </button>
        </div>
        <p className="input-hint">Press Enter to send, Shift+Enter for new line</p>
      </div>
    </section>
  );
}
