import { useState, useRef, useEffect } from "react";
import { Send, X, Sparkles } from "lucide-react";
import { InntiIcon } from "./InntiIcon";
import { API_BASE } from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ChatPanel({ open, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "¡Hola! Soy Innti, el asistente de QUIPUX. Puedo ayudarte a consultar datos del sistema, analizar facturas y más. ¿En qué puedo ayudarte?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const history = [...messages, userMsg].map(({ role, content }) => ({ role, content }));
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);

      const data = await res.json();
      const botMsg: Message = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: data.content,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: Message = {
        id: `e-${Date.now()}`,
        role: "assistant",
        content: "Lo siento, hubo un error al procesar tu consulta. Intenta de nuevo.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>


      {/* Panel */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] flex flex-col bg-[oklch(0.2_0.035_295)] border-l border-border shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl flex items-center justify-center border border-border bg-secondary/60">
              <InntiIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-[14px] font-semibold tracking-tight text-foreground">Innti Assistant</div>
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-lime animate-pulse-dot" />
                Conectado
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg border border-border bg-secondary/60 flex items-center justify-center hover:bg-secondary transition text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0 bg-[oklch(0.81_0.09_207/12%)] mt-0.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                </div>
              )}
              <div
                className={`max-w-[80%] px-3.5 py-2.5 rounded-xl text-[13px] leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary/15 text-foreground border border-primary/20 rounded-br-md"
                    : "bg-secondary/60 text-foreground border border-border rounded-bl-md"
                }`}
              >
                {msg.content}
                <div className={`text-[10px] mt-1.5 ${msg.role === "user" ? "text-primary/60 text-right" : "text-muted-foreground"}`}>
                  {msg.timestamp.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-2.5">
              <div className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0 bg-[oklch(0.81_0.09_207/12%)] mt-0.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="px-3.5 py-3 rounded-xl bg-secondary/60 border border-border rounded-bl-md">
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions (shown only when few messages) */}
        {messages.length <= 1 && (
          <div className="px-4 pb-2">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Sugerencias</div>
            <div className="flex flex-wrap gap-1.5">
              {[
                "¿Cuántas facturas se procesaron hoy?",
                "Resumen de rechazos",
                "Estado de proveedores",
                "Tasa de validación actual",
              ].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setInput(s);
                    setTimeout(() => inputRef.current?.focus(), 50);
                  }}
                  className="px-2.5 py-1.5 rounded-lg text-[11px] border border-border bg-secondary/40 text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input bar */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Escribe tu consulta…"
              className="flex-1 h-10 px-4 rounded-lg bg-secondary/60 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="h-10 w-10 rounded-lg flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Send className="h-4 w-4 text-[oklch(0.2_0.03_295)]" />
            </button>
          </div>
          <div className="mt-2 text-center text-[10px] text-muted-foreground">
            Powered by <span className="font-medium text-foreground">Innti AI</span>
          </div>
        </div>
      </aside>
    </>
  );
}
