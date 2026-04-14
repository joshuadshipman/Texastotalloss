"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function CounselChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: "Hi, I'm Counsel, the Texas Total Loss AI assistant. Were you involved in a car accident and need help figuring out your next steps?" 
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user" as const, content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "I'm having trouble connecting right now. Please try again or head over to our [Intake Form](/intake) if you need immediate help." }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Safe markdown link parsing for the widget
  const formatMessage = (text: string) => {
    // Basic regex to convert [Link Text](/url) to actual links
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      // Add the link
      parts.push(
        <Link key={match.index} href={match[2]} style={{ color: "var(--color-accent)", fontWeight: 600, textDecoration: "underline" }}>
          {match[1]}
        </Link>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    // Also handle newlines
    if (parts.length === 0) return text;
    
    return parts.map((part, i) => {
      if (typeof part === 'string') {
        return <span key={i}>{part.split('\n').map((line, j) => <span key={j}>{line}<br/></span>)}</span>;
      }
      return part;
    });
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          width: "60px",
          height: "60px",
          borderRadius: "30px",
          background: "var(--color-accent)",
          color: "var(--background-base)",
          fontSize: "1.8rem",
          display: isOpen ? "none" : "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
          border: "none",
          cursor: "pointer",
          zIndex: 9999,
          animation: "pulse-glow 2s infinite"
        }}
        aria-label="Chat with Counsel"
      >
        💬
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          width: "350px",
          height: "500px",
          maxHeight: "calc(100vh - 3rem)",
          background: "var(--surface-overlay)",
          border: "1px solid var(--surface-border)",
          borderRadius: "16px",
          boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
          display: "flex",
          flexDirection: "column",
          zIndex: 10000,
          overflow: "hidden"
        }}>
          {/* Header */}
          <div style={{ 
            padding: "1rem", 
            background: "var(--background-elevated)", 
            borderBottom: "1px solid var(--surface-border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "16px", background: "var(--color-accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>💼</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "1rem" }}>Counsel AI</div>
                <div style={{ fontSize: "0.75rem", color: "var(--color-success)" }}>● Online</div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: "none", border: "none", color: "var(--text-secondary)", fontSize: "1.2rem", cursor: "pointer" }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {messages.map((m, i) => (
              <div key={i} style={{ 
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "85%"
              }}>
                <div style={{ 
                  background: m.role === "user" ? "var(--color-accent)" : "rgba(255,255,255,0.05)",
                  color: m.role === "user" ? "var(--background-base)" : "var(--text-primary)",
                  padding: "0.75rem 1rem",
                  borderRadius: "12px",
                  borderBottomRightRadius: m.role === "user" ? "2px" : "12px",
                  borderBottomLeftRadius: m.role === "assistant" ? "2px" : "12px",
                  fontSize: "0.9rem",
                  lineHeight: 1.5
                }}>
                  {formatMessage(m.content)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ alignSelf: "flex-start", background: "rgba(255,255,255,0.05)", padding: "0.5rem 1rem", borderRadius: "12px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Counsel is typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} style={{ padding: "1rem", borderTop: "1px solid var(--surface-border)", display: "flex", gap: "0.5rem", background: "var(--background-elevated)" }}>
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your message..."
              style={{ 
                flex: 1, 
                padding: "0.5rem 1rem", 
                borderRadius: "20px", 
                border: "1px solid var(--surface-border)",
                background: "var(--surface-overlay)",
                color: "var(--text-primary)",
                outline: "none"
              }}
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              style={{ 
                background: "var(--color-accent)", 
                color: "var(--background-base)", 
                border: "none", 
                width: "36px", 
                height: "36px", 
                borderRadius: "18px", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                cursor: "pointer",
                opacity: (isLoading || !input.trim()) ? 0.5 : 1
              }}
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}
