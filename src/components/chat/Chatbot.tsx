"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Bot,
  RotateCcw,
  Send,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

const SUGGESTED_PROMPTS = [
  "What are Aman's top AI & Agentic projects?",
  "Tell me about Aman's background & experience.",
  "How does the Daily Hadith AI Agent work?",
  "How can I get in touch with Aman?",
];

const INITIAL_WELCOME: Message = {
  id: "welcome",
  role: "assistant",
  content: `Hello! 👋 I'm **Aman's AI Portfolio Assistant**.

I can help you explore Aman's technical skills, production AI architectures, Agentic systems, and work experience. Feel free to ask anything about his projects, or pick a suggested topic below!`,
  timestamp: new Date(),
};

/**
 * Lightweight inline markdown renderer for chat bubbles.
 * Safely parses bold, bullet points, inline code, and markdown links.
 */
function FormattedMessage({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={lineIdx} className="h-1" />;
        }

        // Bullet point
        const isBullet = trimmed.startsWith("- ") || trimmed.startsWith("* ");
        const textContent = isBullet ? trimmed.slice(2) : line;

        // Simple tokenizer for bold, code, and links
        const parsedSegments = parseMarkdownLine(textContent);

        if (isBullet) {
          return (
            <div key={lineIdx} className="flex items-start gap-2 pl-1">
              <span className="text-accent mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
              <div className="flex-1">{parsedSegments}</div>
            </div>
          );
        }

        return <p key={lineIdx}>{parsedSegments}</p>;
      })}
    </div>
  );
}

function parseMarkdownLine(text: string): React.ReactNode[] {
  // Regex matches [label](url), **bold**, and `code`
  const tokenRegex = /(\[.*?\]\(https?:\/\/[^\s)]+\)|\*\*.*?\*\*|`.*?`)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, i) => {
    if (part.startsWith("[") && part.includes("](") && part.endsWith(")")) {
      const match = part.match(/\[(.*?)\]\((https?:\/\/[^\s)]+)\)/);
      if (match) {
        return (
          <a
            key={i}
            href={match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-accent-hover inline-flex items-center gap-0.5 underline transition-colors"
          >
            <span>{match[1]}</span>
            <ArrowUpRight size={12} className="inline shrink-0" />
          </a>
        );
      }
    }

    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return (
        <strong key={i} className="text-foreground font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      return (
        <code
          key={i}
          className="border-border bg-background rounded border px-1 py-0.5 font-mono text-xs text-blue-400"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    return part;
  });
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_WELCOME]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Focus input when chat opens on desktop
      if (window.innerWidth > 640) {
        setTimeout(() => inputRef.current?.focus(), 150);
      }
    }
  }, [isOpen, messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue("");
    setErrorMessage(null);
    setIsLoading(true);

    try {
      // Map to API format (excluding the local welcome note from payload)
      const payloadMessages = newMessages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payloadMessages }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to get a response from AI.");
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        ...INITIAL_WELCOME,
        timestamp: new Date(),
      },
    ]);
    setErrorMessage(null);
    setInputValue("");
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed right-5 bottom-5 z-50 sm:right-7 sm:bottom-7">
        <motion.button
          onClick={() => setIsOpen((prev) => !prev)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
          className={cn(
            "relative flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all duration-300",
            isOpen
              ? "border-border bg-card text-foreground border"
              : "bg-accent text-accent-foreground shadow-accent/25 hover:bg-accent-hover ring-4 ring-blue-500/20",
          )}
        >
          {/* Subtle pulse effect when closed */}
          {!isOpen && (
            <span
              aria-hidden
              className="bg-accent/40 absolute -inset-1 animate-ping rounded-full opacity-40 duration-1000"
            />
          )}

          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X size={22} strokeWidth={2} />
              </motion.div>
            ) : (
              <motion.div
                key="bot"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="relative"
              >
                <Bot size={26} strokeWidth={1.8} />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Chat Window Dialog */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="border-border bg-card/95 fixed right-4 bottom-22 z-50 flex h-[82vh] max-h-[640px] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl sm:right-7 sm:w-[420px]"
          >
            {/* Header */}
            <div className="border-border bg-card/80 flex items-center justify-between border-b px-4 py-3.5 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="border-border bg-accent/10 text-accent relative flex h-9 w-9 items-center justify-center rounded-full border">
                  <Bot size={20} />
                  <span className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#18181b]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-foreground text-sm font-semibold tracking-tight">
                      Aman&apos;s AI Assistant
                    </h3>
                  </div>
                  <p className="text-foreground-subtle flex items-center gap-1 font-mono text-[11px]">
                    <Sparkles size={10} className="text-accent" />
                    Interactive Portfolio Agent
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleResetChat}
                  title="New conversation"
                  aria-label="New conversation"
                  className="text-foreground-subtle hover:text-foreground hover:bg-card-hover rounded-md p-1.5 transition-colors"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close chat"
                  aria-label="Close chat"
                  className="text-foreground-subtle hover:text-foreground hover:bg-card-hover rounded-md p-1.5 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {messages.map((message) => {
                const isUser = message.role === "user";

                return (
                  <div
                    key={message.id}
                    className={cn(
                      "flex items-start gap-2.5",
                      isUser ? "flex-row-reverse" : "flex-row",
                    )}
                  >
                    {/* Avatar */}
                    <div
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs",
                        isUser
                          ? "bg-accent text-accent-foreground"
                          : "border-border bg-card-hover text-accent border",
                      )}
                    >
                      {isUser ? <User size={14} /> : <Bot size={14} />}
                    </div>

                    {/* Bubble */}
                    <div
                      className={cn(
                        "max-w-[82%] rounded-2xl px-4 py-3 shadow-sm",
                        isUser
                          ? "bg-accent text-accent-foreground rounded-tr-xs"
                          : "border-border bg-card text-foreground rounded-tl-xs border",
                      )}
                    >
                      <FormattedMessage content={message.content} />
                      <div
                        className={cn(
                          "mt-1 text-right text-[10px]",
                          isUser
                            ? "text-blue-100/70"
                            : "text-foreground-subtle",
                        )}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex items-start gap-2.5">
                  <div className="border-border bg-card-hover text-accent flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs">
                    <Bot size={14} />
                  </div>
                  <div className="border-border bg-card rounded-2xl rounded-tl-xs border px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-accent h-2 w-2 animate-bounce rounded-full [animation-delay:-0.3s]" />
                      <span className="bg-accent h-2 w-2 animate-bounce rounded-full [animation-delay:-0.15s]" />
                      <span className="bg-accent h-2 w-2 animate-bounce rounded-full" />
                    </div>
                  </div>
                </div>
              )}

              {/* Error Banner */}
              {errorMessage && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs leading-relaxed text-red-300">
                  <p className="font-semibold">Unable to process message</p>
                  <p className="mt-0.5">{errorMessage}</p>
                  <button
                    onClick={() => handleSendMessage()}
                    className="text-accent hover:text-accent-hover mt-2 font-mono underline"
                  >
                    Retry last message
                  </button>
                </div>
              )}

              {/* Suggested Questions (shown when conversation is new) */}
              {messages.length <= 1 && !isLoading && (
                <div className="mt-4 pt-2">
                  <p className="text-foreground-subtle mb-2.5 flex items-center gap-1 font-mono text-xs">
                    <Sparkles size={12} className="text-accent" />
                    Suggested questions
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {SUGGESTED_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => handleSendMessage(prompt)}
                        className="border-border bg-card hover:border-accent/40 hover:bg-card-hover text-foreground-muted hover:text-foreground rounded-lg border px-3 py-2 text-left text-xs transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="border-border bg-card/90 border-t p-3 backdrop-blur-md">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="border-border bg-background focus-within:border-accent/60 flex items-end gap-2 rounded-xl border p-2 transition-colors"
              >
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about Aman's projects, stack, experience..."
                  rows={1}
                  maxLength={1000}
                  className="text-foreground placeholder:text-foreground-subtle max-h-24 flex-1 resize-none bg-transparent px-1 py-1 text-sm outline-none"
                  style={{ minHeight: "24px" }}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  aria-label="Send message"
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                    inputValue.trim() && !isLoading
                      ? "bg-accent text-accent-foreground hover:bg-accent-hover"
                      : "bg-card-hover text-foreground-subtle cursor-not-allowed",
                  )}
                >
                  <Send size={15} />
                </button>
              </form>
              <div className="mt-2 flex items-center justify-between px-1 text-[10px] text-zinc-500">
                <span>Enter to send, Shift+Enter for new line</span>
                <span>Max 1000 chars</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
