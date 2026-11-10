"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";

type ChatMessage = { id: number; role: "user" | "assistant"; content: string };
const examples = ["What is an LLM?", "Can you help with a business website?", "Explain AI in simple terms."];

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 0, role: "assistant", content: "Hi! I’m your Qwen-powered AI assistant. Ask me a question to get started." },
  ]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  async function send(value: string) {
    const message = value.trim();
    if (!message || message.length > 2000 || loading) return;
    setError("");
    setDraft("");
    setMessages(prev => [...prev, { id: nextId.current++, role: "user", content: message }]);
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data: { reply?: string; error?: string } = await response.json();
      if (!response.ok || typeof data.reply !== "string") {
        throw new Error(data.error || "Something went wrong.");
      }
      setMessages(prev => [...prev, { id: nextId.current++, role: "assistant", content: data.reply! }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send your message.");
    } finally {
      setLoading(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void send(draft);
  }
  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      void send(draft);
    }
  }
  function clearChat() {
    if (loading) return;
    setMessages([{ id: nextId.current++, role: "assistant", content: "New chat started. How can I help?" }]);
    setError("");
    setDraft("");
  }

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand"><span className="brandmark">✦</span><div><strong>Nova AI</strong><small>LLM ENGINEERING LAB</small></div></div>
        <button className="new-chat" onClick={clearChat} disabled={loading}>＋ New conversation</button>
        <div className="sidebar-bottom"><span className="status-dot"/> Qwen 0.5B · Local inference <p>Portfolio project · Milestone 3</p></div>
      </aside>
      <section className="workspace" aria-label="Chatbot">
        <header className="topbar"><div><span className="eyebrow">CUSTOMER SUPPORT ASSISTANT</span><h1>AI Chat Workspace</h1></div><span className="model-pill">Qwen2.5 · 0.5B</span></header>
        <div className="conversation" aria-live="polite">
          {messages.map(item => <div className={`message ${item.role}`} key={item.id}>
            <span className="avatar">{item.role === "assistant" ? "✦" : "U"}</span>
            <div className="bubble"><span className="message-role">{item.role === "assistant" ? "Assistant" : "You"}</span><p>{item.content}</p></div>
          </div>)}
          {loading && <div className="message assistant"><span className="avatar">✦</span><div className="bubble"><span className="message-role">Assistant</span><p>Generating a response…</p></div></div>}
          <div ref={bottomRef}/>
        </div>
        <div className="composer-area">
          {messages.length === 1 && <div className="suggestions">{examples.map(example => <button key={example} disabled={loading} onClick={() => void send(example)}>{example}</button>)}</div>}
          {error && <div className="error" role="alert">{error}</div>}
          <form className="composer" onSubmit={submit}>
            <textarea aria-label="Your message" placeholder="Ask a question about AI or your business…" value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={onKeyDown} maxLength={2000} disabled={loading} rows={2}/>
            <button type="submit" disabled={loading || !draft.trim()} aria-label="Send message">{loading ? "…" : "➤"}</button>
          </form>
          <p className="note">Enter to send · Shift+Enter for a new line · AI may make mistakes · Chat history is local to this page</p>
        </div>
      </section>
    </main>
  );
}
