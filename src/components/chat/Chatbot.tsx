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
 * Inline markdown renderer for chat bubbles.
 * Converts headings, bullets, bold, code, links, and translates any table syntax into clean cards.
 */
function FormattedMessage({ content }: { content: string }) {
  if (!content) return null;

  const lines = content.split("\n");
  const renderedElements: React.ReactNode[] = [];

  let idx = 0;
  while (idx < lines.length) {
    const rawLine = lines[idx];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      renderedElements.push(<div key={`blank-${idx}`} className="h-1.5" />);
      idx++;
      continue;
    }

    // Detect markdown table rows
    const isTableLine =
      trimmed.startsWith("|") ||
      trimmed.endsWith("|") ||
      trimmed.includes(" | ") ||
      /^\|?[-:\s|]+\|?$/.test(trimmed);

    if (isTableLine) {
      const tableLines: string[] = [];
      while (
        idx < lines.length &&
        (lines[idx].trim().startsWith("|") ||
          lines[idx].trim().endsWith("|") ||
          lines[idx].trim().includes(" | ") ||
          /^\|?[-:\s|]+\|?$/.test(lines[idx].trim()))
      ) {
        const lineContent = lines[idx].trim();
        if (lineContent && !/^\|?[-:\s|]+\|?$/.test(lineContent)) {
          tableLines.push(lineContent);
        }
        idx++;
      }

      if (tableLines.length > 0) {
        const firstLineCells = tableLines[0]
          .split("|")
          .map((c) => c.trim())
          .filter(Boolean);

        const isFirstLineHeader =
          tableLines.length > 1 &&
          firstLineCells.some((c) =>
            /project|name|stack|tech|link|status|description|why/i.test(c),
          );

        const headers = isFirstLineHeader ? firstLineCells : [];
        const rows = isFirstLineHeader ? tableLines.slice(1) : tableLines;

        renderedElements.push(
          <div key={`table-block-${idx}`} className="my-2.5 space-y-2">
            {rows.map((rowStr, rIdx) => {
              const cells = rowStr
                .split("|")
                .map((c) => c.trim())
                .filter(Boolean);

              if (cells.length === 0) return null;

              const isNumberedTitle =
                /^\d+$/.test(cells[0]) && cells.length > 1;
              const title = isNumberedTitle
                ? `${cells[0]}. ${cells[1]}`
                : cells[0];
              const details = isNumberedTitle ? cells.slice(2) : cells.slice(1);

              return (
                <div
                  key={`card-${rIdx}`}
                  className="border-border/80 bg-card-hover/40 hover:border-accent/40 rounded-xl border p-3 shadow-xs transition-colors"
                >
                  <div className="text-foreground flex items-center gap-1.5 text-sm font-semibold">
                    {parseMarkdownLine(title)}
                  </div>

                  {details.length > 0 && (
                    <div className="mt-2 space-y-1.5 text-xs">
                      {details.map((detail, dIdx) => {
                        const headerIndex = isNumberedTitle
                          ? dIdx + 2
                          : dIdx + 1;
                        const headerLabel = headers[headerIndex];

                        return (
                          <div
                            key={dIdx}
                            className="text-foreground-muted leading-relaxed"
                          >
                            {headerLabel && (
                              <span className="text-foreground-subtle mb-0.5 block font-mono text-[10px] tracking-wider uppercase">
                                {headerLabel}:
                              </span>
                            )}
                            <div>{parseMarkdownLine(detail)}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>,
        );
      }
      continue;
    }

    // Headings
    if (trimmed.startsWith("### ")) {
      renderedElements.push(
        <h4
          key={`h4-${idx}`}
          className="text-foreground mt-3.5 mb-1 text-sm font-semibold tracking-tight"
        >
          {parseMarkdownLine(trimmed.slice(4))}
        </h4>,
      );
      idx++;
      continue;
    }
    if (trimmed.startsWith("## ")) {
      renderedElements.push(
        <h3
          key={`h3-${idx}`}
          className="text-foreground mt-4 mb-1 text-base font-semibold tracking-tight"
        >
          {parseMarkdownLine(trimmed.slice(3))}
        </h3>,
      );
      idx++;
      continue;
    }

    // Bullet points
    const isBullet =
      trimmed.startsWith("- ") ||
      trimmed.startsWith("* ") ||
      trimmed.startsWith("• ");
    const isNumbered = /^\d+\.\s/.test(trimmed);

    if (isBullet || isNumbered) {
      const textContent = isBullet
        ? trimmed.slice(2)
        : trimmed.replace(/^\d+\.\s/, "");

      renderedElements.push(
        <div
          key={`bullet-${idx}`}
          className="my-0.5 flex items-start gap-2 pl-1"
        >
          <span className="text-accent mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
          <div className="flex-1 text-sm">{parseMarkdownLine(textContent)}</div>
        </div>,
      );
      idx++;
      continue;
    }

    // Paragraph
    renderedElements.push(
      <p key={`p-${idx}`} className="text-sm">
        {parseMarkdownLine(trimmed)}
      </p>,
    );
    idx++;
  }

  return (
    <div className="space-y-1.5 text-sm leading-relaxed">
      {renderedElements}
    </div>
  );
}

function parseMarkdownLine(text: string): React.ReactNode[] {
  const tokenRegex =
    /(\[.*?\]\(https?:\/\/[^\s)]+\)|<https?:\/\/[^\s>]+>|https?:\/\/[^\s<>)"]+|\*\*.*?\*\*|`.*?`|\*[^*\n]+\*)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, i) => {
    // Markdown link [text](url)
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

    // Angle bracket link <https://...>
    if (part.startsWith("<http") && part.endsWith(">")) {
      const url = part.slice(1, -1);
      let label = "Link";
      if (url.includes("github.com")) label = "GitHub Repository";
      else if (url.includes("t.me")) label = "Telegram Bot";
      else if (
        url.includes("onrender.com") ||
        url.includes("vercel.app") ||
        url.includes("streamlit.app")
      )
        label = "Live Demo";

      return (
        <a
          key={i}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:text-accent-hover inline-flex items-center gap-0.5 underline transition-colors"
        >
          <span>{label}</span>
          <ArrowUpRight size={12} className="inline shrink-0" />
        </a>
      );
    }

    // Bare URL (e.g. https://github.com/...)
    if (part.startsWith("http://") || part.startsWith("https://")) {
      let label = "Link";
      if (part.includes("github.com")) label = "GitHub Repository";
      else if (part.includes("t.me")) label = "Telegram Bot";
      else if (
        part.includes("onrender.com") ||
        part.includes("vercel.app") ||
        part.includes("streamlit.app")
      )
        label = "Live Demo";

      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:text-accent-hover inline-flex items-center gap-0.5 underline transition-colors"
        >
          <span>{label}</span>
          <ArrowUpRight size={12} className="inline shrink-0" />
        </a>
      );
    }

    // Bold **text**
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return (
        <strong key={i} className="text-foreground font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Inline code `code`
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

    // Italic *text*
    if (part.startsWith("*") && part.endsWith("*") && part.length >= 2) {
      return (
        <em key={i} className="text-foreground-muted italic">
          {part.slice(1, -1)}
        </em>
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

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const userScrolledUpRef = useRef<boolean>(false);

  // Streaming pacing queue
  const tokenQueueRef = useRef<string[]>([]);
  const isPacingActiveRef = useRef<boolean>(false);
  const streamCompleteRef = useRef<boolean>(false);
  const pacingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // When user manually scrolls, check if they are reading higher up
  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= 70;
    userScrolledUpRef.current = !isAtBottom;
  };

  useEffect(() => {
    if (isOpen) {
      userScrolledUpRef.current = false;
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop =
          scrollContainerRef.current.scrollHeight;
      }
      if (window.innerWidth > 640) {
        setTimeout(() => inputRef.current?.focus(), 150);
      }
    }
  }, [isOpen]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (pacingTimerRef.current) clearInterval(pacingTimerRef.current);
    };
  }, []);

  const startWordByWordPacing = (targetId: string) => {
    if (isPacingActiveRef.current) return;
    isPacingActiveRef.current = true;

    pacingTimerRef.current = setInterval(() => {
      // If queue is empty
      if (tokenQueueRef.current.length === 0) {
        if (streamCompleteRef.current) {
          if (pacingTimerRef.current) clearInterval(pacingTimerRef.current);
          isPacingActiveRef.current = false;
          setIsLoading(false);
        }
        return;
      }

      // Smooth pacing: 1 token at a time, or 2-3 if backlog is growing
      const drainCount =
        tokenQueueRef.current.length > 25
          ? 3
          : tokenQueueRef.current.length > 10
            ? 2
            : 1;

      const words = tokenQueueRef.current.splice(0, drainCount).join("");

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === targetId ? { ...msg, content: msg.content + words } : msg,
        ),
      );

      // Only follow downward if user hasn't scrolled up to read earlier text
      if (!userScrolledUpRef.current && scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop =
          scrollContainerRef.current.scrollHeight;
      }
    }, 22); // 22ms per word gives a readable human typing speed (~45 wps)
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    const assistantMsgId = (Date.now() + 1).toString();
    const placeholderAssistant: Message = {
      id: assistantMsgId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages([...newMessages, placeholderAssistant]);
    setInputValue("");
    setErrorMessage(null);
    setIsLoading(true);

    // Reset streaming queue and scroll tracking
    tokenQueueRef.current = [];
    streamCompleteRef.current = false;
    userScrolledUpRef.current = false;

    // Scroll down once so the user's question and the start of the response are in view
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 40);

    try {
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

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(
          data?.error || `Request failed with status ${res.status}`,
        );
      }

      if (!res.body) {
        throw new Error("No response stream received from server.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      startWordByWordPacing(assistantMsgId);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const tokens = chunk.match(/\S+|\s+/g) || [chunk];
        tokenQueueRef.current.push(...tokens);
      }

      streamCompleteRef.current = true;
    } catch (err: unknown) {
      if (pacingTimerRef.current) clearInterval(pacingTimerRef.current);
      isPacingActiveRef.current = false;
      setIsLoading(false);

      setMessages((prev) =>
        prev.filter(
          (msg) => msg.id !== assistantMsgId || msg.content.length > 0,
        ),
      );
      const msg =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again.";
      setErrorMessage(msg);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    if (pacingTimerRef.current) clearInterval(pacingTimerRef.current);
    isPacingActiveRef.current = false;
    tokenQueueRef.current = [];
    setIsLoading(false);

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

  const isAwaitingFirstChunk =
    isLoading &&
    messages.length > 0 &&
    messages[messages.length - 1].role === "assistant" &&
    messages[messages.length - 1].content === "";

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
            className="border-border bg-card/95 fixed right-4 bottom-22 z-50 flex h-[82vh] max-h-[640px] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl sm:right-7 sm:w-[440px]"
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

            {/* Messages Scroll Area with Intelligent Anchor */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex-1 space-y-4 overflow-y-auto p-4"
            >
              {messages
                .filter((m) => m.content.length > 0)
                .map((message) => {
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
                          "max-w-[85%] rounded-2xl px-4 py-3 shadow-sm",
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

              {/* Typing indicator (only shown while awaiting first token) */}
              {isAwaitingFirstChunk && (
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

              {/* Suggested Questions */}
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
                  maxLength={2000}
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
                <span>Max 2000 chars</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
